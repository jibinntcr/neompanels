/**
 * NEOM Panels — Structured Content & Data Model
 * Follows Section 17.5 (CMS and editorial model) & Section 19.2 (Factual rules).
 * Only approved public copy is exposed here. Internal notes and unconfirmed facts are excluded.
 */

const LEGAL_ENTITY = process.env.NEOM_LEGAL_ENTITY || 'NEOM Panels';
const STARWOODS_URL = process.env.STARWOODS_WEBSITE_URL || '';

const companySettings = {
  brandName: 'NEOM Panels',
  legalEntity: LEGAL_ENTITY,
  tagline: 'ENGINEERED EXCELLENCE, DESIGNED FOR SPACES',
  proposedHeadline: 'Panels for spaces. A company built on values.',
  shortDescriptor:
    'NEOM Panels is an Indian panel manufacturing business and the company behind Starwoods.',
  coreProposition:
    'Manufacturing capability. Material understanding. Long-term relationships.',
  country: 'India',
  manufacturingSummary:
    'Own manufacturing facility in India supporting NEOM Panels and its brand portfolio.',
  privacyNoticeVersion: '2026-11-v1.0',
  effectiveDate: '2 November 2026',
  contactRoutes: {
    businessEnquiries: {
      title: 'Business enquiries',
      description:
        'For recurring manufacturing supply, project BOQs, institutional requirements, technical documentation or partnership discussions.',
      actionLabel: 'Submit a Business Enquiry',
      actionHref: '/enquiry',
    },
    corporateOffice: {
      title: 'Corporate office',
      description:
        'India — Corporate correspondence and verification enquiries are routed through our corporate desk.',
      actionLabel: 'Corporate Enquiry',
      actionHref: '/enquiry?type=Corporate+%2F+other+enquiry',
    },
    factoryLocation: {
      title: 'Manufacturing facility',
      description:
        'NEOM Panels operates its own manufacturing facility in India. Facility visit and supply discussions are arranged through the manufacturing enquiry route.',
      actionLabel: 'Manufacturing Enquiry',
      actionHref: '/enquiry?type=Manufacturing+%2F+recurring+supply',
    },
    generalContact: {
      title: 'Document & information requests',
      description:
        'Need a specific product sheet, grade specification or policy document for your evaluation?',
      actionLabel: 'Request Information',
      actionHref: '/enquiry?type=Product+%2F+technical+information',
    },
  },
  featureFlags: {
    publishLeadershipPage: false, // Enable when approved leadership profiles & portraits are supplied
    publishNewsPage: false, // Enable when genuine announcements exist
    publishCareersPage: false, // Enable when staffed positions are open
    publishSdgReference: true, // Restrained SDG 12 (primary) & 8, 9, 15 (supporting) priorities
  },
};

const brands = [
  {
    id: 'starwoods',
    name: 'Starwoods',
    slug: 'starwoods',
    relationship: 'A NEOM Panels brand.',
    homeCopy:
      'A NEOM Panels brand. Explore the available range and product information through the dedicated Starwoods website.',
    brandPageCopy:
      'Discover Starwoods and explore the product information available on its dedicated website. For a broader supply, project or partnership discussion, you can also contact NEOM directly.',
    materialNotes: [
      'Dedicated brand destination for detailed product range exploration',
      'Application-led product and technical documentation inquiries',
      'Direct NEOM corporate routing for recurring OEM, project and channel discussions',
    ],
    image: '/assets/images/material-study-detail.jpg',
    imageAlt:
      'Architectural material study showing warm vertical timber grain paired with a deep forest-green solid panel surface.',
    imageCaption: 'Brand material illustration — solid surface and timber grain study.',
    verifiedExternalUrl: STARWOODS_URL || null,
    externalLinkHelper: 'Opens the Starwoods website.',
    enquiryRoute: '/enquiry?brand=starwoods',
    enquiryOwner: 'starwoods_brand_desk',
    published: true,
  },
];

