/**
 * NEOM Panels — Complete Corporate Page Renderers
 * Strictly implements public copy from Sections 5–18 of the NEOM Panels Brief.
 * Zero bracket placeholders, zero invented statistics/certifications/clients.
 */

const {
  companySettings,
  brands,
  homeAudiences,
  industrySegments,
  companyValues,
  responsibilityPriorities,
  sdgReferences,
  articles,
  documents,
  galleryAssets,
  faqs,
  enquiryTypes,
} = require('../data/content');
const { escapeHtml, renderDocument } = require('./layout');

/* Custom restrained line drawings for Responsibility (Section 16.2) */
const responsibilityIcons = {
  materials: `<svg class="resp-card__icon" viewBox="0 0 40 40" fill="none" aria-hidden="true" focusable="false">
    <rect x="6" y="7" width="16" height="26" stroke="currentColor" stroke-width="1.6"/>
    <rect x="18" y="11" width="16" height="22" stroke="#608D2E" stroke-width="1.6" fill="#F7F7F0"/>
    <line x1="22" y1="16" x2="30" y2="16" stroke="currentColor" stroke-width="1.4"/>
    <line x1="22" y1="21" x2="30" y2="21" stroke="currentColor" stroke-width="1.4"/>
    <line x1="22" y1="26" x2="27" y2="26" stroke="currentColor" stroke-width="1.4"/>
  </svg>`,
  resources: `<svg class="resp-card__icon" viewBox="0 0 40 40" fill="none" aria-hidden="true" focusable="false">
    <circle cx="20" cy="20" r="13" stroke="currentColor" stroke-width="1.6"/>
    <path d="M20 11V20L26 24" stroke="#608D2E" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M11 29L29 11" stroke="#CBB58F" stroke-width="1.2" stroke-dasharray="2 2"/>
  </svg>`,
  people: `<svg class="resp-card__icon" viewBox="0 0 40 40" fill="none" aria-hidden="true" focusable="false">
    <circle cx="15" cy="14" r="4" stroke="currentColor" stroke-width="1.6"/>
    <circle cx="26" cy="15" r="3.5" stroke="#608D2E" stroke-width="1.6"/>
    <path d="M8 30C8 25.5 11.2 23 15 23C18.8 23 22 25.5 22 30" stroke="currentColor" stroke-width="1.6"/>
    <path d="M21 30C21.3 26.5 23.6 24.5 26.5 24.5C29.4 24.5 32 26.5 32 30" stroke="#608D2E" stroke-width="1.6"/>
  </svg>`,
  progress: `<svg class="resp-card__icon" viewBox="0 0 40 40" fill="none" aria-hidden="true" focusable="false">
    <rect x="6" y="8" width="28" height="24" stroke="currentColor" stroke-width="1.6"/>
    <path d="M12 25L17 19L22 22L28 14" stroke="#608D2E" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="28" cy="14" r="2" fill="#0B3D2E"/>
  </svg>`,
};

function renderBrandActionButtons(brand, isHome = false) {
  const secondaryLabel = isHome
    ? 'Enquire Through NEOM'
    : `Enquire About ${brand.name}`;
  if (brand.verifiedExternalUrl) {
    return `
      <div class="btn-group">
        <a
          href="${escapeHtml(brand.verifiedExternalUrl)}"
          class="btn btn--primary"
          target="_blank"
          rel="noopener noreferrer"
          data-track-brand="${escapeHtml(brand.slug)}"
        >
          Visit ${escapeHtml(brand.name)} Website <span aria-hidden="true">&#8599;</span>
        </a>
        <a
          href="${escapeHtml(brand.enquiryRoute)}"
          class="btn btn--secondary"
          data-track-contact="brand_enquiry_${escapeHtml(brand.slug)}"
        >
          ${escapeHtml(secondaryLabel)}
        </a>
      </div>
      <p class="muted-text" style="margin-top: 0.65rem; font-size: 0.85rem;">
        ${escapeHtml(brand.externalLinkHelper)}
      </p>`;
  }

  return `
    <div class="btn-group">
      <a
        href="${escapeHtml(brand.enquiryRoute)}"
        class="btn btn--primary"
        data-track-contact="brand_enquiry_${escapeHtml(brand.slug)}"
      >
        Enquire About ${escapeHtml(brand.name)}
      </a>
      ${
        isHome
          ? `<a href="/brands" class="btn btn--secondary">View Brand Details</a>`
          : `<a href="/enquiry" class="btn btn--secondary">General Business Enquiry</a>`
      }
    </div>
    <p class="muted-text" style="margin-top: 0.65rem; font-size: 0.85rem;">
      Direct ${escapeHtml(brand.name)} enquiries are routed through NEOM Panels with the brand preselected.
    </p>`;
}

/* ==========================================================================
   1. HOME PAGE (Section 4.3 & Section 5)
   ========================================================================== */
