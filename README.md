# NEOM Panels — Corporate B2B Website

A corporate parent-brand and B2B enquiry website for **NEOM Panels**, an Indian panel manufacturing business and the company behind **Starwoods**.

Built strictly against [`WebsitePlan/NEOM_Panels_Website_Strategy_Content_and_Antigravity_Brief.md`](./WebsitePlan/NEOM_Panels_Website_Strategy_Content_and_Antigravity_Brief.md).

---

## 1. Quick Start & Setup Instructions

### Prerequisites
- **Node.js** `>= 18.0.0` (uses standard Node HTTP, filesystem, and crypto modules — zero vulnerable third-party runtime dependencies).

### Start the Server
```bash
npm start
```
The website will be available at `http://localhost:3000`.

### Run Automated Verification
```bash
npm test
```
Executes [`scripts/verify-site.js`](./scripts/verify-site.js) to verify all published routes, zero bracket placeholders, static assets, server-side enquiry validation, idempotency deduplication, magic-byte file attachment verification, private storage isolation, and HMAC-signed staff download URLs.

---

## 2. Environment Variables (No Secrets Committed)

Configure these environment variables in your deployment environment before public release:

| Variable Name | Purpose | Default in Local Preview |
| :--- | :--- | :--- |
| `PORT` | HTTP server listening port | `3000` |
| `PUBLIC_SITE_URL` | Canonical base URL for SEO metadata, JSON-LD and `sitemap.xml` | `https://neompanels.com` |
| `NEOM_LEGAL_ENTITY` | Confirmed registered legal entity operating the website and factory | `NEOM Panels` |
| `STARWOODS_WEBSITE_URL` | Verified external URL for the Starwoods brand website (`https://...`). When unset, the site automatically renders an honest NEOM enquiry route with Starwoods preselected. | *(Unset — routes to `/enquiry?brand=starwoods`)* |
| `NEOM_STAFF_TOKEN` | Secret token required for staff lead management endpoints (`/api/staff/enquiries`) | *(Disabled until set)* |
| `NEOM_ATTACHMENT_SIGNING_SECRET` | HMAC-SHA256 secret used to sign expiring private attachment download URLs | *(Falls back to `NEOM_STAFF_TOKEN`)* |

---

## 3. Content Management Approach

All public content is separated from layout templates inside [`src/data/content.js`](./src/data/content.js) following Section 17.5 of the brief:

- **`companySettings`**: Legal identity, brand tagline, privacy notice version/effective date, contact routing blocks, and `featureFlags` (`publishLeadershipPage`, `publishNewsPage`, `publishCareersPage`, `publishSdgReference`).
- **`brands`**: Structured brand directory (`Starwoods`). Adding a new approved brand or setting `STARWOODS_WEBSITE_URL` updates the Home page, Our Brands page, Footer, and Enquiry form dropdown automatically.
- **`industrySegments`**: Controls `/industries` and the dedicated B2B buyer guides (`/industries/furniture-manufacturers`, `/industries/projects-and-fitouts`, `/industries/institutions-and-public-procurement`).
- **`articles`**: Houses the three reviewed editorial drafts under `/insights/[slug]`.
- **`documents`**: Houses published corporate documents on `/resources/downloads` and `/company/corporate-information` with version, scope, format, size, and validity metadata.
- **`galleryAssets`**: Controls `/gallery` with category, caption, alt text, and scope attribution.

---

## 4. Enquiry Architecture, Private Storage & Staff Workflow

- **Two-Step Accessible Form (`/enquiry` & `POST /api/enquiries`)**:
  - **Step 1 (Your requirement)**: Enquiry type selection (`Manufacturing / recurring supply`, `Project / bulk requirement`, `Institutional / public procurement`, `Product / technical information`, `Distribution / business partnership`, `Corporate / other enquiry`), requirement description (20–3,000 chars), conditional optional fields (brand, product/grade, quantity + unit, purchase frequency, needed-by date, institutional role/reference, territory), and optional file upload (`PDF`, `JPG`, `PNG`, up to 10 MB per file, max 3 files).
  - **Step 2 (Your contact details)**: Full name, company/organisation (with quick presets for `Independent professional` and `Individual project`), preferred contact method (`Email` or `Phone`), delivery city/state, required privacy notice acknowledgement, and a separate, unchecked optional marketing checkbox.
- **Durable Persistence & Abuse Controls ([`src/services/enquiry-service.js`](./src/services/enquiry-service.js))**:
  - Atomic JSON table writes in `private_storage/db/` (`enquiries.json`, `enquiry_attachments.json`, `notification_jobs.json`, `enquiry_activities.json`) with `0600` file permissions.
  - Magic-byte file signature inspection (`%PDF-`, `\xFF\xD8\xFF`, `\x89PNG\r\n\x1a\n`) blocks disguised executables.
  - Attachments are stored outside `public/` in `private_storage/attachments/` and are never directly web-accessible (`403 Forbidden`).
  - Idempotency key deduplication prevents double submissions.
  - Staff can retrieve leads and expiring HMAC-signed attachment links via `GET /api/staff/enquiries` and update status (`New`, `Assigned`, `Contacted`, `Qualified`, `Quoted`, `Closed`, `Spam`) via `PATCH /api/staff/enquiries/:id` using `Authorization: Bearer <NEOM_STAFF_TOKEN>`.

---

## 5. Remaining Factual & Operational Dependencies Before Public Launch

As outlined in Section 21 of the brief, confirm the following inputs before switching from private preview to public production:
1. **Legal Identity & Contacts**: Set `NEOM_LEGAL_ENTITY` and add verified postal address / privacy contact details in `src/data/content.js`.
2. **Starwoods External Website**: Set `STARWOODS_WEBSITE_URL` once the separate Starwoods domain is live.
3. **Real Documentary Photography**: Replace or supplement the abstract brand material studies in `/gallery` and `/manufacturing` with commissioned photographs of the Indian manufacturing facility, production stages, and leadership portraits.
4. **Notification Worker Integration**: Connect the queued jobs in `private_storage/db/notification_jobs.json` to NEOM’s production SMTP/transactional email provider and CRM desk owners.