const homeAudiences = [
  {
    id: 'furniture-oem',
    title: 'Furniture & OEM Manufacturing',
    description:
      'Discuss panel requirements for furniture production, modular systems and repeat manufacturing.',
    href: '/industries/furniture-manufacturers',
    enquiryHref: '/enquiry?type=Manufacturing+%2F+recurring+supply',
    tag: 'Recurring & Production Supply',
  },
  {
    id: 'projects-interiors',
    title: 'Projects & Commercial Interiors',
    description:
      'Share your application, quantities and project requirements so the conversation starts with the right information.',
    href: '/industries/projects-and-fitouts',
    enquiryHref: '/enquiry?type=Project+%2F+bulk+requirement',
    tag: 'Project BOQs & Fit-Outs',
  },
  {
    id: 'institutions-procurement',
    title: 'Institutions & Public Procurement',
    description:
      'Connect with NEOM about specification-led requirements and the supporting product information available.',
    href: '/industries/institutions-and-public-procurement',
    enquiryHref: '/enquiry?type=Institutional+%2F+public+procurement',
    tag: 'Specification-Led Sourcing',
  },
  {
    id: 'distribution-partnerships',
    title: 'Distribution & Business Partnerships',
    description:
      'Explore a potential relationship with NEOM and its brands in your market.',
    href: '/partner-with-us',
    enquiryHref: '/enquiry?type=Distribution+%2F+business+partnership',
    tag: 'Channel & Market Partners',
  },
];

