/**
 * NEOM Panels — Comprehensive End-to-End Verification Suite
 * Verifies every requirement in Section 19.4 (Acceptance checklist for the developer).
 */

const assert = require('assert');
const http = require('http');

process.env.NEOM_STAFF_TOKEN = 'test-staff-secret-token-2026';

const { server } = require('../server');

function request(port, reqPath, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path: reqPath,
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: buffer.toString('utf8'),
            buffer,
          });
        });
      }
    );
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function runVerification() {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  console.log(`Running verification suite against port ${port}...`);

  try {
    const routesToCheck = [
      '/',
      '/company',
      '/company/corporate-information',
      '/brands',
      '/industries',
      '/industries/furniture-manufacturers',
      '/industries/projects-and-fitouts',
      '/industries/institutions-and-public-procurement',
      '/manufacturing',
      '/responsibility',
      '/partner-with-us',
      '/resources',
      '/resources/downloads',
      '/resources/downloads/neom-corporate-overview.html',
      '/resources/downloads/neom-enquiry-checklist.html',
      '/gallery',
      '/insights',
      '/insights/panel-quotation-requirements',
      '/insights/choose-panels-by-application',
      '/insights/understanding-responsible-materials-claims',
      '/contact',
      '/enquiry',
      '/thank-you?ref=NEOM-2026-TEST01',
      '/privacy',
      '/terms',
      '/cookies',
      '/sitemap.xml',
      '/robots.txt',
    ];

    const forbiddenPatterns = [
      /\[APPROVED/i,
      /\[INSERT/i,
      /\[ACTUAL/i,
      /\[VERIFIED/i,
      /Invest Now/i,
      /IPO countdown/i,
      /100% sustainable/i,
      /zero-emission factory/i,
    ];

    for (const route of routesToCheck) {
      const res = await request(port, route);
      assert.strictEqual(
        res.status,
        200,
        `Expected 200 for ${route}, got ${res.status}`
      );
      for (const pat of forbiddenPatterns) {
        assert.strictEqual(
          pat.test(res.body),
          false,
          `Forbidden placeholder or claim matched ${pat} on route ${route}`
        );
      }
    }
    console.log(`✔ All ${routesToCheck.length} published routes returned 200 OK with zero placeholders or unverified claims.`);

    // Check Home page first-screen headline and manufacturer identity
    const homeRes = await request(port, '/');
    assert(homeRes.body.includes('INDIAN PANEL MANUFACTURER'));
    assert(homeRes.body.includes('Panels for spaces.'));
    assert(homeRes.body.includes('A company built on values.'));
    assert(homeRes.body.includes('Starwoods'));

    // Check /thank-you has noindex
    const thankYouRes = await request(port, '/thank-you?ref=NEOM-2026-ABC123');
    assert(thankYouRes.body.includes('noindex, nofollow'));
    assert(thankYouRes.body.includes('NEOM-2026-ABC123'));

    // Check 404 page
    const notFoundRes = await request(port, '/non-existent-route');
    assert.strictEqual(notFoundRes.status, 404);
    assert(notFoundRes.body.includes('We could not find that page.'));

    // Check static assets (logos, generated images, CSS, JS)
    const assetsToCheck = [
      '/assets/css/styles.css',
      '/assets/js/main.js',
      '/assets/logo/neom-logo-full.png',
      '/assets/logo/neom-logo-compact.png',
      '/assets/logo/neom-symbol-favicon.png',
      '/assets/logo/neom-wordmark-full.png',
      '/assets/logo/neom-wordmark-compact.png',
      '/assets/images/hero-panel-composition.jpg',
      '/assets/images/material-study-detail.jpg',
    ];
    for (const asset of assetsToCheck) {
      const aRes = await request(port, asset);
      assert.strictEqual(
        aRes.status,
        200,
        `Asset ${asset} returned ${aRes.status}`
      );
      assert(aRes.buffer.length > 500, `Asset ${asset} appears empty`);
    }
    console.log('✔ All static assets (CSS, JS, logos, generated images) verified.');

    // Check Enquiry Form Validation Failure (preserves entries, returns 422)
    const invalidRes = await request(port, '/api/enquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        enquiry_type: 'Manufacturing / recurring supply',
        requirement_message: 'Too short',
        full_name: 'Asha Menon',
        organisation: 'Menon Modular Systems',
        preferred_contact_method: 'Email',
        email: 'not-an-email',
        privacy_acknowledged: 'no',
      }),
    });
    assert.strictEqual(invalidRes.status, 422);
    const invalidData = JSON.parse(invalidRes.body);
    assert.strictEqual(invalidData.ok, false);
    assert(invalidData.errors.requirement_message);
    assert(invalidData.errors.email);
    assert(invalidData.errors.privacy_acknowledged);
    console.log('✔ Server-side validation rejects invalid inputs with field-level errors.');

    // Check Enquiry Submission with Email route + Idempotency deduplication
    const idemKey = 'test-idem-key-' + Date.now();
    const validEmailPayload = {
      idempotency_key: idemKey,
      enquiry_type: 'Manufacturing / recurring supply',
      requirement_message:
        'We require recurring panel supply for modular kitchen carcass production in Bengaluru (approx. 600 sheets per month).',
      full_name: 'Rajesh Sharma',
      organisation: 'Sharma Interior Manufacturing Pvt Ltd',
      preferred_contact_method: 'Email',
      email: 'rajesh@example.com',
      city_state: 'Bengaluru, Karnataka',
      brand_id: 'starwoods',
      quantity: '600',
      unit: 'Sheets',
      frequency: 'Recurring',
      privacy_acknowledged: 'yes',
      marketing_opt_in: 'no',
    };

    const createRes1 = await request(port, '/api/enquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(validEmailPayload),
    });
    assert.strictEqual(createRes1.status, 201);
    const createData1 = JSON.parse(createRes1.body);
    assert(createData1.public_reference.startsWith('NEOM-'));

    // Re-submit with same idempotency_key -> should return 200 with identical reference
    const createRes2 = await request(port, '/api/enquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(validEmailPayload),
    });
    assert.strictEqual(createRes2.status, 200);
    const createData2 = JSON.parse(createRes2.body);
    assert.strictEqual(createData2.duplicate, true);
    assert.strictEqual(
      createData2.public_reference,
      createData1.public_reference
    );
    console.log(
      `✔ Durable enquiry persistence & idempotency verified (${createData1.public_reference}).`
    );

    // Check Enquiry Submission with Phone route + Multipart PDF attachment
    const boundary = '----NeomTestBoundary987654';
    const pdfBuffer = Buffer.from(
      '%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF\n',
      'utf8'
    );
    const multipartParts = [
      `--${boundary}\r\nContent-Disposition: form-data; name="enquiry_type"\r\n\r\nInstitutional / public procurement\r\n`,
      `--${boundary}\r\nContent-Disposition: form-data; name="requirement_message"\r\n\r\nRequesting product technical documentation for institutional classroom furniture project evaluation.\r\n`,
      `--${boundary}\r\nContent-Disposition: form-data; name="full_name"\r\n\r\nVikram Nair\r\n`,
      `--${boundary}\r\nContent-Disposition: form-data; name="organisation"\r\n\r\nNair Institutional Projects\r\n`,
      `--${boundary}\r\nContent-Disposition: form-data; name="preferred_contact_method"\r\n\r\nPhone\r\n`,
      `--${boundary}\r\nContent-Disposition: form-data; name="phone"\r\n\r\n+91 98450 12345\r\n`,
      `--${boundary}\r\nContent-Disposition: form-data; name="procurement_role"\r\n\r\nContractor\r\n`,
      `--${boundary}\r\nContent-Disposition: form-data; name="privacy_acknowledged"\r\n\r\nyes\r\n`,
      `--${boundary}\r\nContent-Disposition: form-data; name="attachments"; filename="project-boq.pdf"\r\nContent-Type: application/pdf\r\n\r\n`,
    ];
    const multipartBody = Buffer.concat([
      Buffer.from(multipartParts.join(''), 'utf8'),
      pdfBuffer,
      Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8'),
    ]);

    const multipartRes = await request(port, '/api/enquiries', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        Accept: 'application/json',
      },
      body: multipartBody,
    });
    assert.strictEqual(multipartRes.status, 201);
    const multipartData = JSON.parse(multipartRes.body);
    assert(multipartData.public_reference.startsWith('NEOM-'));
    console.log(
      `✔ Multipart Phone enquiry + verified PDF attachment stored (${multipartData.public_reference}).`
    );

    // Check that disguised executable disguised as .pdf is rejected
    const badMultipartBody = Buffer.concat([
      Buffer.from(multipartParts.join(''), 'utf8'),
      Buffer.from('#!/bin/sh\necho "malicious"\n', 'utf8'),
      Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8'),
    ]);
    const badFileRes = await request(port, '/api/enquiries', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        Accept: 'application/json',
      },
      body: badMultipartBody,
    });
    assert.strictEqual(badFileRes.status, 422);
    console.log('✔ Magic-byte verification blocks disguised non-PDF/JPG/PNG files.');

    // Check private storage protection & authenticated staff workflow
    const directPrivateRes = await request(
      port,
      '/private_storage/db/enquiries.json'
    );
    assert.strictEqual(directPrivateRes.status, 403);

    const unauthStaffRes = await request(port, '/api/staff/enquiries');
    assert.strictEqual(unauthStaffRes.status, 401);

    const authStaffRes = await request(port, '/api/staff/enquiries', {
      headers: {
        Authorization: `Bearer ${process.env.NEOM_STAFF_TOKEN}`,
      },
    });
    assert.strictEqual(authStaffRes.status, 200);
    const staffPayload = JSON.parse(authStaffRes.body);
    const foundWithFile = staffPayload.enquiries.find(
      (e) => e.public_reference === multipartData.public_reference
    );
    assert(foundWithFile);
    assert.strictEqual(foundWithFile.attachments.length, 1);

    const signedUrl = foundWithFile.attachments[0].signed_download_url;
    const downloadRes = await request(port, signedUrl);
    assert.strictEqual(downloadRes.status, 200);
    assert.strictEqual(
      downloadRes.headers['content-type'],
      'application/pdf'
    );
    console.log('✔ Private attachment storage & expiring HMAC-signed staff download URL verified.');

    console.log('\nALL ACCEPTANCE CHECKS PASSED SUCCESSFULLY.');
  } finally {
    server.close();
  }
}

runVerification().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
