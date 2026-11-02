/**
 * NEOM Panels — Corporate B2B Website Server
 * Implements complete routing, SEO sitemap, redirects, rate-limited enquiry intake,
 * private attachment handling and staff workflow endpoints.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

const {
  industrySegments,
  articles,
  seoMetadata,
} = require('./src/data/content');
const pages = require('./src/views/pages');
const {
  createEnquiry,
  listEnquiriesForStaff,
  updateEnquiryForStaff,
  verifySignedAttachmentUrl,
  getAttachmentForStreaming,
} = require('./src/services/enquiry-service');
const {
  parseIncomingEnquiryRequest,
} = require('./src/services/multipart-parser');

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, 'public');

/* Simple in-memory sliding-window rate limiter for POST /api/enquiries */
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQ = 20;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  entry.count += 1;
  rateLimitMap.set(ip, entry);
  return entry.count <= RATE_LIMIT_MAX_REQ;
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
};

const REDIRECT_MAP = {
  '/about': '/company',
  '/about-us': '/company',
  '/our-brands': '/brands',
  '/starwoods': '/brands#starwoods',
  '/products': '/brands',
  '/sustainability': '/responsibility',
  '/downloads': '/resources/downloads',
  '/enquire': '/enquiry',
  '/business-enquiry': '/enquiry',
};

function sendHtml(res, statusCode, html, extraHeaders = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/html; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    ...extraHeaders,
  });
  res.end(html);
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(JSON.stringify(payload));
}

function isStaffAuthorized(req) {
  const configuredToken = process.env.NEOM_STAFF_TOKEN;
  if (!configuredToken) return false;
  const authHeader = String(req.headers.authorization || '');
  const bearer = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : '';
  const tokenHeader = String(req.headers['x-staff-token'] || '').trim();
  const candidate = bearer || tokenHeader;
  if (!candidate || candidate.length !== configuredToken.length) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(candidate),
      Buffer.from(configuredToken)
    );
  } catch (_) {
    return false;
  }
}

function generateXmlSitemap() {
  const baseUrl = process.env.PUBLIC_SITE_URL || 'https://neompanels.com';
  const indexableRoutes = [
    ...Object.keys(seoMetadata).filter(
      (route) => !seoMetadata[route].noIndex
    ),
    ...industrySegments
      .filter((s) => s.hasDetailPage)
      .map((s) => `/industries/${s.slug}`),
    ...articles.filter((a) => a.published).map((a) => `/insights/${a.slug}`),
  ];

  const uniqueRoutes = [...new Set(indexableRoutes)];
  const urlsXml = uniqueRoutes
    .map(
      (route) => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>2026-11-02</lastmod>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
}

function serveStaticFile(reqPath, res) {
  const safeRel = path
    .normalize(decodeURIComponent(reqPath))
    .replace(/^(\.\.(\/|\\|$))+/, '');
  const fullPath = path.join(PUBLIC_DIR, safeRel);

  if (!fullPath.startsWith(PUBLIC_DIR)) {
    return false;
  }

  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
    return false;
  }

  const ext = path.extname(fullPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const cacheControl =
    ext === '.png' || ext === '.jpg' || ext === '.jpeg'
      ? 'public, max-age=86400'
      : 'public, max-age=3600';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': cacheControl,
    'X-Content-Type-Options': 'nosniff',
  });
  fs.createReadStream(fullPath).pipe(res);
  return true;
}