function renderHomePage() {
  const starwoods = brands.find((b) => b.published) || brands[0];
  const topArticles = articles.filter((a) => a.published).slice(0, 3);
  const topGallery = galleryAssets.filter((g) => g.published).slice(0, 2);

  const bodyHtml = `
  <!-- 1. Hero Section (Section 5 & Section 16.1) -->
  <section class="hero" aria-labelledby="home-hero-heading">
    <div class="container hero__grid">
      <div class="hero__copy">
        <div class="eyebrow">INDIAN PANEL MANUFACTURER</div>
        <h1 id="home-hero-heading" class="hero-h1">
          Panels for spaces.<br>
          A company built on values.
        </h1>
        <p class="lead">
          NEOM Panels brings manufacturing and material understanding together for businesses that make furniture, shape interiors and deliver projects.
        </p>
        <div class="btn-group">
          <a href="/enquiry" class="btn btn--primary" data-track-contact="hero_primary">
            Discuss Your Requirement
          </a>
          <a href="/brands" class="btn btn--secondary">
            Explore Our Brands
          </a>
        </div>
        <div class="hero__supporting-line">
          <span class="hero__supporting-dot" aria-hidden="true"></span>
          <span>Discover the company behind <strong>Starwoods</strong>.</span>
        </div>
      </div>

      <div class="hero__visual-wrap">
        <figure class="hero-stage" data-hero-stage style="margin: 0;">
          <div class="hero-stage__frame">
            <img
              src="/assets/images/hero-panel-composition.jpg"
              alt="Architectural material study of three solid panel forms in deep forest green, olive leaf and natural timber grain arranged on a warm ivory plinth."
              class="hero-stage__img"
              width="960"
              height="600"
              fetchpriority="high"
            >
          </div>
          <figcaption class="hero-stage__footer">
            <span>Architectural material study — solid panel forms</span>
            <div class="material-swatches" aria-label="Brand material palette">
              <span class="swatch-chip">
                <span class="swatch-chip__color" style="background-color: #0b3d2e;"></span>
                Forest
              </span>
              <span class="swatch-chip">
                <span class="swatch-chip__color" style="background-color: #608d2e;"></span>
                Leaf
              </span>
              <span class="swatch-chip">
                <span class="swatch-chip__color" style="background-color: #cbb58f;"></span>
                Timber
              </span>
            </div>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>

  <!-- 2. Company Introduction (Section 5) -->
  <section class="section section--white" aria-labelledby="home-company-heading">
    <div class="container split-grid split-grid--equal">
      <div>
        <div class="eyebrow">THE COMPANY BEHIND THE PANEL</div>
        <h2 id="home-company-heading" class="section-h2">
          Manufacturing is where our responsibility begins.
        </h2>
        <p class="lead">
          A panel becomes part of something larger: a piece of furniture, a workplace, a learning environment or a space used every day.
        </p>
        <p>
          NEOM Panels is an Indian panel manufacturing business with its own factory. We are building a company that values clear product information, practical business relationships and the careful use of resources.
        </p>
        <div class="btn-group">
          <a href="/company" class="btn btn--secondary">Get to Know NEOM</a>
        </div>
      </div>

      <div class="logo-lockup-card">
        <img
          src="/assets/logo/neom-logo-full.png"
          alt="NEOM Panels — Engineered Excellence, Designed for Spaces"
          width="240"
          height="262"
          loading="lazy"
        >
        <div class="logo-lockup-card__caption">
          <strong>${escapeHtml(companySettings.coreProposition)}</strong><br>
          <span>Parent manufacturing identity behind Starwoods</span>
        </div>
      </div>
    </div>
  </section>

  <!-- 3. Brand Section (Section 5) -->
  <section class="section section--ivory" aria-labelledby="home-brands-heading">
    <div class="container">
      <div class="section-header">
        <div class="section-header__copy">
          <div class="eyebrow">OUR BRANDS</div>
          <h2 id="home-brands-heading" class="section-h2">
            Explore the brands we are building.
          </h2>
          <p>
            Our product brands give customers a focused way to explore their panel requirements. Discover each brand, then continue to its dedicated website for available products and enquiry options.
          </p>
        </div>
        <a href="/brands" class="text-link">View Brand Directory &rarr;</a>
      </div>

      <article class="brand-showcase" aria-labelledby="home-starwoods-title">
        <div class="brand-showcase__body">
          <div>
            <span class="brand-badge">${escapeHtml(starwoods.relationship)}</span>
            <h3 id="home-starwoods-title" class="brand-wordmark">${escapeHtml(starwoods.name)}</h3>
            <p class="lead">${escapeHtml(starwoods.homeCopy)}</p>
            <ul class="brand-points">
              ${starwoods.materialNotes
                .map((note) => `<li>${escapeHtml(note)}</li>`)
                .join('')}
            </ul>
          </div>
          <div>
            ${renderBrandActionButtons(starwoods, true)}
          </div>
        </div>
        <div class="brand-showcase__media">
          <img
            src="${escapeHtml(starwoods.image)}"
            alt="${escapeHtml(starwoods.imageAlt)}"
            width="640"
            height="480"
            loading="lazy"
          >
          <div class="brand-showcase__caption">
            ${escapeHtml(starwoods.imageCaption)}
          </div>
        </div>
      </article>
    </div>
  </section>

  <!-- 4. Business Audiences (Section 5) -->
  <section class="section section--white" aria-labelledby="home-audiences-heading">
    <div class="container">
      <div class="section-header">
        <div class="section-header__copy">
          <div class="eyebrow">BUILT AROUND BUSINESS NEEDS</div>
          <h2 id="home-audiences-heading" class="section-h2">
            Start with what you need to make.
          </h2>
        </div>
        <a href="/industries" class="btn btn--secondary">Explore Business Needs</a>
      </div>

      <div class="audience-grid">
        ${homeAudiences
          .map(
            (aud) => `
          <article class="audience-card">
            <div>
              <div class="audience-card__tag">${escapeHtml(aud.tag)}</div>
              <h3 class="card-h3">${escapeHtml(aud.title)}</h3>
              <p>${escapeHtml(aud.description)}</p>
            </div>
            <div class="audience-card__actions">
              <a href="${escapeHtml(aud.href)}" class="text-link">Read guidance &rarr;</a>
              <a href="${escapeHtml(aud.enquiryHref)}" class="text-link">Start enquiry</a>
            </div>
          </article>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <!-- 5. Manufacturing Section (Section 5) -->
  <section class="section section--sage" aria-labelledby="home-manufacturing-heading">
    <div class="container split-grid">
      <div>
        <div class="eyebrow">MANUFACTURING &amp; QUALITY</div>
        <h2 id="home-manufacturing-heading" class="section-h2">
          Know the company behind your material.
        </h2>
        <p class="lead">
          Our factory is central to the NEOM story. Explore the manufacturing information we publish and ask about the product details relevant to your application.
        </p>
        <div class="btn-group">
          <a href="/manufacturing" class="btn btn--primary">Explore Our Manufacturing</a>
        </div>
      </div>

      <div class="pillar-grid" style="margin-top: 0;">
        <div class="pillar-item">
          <div class="pillar-item__num">01 · FACILITY</div>
          <h3 class="card-h3">Factory information</h3>
          <p class="muted-text">
            NEOM Panels operates its own manufacturing facility in India as the foundation of our business.
          </p>
        </div>
        <div class="pillar-item pillar-item--leaf">
          <div class="pillar-item__num">02 · EVIDENCE</div>
          <h3 class="card-h3">Product documentation</h3>
          <p class="muted-text">
            Technical parameters and test scope are matched to the exact product and grade under evaluation.
          </p>
        </div>
        <div class="pillar-item pillar-item--timber">
          <div class="pillar-item__num">03 · FIT</div>
          <h3 class="card-h3">Application questions</h3>
          <p class="muted-text">
            Share dimensions, machining needs and service conditions early so selection starts accurately.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- 6. Responsibility Section (Section 5) -->
  <section class="section section--ivory" aria-labelledby="home-responsibility-heading">
    <div class="container">
      <div class="section-header">
        <div class="section-header__copy">
          <div class="eyebrow">OUR APPROACH TO RESPONSIBILITY</div>
          <h2 id="home-responsibility-heading" class="section-h2">
            Value should extend beyond the product.
          </h2>
          <p>
            We believe a panel business should consider how materials are sourced, how resources are used and how people are treated. These questions guide the kind of company we want NEOM to become.
          </p>
        </div>
        <a href="/responsibility" class="btn btn--secondary">Explore Our Priorities</a>
      </div>

      <div class="responsibility-grid">
        <article class="resp-card">
          ${responsibilityIcons.materials}
          <h3 class="card-h3">Material choices</h3>
          <p>Understand where inputs come from and what can be documented.</p>
        </article>
        <article class="resp-card">
          ${responsibilityIcons.resources}
          <h3 class="card-h3">Resource use</h3>
          <p>Identify opportunities to use materials and energy more carefully.</p>
        </article>
        <article class="resp-card">
          ${responsibilityIcons.people}
          <h3 class="card-h3">People &amp; relationships</h3>
          <p>Build a culture of safety, fairness and accountability.</p>
        </article>
      </div>
    </div>
  </section>

  <!-- 7. Gallery Preview (Section 5) -->
  <section class="section section--white" aria-labelledby="home-gallery-heading">
    <div class="container">
      <div class="section-header">
        <div class="section-header__copy">
          <div class="eyebrow">INSIDE NEOM</div>
          <h2 id="home-gallery-heading" class="section-h2">A closer look at NEOM.</h2>
          <p>
            Explore our materials, surface finishes and visual studies from the business.
          </p>
        </div>
        <a href="/gallery" class="btn btn--secondary">View Gallery</a>
      </div>

      <div class="gallery-grid">
        ${topGallery
          .map(
            (item) => `
          <figure class="gallery-card" style="margin: 0;">
            <a href="/gallery" class="gallery-card__trigger" style="text-decoration: none;">
              <img
                src="${escapeHtml(item.image)}"
                alt="${escapeHtml(item.alt)}"
                width="640"
                height="400"
                loading="lazy"
              >
            </a>
            <figcaption class="gallery-card__body">
              <strong style="color: var(--neom-forest); display: block; margin-bottom: 0.25rem;">
                ${escapeHtml(item.title)}
              </strong>
              <span class="muted-text">${escapeHtml(item.caption)}</span>
            </figcaption>
          </figure>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <!-- 8. Insights Preview (Section 5) -->
  <section class="section section--ivory" aria-labelledby="home-insights-heading">
    <div class="container">
      <div class="section-header">
        <div class="section-header__copy">
          <div class="eyebrow">NEOM INSIGHTS</div>
          <h2 id="home-insights-heading" class="section-h2">
            Knowledge that helps better material decisions.
          </h2>
          <p>
            Practical perspectives on panel selection, business procurement and the questions behind responsible material choices.
          </p>
        </div>
        <a href="/insights" class="btn btn--secondary">Read Our Insights</a>
      </div>

      <div class="article-grid">
        ${topArticles
          .map(
            (art) => `
          <article class="article-card">
            <div>
              <div class="article-card__meta">
                <span class="article-card__category">${escapeHtml(art.category)}</span>
                <span>&middot;</span>
                <span>${escapeHtml(art.readingTime)}</span>
              </div>
              <h3 class="card-h3">
                <a href="/insights/${escapeHtml(art.slug)}" style="color: inherit; text-decoration: none;">
                  ${escapeHtml(art.title)}
                </a>
              </h3>
              <p class="muted-text">${escapeHtml(art.summary)}</p>
            </div>
            <div style="margin-top: 1.25rem;">
              <a href="/insights/${escapeHtml(art.slug)}" class="text-link">Read article &rarr;</a>
            </div>
          </article>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <!-- 9. Final Enquiry Section (Section 5) -->
  <section class="section section--sage" aria-labelledby="home-cta-heading">
    <div class="container split-grid split-grid--equal">
      <div>
        <div class="eyebrow">BUSINESS ENQUIRY</div>
        <h2 id="home-cta-heading" class="section-h2">
          Tell us what your business needs.
        </h2>
        <p class="lead">
          Whether you are planning recurring supply, sourcing for a project or exploring a partnership, start a conversation with NEOM Panels.
        </p>
      </div>
      <div>
        <div class="btn-group" style="margin-top: 0;">
          <a href="/enquiry" class="btn btn--primary">Submit a Business Enquiry</a>
          <a href="/contact" class="btn btn--secondary">Contact NEOM</a>
        </div>
      </div>
    </div>
  </section>`;

  return renderDocument({
    currentPath: '/',
    bodyHtml,
  });
}

/* ==========================================================================
   2. COMPANY PAGE: /company (Section 6)
   ========================================================================== */
function renderCompanyPage() {
  const bodyHtml = `
  <section class="section section--white" aria-labelledby="company-h1">
    <div class="container split-grid">
      <div>
        <div class="eyebrow">ABOUT NEOM PANELS</div>
        <h1 id="company-h1" class="page-h1">
          A manufacturing business with a longer view.
        </h1>
        <p class="lead">
          NEOM Panels is an Indian panel manufacturing business and the company behind Starwoods. With our own factory, we are developing a brand that connects materials, business relationships and a clear sense of responsibility.
        </p>
        <p>
          We see the panel industry as part of a larger chain of value. Materials support manufacturers, designers and project teams. Those businesses create furniture and spaces that people use every day. The company behind the material has a role in making that chain more dependable.
        </p>
      </div>

      <div class="logo-lockup-card">
        <img
          src="/assets/logo/neom-logo-full.png"
          alt="NEOM Panels — Engineered Excellence, Designed for Spaces"
          width="240"
          height="262"
        >
        <div class="logo-lockup-card__caption">
          <strong>Indian Panel Manufacturing Business</strong><br>
          <span>Corporate parent brand behind Starwoods</span>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--ivory" aria-labelledby="what-we-are-building">
    <div class="container split-grid">
      <div>
        <div class="eyebrow">DIRECTION &amp; PURPOSE</div>
        <h2 id="what-we-are-building" class="section-h2">What we are building</h2>
      </div>
      <div>
        <p class="lead">
          Our ambition is to build an enduring Indian panel company, recognised for the strength of its brands, the clarity of its information and the quality of its business relationships.
        </p>
        <p>
          We want customers and partners to understand what NEOM stands for, who is responsible and how to begin a useful conversation with us.
        </p>
      </div>
    </div>
  </section>

  <section id="vision-and-values" class="section section--sage" aria-labelledby="vision-mission-heading">
    <div class="container">
      <div class="eyebrow">VISION &amp; MISSION</div>
      <h2 id="vision-mission-heading" class="section-h2">Guided by clear commitments.</h2>
      <div class="audience-grid" style="margin-top: 1.75rem;">
        <article class="audience-card">
          <div>
            <div class="audience-card__tag">OUR VISION</div>
            <h3 class="card-h3">An enduring Indian panel company</h3>
            <p class="lead" style="font-size: 1.12rem;">
              To build an enduring Indian panel company that creates lasting value through manufacturing, trusted brands and responsible growth.
            </p>
          </div>
        </article>
        <article class="audience-card">
          <div>
            <div class="audience-card__tag">OUR MISSION</div>
            <h3 class="card-h3">Material clarity &amp; accountable relationships</h3>
            <p class="lead" style="font-size: 1.12rem;">
              To develop panel brands around clear material choices, practical business needs and accountable relationships, while improving the way we use resources and care for people.
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="section section--white" aria-labelledby="values-heading">
    <div class="container">
      <div class="section-header">
        <div class="section-header__copy">
          <div class="eyebrow">OUR VALUES</div>
          <h2 id="values-heading" class="section-h2">Six principles that shape our decisions.</h2>
        </div>
      </div>

      <div class="pillar-grid" style="margin-top: 0;">
        ${companyValues
          .map(
            (val, idx) => `
          <article class="pillar-item ${idx % 3 === 1 ? 'pillar-item--leaf' : idx % 3 === 2 ? 'pillar-item--timber' : ''}">
            <div class="pillar-item__num">0${idx + 1} · VALUE</div>
            <h3 class="card-h3">${escapeHtml(val.title)}</h3>
            <p class="muted-text">${escapeHtml(val.description)}</p>
          </article>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section class="section section--ivory" aria-labelledby="company-closing-cta">
    <div class="container split-grid split-grid--equal">
      <div>
        <div class="eyebrow">CORPORATE GOVERNANCE &amp; CONTACT</div>
        <h2 id="company-closing-cta" class="section-h2">
          Let’s discuss how our businesses could work together.
        </h2>
        <p>
          Explore our published corporate information, discover Starwoods or reach out to our team with your requirement.
        </p>
      </div>
      <div class="btn-group" style="margin-top: 0;">
        <a href="/enquiry" class="btn btn--primary">Discuss Your Requirement</a>
        <a href="/company/corporate-information" class="btn btn--secondary">Corporate Information</a>
      </div>
    </div>
  </section>`;

  return renderDocument({
    currentPath: '/company',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'About NEOM Panels', href: '/company' },
    ],
    bodyHtml,
  });
}

/* ==========================================================================
   3. CORPORATE INFORMATION: /company/corporate-information (Section 11.2)
   ========================================================================== */
function renderCorporateInfoPage() {
  const bodyHtml = `
  <section class="section section--white" aria-labelledby="corp-info-h1">
    <div class="container">
      <div class="eyebrow">CORPORATE INFORMATION</div>
      <h1 id="corp-info-h1" class="page-h1">A clear view of the company.</h1>
      <p class="lead">
        Find NEOM’s published company information, brand governance details and available corporate documents in one place.
      </p>
      <p>
        For a business verification request or a question about a published document, contact the company through the corporate enquiry route below.
      </p>
    </div>
  </section>

  <section class="section section--ivory" aria-labelledby="corp-summary-heading">
    <div class="container">
      <h2 id="corp-summary-heading" class="section-h2">Published company profile</h2>
      <div class="audience-grid" style="margin-top: 1.5rem;">
        <div class="audience-card">
          <div>
            <div class="audience-card__tag">PUBLIC IDENTITY</div>
            <h3 class="card-h3">${escapeHtml(companySettings.brandName)}</h3>
            <p>
              ${escapeHtml(companySettings.shortDescriptor)}
            </p>
          </div>
        </div>

        <div class="audience-card">
          <div>
            <div class="audience-card__tag">MANUFACTURING FOUNDATION</div>
            <h3 class="card-h3">Indian Manufacturing Facility</h3>
            <p>
              NEOM Panels operates its own manufacturing facility in India. Facility and supply verification details are shared directly with business partners and institutional buyers through our corporate and manufacturing enquiry desks.
            </p>
          </div>
        </div>

        <div class="audience-card">
          <div>
            <div class="audience-card__tag">BRAND ARCHITECTURE</div>
            <h3 class="card-h3">Starwoods — Product Brand</h3>
            <p>
              Starwoods is a NEOM Panels brand. Detailed product specifications live on the dedicated brand destination, while corporate enquiries are managed here.
            </p>
          </div>
        </div>

        <div class="audience-card">
          <div>
            <div class="audience-card__tag">POLICIES &amp; NOTICES</div>
            <h3 class="card-h3">Website &amp; Data Governance</h3>
            <p>
              View our <a href="/privacy" class="text-link" style="min-height: auto;">Privacy Notice</a>, <a href="/terms" class="text-link" style="min-height: auto;">Website Terms</a> and <a href="/cookies" class="text-link" style="min-height: auto;">Cookie Information</a> governing enquiries and website interactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--white" aria-labelledby="corp-docs-heading">
    <div class="container">
      <div class="section-header">
        <div class="section-header__copy">
          <div class="eyebrow">DOCUMENT ARCHIVE</div>
          <h2 id="corp-docs-heading" class="section-h2">Published corporate documents</h2>
          <p>
            Every published document records its applicable entity, scope, version and publication date.
          </p>
        </div>
        <a href="/resources/downloads" class="btn btn--secondary">All Downloads</a>
      </div>

      <div class="doc-list">
        ${documents
          .filter((d) => d.published)
          .map(
            (doc) => `
          <article class="doc-item">
            <div>
              <h3 class="card-h3" style="margin-bottom: 0.35rem;">${escapeHtml(doc.title)}</h3>
              <p class="muted-text">${escapeHtml(doc.summary)}</p>
              <div class="doc-item__meta">
                <span><strong>Category:</strong> ${escapeHtml(doc.category)}</span>
                <span><strong>Entity:</strong> ${escapeHtml(doc.applicableEntity)}</span>
                <span><strong>Version:</strong> ${escapeHtml(doc.version)}</span>
                <span><strong>Format:</strong> ${escapeHtml(doc.format)} (${escapeHtml(doc.size)})</span>
              </div>
            </div>
            <div>
              <a
                href="${escapeHtml(doc.downloadHref)}"
                class="btn btn--secondary"
                data-track-doc="${escapeHtml(doc.id)}"
              >
                View Document
              </a>
            </div>
          </article>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section class="section section--sage" aria-labelledby="corp-enquiry-cta">
    <div class="container split-grid split-grid--equal">
      <div>
        <h2 id="corp-enquiry-cta" class="section-h2">Need corporate verification or a specific record?</h2>
        <p>
          Submit a corporate enquiry to request verification details or discuss a formal business relationship with NEOM Panels.
        </p>
      </div>
      <div>
        <a href="/enquiry?type=Corporate+%2F+other+enquiry" class="btn btn--primary">
          Make a Corporate Enquiry
        </a>
      </div>
    </div>
  </section>`;

  return renderDocument({
    currentPath: '/company/corporate-information',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Company', href: '/company' },
      { label: 'Corporate Information', href: '/company/corporate-information' },
    ],
    bodyHtml,
  });
}

/* ==========================================================================
   4. OUR BRANDS PAGE: /brands (Section 7)
   ========================================================================== */
function renderBrandsPage() {
  const activeBrands = brands.filter((b) => b.published);

  const bodyHtml = `
  <section class="section section--white" aria-labelledby="brands-h1">
    <div class="container">
      <div class="eyebrow">THE NEOM BRAND FAMILY</div>
      <h1 id="brands-h1" class="page-h1">
        A company behind the brands you choose.
      </h1>
      <p class="lead">
        NEOM Panels brings its product brands together under one corporate identity. Each brand has its own product focus and a dedicated place to explore the range in greater detail.
      </p>
      <p>
        Use this page to discover a brand, visit its website or send a business enquiry to NEOM.
      </p>
    </div>
  </section>

  <section class="section section--ivory" aria-label="Published Brands">
    <div class="container">
      ${activeBrands
        .map(
          (brand) => `
        <article id="${escapeHtml(brand.slug)}" class="brand-showcase" aria-labelledby="brand-heading-${escapeHtml(brand.slug)}">
          <div class="brand-showcase__body">
            <div>
              <span class="brand-badge">${escapeHtml(brand.relationship)}</span>
              <h2 id="brand-heading-${escapeHtml(brand.slug)}" class="brand-wordmark">
                ${escapeHtml(brand.name)}
              </h2>
              <p class="lead">
                ${escapeHtml(brand.brandPageCopy)}
              </p>
              <ul class="brand-points">
                ${brand.materialNotes
                  .map((note) => `<li>${escapeHtml(note)}</li>`)
                  .join('')}
              </ul>
            </div>
            <div>
              ${renderBrandActionButtons(brand, false)}
            </div>
          </div>
          <div class="brand-showcase__media">
            <img
              src="${escapeHtml(brand.image)}"
              alt="${escapeHtml(brand.imageAlt)}"
              width="640"
              height="480"
            >
            <div class="brand-showcase__caption">
              ${escapeHtml(brand.imageCaption)}
            </div>
          </div>
        </article>`
        )
        .join('')}
    </div>
  </section>

  <section class="section section--sage" aria-labelledby="brands-unsure-heading">
    <div class="container split-grid split-grid--equal">
      <div>
        <div class="eyebrow">GUIDED ENQUIRY</div>
        <h2 id="brands-unsure-heading" class="section-h2">Not sure where to begin?</h2>
        <p class="lead">
          Tell us about your business, intended application and approximate requirement. We can discuss which available brand or product information is relevant to your enquiry.
        </p>
      </div>
      <div>
        <a href="/enquiry" class="btn btn--primary">Discuss Your Requirement</a>
      </div>
    </div>
  </section>`;

  return renderDocument({
    currentPath: '/brands',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Our Brands', href: '/brands' },
    ],
    bodyHtml,
  });
}

/* ==========================================================================
   5. INDUSTRIES OVERVIEW & DETAIL PAGES: /industries/* (Section 8)
   ========================================================================== */
function renderIndustriesPage() {
  const bodyHtml = `
  <section class="section section--white" aria-labelledby="industries-h1">
    <div class="container">
      <div class="eyebrow">INDUSTRIES &amp; BUSINESS NEEDS</div>
      <h1 id="industries-h1" class="page-h1">
        Different businesses. Specific material needs.
      </h1>
      <p class="lead">
        Panel decisions begin with an application. The requirements of a furniture production line, a commercial interior and an institutional project can be very different.
      </p>
      <p>
        Start with your intended use, relevant specification and supply requirement. NEOM can discuss the available product information with you.
      </p>
    </div>
  </section>

  <section class="section section--ivory" aria-label="Industry segments">
    <div class="container">
      <div class="audience-grid">
        ${industrySegments
          .map(
            (seg) => `
          <article class="audience-card">
            <div>
              <h2 class="card-h3">${escapeHtml(seg.title)}</h2>
              <p style="font-weight: 600; color: var(--neom-ink); margin-bottom: 0.65rem;">
                ${escapeHtml(seg.shortSummary)}
              </p>
              <p class="muted-text">${escapeHtml(seg.body)}</p>
            </div>
            <div class="audience-card__actions">
              <a href="${escapeHtml(seg.ctaHref)}" class="btn btn--primary">
                ${escapeHtml(seg.ctaLabel)}
              </a>
              ${
                seg.hasDetailPage
                  ? `<a href="${escapeHtml(seg.detailHref)}" class="text-link">Preparation guide &rarr;</a>`
                  : ''
              }
            </div>
          </article>`
          )
          .join('')}
      </div>
    </div>
  </section>`;

  return renderDocument({
    currentPath: '/industries',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Industries & Business Needs', href: '/industries' },
    ],
    bodyHtml,
  });
}

function renderIndustryDetailPage(segment) {
  const d = segment.detailPage;
  const bodyHtml = `
  <section class="section section--white" aria-labelledby="ind-detail-h1">
    <div class="container split-grid">
      <div>
        <div class="eyebrow">${escapeHtml(d.eyebrow)}</div>
        <h1 id="ind-detail-h1" class="page-h1">${escapeHtml(d.heading)}</h1>
        ${d.paragraphs.map((p) => `<p class="lead">${escapeHtml(p)}</p>`).join('')}
        <div class="btn-group">
          <a href="${escapeHtml(d.ctaHref)}" class="btn btn--primary">
            ${escapeHtml(d.ctaLabel)}
          </a>
          <a href="/industries" class="btn btn--secondary">All Business Needs</a>
        </div>
        <p class="muted-text" style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--neom-line);">
          ${escapeHtml(d.smallNote)}
        </p>
      </div>

      <aside class="enquiry-card" aria-labelledby="ind-checklist-title">
        <h2 id="ind-checklist-title" class="card-h3">${escapeHtml(d.checklistTitle)}</h2>
        <ul class="brand-points">
          ${d.checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
        <p class="muted-text" style="font-size: 0.86rem;">
          You do not need every item finalized before contacting us—identifying open questions helps our team route your enquiry effectively.
        </p>
      </aside>
    </div>
  </section>`;

  return renderDocument({
    currentPath: `/industries/${segment.slug}`,
    title: d.seoTitle,
    description: d.seoDescription,
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Industries', href: '/industries' },
      { label: segment.title, href: `/industries/${segment.slug}` },
    ],
    bodyHtml,
  });
}

/* ==========================================================================
   6. MANUFACTURING & QUALITY: /manufacturing (Section 9)
   ========================================================================== */
function renderManufacturingPage() {
  const processStages = [
    {
      index: 'STAGE 01',
      title: 'Material intake',
      desc: 'Incoming raw material inspection and source documentation recording.',
    },
    {
      index: 'STAGE 02',
      title: 'Preparation',
      desc: 'Conditioning and material preparation suited to the specified panel construction.',
    },
    {
      index: 'STAGE 03',
      title: 'Panel manufacture',
      desc: 'Controlled pressing and board formation within defined operating parameters.',
    },
    {
      index: 'STAGE 04',
      title: 'Finishing',
      desc: 'Trimming, calibration and surface preparation to specified dimensions.',
    },
    {
      index: 'STAGE 05',
      title: 'Product checks',
      desc: 'Batch-level inspection against the applicable grade and specification.',
    },
    {
      index: 'STAGE 06',
      title: 'Packing & dispatch',
      desc: 'Protective bundling, batch identification and dispatch coordination.',
    },
  ];

  const bodyHtml = `
  <section class="section section--white" aria-labelledby="mfg-h1">
    <div class="container split-grid split-grid--equal">
      <div>
        <div class="eyebrow">MANUFACTURING &amp; QUALITY</div>
        <h1 id="mfg-h1" class="page-h1">
          Our factory. The foundation of our business.
        </h1>
        <p class="lead">
          NEOM Panels has its own manufacturing facility in India. It is an important part of the company we are building and the relationship we want customers to have with our materials.
        </p>
        <p>
          This page brings together approved information about the facility, how manufacturing discussions begin and the supporting information available for business enquiries.
        </p>
      </div>

      <figure class="hero-stage" style="margin: 0; animation: none;">
        <div class="hero-stage__frame">
          <img
            src="/assets/images/material-study-detail.jpg"
            alt="Solid panel edge and surface study in natural timber grain and matte forest green."
            class="hero-stage__img"
            width="640"
            height="480"
          >
        </div>
        <figcaption class="hero-stage__footer">
          <span>Brand material study — surface calibration and solid edge detail</span>
        </figcaption>
      </figure>
    </div>
  </section>

  <section class="section section--ivory" aria-labelledby="mfg-flow-heading">
    <div class="container">
      <div class="eyebrow">MANUFACTURING WORKFLOW STRUCTURE</div>
      <h2 id="mfg-flow-heading" class="section-h2">
        From material intake to dispatch accountability.
      </h2>
      <p class="muted-text">
        Illustrative overview of core panel manufacturing stages. Specific process steps depend on the exact product family and grade under discussion.
      </p>

      <div class="process-flow" role="list">
        ${processStages
          .map(
            (st) => `
          <div class="process-step" role="listitem">
            <div class="process-step__index">${escapeHtml(st.index)}</div>
            <div class="process-step__title">${escapeHtml(st.title)}</div>
            <div class="process-step__desc">${escapeHtml(st.desc)}</div>
          </div>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section class="section section--white" aria-labelledby="mfg-principles-heading">
    <div class="container">
      <h2 id="mfg-principles-heading" class="section-h2">How we approach manufacturing conversations</h2>
      <div class="audience-grid" style="margin-top: 1.5rem;">
        <article class="audience-card">
          <div>
            <div class="audience-card__tag">01 · PRODUCT REQUIREMENT</div>
            <h3 class="card-h3">Begin with the product requirement</h3>
            <p>
              The right manufacturing conversation starts with the material, grade and application being considered. Explore our brands for product information, or share your specification with NEOM.
            </p>
          </div>
          <div class="audience-card__actions">
            <a href="/brands" class="btn btn--secondary">Explore Our Brands</a>
          </div>
        </article>

        <article class="audience-card">
          <div>
            <div class="audience-card__tag">02 · SPECIFIC DOCUMENTATION</div>
            <h3 class="card-h3">Product information should be specific.</h3>
            <p>
              Performance depends on the exact product, its grade, intended application and conditions of use. Ask about current specifications, relevant test documentation and any limitations that apply before finalising a selection.
            </p>
          </div>
          <div class="audience-card__actions">
            <a href="/enquiry?type=Product+%2F+technical+information" class="btn btn--secondary">
              Request Product Documentation
            </a>
          </div>
        </article>

        <article class="audience-card">
          <div>
            <div class="audience-card__tag">03 · VISUAL STUDIES</div>
            <h3 class="card-h3">See the business more closely.</h3>
            <p>
              View visual studies of our materials. Every visual asset is captioned clearly to explain what is shown.
            </p>
          </div>
          <div class="audience-card__actions">
            <a href="/gallery" class="btn btn--secondary">View Gallery</a>
          </div>
        </article>

        <article class="audience-card">
          <div>
            <div class="audience-card__tag">04 · SUPPLY &amp; TECHNICAL ENQUIRY</div>
            <h3 class="card-h3">Discuss your requirement.</h3>
            <p>
              For recurring supply, project sourcing or a technical question, share the information your team needs to evaluate the next step.
            </p>
          </div>
          <div class="audience-card__actions">
            <a href="/enquiry?type=Manufacturing+%2F+recurring+supply" class="btn btn--primary">
              Submit a Manufacturing Enquiry
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>`;

  return renderDocument({
    currentPath: '/manufacturing',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Manufacturing & Quality', href: '/manufacturing' },
    ],
    bodyHtml,
  });
}

/* ==========================================================================
   7. RESPONSIBILITY: /responsibility (Section 10)
   ========================================================================== */
function renderResponsibilityPage() {
  const bodyHtml = `
  <section class="section section--white" aria-labelledby="resp-h1">
    <div class="container">
      <div class="eyebrow">RESPONSIBILITY</div>
      <h1 id="resp-h1" class="page-h1">A longer view of value.</h1>
      <p class="lead">
        We believe responsible growth begins with understanding the choices behind a product: where materials come from, how they are used and how people are treated along the way.
      </p>
      <p>
        For NEOM Panels, these questions belong in the business conversation. They shape the priorities we want to develop as the company grows.
      </p>
    </div>
  </section>

  <section class="section section--ivory" aria-labelledby="resp-pillars-heading">
    <div class="container">
      <h2 id="resp-pillars-heading" class="section-h2">Four operating principles</h2>
      <div class="responsibility-grid responsibility-grid--four" style="margin-top: 1.75rem;">
        ${responsibilityPriorities
          .map(
            (item) => `
          <article class="resp-card">
            ${responsibilityIcons[item.id] || ''}
            <h3 class="card-h3">${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.body)}</p>
          </article>`
          )
          .join('')}
      </div>
    </div>
  </section>

  ${
    companySettings.featureFlags.publishSdgReference
      ? `
  <section class="section section--white" aria-labelledby="sdg-reference-heading">
    <div class="container">
      <div class="eyebrow">FRAMEWORK &amp; PRIORITIES</div>
      <h2 id="sdg-reference-heading" class="section-h2">
        Our reference point for responsible growth
      </h2>
      <p class="lead">
        The UN Sustainable Development Goals provide a useful reference for considering responsible production, work, industry and forest-related sourcing. Our proposed priorities focus on SDG 12, with supporting relevance to SDGs 8, 9 and 15.
      </p>
      <p class="muted-text">
        These are priorities for developing our approach. They are not a claim of certification, UN endorsement or measured impact.
      </p>

      <div class="sdg-grid">
        ${sdgReferences
          .map(
            (sdg, idx) => `
          <article class="sdg-card ${idx === 0 ? 'sdg-card--primary' : ''}">
            <div class="sdg-card__header">
              <span class="sdg-card__code">${escapeHtml(sdg.goal)}</span>
              <span class="sdg-card__role">${escapeHtml(sdg.role)}</span>
            </div>
            <h3 class="card-h3">${escapeHtml(sdg.title)}</h3>
            <p class="muted-text">${escapeHtml(sdg.focus)}</p>
          </article>`
          )
          .join('')}
      </div>
    </div>
  </section>`
      : ''
  }

  <section class="section section--sage" aria-labelledby="resp-cta-heading">
    <div class="container split-grid split-grid--equal">
      <div>
        <h2 id="resp-cta-heading" class="section-h2">Questions about our material practices?</h2>
        <p>
          Ask about the sourcing or technical documentation applicable to the specific product and grade your team is evaluating.
        </p>
      </div>
      <div>
        <a href="/enquiry?type=Product+%2F+technical+information" class="btn btn--primary">
          Ask About Our Approach
        </a>
      </div>
    </div>
  </section>`;

  return renderDocument({
    currentPath: '/responsibility',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Responsibility', href: '/responsibility' },
    ],
    bodyHtml,
  });
}

/* ==========================================================================
   8. PARTNER WITH NEOM: /partner-with-us (Section 11.4)
   ========================================================================== */
function renderPartnerPage() {
  const bodyHtml = `
  <section class="section section--white" aria-labelledby="partner-h1">
    <div class="container">
      <div class="eyebrow">BUSINESS PARTNERSHIPS</div>
      <h1 id="partner-h1" class="page-h1">Build a relationship with NEOM.</h1>
      <p class="lead">
        We welcome conversations with businesses interested in NEOM Panels and its brands. Tell us where you operate, the customers you work with and the relationship you would like to explore.
      </p>
    </div>
  </section>

  <section class="section section--ivory" aria-label="Partnership routes">
    <div class="container">
      <div class="pillar-grid" style="margin-top: 0;">
        <article class="pillar-item">
          <div class="pillar-item__num">01 · CHANNEL</div>
          <h2 class="card-h3">Distribution &amp; channel</h2>
          <p>
            Introduce your market, existing business and the territory you are interested in representing for NEOM Panels and Starwoods.
          </p>
        </article>

        <article class="pillar-item pillar-item--leaf">
          <div class="pillar-item__num">02 · OPERATIONS</div>
          <h2 class="card-h3">Manufacturing &amp; supply relationships</h2>
          <p>
            Share your company profile and the products or services relevant to NEOM’s manufacturing operations.
          </p>
        </article>

        <article class="pillar-item pillar-item--timber">
          <div class="pillar-item__num">03 · PROJECTS</div>
          <h2 class="card-h3">Project &amp; institutional relationships</h2>
          <p>
            Tell us about the type of requirement and your role in the procurement or delivery process.
          </p>
        </article>
      </div>

      <div class="enquiry-card" style="margin-top: 2.5rem;">
        <h2 class="section-h2">Ready to introduce your organisation?</h2>
        <p>
          Use our partnership enquiry route to share your operating location, customer segment and commercial background.
        </p>
        <div class="btn-group">
          <a href="/enquiry?type=Distribution+%2F+business+partnership" class="btn btn--primary">
            Introduce Your Business
          </a>
        </div>
        <p class="muted-text" style="margin-top: 1rem; font-size: 0.86rem;">
          Every partnership enquiry is reviewed on its own merits. Submission does not confirm appointment, exclusivity or commercial terms.
        </p>
      </div>
    </div>
  </section>`;

  return renderDocument({
    currentPath: '/partner-with-us',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Partner With NEOM', href: '/partner-with-us' },
    ],
    bodyHtml,
  });
}