const industrySegments = [
  {
    id: 'furniture-manufacturers',
    slug: 'furniture-manufacturers',
    title: 'Furniture & OEM Manufacturing',
    shortSummary:
      'For businesses evaluating panels for furniture production, modular systems and component manufacturing.',
    body: 'Share the intended application, required grade or specification, dimensions and expected volume. If the requirement is recurring, include its frequency and delivery location.',
    ctaLabel: 'Discuss Manufacturing Supply',
    ctaHref: '/enquiry?type=Manufacturing+%2F+recurring+supply',
    detailHref: '/industries/furniture-manufacturers',
    hasDetailPage: true,
    detailPage: {
      seoTitle: 'Furniture & OEM Manufacturing Panel Requirements | NEOM Panels',
      seoDescription:
        'Discuss panel requirements for furniture production, modular systems and repeat OEM manufacturing with NEOM Panels.',
      eyebrow: 'INDUSTRIES · FURNITURE & OEM MANUFACTURING',
      heading: 'Start with the needs of your production.',
      paragraphs: [
        'Choosing a panel for manufacturing involves more than identifying a product name. Your team may need to consider the application, machining requirements, surface finish, specified dimensions and consistency across repeat orders.',
        'Share those requirements with NEOM at the start of the conversation. The more clearly a requirement is defined, the easier it becomes to identify the relevant product information and questions that need technical review.',
      ],
      checklistTitle: 'Information to include in your enquiry',
      checklist: [
        'Intended furniture or component application',
        'Required product family or grade (if already specified)',
        'Panel dimensions and thickness with units',
        'Approximate quantity and unit of measure',
        'Recurring order frequency, if relevant',
        'Delivery city and state / destination',
        'Required supporting technical documents',
      ],
      ctaLabel: 'Submit an OEM Enquiry',
      ctaHref: '/enquiry?type=Manufacturing+%2F+recurring+supply',
      smallNote:
        'Availability, suitability and commercial terms are confirmed against the specific requirement.',
    },
  },
  {
    id: 'projects-and-fitouts',
    slug: 'projects-and-fitouts',
    title: 'Projects & Commercial Interiors',
    shortSummary:
      'For contractors, project teams and businesses sourcing materials for commercial, hospitality, retail and workplace interiors.',
    body: 'Share the application, BOQ or material schedule, destination and project timeline. Product suitability must be assessed against the actual specification and conditions of use.',
    ctaLabel: 'Share a Project Requirement',
    ctaHref: '/enquiry?type=Project+%2F+bulk+requirement',
    detailHref: '/industries/projects-and-fitouts',
    hasDetailPage: true,
    detailPage: {
      seoTitle: 'Projects & Commercial Interior Panel Sourcing | NEOM Panels',
      seoDescription:
        'Share your project specification, BOQ and commercial interior panel requirements with NEOM Panels.',
      eyebrow: 'INDUSTRIES · PROJECTS & COMMERCIAL INTERIORS',
      heading: 'Bring the specification into the conversation.',
      paragraphs: [
        'Project material decisions need to connect design intent with technical requirements and commercial planning. Share your project context and the specification that applies to the panel you are evaluating.',
        'Where you have a BOQ or material schedule, include the relevant sections. Please remove information that is confidential or not authorised for sharing.',
      ],
      checklistTitle: 'Information to include in your brief',
      checklist: [
        'Project type and delivery location',
        'Intended interior or furniture application',
        'Specified material or grade from the schedule',
        'Approximate quantity and unit of measure',
        'Project stage or target schedule',
        'Requested product or test documentation',
      ],
      ctaLabel: 'Share Your Project Requirement',
      ctaHref: '/enquiry?type=Project+%2F+bulk+requirement',
      smallNote:
        'Product suitability must be assessed against the actual specification, installation method and conditions of use.',
    },
  },
  {
    id: 'institutions-and-public-procurement',
    slug: 'institutions-and-public-procurement',
    title: 'Institutions & Public Procurement',
    shortSummary:
      'For institutional buyers, public-sector procurement teams and suppliers delivering specification-led projects.',
    body: 'Share the procurement reference, required product details and relevant document requirements. Any supply discussion remains subject to product suitability, eligibility and the applicable procurement process.',
    ctaLabel: 'Submit a Procurement Enquiry',
    ctaHref: '/enquiry?type=Institutional+%2F+public+procurement',
    detailHref: '/industries/institutions-and-public-procurement',
    hasDetailPage: true,
    detailPage: {
      seoTitle: 'Institutions & Public Procurement Panel Enquiries | NEOM Panels',
      seoDescription:
        'Share specification-led institutional or public-procurement panel enquiries and document requirements with NEOM Panels.',
      eyebrow: 'INDUSTRIES · INSTITUTIONS & PUBLIC PROCUREMENT',
      heading: 'Clear requirements support clearer procurement conversations.',
      paragraphs: [
        'Institutional and public-sector enquiries often begin with a specification, document requirement or procurement reference. Use this route to share the information relevant to your sourcing discussion with NEOM.',
        'Tell us the required material, application, quantity, delivery location and submission deadline where applicable. If you are supplying a public-sector or institutional project, identify your role so the enquiry can be understood correctly.',
      ],
      checklistTitle: 'Helpful information to provide',
      checklist: [
        'Your role (Direct buyer, appointed contractor, institutional furniture supplier or consultant)',
        'Public tender or enquiry reference, if applicable',
        'Product specification and application scope',
        'Required supporting documents or test scope',
        'Delivery destination and approximate quantity',
        'Submission or project evaluation deadline',
      ],
      ctaLabel: 'Submit a Procurement Enquiry',
      ctaHref: '/enquiry?type=Institutional+%2F+public+procurement',
      smallNote:
        'Important public note: Submitting an enquiry does not constitute a bid, purchase order, supplier approval or confirmation of product eligibility. Formal procurement must follow the applicable process.',
    },
  },
  {
    id: 'distribution-partnerships',
    slug: 'distribution-partnerships',
    title: 'Distribution & Channel Partnerships',
    shortSummary:
      'For businesses interested in developing a market relationship with NEOM and its brands.',
    body: 'Introduce your company, operating location, business experience and the territory or customer segment you are interested in.',
    ctaLabel: 'Explore a Partnership',
    ctaHref: '/partner-with-us',
    detailHref: '/partner-with-us',
    hasDetailPage: false,
  },
  {
    id: 'architects-consultants',
    slug: 'architects-consultants',
    title: 'Architects, Designers & Consultants',
    shortSummary:
      'For professionals evaluating panel options for furniture and interior applications.',
    body: 'Explore the product-brand websites or ask about the technical information available for a specific application. Selection should be based on the documented properties of the exact product and grade.',
    ctaLabel: 'Request Product Information',
    ctaHref: '/enquiry?type=Product+%2F+technical+information',
    detailHref: '/enquiry?type=Product+%2F+technical+information',
    hasDetailPage: false,
  },
  {
    id: 'specialist-requirements',
    slug: 'specialist-requirements',
    title: 'Specialist Requirements',
    shortSummary:
      'Have an application that does not fit these categories?',
    body: 'Describe the intended use and the properties you need. A technical discussion can establish whether the available portfolio is relevant.',
    ctaLabel: 'Discuss an Application',
    ctaHref: '/enquiry?type=Product+%2F+technical+information',
    detailHref: '/enquiry?type=Product+%2F+technical+information',
    hasDetailPage: false,
  },
];

