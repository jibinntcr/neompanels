/**
 * NEOM Panels — Semantic HTML5 Layout, Header, Navigation, Footer & SEO Shell
 * Implements Sections 4.1, 15.2, 15.7, 17.1–17.4 of the NEOM Panels Brief.
 */

const { companySettings, brands, seoMetadata } = require('../data/content');

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildStructuredData({ currentPath, breadcrumbs, article }) {
  const baseUrl = process.env.PUBLIC_SITE_URL || 'https://neompanels.com';
  const graph = [
    {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: companySettings.brandName,
      legalName: companySettings.legalEntity,
      description: companySettings.shortDescriptor,
      url: `${baseUrl}/`,
      logo: `${baseUrl}/assets/logo/neom-logo-full.png`,
    },
  ];

  if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: crumb.label,
        item: `${baseUrl}${crumb.href}`,
      })),
    });
  }

  if (article) {
    graph.push({
      '@type': 'Article',
      headline: article.title,
      description: article.summary,
      author: {
        '@type': 'Organization',
        name: article.author || 'NEOM Editorial Team',
      },
      publisher: {
        '@id': `${baseUrl}/#organization`,
      },
      datePublished: '2026-11-02',
      mainEntityOfPage: `${baseUrl}/insights/${article.slug}`,
    });
  }

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph,
  });
}