/* ==========================================================================
   9. RESOURCES, DOWNLOADS, GALLERY & INSIGHTS (Sections 12 & 13)
   ========================================================================== */
function renderResourcesPage() {
  const bodyHtml = `
  <section class="section section--white" aria-labelledby="resources-h1">
    <div class="container">
      <div class="eyebrow">RESOURCES</div>
      <h1 id="resources-h1" class="page-h1">Information for your next decision.</h1>
      <p class="lead">
        Explore published company information, available documents and practical reading from NEOM Panels.
      </p>

      <div class="pillar-grid">
        <article class="pillar-item">
          <div class="pillar-item__num">DOCUMENTS</div>
          <h2 class="card-h3">Downloads</h2>
          <p class="muted-text">
            Find current brochures, enquiry checklists and company information that have been approved for publication.
          </p>
          <div style="margin-top: 1.25rem;">
            <a href="/resources/downloads" class="text-link">Browse Downloads &rarr;</a>
          </div>
        </article>

        <article class="pillar-item pillar-item--leaf">
          <div class="pillar-item__num">VISUAL ASSETS</div>
          <h2 class="card-h3">Gallery</h2>
          <p class="muted-text">
            See architectural material studies and visual assets from NEOM Panels with clear scope captions.
          </p>
          <div style="margin-top: 1.25rem;">
            <a href="/gallery" class="text-link">Open Gallery &rarr;</a>
          </div>
        </article>

        <article class="pillar-item pillar-item--timber">
          <div class="pillar-item__num">EDITORIAL</div>
          <h2 class="card-h3">Insights</h2>
          <p class="muted-text">
            Read practical perspectives on panel decisions, specification checklists and business procurement.
          </p>
          <div style="margin-top: 1.25rem;">
            <a href="/insights" class="text-link">Read Insights &rarr;</a>
          </div>
        </article>
      </div>
    </div>
  </section>`;

  return renderDocument({
    currentPath: '/resources',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Resources', href: '/resources' },
    ],
    bodyHtml,
  });
}

