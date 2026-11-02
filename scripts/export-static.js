/**
 * Pre-renders all NEOM Panels routes into static HTML inside ./dist
 * Supports optional BASE_PATH (e.g. "/neompanels" for GitHub Pages project sites)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { industrySegments, articles } = require('../src/data/content');
const pages = require('../src/views/pages');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const BASE_PATH = (process.env.BASE_PATH || '').replace(/\/$/, '');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function applyBasePath(html) {
  if (!BASE_PATH) return html;
  return html
    .replace(/(href|src|action)="\/(?!\/)/g, `$1="${BASE_PATH}/`)
    .replace(/url\('\/(?!\/)/g, `url('${BASE_PATH}/`);
}

function writeRouteHtml(routePath, html) {
  const transformed = applyBasePath(html);
  if (routePath === '/') {
    const outFile = path.join(DIST_DIR, 'index.html');
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, transformed, 'utf8');
    return;
  }
  const cleanRel = routePath.replace(/^\//, '');
  const indexFile = path.join(DIST_DIR, cleanRel, 'index.html');
  fs.mkdirSync(path.dirname(indexFile), { recursive: true });
  fs.writeFileSync(indexFile, transformed, 'utf8');
  // Also write cleanRel.html for flat static hosts
  const flatFile = path.join(DIST_DIR, `${cleanRel}.html`);
  fs.writeFileSync(flatFile, transformed, 'utf8');
}

function buildStaticSite() {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
  fs.mkdirSync(DIST_DIR, { recursive: true });

  // 1. Copy public static assets
  copyRecursive(PUBLIC_DIR, DIST_DIR);

  // 2. Render all core pages
  const routeMap = {
    '/': pages.renderHomePage(),
    '/company': pages.renderCompanyPage(),
    '/company/corporate-information': pages.renderCorporateInfoPage(),
    '/brands': pages.renderBrandsPage(),
    '/industries': pages.renderIndustriesPage(),
    '/manufacturing': pages.renderManufacturingPage(),
    '/responsibility': pages.renderResponsibilityPage(),
    '/partner-with-us': pages.renderPartnerPage(),
    '/resources': pages.renderResourcesPage(),
    '/resources/downloads': pages.renderDownloadsPage(),
    '/gallery': pages.renderGalleryPage(),
    '/insights': pages.renderInsightsIndexPage(),
    '/contact': pages.renderContactPage(),
    '/enquiry': pages.renderEnquiryPage({
      idempotencyKey: crypto.randomUUID(),
    }),
    '/thank-you': pages.renderThankYouPage('NEOM-2026-PREVIEW'),
    '/privacy': pages.renderPrivacyPage(),
    '/terms': pages.renderTermsPage(),
    '/cookies': pages.renderCookiesPage(),
  };

  for (const [route, html] of Object.entries(routeMap)) {
    writeRouteHtml(route, html);
  }

  for (const seg of industrySegments.filter((s) => s.hasDetailPage)) {
    writeRouteHtml(
      `/industries/${seg.slug}`,
      pages.renderIndustryDetailPage(seg)
    );
  }

  for (const art of articles.filter((a) => a.published)) {
    writeRouteHtml(
      `/insights/${art.slug}`,
      pages.renderInsightArticlePage(art)
    );
  }

  // 404 page at root of dist
  fs.writeFileSync(
    path.join(DIST_DIR, '404.html'),
    applyBasePath(pages.renderNotFoundPage('/404')),
    'utf8'
  );
  fs.writeFileSync(path.join(DIST_DIR, '.nojekyll'), '', 'utf8');

  console.log(`Static build exported to ${DIST_DIR} (BASE_PATH="${BASE_PATH}")`);
}

buildStaticSite();
