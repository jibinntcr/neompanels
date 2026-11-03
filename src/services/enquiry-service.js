/**
 * NEOM Panels — Durable Enquiry Persistence, Validation, Private File Storage & Routing
 * Implements Section 14.2 & 14.3 of the NEOM Panels Brief.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { companySettings, enquiryTypes, brands } = require('../data/content');

const PRIVATE_ROOT = process.env.VERCEL
  ? path.join(os.tmpdir(), 'neom_private_storage')
  : path.join(__dirname, '..', '..', 'private_storage');
const DB_DIR = path.join(PRIVATE_ROOT, 'db');
const ATTACHMENTS_DIR = path.join(PRIVATE_ROOT, 'attachments');

const ENQUIRIES_FILE = path.join(DB_DIR, 'enquiries.json');
const ATTACHMENTS_META_FILE = path.join(DB_DIR, 'enquiry_attachments.json');
const NOTIFICATIONS_FILE = path.join(DB_DIR, 'notification_jobs.json');
const ACTIVITIES_FILE = path.join(DB_DIR, 'enquiry_activities.json');

const MAX_FILES = 3;
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB per file

const VALID_STATUSES = [
  'New',
  'Assigned',
  'Contacted',
  'Qualified',
  'Quoted',
  'Closed',
  'Spam',
];

function ensureStorageDirs() {
  fs.mkdirSync(DB_DIR, { recursive: true, mode: 0o700 });
  fs.mkdirSync(ATTACHMENTS_DIR, { recursive: true, mode: 0o700 });
  for (const file of [
    ENQUIRIES_FILE,
    ATTACHMENTS_META_FILE,
    NOTIFICATIONS_FILE,
    ACTIVITIES_FILE,
  ]) {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, '[]\n', { encoding: 'utf8', mode: 0o600 });
    }
  }
}

function readJsonTable(filePath) {
  ensureStorageDirs();
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function writeJsonTableAtomic(filePath, records) {
  ensureStorageDirs();
  const tmpFile = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(records, null, 2) + '\n', {
    encoding: 'utf8',
    mode: 0o600,
  });
  fs.renameSync(tmpFile, filePath);
}

/**
 * Inspects file magic bytes to verify genuine PDF, JPEG or PNG content
 * and reject disguised executables/scripts (Section 14.3 item 5).
 */
function verifyMagicBytes(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 8) return null;

  // PDF: %PDF- (25 50 44 46 2D)
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46 &&
    buffer[4] === 0x2d
  ) {
    return { mime: 'application/pdf', ext: '.pdf' };
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mime: 'image/jpeg', ext: '.jpg' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { mime: 'image/png', ext: '.png' };
  }

  return null;
}

function sanitizeFilename(name) {
  return String(name || 'document')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 100);
}

function resolveOwnerByType(enquiryType, brandId) {
  if (brandId && brandId !== 'not_sure') {
    const matchedBrand = brands.find((b) => b.slug === brandId);
    if (matchedBrand && matchedBrand.enquiryOwner) {
      return matchedBrand.enquiryOwner;
    }
  }
  const found = enquiryTypes.find((t) => t.value === enquiryType);
  return found ? found.ownerDesk : 'general_sales_desk';
}

function generatePublicReference() {
  const year = new Date().getUTCFullYear();
  const token = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `NEOM-${year}-${token}`;
}