function renderDownloadsPage() {
  const publishedDocs = documents.filter((d) => d.published);
  const categories = ['All', ...new Set(publishedDocs.map((d) => d.category))];

  const bodyHtml = `
  <section class="section section--white" aria-labelledby="downloads-h1">
    <div class="container">
      <div class="eyebrow">DOWNLOADS &amp; DOCUMENTS</div>
      <h1 id="downloads-h1" class="page-h1">Find the information you need.</h1>
      <p class="lead">
        Browse the documents currently published by NEOM. For product-specific information, you may also need to visit the relevant brand website.
      </p>

      <div class="btn-group" role="toolbar" aria-label="Filter documents by category">
        ${categories
          .map(
            (cat, idx) => `
          <button
            type="button"
            class="btn ${idx === 0 ? 'btn--primary' : 'btn--quiet'}"
            data-doc-filter="${escapeHtml(cat)}"
            aria-pressed="${idx === 0 ? 'true' : 'false'}"
          >
            ${escapeHtml(cat)}
          </button>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section class="section section--ivory" aria-label="Published document list">
    <div class="container">
      <div class="doc-list">
        ${publishedDocs
          .map(
            (doc) => `
          <article class="doc-item" data-doc-category="${escapeHtml(doc.category)}">
            <div style="max-width: 720px;">
              <h2 class="card-h3" style="margin-bottom: 0.35rem;">${escapeHtml(doc.title)}</h2>
              <p class="muted-text">${escapeHtml(doc.summary)}</p>
              <div class="doc-item__meta">
                <span><strong>Category:</strong> ${escapeHtml(doc.category)}</span>
                <span><strong>Entity / Scope:</strong> ${escapeHtml(doc.applicableEntity)} · ${escapeHtml(doc.productScope)}</span>
                <span><strong>Version:</strong> ${escapeHtml(doc.version)}</span>
                <span><strong>Format:</strong> ${escapeHtml(doc.format)} (${escapeHtml(doc.size)})</span>
                <span><strong>Status:</strong> ${escapeHtml(doc.validityDate)}</span>
              </div>
            </div>
            <div class="btn-group" style="margin-top: 0;">
              <a
                href="${escapeHtml(doc.downloadHref)}"
                class="btn btn--primary"
                data-track-doc="${escapeHtml(doc.id)}"
              >
                Open / Print PDF
              </a>
              <a
                href="${escapeHtml(doc.downloadHref)}"
                download
                class="btn btn--secondary"
                data-track-doc="${escapeHtml(doc.id)}_download"
              >
                Download File
              </a>
            </div>
          </article>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section class="section section--sage" aria-labelledby="doc-request-heading">
    <div class="container split-grid split-grid--equal">
      <div>
        <h2 id="doc-request-heading" class="section-h2">Document not available?</h2>
        <p class="lead">
          Tell us what information your team needs and which product or application it relates to.
        </p>
      </div>
      <div>
        <a href="/enquiry?type=Product+%2F+technical+information" class="btn btn--primary">
          Request a Document
        </a>
      </div>
    </div>
  </section>`;

  return renderDocument({
    currentPath: '/resources/downloads',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Resources', href: '/resources' },
      { label: 'Downloads & Documents', href: '/resources/downloads' },
    ],
    bodyHtml,
  });
}

function renderGalleryPage() {
  const items = galleryAssets.filter((g) => g.published);

  const bodyHtml = `
  <section class="section section--white" aria-labelledby="gallery-h1">
    <div class="container">
      <div class="eyebrow">INSIDE NEOM</div>
      <h1 id="gallery-h1" class="page-h1">Materials. Manufacturing. Company life.</h1>
      <p class="lead">
        A closer look at NEOM Panels through visual studies and approved assets from our business. Every item is captioned to distinguish material illustrations from documentary photography.
      </p>
    </div>
  </section>

  <section class="section section--ivory" aria-label="Gallery items">
    <div class="container">
      <div class="gallery-grid">
        ${items
          .map(
            (item) => `
          <figure class="gallery-card" style="margin: 0;">
            <button
              type="button"
              class="gallery-card__trigger"
              data-gallery-trigger
              data-src="${escapeHtml(item.image)}"
              data-alt="${escapeHtml(item.alt)}"
              data-title="${escapeHtml(item.title)}"
              data-caption="${escapeHtml(item.caption)}"
              data-role="${escapeHtml(item.roleNote)}"
              aria-label="Inspect larger view: ${escapeHtml(item.title)}"
            >
              <img
                src="${escapeHtml(item.image)}"
                alt="${escapeHtml(item.alt)}"
                width="720"
                height="450"
                loading="lazy"
              >
              <span class="gallery-card__zoom-pill">Expand view</span>
            </button>
            <figcaption class="gallery-card__body">
              <div class="audience-card__tag">${escapeHtml(item.category)}</div>
              <h2 class="card-h3" style="margin-bottom: 0.35rem;">${escapeHtml(item.title)}</h2>
              <p class="muted-text">${escapeHtml(item.caption)}</p>
              <p class="muted-text" style="font-size: 0.82rem; margin-top: 0.4rem;">
                <strong>Scope:</strong> ${escapeHtml(item.roleNote)}
              </p>
            </figcaption>
          </figure>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <dialog id="gallery-lightbox" class="lightbox-dialog" aria-labelledby="lightbox-title">
    <div class="lightbox-dialog__header">
      <strong id="lightbox-title" data-lightbox-title style="color: var(--neom-forest); font-family: var(--font-heading);"></strong>
      <div style="display: flex; gap: 0.5rem;">
        <button type="button" class="btn btn--quiet" data-lightbox-prev aria-label="Previous image">&larr; Prev</button>
        <button type="button" class="btn btn--quiet" data-lightbox-next aria-label="Next image">Next &rarr;</button>
        <button type="button" class="btn btn--primary" data-lightbox-close>Close</button>
      </div>
    </div>
    <div>
      <img src="" alt="" data-lightbox-img style="width: 100%; max-height: 68vh; object-fit: contain; background: var(--neom-ivory);">
      <p data-lightbox-caption style="margin-top: 0.85rem; font-weight: 500;"></p>
      <p data-lightbox-role class="muted-text" style="font-size: 0.85rem;"></p>
    </div>
  </dialog>`;

  return renderDocument({
    currentPath: '/gallery',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Resources', href: '/resources' },
      { label: 'Gallery', href: '/gallery' },
    ],
    bodyHtml,
  });
}

function renderInsightsIndexPage() {
  const publishedArticles = articles.filter((a) => a.published);

  const bodyHtml = `
  <section class="section section--white" aria-labelledby="insights-h1">
    <div class="container">
      <div class="eyebrow">NEOM INSIGHTS</div>
      <h1 id="insights-h1" class="page-h1">
        Better questions. Clearer material decisions.
      </h1>
      <p class="lead">
        Practical reading for manufacturers, project teams, procurement professionals and people working with panels.
      </p>
    </div>
  </section>

  <section class="section section--ivory" aria-label="Articles">
    <div class="container">
      <div class="article-grid">
        ${publishedArticles
          .map(
            (art) => `
          <article class="article-card">
            <div>
              <div class="article-card__meta">
                <span class="article-card__category">${escapeHtml(art.category)}</span>
                <span>&middot;</span>
                <span>${escapeHtml(art.publishedAt)}</span>
                <span>&middot;</span>
                <span>${escapeHtml(art.readingTime)}</span>
              </div>
              <h2 class="card-h3">
                <a href="/insights/${escapeHtml(art.slug)}" style="color: inherit; text-decoration: none;">
                  ${escapeHtml(art.title)}
                </a>
              </h2>
              <p>${escapeHtml(art.summary)}</p>
            </div>
            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--neom-line);">
              <a href="/insights/${escapeHtml(art.slug)}" class="text-link">Read full article &rarr;</a>
            </div>
          </article>`
          )
          .join('')}
      </div>
    </div>
  </section>`;

  return renderDocument({
    currentPath: '/insights',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Resources', href: '/resources' },
      { label: 'Insights', href: '/insights' },
    ],
    bodyHtml,
  });
}

function renderInsightArticlePage(article) {
  const related = articles.filter(
    (a) => a.published && a.slug !== article.slug
  );

  const bodyHtml = `
  <article class="section section--white" aria-labelledby="article-h1">
    <div class="container" style="max-width: 840px;">
      <div class="article-card__meta" style="margin-bottom: 1rem;">
        <span class="article-card__category">${escapeHtml(article.category)}</span>
        <span>&middot;</span>
        <span>Published ${escapeHtml(article.publishedAt)}</span>
        <span>&middot;</span>
        <span>By ${escapeHtml(article.author)}</span>
        <span>&middot;</span>
        <span>${escapeHtml(article.readingTime)}</span>
      </div>

      <h1 id="article-h1" class="page-h1">${escapeHtml(article.title)}</h1>
      <p class="lead" style="padding-bottom: 1.5rem; border-bottom: 1px solid var(--neom-line); margin-bottom: 2rem;">
        ${escapeHtml(article.intro)}
      </p>

      ${article.sections
        .map(
          (sec) => `
        <section style="margin-bottom: 1.85rem;">
          <h2 class="card-h3">${escapeHtml(sec.heading)}</h2>
          <p>${escapeHtml(sec.body)}</p>
        </section>`
        )
        .join('')}

      <div style="padding: 1.5rem; background: var(--neom-ivory); border-left: 4px solid var(--neom-forest); margin: 2.25rem 0;">
        <p style="margin: 0; font-weight: 500;">${escapeHtml(article.closing)}</p>
      </div>

      <div class="enquiry-card" style="background: var(--neom-sage-soft); margin-top: 2.5rem;">
        <h2 class="card-h3">Discuss your material requirement with NEOM Panels</h2>
        <p>${escapeHtml(article.ctaText)}</p>
        <div class="btn-group">
          <a href="${escapeHtml(article.ctaHref)}" class="btn btn--primary">
            ${escapeHtml(article.ctaLabel)}
          </a>
          <a href="/brands" class="btn btn--secondary">Explore Our Brands</a>
        </div>
      </div>
    </div>
  </article>

  <section class="section section--ivory" aria-labelledby="related-reading-heading">
    <div class="container">
      <h2 id="related-reading-heading" class="section-h2">Related reading</h2>
      <div class="audience-grid" style="margin-top: 1.5rem;">
        ${related
          .map(
            (rel) => `
          <article class="article-card">
            <div>
              <div class="article-card__meta">
                <span class="article-card__category">${escapeHtml(rel.category)}</span>
                <span>&middot;</span>
                <span>${escapeHtml(rel.readingTime)}</span>
              </div>
              <h3 class="card-h3">
                <a href="/insights/${escapeHtml(rel.slug)}" style="color: inherit; text-decoration: none;">
                  ${escapeHtml(rel.title)}
                </a>
              </h3>
              <p class="muted-text">${escapeHtml(rel.summary)}</p>
            </div>
            <div style="margin-top: 1rem;">
              <a href="/insights/${escapeHtml(rel.slug)}" class="text-link">Read article &rarr;</a>
            </div>
          </article>`
          )
          .join('')}
      </div>
    </div>
  </section>`;

  return renderDocument({
    currentPath: `/insights/${article.slug}`,
    title: `${article.title} | NEOM Panels Insights`,
    description: article.summary,
    article,
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Insights', href: '/insights' },
      { label: article.title, href: `/insights/${article.slug}` },
    ],
    bodyHtml,
  });
}

/* ==========================================================================
   10. CONTACT PAGE & FAQ: /contact (Sections 14.5 & 14.7)
   ========================================================================== */
function renderContactPage() {
  const routes = Object.values(companySettings.contactRoutes);

  const bodyHtml = `
  <section class="section section--white" aria-labelledby="contact-h1">
    <div class="container">
      <div class="eyebrow">CONTACT NEOM</div>
      <h1 id="contact-h1" class="page-h1">Start a conversation with NEOM.</h1>
      <p class="lead">
        For product requirements, manufacturing supply, projects or partnerships, use the business enquiry form so your request includes the information needed for follow-up.
      </p>
      <div class="btn-group">
        <a href="/enquiry" class="btn btn--primary" data-track-contact="contact_hero_cta">
          Submit a Business Enquiry
        </a>
        <a href="/brands" class="btn btn--secondary">Explore Our Brands</a>
      </div>
    </div>
  </section>

  <section class="section section--ivory" aria-labelledby="direct-routes-heading">
    <div class="container">
      <h2 id="direct-routes-heading" class="section-h2">Direct enquiry &amp; contact routes</h2>
      <div class="audience-grid" style="margin-top: 1.5rem;">
        ${routes
          .map(
            (rt) => `
          <article class="audience-card">
            <div>
              <h3 class="card-h3">${escapeHtml(rt.title)}</h3>
              <p class="muted-text">${escapeHtml(rt.description)}</p>
            </div>
            <div class="audience-card__actions">
              <a
                href="${escapeHtml(rt.actionHref)}"
                class="text-link"
                data-track-contact="${escapeHtml(rt.title)}"
              >
                ${escapeHtml(rt.actionLabel)} &rarr;
              </a>
            </div>
          </article>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section class="section section--white" aria-labelledby="faq-heading">
    <div class="container" style="max-width: 920px;">
      <div class="eyebrow">FREQUENTLY ASKED QUESTIONS</div>
      <h2 id="faq-heading" class="section-h2">Common questions before submitting an enquiry</h2>
      <div class="faq-list" style="margin-top: 1.75rem;">
        ${faqs
          .map(
            (f) => `
          <details class="faq-item">
            <summary>${escapeHtml(f.question)}</summary>
            <div class="faq-item__body">
              <p>${escapeHtml(f.answer)}</p>
            </div>
          </details>`
          )
          .join('')}
      </div>
    </div>
  </section>`;

  return renderDocument({
    currentPath: '/contact',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Contact NEOM', href: '/contact' },
    ],
    bodyHtml,
  });
}

/* ==========================================================================
   11. BUSINESS ENQUIRY PAGE: /enquiry (Section 14.1 & 14.2)
   ========================================================================== */
function renderEnquiryPage({
  query = {},
  values = {},
  errors = {},
  errorMessage = '',
  idempotencyKey = '',
} = {}) {
  const preselectedType =
    values.enquiry_type ||
    query.type ||
    'Manufacturing / recurring supply';
  const preselectedBrand = (
    values.brand_id ||
    query.brand ||
    ''
  ).toLowerCase();
  const preferredMethod = values.preferred_contact_method || 'Email';

  const bodyHtml = `
  <section class="section section--ivory" aria-labelledby="enquiry-h1">
    <div class="container">
      <div style="max-width: 760px; margin-bottom: 2.25rem;">
        <div class="eyebrow">BUSINESS ENQUIRY</div>
        <h1 id="enquiry-h1" class="page-h1">Tell us what your business needs.</h1>
        <p class="lead">
          Share your requirement with NEOM Panels. Include the information you already have; you do not need to know the exact product before starting a conversation.
        </p>
      </div>

      <div class="enquiry-layout">
        <div class="enquiry-card">
          <div class="step-indicator" aria-label="Enquiry form structure">
            <div class="step-pill is-active" data-step-pill="1">
              Step 1 · Your requirement
            </div>
            <div class="step-pill" data-step-pill="2">
              Step 2 · Your contact details
            </div>
          </div>

          <div id="enquiry-status-region" ${errorMessage ? '' : 'hidden'}>
            ${
              errorMessage
                ? `<div class="alert-box alert-box--error" role="alert"><strong>${escapeHtml(errorMessage)}</strong></div>`
                : ''
            }
          </div>

          <!-- Success State (Shown only after durable backend persistence) -->
          <div
            id="enquiry-success-panel"
            class="alert-box alert-box--success"
            tabindex="-1"
            role="status"
            aria-live="polite"
            hidden
          >
            <h2 class="section-h2" style="margin-bottom: 0.65rem;">
              Thank you. Your enquiry has been received.
            </h2>
            <p class="lead">
              Your reference is <strong id="enquiry-reference-code"></strong>. Please keep it for any follow-up with NEOM.
            </p>
            <div class="btn-group">
              <a href="/brands" class="btn btn--primary">Explore Our Brands</a>
              <a href="/enquiry" class="btn btn--secondary">Submit Another Requirement</a>
            </div>
          </div>

          <form
            id="neom-enquiry-form"
            method="POST"
            action="/api/enquiries"
            enctype="multipart/form-data"
            novalidate
          >
            <input type="hidden" name="idempotency_key" value="${escapeHtml(idempotencyKey)}">
            <input type="hidden" name="source_page" value="${escapeHtml(query.from || '/enquiry')}">

            <!-- Honeypot field for abuse protection -->
            <div class="honeypot-field" aria-hidden="true">
              <label for="field-website-url">Leave this field blank</label>
              <input type="text" id="field-website-url" name="website_url" tabindex="-1" autocomplete="off">
            </div>

            <!-- STEP 1: YOUR REQUIREMENT -->
            <fieldset id="fieldset-step-1" class="form-fieldset">
              <legend class="form-fieldset__legend">Step 1: Your requirement</legend>

              <div class="form-group">
                <span class="form-label">
                  Enquiry type <span class="form-required" aria-hidden="true">*</span>
                </span>
                <div class="radio-card-grid" role="radiogroup" aria-label="Enquiry type">
                  ${enquiryTypes
                    .map((t) => {
                      const checked = preselectedType === t.value;
                      return `
                    <label class="radio-card ${checked ? 'is-selected' : ''}">
                      <input
                        type="radio"
                        name="enquiry_type"
                        value="${escapeHtml(t.value)}"
                        ${checked ? 'checked' : ''}
                        required
                      >
                      <span>
                        <span class="radio-card__title">${escapeHtml(t.label)}</span>
                        <span class="radio-card__desc">${escapeHtml(t.description)}</span>
                      </span>
                    </label>`;
                    })
                    .join('')}
                </div>
                ${
                  errors.enquiry_type
                    ? `<span class="field-error">${escapeHtml(errors.enquiry_type)}</span>`
                    : ''
                }
              </div>

              <div class="form-group">
                <label for="field-requirement_message" class="form-label">
                  What would you like to discuss? <span class="form-required" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="field-requirement_message"
                  name="requirement_message"
                  class="form-control"
                  rows="5"
                  minlength="20"
                  maxlength="3000"
                  required
                  placeholder="Tell us the intended application, approximate quantity and delivery location, if known."
                  ${errors.requirement_message ? 'aria-invalid="true"' : ''}
                >${escapeHtml(values.requirement_message || '')}</textarea>
                <span class="form-hint">
                  Between 20 and 3,000 characters. You do not need to know the exact product grade before starting a conversation.
                </span>
                ${
                  errors.requirement_message
                    ? `<span class="field-error">${escapeHtml(errors.requirement_message)}</span>`
                    : ''
                }
              </div>

              <!-- Optional Context Fields (Section 14.2) -->
              <div class="form-row" data-conditional-scope="all">
                <div class="form-group">
                  <label for="field-brand_id" class="form-label">
                    Brand of interest <span class="form-optional">(Optional)</span>
                  </label>
                  <select id="field-brand_id" name="brand_id" class="form-control">
                    <option value="not_sure" ${!preselectedBrand || preselectedBrand === 'not_sure' ? 'selected' : ''}>
                      Not sure / Open to recommendation
                    </option>
                    ${brands
                      .filter((b) => b.published)
                      .map(
                        (b) => `
                      <option value="${escapeHtml(b.slug)}" ${preselectedBrand === b.slug ? 'selected' : ''}>
                        ${escapeHtml(b.name)} (${escapeHtml(b.relationship)})
                      </option>`
                      )
                      .join('')}
                  </select>
                </div>

                <div class="form-group">
                  <label for="field-product_text" class="form-label">
                    Product family or grade <span class="form-optional">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="field-product_text"
                    name="product_text"
                    class="form-control"
                    placeholder="e.g., Not sure, or specification wording"
                    value="${escapeHtml(values.product_text || '')}"
                  >
                </div>
              </div>

              <div
                class="form-row"
                data-conditional-scope="Manufacturing / recurring supply|Project / bulk requirement|Institutional / public procurement|Product / technical information"
              >
                <div class="form-group">
                  <label for="field-quantity" class="form-label">
                    Approximate quantity <span class="form-optional">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="field-quantity"
                    name="quantity"
                    class="form-control"
                    placeholder="e.g., 500"
                    value="${escapeHtml(values.quantity || '')}"
                  >
                </div>

                <div class="form-group">
                  <label for="field-unit" class="form-label">
                    Unit of measure <span class="form-optional">(Optional)</span>
                  </label>
                  <select id="field-unit" name="unit" class="form-control">
                    <option value="">Select unit (if applicable)</option>
                    <option value="Sheets" ${values.unit === 'Sheets' ? 'selected' : ''}>Sheets</option>
                    <option value="Square metres (sq. m)" ${values.unit === 'Square metres (sq. m)' ? 'selected' : ''}>Square metres (sq. m)</option>
                    <option value="Cubic metres (cu. m)" ${values.unit === 'Cubic metres (cu. m)' ? 'selected' : ''}>Cubic metres (cu. m)</option>
                    <option value="Truckloads / Containers" ${values.unit === 'Truckloads / Containers' ? 'selected' : ''}>Truckloads / Containers</option>
                    <option value="To be discussed" ${values.unit === 'To be discussed' ? 'selected' : ''}>To be discussed</option>
                  </select>
                </div>
              </div>

              <!-- OEM / Recurring Frequency -->
              <div
                class="form-row"
                data-conditional-scope="Manufacturing / recurring supply|Project / bulk requirement"
              >
                <div class="form-group">
                  <label for="field-frequency" class="form-label">
                    Purchase frequency <span class="form-optional">(Optional)</span>
                  </label>
                  <select id="field-frequency" name="frequency" class="form-control">
                    <option value="">Select frequency</option>
                    <option value="One-time" ${values.frequency === 'One-time' ? 'selected' : ''}>One-time requirement</option>
                    <option value="Recurring" ${values.frequency === 'Recurring' ? 'selected' : ''}>Recurring / repeat production supply</option>
                    <option value="Under evaluation" ${values.frequency === 'Under evaluation' ? 'selected' : ''}>Under evaluation</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="field-needed_by" class="form-label">
                    Requested date / project stage <span class="form-optional">(Optional)</span>
                  </label>
                  <input
                    type="date"
                    id="field-needed_by"
                    name="needed_by"
                    class="form-control"
                    value="${escapeHtml(values.needed_by || '')}"
                  >
                  <span class="form-hint">A starting point for discussion, not a delivery promise.</span>
                </div>
              </div>

              <!-- Institutional / Public Procurement Specific Fields -->
              <div
                class="form-row"
                data-conditional-scope="Institutional / public procurement"
              >
                <div class="form-group">
                  <label for="field-procurement_role" class="form-label">
                    Your role <span class="form-optional">(Optional)</span>
                  </label>
                  <select id="field-procurement_role" name="procurement_role" class="form-control">
                    <option value="">Select role</option>
                    <option value="Direct buyer" ${values.procurement_role === 'Direct buyer' ? 'selected' : ''}>Direct institutional / public buyer</option>
                    <option value="Contractor" ${values.procurement_role === 'Contractor' ? 'selected' : ''}>Appointed project contractor</option>
                    <option value="Supplier" ${values.procurement_role === 'Supplier' ? 'selected' : ''}>Institutional furniture supplier / integrator</option>
                    <option value="Consultant" ${values.procurement_role === 'Consultant' ? 'selected' : ''}>Architect / technical consultant</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="field-procurement_reference" class="form-label">
                    Public procurement or tender reference <span class="form-optional">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="field-procurement_reference"
                    name="procurement_reference"
                    class="form-control"
                    placeholder="Public reference only"
                    value="${escapeHtml(values.procurement_reference || '')}"
                  >
                  <span class="form-hint">Do not share restricted tender credentials or confidential files.</span>
                </div>
              </div>

              <!-- Partner Route Specific Field -->
              <div
                class="form-group"
                data-conditional-scope="Distribution / business partnership"
              >
                <label for="field-territory" class="form-label">
                  Territory &amp; current market focus <span class="form-optional">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="field-territory"
                  name="territory"
                  class="form-control"
                  placeholder="e.g., Region, city/state and customer segments served"
                  value="${escapeHtml(values.territory || '')}"
                >
              </div>

              <!-- Supporting Files Attachment -->
              <div class="form-group">
                <label for="field-attachments" class="form-label">
                  Supporting specification or BOQ <span class="form-optional">(Optional)</span>
                </label>
                <input
                  type="file"
                  id="field-attachments"
                  name="attachments"
                  class="form-control"
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  multiple
                >
                <span class="form-hint">
                  Optional: add a relevant specification or BOQ. PDF, JPG or PNG; up to 10 MB per file, maximum 3 files. Share only files you are authorised to provide. Do not include sensitive personal or restricted procurement information.
                </span>
                ${
                  errors.attachments
                    ? `<span class="field-error">${escapeHtml(errors.attachments)}</span>`
                    : ''
                }
              </div>
            </fieldset>

            <!-- STEP 2: YOUR CONTACT DETAILS -->
            <fieldset id="fieldset-step-2" class="form-fieldset">
              <legend class="form-fieldset__legend">Step 2: Your contact details</legend>

              <div class="form-row">
                <div class="form-group">
                  <label for="field-full_name" class="form-label">
                    Full name <span class="form-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    type="text"
                    id="field-full_name"
                    name="full_name"
                    class="form-control"
                    autocomplete="name"
                    required
                    value="${escapeHtml(values.full_name || '')}"
                    ${errors.full_name ? 'aria-invalid="true"' : ''}
                  >
                  ${
                    errors.full_name
                      ? `<span class="field-error">${escapeHtml(errors.full_name)}</span>`
                      : ''
                  }
                </div>

                <div class="form-group">
                  <label for="field-organisation" class="form-label">
                    Company / organisation <span class="form-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    type="text"
                    id="field-organisation"
                    name="organisation"
                    class="form-control"
                    autocomplete="organization"
                    required
                    placeholder="Company name, or Independent professional"
                    value="${escapeHtml(values.organisation || '')}"
                    ${errors.organisation ? 'aria-invalid="true"' : ''}
                  >
                  <span class="form-hint">
                    Enquiring individually? Choose:
                    <button type="button" class="text-link" style="min-height: auto; font-size: 0.82rem; background: none; border: none; padding: 0; cursor: pointer;" data-org-preset="Independent professional">Independent professional</button>
                    or
                    <button type="button" class="text-link" style="min-height: auto; font-size: 0.82rem; background: none; border: none; padding: 0; cursor: pointer;" data-org-preset="Individual project">Individual project</button>
                  </span>
                  ${
                    errors.organisation
                      ? `<span class="field-error">${escapeHtml(errors.organisation)}</span>`
                      : ''
                  }
                </div>
              </div>

              <div class="form-group">
                <span class="form-label">
                  Preferred contact method <span class="form-required" aria-hidden="true">*</span>
                </span>
                <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; margin-top: 0.35rem;">
                  <label style="display: inline-flex; align-items: center; gap: 0.45rem; cursor: pointer; font-weight: 600;">
                    <input
                      type="radio"
                      name="preferred_contact_method"
                      value="Email"
                      ${preferredMethod === 'Email' ? 'checked' : ''}
                      style="width: 18px; height: 18px; accent-color: var(--neom-forest);"
                    >
                    Email
                  </label>
                  <label style="display: inline-flex; align-items: center; gap: 0.45rem; cursor: pointer; font-weight: 600;">
                    <input
                      type="radio"
                      name="preferred_contact_method"
                      value="Phone"
                      ${preferredMethod === 'Phone' ? 'checked' : ''}
                      style="width: 18px; height: 18px; accent-color: var(--neom-forest);"
                    >
                    Phone
                  </label>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="field-email" class="form-label">
                    Email address
                    <span id="email-required-badge" class="${preferredMethod === 'Email' ? 'form-required' : 'form-optional'}">
                      ${preferredMethod === 'Email' ? '*' : '(Optional)'}
                    </span>
                  </label>
                  <input
                    type="email"
                    id="field-email"
                    name="email"
                    class="form-control"
                    autocomplete="email"
                    placeholder="name@company.com"
                    value="${escapeHtml(values.email || '')}"
                    ${preferredMethod === 'Email' ? 'required' : ''}
                    ${errors.email ? 'aria-invalid="true"' : ''}
                  >
                  ${
                    errors.email
                      ? `<span class="field-error">${escapeHtml(errors.email)}</span>`
                      : ''
                  }
                </div>

                <div class="form-group">
                  <label for="field-phone" class="form-label">
                    Phone with country code
                    <span id="phone-required-badge" class="${preferredMethod === 'Phone' ? 'form-required' : 'form-optional'}">
                      ${preferredMethod === 'Phone' ? '*' : '(Optional)'}
                    </span>
                  </label>
                  <input
                    type="tel"
                    id="field-phone"
                    name="phone"
                    class="form-control"
                    autocomplete="tel"
                    placeholder="+91 98765 43210"
                    value="${escapeHtml(values.phone || '+91 ')}"
                    ${preferredMethod === 'Phone' ? 'required' : ''}
                    ${errors.phone ? 'aria-invalid="true"' : ''}
                  >
                  ${
                    errors.phone
                      ? `<span class="field-error">${escapeHtml(errors.phone)}</span>`
                      : ''
                  }
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="field-city_state" class="form-label">
                    Delivery or operating city &amp; state <span class="form-optional">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="field-city_state"
                    name="city_state"
                    class="form-control"
                    placeholder="e.g., Bengaluru, Karnataka"
                    value="${escapeHtml(values.city_state || '')}"
                  >
                </div>

                <div class="form-group">
                  <label for="field-country" class="form-label">
                    Country <span class="form-optional">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="field-country"
                    name="country"
                    class="form-control"
                    value="${escapeHtml(values.country || 'India')}"
                  >
                </div>
              </div>

              <!-- Enquiry Processing Acknowledgement (Required) -->
              <div class="checkbox-row">
                <input
                  type="checkbox"
                  id="field-privacy_acknowledged"
                  name="privacy_acknowledged"
                  value="yes"
                  required
                  ${values.privacy_acknowledged === 'yes' ? 'checked' : ''}
                >
                <label for="field-privacy_acknowledged" style="font-size: 0.94rem; cursor: pointer;">
                  I agree that ${escapeHtml(companySettings.legalEntity)} may use the details I provide to respond to and manage this enquiry, as described in the <a href="/privacy" class="text-link" style="min-height: auto;">Privacy Notice</a>. <span class="form-required" aria-hidden="true">*</span>
                </label>
              </div>
              ${
                errors.privacy_acknowledged
                  ? `<span class="field-error" style="margin-bottom: 1rem;">${escapeHtml(errors.privacy_acknowledged)}</span>`
                  : ''
              }

              <!-- Optional Marketing Checkbox (Separate and Unchecked by default) -->
              <div class="checkbox-row" style="background-color: var(--neom-white);">
                <input
                  type="checkbox"
                  id="field-marketing_opt_in"
                  name="marketing_opt_in"
                  value="yes"
                  ${values.marketing_opt_in === 'yes' ? 'checked' : ''}
                >
                <label for="field-marketing_opt_in" style="font-size: 0.94rem; cursor: pointer;">
                  I would like to receive occasional product and company updates from ${escapeHtml(companySettings.legalEntity)}. <span class="form-optional">(Optional)</span>
                </label>
              </div>
            </fieldset>

            <div class="btn-group" style="margin-top: 1.5rem;">
              <button type="submit" id="enquiry-submit-btn" class="btn btn--primary">
                Submit Business Enquiry
              </button>
            </div>
          </form>
        </div>

        <!-- Quiet Static Panel Edge Illustration & Guidance Aside (Section 16.2) -->
        <aside aria-label="Enquiry guidance">
          <div class="audience-card" style="margin-bottom: 1.5rem;">
            <div class="audience-card__tag">WHAT HAPPENS NEXT</div>
            <h2 class="card-h3">How your requirement is handled</h2>
            <ul class="brand-points">
              <li>Your enquiry receives a unique reference code once saved.</li>
              <li>Requirements are routed by category (OEM supply, project, institutional, technical or partnership).</li>
              <li>No GST number, OTP or account registration is required to begin a conversation.</li>
            </ul>
            <p class="muted-text" style="font-size: 0.85rem; margin-top: 0.75rem;">
              Note: Submitting an enquiry does not constitute a formal tender bid, purchase order or confirmation of product eligibility.
            </p>
          </div>

          <figure class="gallery-card" style="margin: 0;">
            <img
              src="/assets/images/material-study-detail.jpg"
              alt=""
              aria-hidden="true"
              width="520"
              height="360"
              loading="lazy"
            >
            <figcaption class="gallery-card__body">
              <strong style="color: var(--neom-forest); display: block; margin-bottom: 0.25rem;">
                Need help defining your specification?
              </strong>
              <p class="muted-text" style="font-size: 0.9rem;">
                Read our guide: <a href="/insights/panel-quotation-requirements" class="text-link" style="min-height: auto;">Before You Request a Panel Quotation, Define These Seven Things</a>.
              </p>
            </figcaption>
          </figure>
        </aside>
      </div>
    </div>
  </section>`;

  return renderDocument({
    currentPath: '/enquiry',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Business Enquiry', href: '/enquiry' },
    ],
    bodyHtml,
  });
}

/* ==========================================================================
   12. THANK YOU PAGE: /thank-you (Section 4.2 & 14.1, noindex)
   ========================================================================== */
function renderThankYouPage(referenceCode = '') {
  const bodyHtml = `
  <section class="section section--white" aria-labelledby="thank-you-h1">
    <div class="container" style="max-width: 720px;">
      <div class="alert-box alert-box--success" role="status" aria-live="polite" style="padding: 2.5rem;">
        <div class="eyebrow">ENQUIRY RECEIVED</div>
        <h1 id="thank-you-h1" class="page-h1">
          Thank you. Your enquiry has been received.
        </h1>
        <p class="lead">
          ${
            referenceCode
              ? `Your reference is <strong>${escapeHtml(referenceCode)}</strong>. Please keep it for any follow-up with NEOM.`
              : 'Your enquiry has been recorded by NEOM Panels. Please keep your reference code for any follow-up.'
          }
        </p>
        <div class="btn-group">
          <a href="/brands" class="btn btn--primary">Explore Our Brands</a>
          <a href="/" class="btn btn--secondary">Return to Home</a>
        </div>
      </div>
    </div>
  </section>`;

  return renderDocument({
    currentPath: '/thank-you',
    noIndex: true,
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Enquiry Received', href: '/thank-you' },
    ],
    bodyHtml,
  });
}