const companyValues = [
  {
    title: 'Accountability',
    description:
      'Be clear about what we offer, what we commit to and who is responsible.',
  },
  {
    title: 'Material understanding',
    description:
      'Encourage informed choices through relevant product information and application discussions.',
  },
  {
    title: 'Integrity',
    description:
      'Communicate honestly and support claims with appropriate evidence.',
  },
  {
    title: 'Respect for resources',
    description:
      'Consider the materials, energy and effort behind every product.',
  },
  {
    title: 'Respect for people',
    description:
      'Value safe work, fairness and constructive relationships.',
  },
  {
    title: 'Long-term thinking',
    description:
      'Build practices and partnerships that can strengthen with time.',
  },
];

const responsibilityPriorities = [
  {
    id: 'materials',
    title: 'Materials deserve careful consideration.',
    shortSummary: 'Understand where inputs come from and what can be documented.',
    body: 'Responsible material decisions begin with knowing the inputs behind a product. Our priority is to improve the clarity of sourcing information and the questions we ask across our supply relationships.',
  },
  {
    id: 'resources',
    title: 'Resources deserve practical attention.',
    shortSummary: 'Identify opportunities to use materials and energy more carefully.',
    body: 'Materials, energy and water have value. We want improvement to begin with understanding their use, identifying avoidable losses and evaluating practical opportunities within our operations.',
  },
  {
    id: 'people',
    title: 'People belong at the centre.',
    shortSummary: 'Build a culture of safety, fairness and accountability.',
    body: 'We value safe work, respectful relationships and opportunities to build skills. A strong manufacturing business depends on the people and partners who contribute to it.',
  },
  {
    id: 'progress',
    title: 'Progress should be explained clearly.',
    shortSummary: 'Distinguish principles, planned actions and measured outcomes.',
    body: 'We believe responsibility statements should distinguish principles, planned actions and measured outcomes. When we publish an initiative or result, the information should explain its scope and basis.',
  },
];

const sdgReferences = [
  {
    goal: 'SDG 12',
    role: 'Primary Reference',
    title: 'Responsible Consumption and Production',
    focus:
      'Guides our focus on understanding material inputs and outputs, reducing avoidable waste in operations and building transparent corporate reporting habits.',
  },
  {
    goal: 'SDG 8',
    role: 'Supporting Priority',
    title: 'Decent Work and Economic Growth',
    focus:
      'Guides our commitment to safe working conditions, practical skill development and constructive workplace relationships.',
  },
  {
    goal: 'SDG 9',
    role: 'Supporting Priority',
    title: 'Industry, Innovation and Infrastructure',
    focus:
      'Informs how we evaluate practical manufacturing process improvements and resource-efficient industrial operations.',
  },
  {
    goal: 'SDG 15',
    role: 'Supporting Priority',
    title: 'Life on Land',
    focus:
      'Guides how we map wood-based input sourcing and work toward clearer supply-chain traceability.',
  },
];