function renderHeader(currentPath) {
  const flags = companySettings.featureFlags;

  const companySubmenu = [
    { label: 'About NEOM', href: '/company' },
    { label: 'Vision & Values', href: '/company#vision-and-values' },
    ...(flags.publishLeadershipPage
      ? [{ label: 'Leadership', href: '/company/leadership' }]
      : []),
    { label: 'Corporate Information', href: '/company/corporate-information' },
    ...(flags.publishCareersPage ? [{ label: 'Careers', href: '/careers' }] : []),
  ];

  const industriesSubmenu = [
    { label: 'All Industries & Business Needs', href: '/industries' },
    {
      label: 'Furniture & OEM Manufacturing',
      href: '/industries/furniture-manufacturers',
    },
    {
      label: 'Projects & Commercial Interiors',
      href: '/industries/projects-and-fitouts',
    },
    {
      label: 'Institutions & Public Procurement',
      href: '/industries/institutions-and-public-procurement',
    },
    { label: 'Partner With NEOM', href: '/partner-with-us' },
  ];

  const resourcesSubmenu = [
    { label: 'Resources Overview', href: '/resources' },
    { label: 'Insights & Articles', href: '/insights' },
    { label: 'Downloads & Documents', href: '/resources/downloads' },
    { label: 'Materials Gallery', href: '/gallery' },
    ...(flags.publishNewsPage ? [{ label: 'News & Updates', href: '/news' }] : []),
  ];

  const isCompanyActive = currentPath.startsWith('/company');
  const isBrandsActive = currentPath.startsWith('/brands');
  const isIndustriesActive =
    currentPath.startsWith('/industries') || currentPath === '/partner-with-us';
  const isManufacturingActive = currentPath.startsWith('/manufacturing');
  const isResponsibilityActive = currentPath.startsWith('/responsibility');
  const isResourcesActive =
    currentPath.startsWith('/resources') ||
    currentPath.startsWith('/insights') ||
    currentPath.startsWith('/gallery');

  const caretSvg = `<svg class="nav-caret" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M2.5 4.5L6 8L9.5 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  return `
  <header class="site-header" role="banner">
    <div class="container site-header__inner">
      <a href="/" class="brand-lockup" aria-label="NEOM Panels — Home">
        <img
          src="/assets/logo/neom-symbol-favicon.png"
          alt=""
          class="brand-lockup__symbol"
          width="48"
          height="48"
        >
        <img
          src="/assets/logo/neom-wordmark-full.png"
          alt="NEOM Panels — Engineered Excellence, Designed for Spaces"
          class="brand-lockup__wordmark-full"
          width="112"
          height="44"
        >
        <img
          src="/assets/logo/neom-wordmark-compact.png"
          alt="NEOM Panels"
          class="brand-lockup__wordmark-compact"
          width="100"
          height="32"
        >
      </a>

      <nav class="primary-nav" aria-label="Primary Navigation">
        <ul class="nav-list">
          <li class="nav-item nav-item--has-dropdown ${isCompanyActive ? 'is-active' : ''}">
            <button
              type="button"
              class="nav-dropdown-trigger"
              aria-expanded="false"
              aria-haspopup="true"
            >
              <span>Company</span>
              ${caretSvg}
            </button>
            <ul class="nav-dropdown" aria-label="Company submenu">
              ${companySubmenu
                .map(
                  (item) => `
                <li>
                  <a href="${item.href}" ${currentPath === item.href ? 'aria-current="page"' : ''}>
                    ${escapeHtml(item.label)}
                  </a>
                </li>`
                )
                .join('')}
            </ul>
          </li>

          <li class="nav-item ${isBrandsActive ? 'is-active' : ''}">
            <a href="/brands" class="nav-link" ${currentPath === '/brands' ? 'aria-current="page"' : ''}>
              Our Brands
            </a>
          </li>

          <li class="nav-item nav-item--has-dropdown ${isIndustriesActive ? 'is-active' : ''}">
            <button
              type="button"
              class="nav-dropdown-trigger"
              aria-expanded="false"
              aria-haspopup="true"
            >
              <span>Industries</span>
              ${caretSvg}
            </button>
            <ul class="nav-dropdown" aria-label="Industries submenu">
              ${industriesSubmenu
                .map(
                  (item) => `
                <li>
                  <a href="${item.href}" ${currentPath === item.href ? 'aria-current="page"' : ''}>
                    ${escapeHtml(item.label)}
                  </a>
                </li>`
                )
                .join('')}
            </ul>
          </li>

          <li class="nav-item ${isManufacturingActive ? 'is-active' : ''}">
            <a href="/manufacturing" class="nav-link" ${currentPath === '/manufacturing' ? 'aria-current="page"' : ''}>
              Manufacturing
            </a>
          </li>

          <li class="nav-item ${isResponsibilityActive ? 'is-active' : ''}">
            <a href="/responsibility" class="nav-link" ${currentPath === '/responsibility' ? 'aria-current="page"' : ''}>
              Responsibility
            </a>
          </li>

          <li class="nav-item nav-item--has-dropdown ${isResourcesActive ? 'is-active' : ''}">
            <button
              type="button"
              class="nav-dropdown-trigger"
              aria-expanded="false"
              aria-haspopup="true"
            >
              <span>Resources</span>
              ${caretSvg}
            </button>
            <ul class="nav-dropdown" aria-label="Resources submenu">
              ${resourcesSubmenu
                .map(
                  (item) => `
                <li>
                  <a href="${item.href}" ${currentPath === item.href ? 'aria-current="page"' : ''}>
                    ${escapeHtml(item.label)}
                  </a>
                </li>`
                )
                .join('')}
            </ul>
          </li>
        </ul>
      </nav>

      <div class="header-actions">
        <a
          href="/enquiry"
          class="btn btn--primary"
          ${currentPath === '/enquiry' ? 'aria-current="page"' : ''}
        >
          Business Enquiry
        </a>
        <button
          type="button"
          class="mobile-menu-toggle"
          data-mobile-menu-toggle
          aria-expanded="false"
          aria-controls="mobile-nav-drawer"
        >
          <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true" focusable="false">
            <path d="M1 1.5H17M1 7H17M1 12.5H17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          <span data-menu-label>Menu</span>
        </button>
      </div>
    </div>

    <div id="mobile-nav-drawer" class="mobile-drawer" role="region" aria-label="Mobile Navigation Menu">
      <div class="mobile-nav-group">
        <div class="mobile-nav-group__title">Company &amp; Brands</div>
        <ul class="mobile-nav-links">
          <li><a href="/" ${currentPath === '/' ? 'aria-current="page"' : ''}>Home</a></li>
          <li><a href="/company" ${currentPath === '/company' ? 'aria-current="page"' : ''}>About NEOM Panels</a></li>
          <li><a href="/company/corporate-information" ${currentPath === '/company/corporate-information' ? 'aria-current="page"' : ''}>Corporate Information</a></li>
          <li><a href="/brands" ${currentPath === '/brands' ? 'aria-current="page"' : ''}>Our Brands (Starwoods)</a></li>
          <li><a href="/manufacturing" ${currentPath === '/manufacturing' ? 'aria-current="page"' : ''}>Manufacturing &amp; Quality</a></li>
          <li><a href="/responsibility" ${currentPath === '/responsibility' ? 'aria-current="page"' : ''}>Responsibility</a></li>
        </ul>
      </div>

      <div class="mobile-nav-group">
        <div class="mobile-nav-group__title">Industries &amp; Business Needs</div>
        <ul class="mobile-nav-links">
          <li><a href="/industries" ${currentPath === '/industries' ? 'aria-current="page"' : ''}>All Industries Overview</a></li>
          <li><a href="/industries/furniture-manufacturers" ${currentPath === '/industries/furniture-manufacturers' ? 'aria-current="page"' : ''}>Furniture &amp; OEM Manufacturing</a></li>
          <li><a href="/industries/projects-and-fitouts" ${currentPath === '/industries/projects-and-fitouts' ? 'aria-current="page"' : ''}>Projects &amp; Commercial Interiors</a></li>
          <li><a href="/industries/institutions-and-public-procurement" ${currentPath === '/industries/institutions-and-public-procurement' ? 'aria-current="page"' : ''}>Institutions &amp; Public Procurement</a></li>
          <li><a href="/partner-with-us" ${currentPath === '/partner-with-us' ? 'aria-current="page"' : ''}>Partner With NEOM</a></li>
        </ul>
      </div>

      <div class="mobile-nav-group">
        <div class="mobile-nav-group__title">Resources &amp; Contact</div>
        <ul class="mobile-nav-links">
          <li><a href="/resources" ${currentPath === '/resources' ? 'aria-current="page"' : ''}>Resources Hub</a></li>
          <li><a href="/insights" ${currentPath.startsWith('/insights') ? 'aria-current="page"' : ''}>Insights &amp; Articles</a></li>
          <li><a href="/resources/downloads" ${currentPath === '/resources/downloads' ? 'aria-current="page"' : ''}>Downloads &amp; Documents</a></li>
          <li><a href="/gallery" ${currentPath === '/gallery' ? 'aria-current="page"' : ''}>Materials Gallery</a></li>
          <li><a href="/contact" ${currentPath === '/contact' ? 'aria-current="page"' : ''}>Contact NEOM</a></li>
        </ul>
      </div>

      <div class="mobile-drawer__cta">
        <a href="/enquiry" class="btn btn--primary">Submit a Business Enquiry</a>
        <a href="/contact" class="btn btn--secondary">Contact NEOM</a>
      </div>
    </div>
  </header>`;
}

function renderBreadcrumbs(breadcrumbs) {
  if (!Array.isArray(breadcrumbs) || breadcrumbs.length === 0) return '';
  return `
  <nav class="breadcrumb-bar" aria-label="Breadcrumb">
    <div class="container">
      <ol class="breadcrumb-list">
        ${breadcrumbs
          .map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            if (isLast) {
              return `<li aria-current="page">${escapeHtml(crumb.label)}</li>`;
            }
            return `<li><a href="${crumb.href}">${escapeHtml(crumb.label)}</a> <span aria-hidden="true">/</span></li>`;
          })
          .join('')}
      </ol>
    </div>
  </nav>`;
}

function renderFooter() {
  const activeBrands = brands.filter((b) => b.published);
  return `
  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="/" aria-label="NEOM Panels Home">
            <img
              src="/assets/logo/neom-logo-full.png"
              alt="NEOM Panels — Engineered Excellence, Designed for Spaces"
              class="footer-brand__logo"
              width="84"
              height="92"
              loading="lazy"
            >
          </a>
          <p class="muted-text" style="max-width: 34ch;">
            ${escapeHtml(companySettings.shortDescriptor)}
          </p>
          <p class="muted-text" style="font-size: 0.84rem; margin-top: 0.65rem;">
            ${escapeHtml(companySettings.coreProposition)}
          </p>
        </div>

        <div>
          <div class="footer-col__title">Company</div>
          <ul class="footer-links">
            <li><a href="/company">About NEOM</a></li>
            <li><a href="/company#vision-and-values">Vision &amp; Values</a></li>
            <li><a href="/company/corporate-information">Corporate Information</a></li>
            <li><a href="/responsibility">Responsibility</a></li>
          </ul>
        </div>

        <div>
          <div class="footer-col__title">Brands</div>
          <ul class="footer-links">
            <li><a href="/brands">Our Brands Overview</a></li>
            ${activeBrands
              .map(
                (b) => `
              <li>
                <a href="/brands#${escapeHtml(b.slug)}">${escapeHtml(b.name)}</a>
              </li>`
              )
              .join('')}
            <li><a href="/enquiry?brand=starwoods">Enquire About Starwoods</a></li>
          </ul>
        </div>

        <div>
          <div class="footer-col__title">Business</div>
          <ul class="footer-links">
            <li><a href="/industries">Industries &amp; Needs</a></li>
            <li><a href="/industries/furniture-manufacturers">Furniture &amp; OEM Supply</a></li>
            <li><a href="/industries/projects-and-fitouts">Projects &amp; Fit-Outs</a></li>
            <li><a href="/industries/institutions-and-public-procurement">Public Procurement</a></li>
            <li><a href="/manufacturing">Manufacturing</a></li>
            <li><a href="/partner-with-us">Partner With Us</a></li>
          </ul>
        </div>

        <div>
          <div class="footer-col__title">Resources &amp; Contact</div>
          <ul class="footer-links">
            <li><a href="/resources">Resources</a></li>
            <li><a href="/insights">Insights</a></li>
            <li><a href="/resources/downloads">Downloads</a></li>
            <li><a href="/gallery">Gallery</a></li>
            <li><a href="/contact">Contact NEOM</a></li>
            <li><a href="/enquiry">Business Enquiry</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div>
          &copy; 2026 ${escapeHtml(companySettings.legalEntity)}. All rights reserved.
        </div>
        <ul class="footer-legal-links" aria-label="Legal and policy links">
          <li><a href="/privacy">Privacy Notice</a></li>
          <li><a href="/terms">Website Terms</a></li>
          <li><a href="/cookies">Cookie Information</a></li>
          <li><a href="/sitemap.xml">Sitemap</a></li>
        </ul>
      </div>
    </div>
  </footer>`;
}

function renderDocument({
  currentPath = '/',
  title,
  description,
  noIndex = false,
  breadcrumbs = [],
  article = null,
  bodyHtml = '',
}) {
  const metaDefaults = seoMetadata[currentPath] || {
    title: 'NEOM Panels | Indian Panel Manufacturer',
    description: companySettings.shortDescriptor,
  };
  const pageTitle = title || metaDefaults.title;
  const pageDescription = description || metaDefaults.description;
  const shouldNoIndex = Boolean(noIndex || metaDefaults.noIndex);
  const baseUrl = process.env.PUBLIC_SITE_URL || 'https://neompanels.com';
  const canonicalUrl = `${baseUrl}${currentPath === '/' ? '/' : currentPath}`;
  const jsonLd = buildStructuredData({ currentPath, breadcrumbs, article });

  return `<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(pageDescription)}">
  ${
    shouldNoIndex
      ? '<meta name="robots" content="noindex, nofollow">'
      : '<meta name="robots" content="index, follow">'
  }
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
  <link rel="icon" type="image/png" href="/assets/logo/neom-symbol-favicon.png">
  <meta property="og:type" content="${article ? 'article' : 'website'}">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(pageDescription)}">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:image" content="${escapeHtml(baseUrl)}/assets/images/hero-panel-composition.jpg">
  <link rel="stylesheet" href="/assets/css/styles.css">
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  ${renderHeader(currentPath)}
  ${renderBreadcrumbs(breadcrumbs)}
  <main id="main-content" tabindex="-1">
    ${bodyHtml}
  </main>
  ${renderFooter()}
  <script src="/assets/js/main.js" defer></script>
</body>
</html>`;
}

module.exports = {
  escapeHtml,
  renderDocument,
};