const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = new URL(
      req.url || '/',
      `http://${req.headers.host || 'localhost'}`
    );
    let pathname = parsedUrl.pathname;
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }

    const query = Object.fromEntries(parsedUrl.searchParams.entries());

    // 1. Block any direct attempt to access private storage
    if (pathname.startsWith('/private_storage')) {
      sendJson(res, 403, { error: 'Forbidden' });
      return;
    }

    // 2. Redirects for changed or shorthand URLs (Section 17.3)
    if (REDIRECT_MAP[pathname]) {
      res.writeHead(301, { Location: REDIRECT_MAP[pathname] });
      res.end();
      return;
    }

    const isGetOrHead = req.method === 'GET' || req.method === 'HEAD';

    // 3. Static files under /assets or /resources/downloads/*.html
    if (
      isGetOrHead &&
      (pathname.startsWith('/assets/') ||
        (pathname.startsWith('/resources/downloads/') &&
          pathname.endsWith('.html')))
    ) {
      if (serveStaticFile(pathname, res)) return;
    }

    // 4. XML Sitemap & robots.txt (Section 17.3)
    if (isGetOrHead && pathname === '/sitemap.xml') {
      res.writeHead(200, {
        'Content-Type': 'application/xml; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      });
      res.end( generateXmlSitemap());
      return;
    }

    if (isGetOrHead && pathname === '/robots.txt') {
      const baseUrl = process.env.PUBLIC_SITE_URL || 'https://neompanels.com';
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(
        `User-agent: *\nAllow: /\nDisallow: /thank-you\nDisallow: /api/\nSitemap: ${baseUrl}/sitemap.xml\n`
      );
      return;
    }

    // 5. API: Submit Business Enquiry (POST /api/enquiries)
    if (req.method === 'POST' && pathname === '/api/enquiries') {
      const clientIp =
        String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
        req.socket.remoteAddress ||
        'unknown';
      const wantsJson = String(req.headers.accept || '').includes(
        'application/json'
      );

      if (!checkRateLimit(clientIp)) {
        const msg =
          'Too many enquiry attempts from this network. Please wait a few minutes and try again.';
        if (wantsJson) {
          sendJson(res, 429, { ok: false, message: msg });
        } else {
          sendHtml(
            res,
            429,
            pages.renderEnquiryPage({
              errorMessage: msg,
              idempotencyKey: crypto.randomUUID(),
            })
          );
        }
        return;
      }

      let parsedBody;
      try {
        parsedBody = await parseIncomingEnquiryRequest(req);
      } catch (err) {
        const status = err.statusCode || 400;
        const msg =
          status === 413
            ? 'Uploaded files exceed the 10 MB per file limit. Please check your attachments.'
            : 'Your enquiry could not be processed. Please check your entries and try again.';
        if (wantsJson) {
          sendJson(res, status, { ok: false, message: msg });
        } else {
          sendHtml(
            res,
            status,
            pages.renderEnquiryPage({
              errorMessage: msg,
              idempotencyKey: crypto.randomUUID(),
            })
          );
        }
        return;
      }

      const result = createEnquiry(parsedBody.fields, parsedBody.files);

      if (result.ok) {
        if (wantsJson) {
          sendJson(res, result.status, {
            ok: true,
            public_reference: result.record.public_reference,
            enquiry_type: result.record.enquiry_type,
            assigned_owner: result.record.assigned_owner,
            duplicate: Boolean(result.duplicate),
          });
        } else {
          res.writeHead(303, {
            Location: `/thank-you?ref=${encodeURIComponent(result.record.public_reference)}`,
          });
          res.end();
        }
        return;
      }

      if (wantsJson) {
        sendJson(res, result.status, {
          ok: false,
          message: result.message,
          errors: result.errors,
        });
      } else {
        sendHtml(
          res,
          result.status,
          pages.renderEnquiryPage({
            values: parsedBody.fields,
            errors: result.errors,
            errorMessage: result.message,
            idempotencyKey:
              parsedBody.fields.idempotency_key || crypto.randomUUID(),
          })
        );
      }
      return;
    }

    // 6. Staff Authenticated Workflow Endpoints (Section 14.3 items 5, 8 & 9)
    if (pathname === '/api/staff/enquiries' && req.method === 'GET') {
      if (!isStaffAuthorized(req)) {
        sendJson(res, 401, {
          error: 'Unauthorized. Valid NEOM_STAFF_TOKEN required.',
        });
        return;
      }
      sendJson(res, 200, { ok: true, enquiries: listEnquiriesForStaff() });
      return;
    }

    if (
      pathname.startsWith('/api/staff/enquiries/') &&
      (req.method === 'PATCH' || req.method === 'POST')
    ) {
      if (!isStaffAuthorized(req)) {
        sendJson(res, 401, {
          error: 'Unauthorized. Valid NEOM_STAFF_TOKEN required.',
        });
        return;
      }
      const enquiryId = decodeURIComponent(
        pathname.replace('/api/staff/enquiries/', '')
      );
      const parsed = await parseIncomingEnquiryRequest(req);
      const updated = updateEnquiryForStaff(
        enquiryId,
        parsed.fields,
        parsed.fields.actor_id || 'staff_member'
      );
      if (!updated) {
        sendJson(res, 404, { error: 'Enquiry not found' });
        return;
      }
      sendJson(res, 200, { ok: true, enquiry: updated });
      return;
    }

    if (pathname.startsWith('/api/staff/attachments/') && req.method === 'GET') {
      const attachmentId = decodeURIComponent(
        pathname.replace('/api/staff/attachments/', '')
      );
      const validSignature = verifySignedAttachmentUrl(
        attachmentId,
        query.expires,
        query.sig
      );
      if (!validSignature && !isStaffAuthorized(req)) {
        sendJson(res, 403, {
          error: 'Forbidden. Valid signed URL or staff token required.',
        });
        return;
      }
      const found = getAttachmentForStreaming(attachmentId);
      if (!found) {
        sendJson(res, 404, { error: 'Attachment not found' });
        return;
      }
      res.writeHead(200, {
        'Content-Type': found.meta.verified_mime_type,
        'Content-Disposition': `attachment; filename="${found.meta.original_name}"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      });
      fs.createReadStream(found.fullPath).pipe(res);
      return;
    }

    // 7. Public Corporate Page Routes (GET / HEAD)
    if (isGetOrHead) {
      if (pathname === '/') {
        sendHtml(res, 200, pages.renderHomePage());
        return;
      }
      if (pathname === '/company') {
        sendHtml(res, 200, pages.renderCompanyPage());
        return;
      }
      if (pathname === '/company/corporate-information') {
        sendHtml(res, 200, pages.renderCorporateInfoPage());
        return;
      }
      if (pathname === '/brands') {
        sendHtml(res, 200, pages.renderBrandsPage());
        return;
      }
      if (pathname === '/industries') {
        sendHtml(res, 200, pages.renderIndustriesPage());
        return;
      }
      if (pathname.startsWith('/industries/')) {
        const slug = pathname.replace('/industries/', '');
        const seg = industrySegments.find(
          (s) => s.slug === slug && s.hasDetailPage
        );
        if (seg) {
          sendHtml(res, 200, pages.renderIndustryDetailPage(seg));
          return;
        }
      }
      if (pathname === '/manufacturing') {
        sendHtml(res, 200, pages.renderManufacturingPage());
        return;
      }
      if (pathname === '/responsibility') {
        sendHtml(res, 200, pages.renderResponsibilityPage());
        return;
      }
      if (pathname === '/partner-with-us') {
        sendHtml(res, 200, pages.renderPartnerPage());
        return;
      }
      if (pathname === '/resources') {
        sendHtml(res, 200, pages.renderResourcesPage());
        return;
      }
      if (pathname === '/resources/downloads') {
        sendHtml(res, 200, pages.renderDownloadsPage());
        return;
      }
      if (pathname === '/gallery') {
        sendHtml(res, 200, pages.renderGalleryPage());
        return;
      }
      if (pathname === '/insights') {
        sendHtml(res, 200, pages.renderInsightsIndexPage());
        return;
      }
      if (pathname.startsWith('/insights/')) {
        const slug = pathname.replace('/insights/', '');
        const art = articles.find((a) => a.slug === slug && a.published);
        if (art) {
          sendHtml(res, 200, pages.renderInsightArticlePage(art));
          return;
        }
      }
      if (pathname === '/contact') {
        sendHtml(res, 200, pages.renderContactPage());
        return;
      }
      if (pathname === '/enquiry') {
        sendHtml(
          res,
          200,
          pages.renderEnquiryPage({
            query,
            idempotencyKey: crypto.randomUUID(),
          })
        );
        return;
      }
      if (pathname === '/thank-you') {
        sendHtml(
          res,
          200,
          pages.renderThankYouPage(String(query.ref || '').slice(0, 40)),
          { 'X-Robots-Tag': 'noindex, nofollow' }
        );
        return;
      }
      if (pathname === '/privacy') {
        sendHtml(res, 200, pages.renderPrivacyPage());
        return;
      }
      if (pathname === '/terms') {
        sendHtml(res, 200, pages.renderTermsPage());
        return;
      }
      if (pathname === '/cookies') {
        sendHtml(res, 200, pages.renderCookiesPage());
        return;
      }
    }

    // 8. Fallback 404 Page Not Found
    sendHtml(res, 404, pages.renderNotFoundPage(pathname), {
      'X-Robots-Tag': 'noindex, nofollow',
    });
  } catch (_) {
    sendHtml(
      res,
      500,
      pages.renderNotFoundPage('Internal error — please return to Home')
    );
  }
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(
      `NEOM Panels corporate server running at http://localhost:${PORT}`
    );
  });
}

module.exports = { server };