const articles = [
  {
    slug: 'panel-quotation-requirements',
    title: 'Before You Request a Panel Quotation, Define These Seven Things',
    category: 'Business Procurement',
    publishedAt: '2 November 2026',
    readingTime: '4 min read',
    author: 'NEOM Editorial Team',
    summary:
      'A clearer material requirement gives both the buyer and supplier a better starting point.',
    intro:
      'A useful panel quotation starts with a clear requirement. When an enquiry contains only a product nickname and a rough quantity, important details may remain open. A little preparation can make the discussion more focused.',
    sections: [
      {
        heading: '1. Describe the application.',
        body: 'What will the panel become? A furniture component, an interior element and a specialist application can involve different requirements. Start with the intended use.',
      },
      {
        heading: '2. Identify the product and grade where known.',
        body: 'Include the specified product family or the wording from your approved material schedule. If selection is still open, say so rather than substituting a similar-sounding name.',
      },
      {
        heading: '3. State dimensions and thickness.',
        body: 'Include the requested panel size and thickness, with units. If a particular tolerance matters, identify it as a requirement for review.',
      },
      {
        heading: '4. Give quantity with a unit.',
        body: '“One thousand” is incomplete. Clarify whether you mean sheets, square metres or another agreed unit. For repeat sourcing, add the expected frequency.',
      },
      {
        heading: '5. Explain the delivery destination.',
        body: 'Include the city and state, and any known delivery constraints. Commercial discussions become more meaningful when the destination is clear.',
      },
      {
        heading: '6. List the documents you need.',
        body: 'Identify the relevant specification sheet, test report or certificate requirement. A document should apply to the actual product and scope being evaluated.',
      },
      {
        heading: '7. Share the schedule.',
        body: 'State the required date or project stage. A requested date is a starting point for discussion and should be confirmed by the supplier.',
      },
    ],
    closing:
      'Before sending a BOQ or drawing, remove confidential information that is not needed for the enquiry. Ask for clarification whenever a quotation relies on an assumption you have not agreed.',
    ctaText:
      'Preparing a requirement? Share your application, quantity and destination with NEOM Panels.',
    ctaLabel: 'Discuss Your Requirement',
    ctaHref: '/enquiry',
    published: true,
  },
  {
    slug: 'choose-panels-by-application',
    title: 'Choosing a Panel Starts With the Application',
    category: 'Material Selection',
    publishedAt: '2 November 2026',
    readingTime: '4 min read',
    author: 'NEOM Editorial Team',
    summary:
      'Product names help organise a range. The intended use determines the questions worth asking.',
    intro:
      'A panel may be hidden inside the finished furniture or space, but its selection deserves a visible place in the planning process. The starting point is the job it needs to perform.',
    sections: [
      {
        heading: 'Start with the installation context',
        body: 'First, describe the use clearly. Where will the material be installed? What loads, fixing methods, finishes or exposure conditions are relevant? Which requirements come from the design, specification or procurement document?',
      },
      {
        heading: 'Move from category label to exact grade',
        body: 'Next, move from the broad product family to the exact grade under consideration. A familiar category name does not establish that every product in the category has identical properties. Product selection should use the relevant technical sheet and supporting evidence.',
      },
      {
        heading: 'Verify specific performance terms',
        body: 'Be equally careful with descriptive terms. If a document mentions moisture performance, fire performance or emissions, ask what is being measured and which product it covers. These are specific properties, not interchangeable promises. Ask the technical team to explain the method, classification, limitations and application scope where needed.',
      },
      {
        heading: 'Connect selection with processing and handling',
        body: 'Processing and installation also belong in the discussion. The people making the finished product should review the manufacturer’s applicable guidance and confirm what their own process requires. A successful selection connects the material with the way it will be handled and used.',
      },
      {
        heading: 'Bring the brief together early',
        body: 'For a project enquiry, it helps to bring the specification, intended application and requested documentation together in one brief. If something is unknown, identify it as a question for review.',
      },
    ],
    closing:
      'A clear question is more useful than an assumed answer. It helps the buyer understand what is established, what needs clarification and whether the proposed product should move to the next stage of evaluation.',
    ctaText:
      'Explore NEOM’s brand websites or send a product-information enquiry for your application.',
    ctaLabel: 'Request Product Information',
    ctaHref: '/enquiry?type=Product+%2F+technical+information',
    published: true,
  },
  {
    slug: 'understanding-responsible-materials-claims',
    title: 'What Should a Responsible Materials Claim Tell You?',
    category: 'Responsible Materials',
    publishedAt: '2 November 2026',
    readingTime: '4 min read',
    author: 'NEOM Editorial Team',
    summary:
      'A useful environmental statement explains what it covers and the evidence behind it.',
    intro:
      'Responsible material decisions need useful information. A short environmental statement can introduce a topic, but it should also help the reader understand the basis of the claim.',
    sections: [
      {
        heading: 'Check the scope of the statement',
        body: 'Start with scope. Is the statement about a product, a factory, the packaging, a sourcing programme or the entire company? Evidence about one part should not automatically be interpreted as evidence about the whole.',
      },
      {
        heading: 'Ask about the period and measurement basis',
        body: 'Then ask about the period and method. A reported improvement should explain what was measured and the comparison being used. A percentage without a denominator or baseline can be difficult to interpret.',
      },
      {
        heading: 'Verify certification holder, scope and validity',
        body: 'Certification needs the same care. Check the certificate holder, applicable product or facility, scope and validity. The presence of a familiar mark is not a reason to assume that every product from a business has the same status.',
      },
      {
        heading: 'Distinguish plans from measured outcomes',
        body: 'Plans and results should also be distinguishable. An organisation can have worthwhile priorities before it has measured outcomes. Readers should be able to tell whether an activity is proposed, underway or completed.',
      },
      {
        heading: 'Look for specific, substantiated explanations',
        body: 'Indian environmental-claims guidance emphasises truthful, substantiated communication. For buyers, the practical lesson is to ask for a specific explanation rather than rely on a broad label.',
      },
    ],
    closing:
      'The same discipline benefits a growing manufacturer. Clear information helps a company recognise what it has established and where it needs to improve. It gives customers a more useful basis for discussion and gives future reporting something solid to build on. Responsible communication is a continuing task. As operations, evidence and measurement improve, the public story should be updated with the same care.',
    ctaText:
      'Read NEOM’s responsibility priorities or ask about information relevant to your requirement.',
    ctaLabel: 'Explore Responsibility Priorities',
    ctaHref: '/responsibility',
    published: true,
  },
];