/* ==========================================================================
   13. LEGAL PAGES: /privacy, /terms, /cookies (Section 18)
   ========================================================================== */
function renderPrivacyPage() {
  const bodyHtml = `
  <section class="section section--white" aria-labelledby="privacy-h1">
    <div class="container" style="max-width: 840px;">
      <div class="eyebrow">LEGAL &amp; DATA PROTECTION</div>
      <h1 id="privacy-h1" class="page-h1">Privacy Notice</h1>
      <p class="muted-text">
        <strong>Effective date:</strong> ${escapeHtml(companySettings.effectiveDate)} &middot;
        <strong>Version:</strong> ${escapeHtml(companySettings.privacyNoticeVersion)}
      </p>
      <p class="lead">
        This notice explains how ${escapeHtml(companySettings.legalEntity)}, operating the NEOM Panels website, handles personal information collected through this website.
      </p>

      <h2 class="card-h3" style="margin-top: 2rem;">Who to contact</h2>
      <p>
        For questions about this notice or a request concerning your information, please submit a request through our <a href="/enquiry?type=Corporate+%2F+other+enquiry" class="text-link" style="min-height: auto;">Corporate Enquiry route</a> or contact our corporate privacy desk via the <a href="/contact" class="text-link" style="min-height: auto;">Contact NEOM</a> page.
      </p>

      <h2 class="card-h3" style="margin-top: 2rem;">Information you choose to provide</h2>
      <p>
        When you submit an enquiry, we receive the contact details, organisation information, requirement description and any files you choose to share. We use this information to understand your request, communicate with you and manage the resulting business discussion.
      </p>

      <h2 class="card-h3" style="margin-top: 2rem;">Website and security information</h2>
      <p>
        The website and its hosting services process limited technical information needed to deliver pages, apply rate limits, maintain security and prevent abuse. Our <a href="/cookies" class="text-link" style="min-height: auto;">Cookie Information</a> page explains the essential tools used on this website.
      </p>

      <h2 class="card-h3" style="margin-top: 2rem;">Marketing choices</h2>
      <p>
        Where we offer company or product updates, the choice to receive them is separate from submitting an enquiry and is unchecked by default. You may withdraw that choice at any time by contacting us with your reference or email address.
      </p>

      <h2 class="card-h3" style="margin-top: 2rem;">Access and service providers</h2>
      <p>
        Enquiry information and uploaded files are stored in restricted private storage accessible only to authorised personnel who need the information to review and respond to your requirement. Personal data, free-text requirement descriptions and private file URLs are never placed in analytics events or public logs.
      </p>

      <h2 class="card-h3" style="margin-top: 2rem;">Brand websites</h2>
      <p>
        This website links to product-brand websites such as Starwoods. Those sites may have their own privacy notices and data-handling arrangements. Please review the notice on the site where you submit information.
      </p>

      <h2 class="card-h3" style="margin-top: 2rem;">Retention</h2>
      <p>
        We retain business enquiry records for the period needed to evaluate, respond to and document the commercial discussion and to meet applicable legal or recordkeeping requirements, after which records and attachments are scheduled for secure deletion or archival review.
      </p>

      <h2 class="card-h3" style="margin-top: 2rem;">Your requests and choices</h2>
      <p>
        You can contact us to ask about the handling of your information, request correction or deletion where applicable, withdraw a relevant permission or raise a concern. We assess requests under applicable Indian data-protection rules and may verify the request before acting.
      </p>

      <h2 class="card-h3" style="margin-top: 2rem;">Security</h2>
      <p>
        We use technical and access-control measures appropriate to the website and the information processed. Please do not include unnecessary sensitive personal information or restricted procurement credentials in a business enquiry.
      </p>

      <h2 class="card-h3" style="margin-top: 2rem;">Changes to this notice</h2>
      <p>
        We may update this notice when our website or practices change. The current version and effective date will always be shown on this page.
      </p>
    </div>
  </section>`;

  return renderDocument({
    currentPath: '/privacy',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Privacy Notice', href: '/privacy' },
    ],
    bodyHtml,
  });
}