function validateEnquiryInput(fields = {}, files = []) {
  const errors = {};
  const validTypeValues = enquiryTypes.map((t) => t.value);

  const enquiryType = String(fields.enquiry_type || '').trim();
  if (!validTypeValues.includes(enquiryType)) {
    errors.enquiry_type = 'Please select one of the available enquiry types.';
  }

  const requirementMessage = String(fields.requirement_message || '').trim();
  if (requirementMessage.length < 20) {
    errors.requirement_message =
      'Please provide at least 20 characters describing your requirement.';
  } else if (requirementMessage.length > 3000) {
    errors.requirement_message =
      'Requirement description must be 3,000 characters or fewer.';
  }

  const fullName = String(fields.full_name || '').trim();
  if (fullName.length < 2 || fullName.length > 160) {
    errors.full_name = 'Please enter your full name.';
  }

  const organisation = String(fields.organisation || '').trim();
  if (organisation.length < 2 || organisation.length > 200) {
    errors.organisation =
      'Please enter your company, organisation or select Independent professional.';
  }

  const preferredMethod = String(
    fields.preferred_contact_method || 'Email'
  ).trim();
  if (preferredMethod !== 'Email' && preferredMethod !== 'Phone') {
    errors.preferred_contact_method =
      'Please choose Email or Phone as your preferred contact method.';
  }

  const email = String(fields.email || '').trim();
  const phone = String(fields.phone || '').trim();
  const phoneDigits = phone.replace(/[^0-9]/g, '');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (preferredMethod === 'Email') {
    if (!email || !emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address so we can respond.';
    }
  } else if (email && !emailRegex.test(email)) {
    errors.email = 'Please enter a valid email address or leave blank.';
  }

  if (preferredMethod === 'Phone') {
    if (phoneDigits.length < 7 || phoneDigits.length > 16) {
      errors.phone =
        'Please enter a valid phone number with country code (7–16 digits).';
    }
  } else if (phone && phone !== '+91' && phone !== '+91 ' && phoneDigits.length > 0) {
    if (phoneDigits.length < 7 || phoneDigits.length > 16) {
      errors.phone = 'Please enter a valid phone number with country code.';
    }
  }

  if (fields.privacy_acknowledged !== 'yes') {
    errors.privacy_acknowledged =
      'Please confirm the enquiry processing acknowledgement to submit your request.';
  }

  const nonEmptyFiles = (files || []).filter(
    (f) => f && Buffer.isBuffer(f.buffer) && f.buffer.length > 0
  );

  if (nonEmptyFiles.length > MAX_FILES) {
    errors.attachments = `You may attach up to ${MAX_FILES} files per enquiry.`;
  } else {
    for (const file of nonEmptyFiles) {
      if (file.buffer.length > MAX_FILE_BYTES) {
        errors.attachments = `Each file must be 10 MB or smaller (${sanitizeFilename(file.filename)} exceeds limit).`;
        break;
      }
      const magic = verifyMagicBytes(file.buffer);
      if (!magic) {
        errors.attachments = `Only genuine PDF, JPG or PNG files are accepted (${sanitizeFilename(file.filename)} was rejected).`;
        break;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    nonEmptyFiles,
  };
}

function createEnquiry(fields = {}, files = []) {
  // Honeypot check (if filled by a bot, reject cleanly without storing spam)
  if (fields.website_url && String(fields.website_url).trim() !== '') {
    return {
      ok: false,
      status: 400,
      message: 'Please check the highlighted fields.',
      errors: { enquiry_type: 'Invalid submission.' },
    };
  }

  const idempotencyKey = String(fields.idempotency_key || '')
    .trim()
    .slice(0, 80);

  if (idempotencyKey) {
    const existingEnquiries = readJsonTable(ENQUIRIES_FILE);
    const duplicate = existingEnquiries.find(
      (item) => item.idempotency_key === idempotencyKey
    );
    if (duplicate) {
      return {
        ok: true,
        status: 200,
        duplicate: true,
        record: duplicate,
      };
    }
  }

  const validation = validateEnquiryInput(fields, files);
  if (!validation.isValid) {
    return {
      ok: false,
      status: 422,
      message: 'Please check the highlighted fields.',
      errors: validation.errors,
    };
  }

  const nowIso = new Date().toISOString();
  const enquiryId = crypto.randomUUID();
  const publicReference = generatePublicReference();
  const enquiryType = String(fields.enquiry_type).trim();
  const brandId = String(fields.brand_id || 'not_sure')
    .trim()
    .slice(0, 64);
  const assignedOwner = resolveOwnerByType(enquiryType, brandId);
  const marketingOptIn = fields.marketing_opt_in === 'yes';

  // 1. Store verified attachments in private storage outside web root
  const savedAttachments = [];
  for (const file of validation.nonEmptyFiles) {
    const magic = verifyMagicBytes(file.buffer);
    const attachmentId = crypto.randomUUID();
    const storageKey = `${enquiryId}_${attachmentId}${magic.ext}`;
    const destPath = path.join(ATTACHMENTS_DIR, storageKey);
    fs.writeFileSync(destPath, file.buffer, { mode: 0o600 });

    savedAttachments.push({
      id: attachmentId,
      enquiry_id: enquiryId,
      private_storage_key: storageKey,
      original_name: sanitizeFilename(file.filename),
      verified_mime_type: magic.mime,
      size_bytes: file.buffer.length,
      scan_status: 'verified_magic_bytes_clean',
      created_at: nowIso,
    });
  }

  // 2. Build enquiry record matching Section 14.3 schema
  const phoneCleaned =
    String(fields.phone || '').trim() === '+91'
      ? ''
      : String(fields.phone || '').trim().slice(0, 40);

  const enquiryRecord = {
    id: enquiryId,
    public_reference: publicReference,
    idempotency_key: idempotencyKey || null,
    created_at: nowIso,
    enquiry_type: enquiryType,
    full_name: String(fields.full_name).trim().slice(0, 160),
    organisation: String(fields.organisation).trim().slice(0, 200),
    preferred_contact_method: String(fields.preferred_contact_method).trim(),
    email: String(fields.email || '').trim().slice(0, 160) || null,
    phone: phoneCleaned || null,
    city_state: String(fields.city_state || '').trim().slice(0, 120) || null,
    country: String(fields.country || 'India').trim().slice(0, 80) || 'India',
    brand_id: brandId,
    product_text: String(fields.product_text || '').trim().slice(0, 200) || null,
    quantity: String(fields.quantity || '').trim().slice(0, 80) || null,
    unit: String(fields.unit || '').trim().slice(0, 60) || null,
    frequency: String(fields.frequency || '').trim().slice(0, 60) || null,
    needed_by: String(fields.needed_by || '').trim().slice(0, 40) || null,
    procurement_reference:
      String(fields.procurement_reference || '').trim().slice(0, 120) || null,
    procurement_role:
      String(fields.procurement_role || '').trim().slice(0, 80) || null,
    territory: String(fields.territory || '').trim().slice(0, 200) || null,
    requirement_message: String(fields.requirement_message).trim(),
    privacy_notice_version: companySettings.privacyNoticeVersion,
    enquiry_acknowledged_at: nowIso,
    marketing_opt_in: marketingOptIn,
    marketing_choice_at: nowIso,
    source_page: String(fields.source_page || '/enquiry')
      .trim()
      .slice(0, 120),
    source_brand: brandId !== 'not_sure' ? brandId : null,
    assigned_owner: assignedOwner,
    status: 'New',
    next_action_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    attachment_count: savedAttachments.length,
  };

  // 3. Persist durably BEFORE queueing notifications
  const allEnquiries = readJsonTable(ENQUIRIES_FILE);
  allEnquiries.push(enquiryRecord);
  writeJsonTableAtomic(ENQUIRIES_FILE, allEnquiries);

  if (savedAttachments.length > 0) {
    const allAttachments = readJsonTable(ATTACHMENTS_META_FILE);
    allAttachments.push(...savedAttachments);
    writeJsonTableAtomic(ATTACHMENTS_META_FILE, allAttachments);
  }

  // 4. Record audit activity & queue notifications asynchronously (never blocking or erasing lead)
  try {
    const activities = readJsonTable(ACTIVITIES_FILE);
    activities.push({
      id: crypto.randomUUID(),
      enquiry_id: enquiryId,
      actor_id: 'system_intake',
      action: `Enquiry created and routed to ${assignedOwner}`,
      timestamp: nowIso,
    });
    writeJsonTableAtomic(ACTIVITIES_FILE, activities);

    const notifications = readJsonTable(NOTIFICATIONS_FILE);
    notifications.push({
      id: crypto.randomUUID(),
      enquiry_id: enquiryId,
      channel: `staff_desk:${assignedOwner}`,
      state: 'queued',
      attempt_count: 0,
      next_attempt_at: nowIso,
      created_at: nowIso,
    });
    if (enquiryRecord.email) {
      notifications.push({
        id: crypto.randomUUID(),
        enquiry_id: enquiryId,
        channel: 'customer_email_acknowledgement',
        state: 'queued',
        attempt_count: 0,
        next_attempt_at: nowIso,
        created_at: nowIso,
      });
    }
    writeJsonTableAtomic(NOTIFICATIONS_FILE, notifications);
  } catch (_) {
    // Notification queue error must never fail a durably saved enquiry (Section 14.3 item 7)
  }

  return {
    ok: true,
    status: 201,
    record: enquiryRecord,
  };
}

/* Staff Workflow Helpers (Section 14.3 items 5, 8 & 9) */
function getSigningSecret() {
  return (
    process.env.NEOM_ATTACHMENT_SIGNING_SECRET ||
    process.env.NEOM_STAFF_TOKEN ||
    'neom-local-dev-signing-secret-change-in-prod'
  );
}

function createSignedAttachmentUrl(attachmentId, ttlSeconds = 300) {
  const expires = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${attachmentId}:${expires}`;
  const sig = crypto
    .createHmac('sha256', getSigningSecret())
    .update(payload)
    .digest('hex');
  return `/api/staff/attachments/${encodeURIComponent(attachmentId)}?expires=${expires}&sig=${sig}`;
}

function verifySignedAttachmentUrl(attachmentId, expires, sig) {
  const expNum = Number(expires);
  if (!expNum || expNum < Math.floor(Date.now() / 1000)) return false;
  const expected = crypto
    .createHmac('sha256', getSigningSecret())
    .update(`${attachmentId}:${expNum}`)
    .digest('hex');
  try {
    return crypto.timingSafeEqual(
      Buffer.from(String(sig || '')),
      Buffer.from(expected)
    );
  } catch (_) {
    return false;
  }
}

function listEnquiriesForStaff() {
  const enquiries = readJsonTable(ENQUIRIES_FILE);
  const attachments = readJsonTable(ATTACHMENTS_META_FILE);
  return enquiries.map((enq) => {
    const files = attachments
      .filter((a) => a.enquiry_id === enq.id)
      .map((a) => ({
        id: a.id,
        original_name: a.original_name,
        verified_mime_type: a.verified_mime_type,
        size_bytes: a.size_bytes,
        signed_download_url: createSignedAttachmentUrl(a.id, 600),
      }));
    return { ...enq, attachments: files };
  });
}

function updateEnquiryForStaff(enquiryId, patch = {}, actorId = 'staff_user') {
  const enquiries = readJsonTable(ENQUIRIES_FILE);
  const idx = enquiries.findIndex(
    (e) => e.id === enquiryId || e.public_reference === enquiryId
  );
  if (idx === -1) return null;

  const target = enquiries[idx];
  const changes = [];

  if (patch.status && VALID_STATUSES.includes(patch.status)) {
    changes.push(`status: ${target.status} -> ${patch.status}`);
    target.status = patch.status;
  }
  if (patch.assigned_owner) {
    changes.push(
      `assigned_owner: ${target.assigned_owner} -> ${patch.assigned_owner}`
    );
    target.assigned_owner = String(patch.assigned_owner).trim().slice(0, 80);
  }
  if (patch.next_action_at) {
    target.next_action_at = String(patch.next_action_at).trim().slice(0, 40);
  }

  writeJsonTableAtomic(ENQUIRIES_FILE, enquiries);

  const activities = readJsonTable(ACTIVITIES_FILE);
  activities.push({
    id: crypto.randomUUID(),
    enquiry_id: target.id,
    actor_id: actorId,
    action:
      patch.note ||
      (changes.length ? changes.join('; ') : 'Enquiry record updated'),
    timestamp: new Date().toISOString(),
  });
  writeJsonTableAtomic(ACTIVITIES_FILE, activities);

  return target;
}

function getAttachmentForStreaming(attachmentId) {
  const attachments = readJsonTable(ATTACHMENTS_META_FILE);
  const meta = attachments.find((a) => a.id === attachmentId);
  if (!meta) return null;
  const fullPath = path.join(ATTACHMENTS_DIR, meta.private_storage_key);
  if (!fs.existsSync(fullPath)) return null;
  return { meta, fullPath };
}

module.exports = {
  createEnquiry,
  listEnquiriesForStaff,
  updateEnquiryForStaff,
  verifySignedAttachmentUrl,
  getAttachmentForStreaming,
  VALID_STATUSES,
};