const documents = [
  {
    id: 'doc-company-overview',
    title: 'NEOM Panels — Corporate Overview & Enquiry Preparation Guide',
    category: 'Company Information',
    applicableEntity: 'NEOM Panels',
    productScope: 'Corporate & B2B Enquiry Guide',
    version: 'Version 1.0 · November 2026',
    publicationDate: '2026-11-02',
    format: 'PDF / Printable HTML',
    size: '28 KB',
    validityDate: 'Current',
    downloadHref: '/resources/downloads/neom-corporate-overview.html',
    owner: 'Corporate Communications',
    archiveStatus: 'Active',
    published: true,
    summary:
      'Introduces NEOM Panels, the Starwoods brand relationship, our responsibility framework and the seven details to include when submitting a business or institutional panel enquiry.',
  },
  {
    id: 'doc-quotation-checklist',
    title: 'B2B Panel Requirement & BOQ Preparation Checklist',
    category: 'Technical Information',
    applicableEntity: 'NEOM Panels',
    productScope: 'OEM, Project & Institutional Enquiries',
    version: 'Version 1.0 · November 2026',
    publicationDate: '2026-11-02',
    format: 'PDF / Printable HTML',
    size: '24 KB',
    validityDate: 'Current',
    downloadHref: '/resources/downloads/neom-enquiry-checklist.html',
    owner: 'Business & Technical Desk',
    archiveStatus: 'Active',
    published: true,
    summary:
      'A structured pre-enquiry worksheet helping procurement teams, furniture OEMs and contractors record dimensions, grade requirements, quantities and required test documentation.',
  },
];