function renderTermsPage() {
  const bodyHtml = `
  <section class="section section--white" aria-labelledby="terms-h1">
    <div class="container" style="max-width: 840px;">
      <div class="eyebrow">WEBSITE TERMS</div>
      <h1 id="terms-h1" class="page-h1">Website Terms</h1>
      <p class="muted-text">
        <strong>Effective date:</strong> ${escapeHtml(companySettings.effectiveDate)}
      </p>
      <p class="lead">
        This website is operated by ${escapeHtml(companySettings.legalEntity)} under the NEOM Panels identity. These terms explain the basis on which the website information and enquiry features are provided.
      </p>

      <h2 class="card-h3" style="margin-top: 2rem;">Information on this website</h2>
      <p>
        The website introduces the company, its brands and the information currently approved for publication. Content may be updated as products, documents and business arrangements evolve.
      </p>

      <h2 class="card-h3" style="margin-top: 2rem;">Product information and suitability</h2>
      <p>
        Product information should be checked against the current documents for the exact product and grade. The intended application, installation and operating conditions are relevant to selection. Request clarification where a specification or claim is unclear.
      </p>

      <h2 class="card-h3" style="margin-top: 2rem;">Business enquiries</h2>
      <p>
        Submitting a form does not create a purchase contract, supplier appointment, distribution arrangement or confirmation of stock, pricing, suitability or delivery. Any commercial arrangement requires the applicable written confirmation and terms.
      </p>

      <h2 class="card-h3" style="margin-top: 2rem;">Institutional and public procurement</h2>
      <p>
        Website enquiries do not constitute a formal bid, procurement submission or confirmation of eligibility. The relevant procurement process and documents continue to apply.
      </p>

      <h2 class="card-h3" style="margin-top: 2rem;">Brand and external websites</h2>
      <p>
        The website links to brand destinations and other resources. Product enquiries, orders or purchases made on another website are subject to the information and terms applicable there, including the identity of the actual seller.
      </p>

      <h2 class="card-h3" style="margin-top: 2rem;">Content and intellectual property</h2>
      <p>
        The NEOM Panels identity, logo and website materials are owned or used by the operator under the applicable rights. Third-party brand names and marks remain subject to their respective rights. Obtain permission before reusing protected materials beyond uses permitted by applicable law.
      </p>

      <h2 class="card-h3" style="margin-top: 2rem;">Files and submissions</h2>
      <p>
        Provide accurate information and share only files you are authorised to provide. Do not submit malicious content, restricted procurement material or information that infringes another party’s rights.
      </p>

      <h2 class="card-h3" style="margin-top: 2rem;">Contact and governing law</h2>
      <p>
        Questions regarding these terms may be sent through our <a href="/contact" class="text-link" style="min-height: auto;">Contact NEOM</a> page. Use of this website is governed by the laws of India.
      </p>
    </div>
  </section>`;

  return renderDocument({
    currentPath: '/terms',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Website Terms', href: '/terms' },
    ],
    bodyHtml,
  });
}