const galleryAssets = [
  {
    id: 'gal-hero-composition',
    category: 'Materials',
    title: 'Architectural Panel Geometry Study',
    image: '/assets/images/hero-panel-composition.jpg',
    alt: 'Three solid architectural panel forms in deep matte forest green, olive leaf and natural vertical timber grain arranged upright on a warm ivory plinth.',
    caption:
      'Concept visualisation — Solid panel geometry and surface finish study inspired by the NEOM symbol.',
    roleNote: 'Brand material illustration (abstract solid panel forms).',
    published: true,
  },
  {
    id: 'gal-material-detail',
    category: 'Materials',
    title: 'Surface & Bevel Edge Material Study',
    image: '/assets/images/material-study-detail.jpg',
    alt: 'Macro studio view of overlapping solid timber grain and matte forest-green panel samples on a warm ivory surface.',
    caption:
      'Concept visualisation — Tactile pairing of natural timber grain and matte forest-green surface finish.',
    roleNote: 'Brand material illustration (surface and edge study).',
    published: true,
  },
];

const faqs = [
  {
    question: 'What is NEOM Panels?',
    answer:
      'NEOM Panels is an Indian panel manufacturing business and the company behind Starwoods.',
  },
  {
    question: 'Does NEOM have its own factory?',
    answer:
      'Yes. NEOM has its own factory in India. See the Manufacturing page for the information currently published about the facility.',
  },
  {
    question: 'How do I explore your products?',
    answer:
      'Start with Our Brands and continue to the relevant brand website. You can also send an enquiry to NEOM if you are unsure where to begin.',
  },
  {
    question: 'Can I discuss a recurring business requirement?',
    answer:
      'Yes. Choose Manufacturing / recurring supply in the enquiry form and include the application, approximate quantity, frequency and delivery destination if known. Availability and terms will need to be confirmed.',
  },
  {
    question: 'Can contractors and institutional suppliers contact NEOM?',
    answer:
      'Yes. Use the project or institutional enquiry route and explain your role and requirement.',
  },
  {
    question: 'Can government or public-sector teams submit an enquiry?',
    answer:
      'Yes. The institutional route accepts procurement-related questions. An enquiry does not replace a formal tender, marketplace process or supplier-eligibility assessment.',
  },
  {
    question: 'How do I ask about technical documents?',
    answer:
      'Identify the product or application and the document you need. Browse available downloads or use the product-information enquiry route.',
  },
  {
    question: 'Do you offer samples?',
    answer:
      'You can request information about samples for the product being considered. Availability and arrangements must be confirmed by the relevant team.',
  },
  {
    question: 'How do I enquire about distribution?',
    answer:
      'Use the partnership route and introduce your company, operating location and the market you would like to discuss.',
  },
  {
    question: 'Are prices shown on the corporate website?',
    answer:
      'Product and business requirements can vary. Use the relevant brand website or send a business enquiry for the appropriate next step.',
  },
  {
    question: 'Does every brand offer the same products?',
    answer:
      'Each brand may have its own product focus. Check the specific brand’s current information and confirm the exact product and grade.',
  },
  {
    question: 'Where can I read about responsibility?',
    answer:
      'Visit the Responsibility page for the principles and any approved initiatives or updates currently published by NEOM.',
  },
];

const enquiryTypes = [
  {
    value: 'Manufacturing / recurring supply',
    label: 'Manufacturing / recurring supply',
    description: 'For furniture OEMs, modular production lines and repeat material requirements.',
    ownerDesk: 'oem_supply_desk',
  },
  {
    value: 'Project / bulk requirement',
    label: 'Project / bulk requirement',
    description: 'For fit-out contractors, commercial interiors, hospitality and project schedules.',
    ownerDesk: 'projects_desk',
  },
  {
    value: 'Institutional / public procurement',
    label: 'Institutional / public procurement',
    description: 'For public-sector bodies, institutional buyers and tender-winning suppliers.',
    ownerDesk: 'institutional_desk',
  },
  {
    value: 'Product / technical information',
    label: 'Product / technical information',
    description: 'For architects, specifiers and buyers requesting product sheets or documentation.',
    ownerDesk: 'technical_desk',
  },
  {
    value: 'Distribution / business partnership',
    label: 'Distribution / business partnership',
    description: 'For channel partners, regional distributors and strategic business relationships.',
    ownerDesk: 'partnerships_desk',
  },
  {
    value: 'Corporate / other enquiry',
    label: 'Corporate / other enquiry',
    description: 'For corporate verification, document inquiries or general business questions.',
    ownerDesk: 'corporate_desk',
  },
];

const seoMetadata = {
  '/': {
    title: 'NEOM Panels | Indian Panel Manufacturer & Brands',
    description:
      'Meet NEOM Panels, an Indian panel manufacturing business. Explore our brands, manufacturing information and business enquiry options.',
  },
  '/company': {
    title: 'About NEOM Panels | Vision, Values & Manufacturing',
    description:
      'Discover the company behind Starwoods, our manufacturing foundation and the values shaping NEOM Panels.',
  },
  '/company/corporate-information': {
    title: 'Corporate Information | NEOM Panels',
    description:
      'Find published company information, approved corporate documents and contact details for NEOM Panels.',
  },
  '/brands': {
    title: 'Our Brands | NEOM Panels',
    description:
      'Explore NEOM’s panel brands and continue to dedicated brand websites for available products and enquiry options.',
  },
  '/industries': {
    title: 'Business & Industry Requirements | NEOM Panels',
    description:
      'Discuss panel requirements for manufacturing, projects, institutions and distribution partnerships with NEOM Panels.',
  },
  '/manufacturing': {
    title: 'Manufacturing & Quality | NEOM Panels',
    description:
      'Find published information about NEOM’s manufacturing and ask about product documentation relevant to your business requirement.',
  },
  '/responsibility': {
    title: 'Responsibility & Priorities | NEOM Panels',
    description:
      'Explore the principles behind NEOM’s approach to materials, resource use, people and responsible growth.',
  },
  '/resources': {
    title: 'Resources, Insights & Documents | NEOM Panels',
    description:
      'Explore published company information, available documents, material studies and practical reading from NEOM Panels.',
  },
  '/resources/downloads': {
    title: 'Downloads & Documents | NEOM Panels',
    description:
      'Browse documents currently published by NEOM Panels or request specific product and technical documentation.',
  },
  '/gallery': {
    title: 'Materials & Brand Visual Gallery | NEOM Panels',
    description:
      'Explore architectural material studies and approved visual assets from NEOM Panels.',
  },
  '/insights': {
    title: 'Panel & Procurement Insights | NEOM Panels',
    description:
      'Read practical perspectives on panel selection, business procurement and responsible materials information.',
  },
  '/partner-with-us': {
    title: 'Partner With NEOM | Distribution & Business Partnerships',
    description:
      'Explore distribution, channel, manufacturing and project partnerships with NEOM Panels and its brands.',
  },
  '/contact': {
    title: 'Contact NEOM Panels | Business & Corporate Enquiries',
    description:
      'Start a conversation with NEOM Panels regarding manufacturing supply, projects, partnerships or corporate questions.',
  },
  '/enquiry': {
    title: 'Submit a Business Enquiry | NEOM Panels',
    description:
      'Share a panel requirement, project brief, technical question or partnership enquiry with NEOM Panels.',
  },
  '/privacy': {
    title: 'Privacy Notice | NEOM Panels',
    description:
      'Read how NEOM Panels handles personal and business contact information submitted through this website.',
  },
  '/terms': {
    title: 'Website Terms | NEOM Panels',
    description:
      'Terms governing the use of the NEOM Panels corporate website and business enquiry features.',
  },
  '/cookies': {
    title: 'Cookie Information | NEOM Panels',
    description:
      'Information about essential technical storage and privacy-preserving operation on the NEOM Panels website.',
  },
  '/thank-you': {
    title: 'Enquiry Received | NEOM Panels',
    description: 'Your business enquiry has been received by NEOM Panels.',
    noIndex: true,
  },
};

module.exports = {
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
  seoMetadata,
};