function renderCookiesPage() {
  const bodyHtml = `
  <section class="section section--white" aria-labelledby="cookies-h1">
    <div class="container" style="max-width: 840px;">
      <div class="eyebrow">COOKIE INFORMATION</div>
      <h1 id="cookies-h1" class="page-h1">Cookie Information</h1>
      <p class="lead">
        This page explains the cookies and similar technologies used on the NEOM Panels website.
      </p>

      <h2 class="card-h3" style="margin-top: 2rem;">Essential website operation</h2>
      <p>
        The NEOM Panels corporate website is designed to operate without intrusive third-party advertising trackers or cross-site profiling cookies. Essential technical parameters (such as form idempotency tokens used to prevent duplicate enquiry submissions) exist only for the duration of your active form interaction.
      </p>

      <h2 class="card-h3" style="margin-top: 2rem;">Optional analytics</h2>
      <p>
        No third-party marketing pixels or cross-brand behavioral profiling scripts are active by default. If optional analytics tools are introduced in future updates, they will be documented here together with an explicit preference control before activation.
      </p>

      <h2 class="card-h3" style="margin-top: 2rem;">Contact</h2>
      <p>
        If you have questions about how technical data is handled on this site, please review our <a href="/privacy" class="text-link" style="min-height: auto;">Privacy Notice</a> or reach us via the <a href="/contact" class="text-link" style="min-height: auto;">Contact NEOM</a> page.
      </p>
    </div>
  </section>`;

  return renderDocument({
    currentPath: '/cookies',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Cookie Information', href: '/cookies' },
    ],
    bodyHtml,
  });
}

/* ==========================================================================
   14. 404 PAGE NOT FOUND (Section 4.2 & 17.3)
   ========================================================================== */
function renderNotFoundPage(requestedPath = '') {
  const bodyHtml = `
  <section class="section section--white" aria-labelledby="not-found-h1">
    <div class="container" style="max-width: 720px;">
      <div class="eyebrow">404 · PAGE NOT AVAILABLE</div>
      <h1 id="not-found-h1" class="page-h1">We could not find that page.</h1>
      <p class="lead">
        The address <code>${escapeHtml(requestedPath)}</code> may have moved or is not currently published.
      </p>
      <p>
        Use the links below to explore NEOM Panels, discover Starwoods or submit a business requirement.
      </p>
      <div class="btn-group">
        <a href="/" class="btn btn--primary">Return to Home</a>
        <a href="/brands" class="btn btn--secondary">Explore Our Brands</a>
        <a href="/enquiry" class="btn btn--quiet">Submit a Business Enquiry</a>
      </div>
    </div>
  </section>`;

  return renderDocument({
    currentPath: '/404',
    title: 'Page Not Found | NEOM Panels',
    description: 'The requested page could not be found on the NEOM Panels website.',
    noIndex: true,
    bodyHtml,
  });
}

module.exports = {
  renderHomePage,
  renderCompanyPage,
  renderCorporateInfoPage,
  renderBrandsPage,
  renderIndustriesPage,
  renderIndustryDetailPage,
  renderManufacturingPage,
  renderResponsibilityPage,
  renderPartnerPage,
  renderResourcesPage,
  renderDownloadsPage,
  renderGalleryPage,
  renderInsightsIndexPage,
  renderInsightArticlePage,
  renderContactPage,
  renderEnquiryPage,
  renderThankYouPage,
  renderPrivacyPage,
  renderTermsPage,
  renderCookiesPage,
  renderNotFoundPage,
};
