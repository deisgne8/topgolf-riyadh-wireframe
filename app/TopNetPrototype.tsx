import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";

type ServiceNode = { name: string; children?: ServiceNode[] };
type ServiceGroup = { name: string; slug: string; description: string; items: string[] };
type Resource = { type: string; title: string; topic: string; service: string };
type ServiceContext = { group: ServiceGroup; node: ServiceNode; parent?: ServiceNode; path: ServiceNode[]; siblings: ServiceNode[] };

const serviceGroups: ServiceGroup[] = [
  { name: "Connectivity Services", slug: "connectivity", description: "Secure, dependable connections across sites, teams, platforms, and workloads.", items: ["Internet Connectivity", "Data Connectivity", "SD-WAN Connectivity", "VPN Connectivity"] },
  { name: "Clouding Services", slug: "clouding-services", description: "Rayadah Cloud and public-cloud platforms supported through design, migration, security, backup and management.", items: ["Rayadah Cloud", "Public Clouds"] },
  { name: "Hosting Services", slug: "hosting", description: "Reliable Saudi-based hosting foundations for websites, email, DNS, and Saudi domains.", items: ["Web Hosting", "Email Hosting", "DNS Hosting", "Saudi Domain Registration"] },
  { name: "Co-Location Services", slug: "co-location", description: "Secure data-center space, interconnection and managed operational support for critical infrastructure.", items: ["Secured Cage", "Dedicated Rack", "Shared Rack", "Bare Metal Servers", "Cross Connect", "Managed Colocation"] },
  { name: "Cybersecurity Services", slug: "cybersecurity", description: "Managed detection, monitoring, assessment, governance and security-awareness capabilities.", items: ["Managed Security", "Security Consulting"] },
  { name: "Security Services", slug: "security-services", description: "Technology controls across networks, endpoints, identity, data, email and cloud environments.", items: ["Network Security", "Endpoint Security", "Identity Security", "Data Security", "Email Security", "Cloud Security"] },
  { name: "Professional Services", slug: "professional-services", description: "Specialist expertise for planning, implementing and transforming enterprise technology environments.", items: ["Collaboration", "Low Current", "IT Consulting", "Infrastructure Projects", "Cloud Projects", "Security Projects", "Business Continuity", "Datacenter Services"] },
  { name: "Managed Services", slug: "managed-services", description: "Ongoing management and support across infrastructure, cybersecurity and the service desk.", items: ["Infrastructure", "Cybersecurity", "Service Desk"] },
];

const serviceHierarchy: Record<string, ServiceNode[]> = {
  connectivity: serviceGroups[0].items.map(name => ({ name })),
  "clouding-services": [
    { name: "Rayadah Cloud", children: [
      { name: "IaaS (Infrastructure as a Service)" },
      { name: "BaaS (Backup as a Service)" },
      { name: "DRaaS (Disaster Recovery as a Service)" },
      { name: "SaaS (Software as a Service)" },
      { name: "PaaS (Platform as a Service)", children: [{ name: "Kubernetes as a Service" }] },
      { name: "Storage Services", children: [{ name: "Block Storage" }, { name: "Object Storage" }, { name: "File Storage" }] },
    ] },
    { name: "Public Clouds", children: [
      { name: "Microsoft Cloud", children: [
        { name: "Microsoft Azure", children: [{ name: "Azure Subscriptions" }, { name: "Azure Design, Plan, Implement, and Management" }, { name: "Azure Migration" }, { name: "Azure Security" }, { name: "Azure Backup" }] },
        { name: "Office 365" }, { name: "Exchange Online" },
      ] },
      { name: "AWS Cloud", children: [{ name: "AWS Subscriptions" }, { name: "AWS Design, Plan, Implement, and Management" }, { name: "AWS Migrations" }, { name: "AWS Security" }, { name: "AWS Backup" }] },
      { name: "Huawei Cloud", children: [{ name: "Huawei Subscriptions" }, { name: "Huawei Design, Plan, Implement, and Management" }, { name: "Huawei Migrations" }, { name: "Huawei Security" }, { name: "Huawei Backup" }] },
      { name: "Oracle Cloud", children: [{ name: "OCI Subscriptions" }, { name: "OCI Design, Plan, Implement, and Management" }, { name: "OCI Migrations" }, { name: "OCI Security" }, { name: "OCI Backup" }] },
    ] },
  ],
  hosting: serviceGroups[2].items.map(name => ({ name })),
  "co-location": [
    { name: "Secured Cage" }, { name: "Dedicated Rack" }, { name: "Shared Rack" }, { name: "Bare Metal Servers" },
    { name: "Cross Connect", children: [{ name: "Fiber Cross Connect" }, { name: "Copper Cross Connect" }, { name: "Internet Exchange" }] },
    { name: "Managed Colocation", children: [{ name: "Remote and Smart Hands" }, { name: "Asset Management" }, { name: "Hardware Installation" }] },
  ],
  cybersecurity: [
    { name: "Managed Security", children: [
      { name: "SOC as a Service" },
      { name: "Managed Detection & Response", children: [{ name: "MDR" }, { name: "EDR" }, { name: "NDR" }, { name: "XDR" }] },
      { name: "Managed Vulnerability Management", children: [{ name: "Vulnerability Scanning" }, { name: "Patch Verification" }, { name: "Risk Prioritization" }] },
      { name: "Security Monitoring", children: [{ name: "Firewall Monitoring" }, { name: "WAF Monitoring" }, { name: "Email Security Monitoring" }, { name: "Endpoint Monitoring" }] },
    ] },
    { name: "Security Consulting", children: [
      { name: "Assessments", children: [{ name: "Vulnerability Assessment" }, { name: "Penetration Testing" }, { name: "Red Team" }, { name: "Purple Team" }, { name: "Configuration Review" }, { name: "Secure Architecture Review" }] },
      { name: "Governance & Compliance", children: [{ name: "NCA ECC" }, { name: "SAMA" }, { name: "CST" }, { name: "ISO 27001" }] },
      { name: "Awareness", children: [{ name: "Security Awareness" }, { name: "Phishing Simulation" }, { name: "Executive Training" }] },
    ] },
  ],
  "security-services": [
    { name: "Network Security", children: [{ name: "Next Generation Firewall (NGFW)" }, { name: "Web Application Firewall (WAF)" }, { name: "Intrusion Detection System (IDS)" }, { name: "Intrusion Protection System (IPS)" }, { name: "DDoS Protection" }, { name: "Network Access Control (NAC)" }] },
    { name: "Endpoint Security", children: [{ name: "Antivirus" }, { name: "EDR" }, { name: "XDR" }, { name: "Disk Encryption" }, { name: "Device Control" }] },
    { name: "Identity Security", children: [{ name: "IAM" }, { name: "PAM" }, { name: "SSO" }, { name: "MFA" }, { name: "Password Vault" }] },
    { name: "Data Security", children: [{ name: "DLP" }, { name: "Encryption (KMS & HSM)" }, { name: "Database Activity Monitoring" }, { name: "Data Classification" }] },
    { name: "Email Security", children: [{ name: "Secure Email Gateway" }, { name: "Email Encryption" }, { name: "Anti-Spam" }, { name: "Anti-Phishing" }] },
    { name: "Cloud Security", children: [{ name: "CSPM" }, { name: "CWPP" }, { name: "CIEM" }, { name: "CASB" }] },
  ],
  "professional-services": [
    { name: "Collaboration", children: [{ name: "IP Telephony and VoIP Solutions" }, { name: "Video Conferencing Systems" }, { name: "Call Center Solutions" }] },
    { name: "Low Current", children: [{ name: "Structured Cabling Systems" }, { name: "Fiber-Optic Cabling and Termination" }, { name: "Data Network Cabling" }, { name: "CCTV, IPTV and Video Surveillance" }, { name: "Access Control Systems" }, { name: "Time Attendance Systems" }, { name: "Intrusion Detection and Alarm Systems" }, { name: "Fire Alarm and Life-Safety Systems" }, { name: "Environmental and Water-Leak Detection" }] },
    { name: "IT Consulting", children: [{ name: "Digital Transformation" }, { name: "IT Strategy" }, { name: "Enterprise Architecture" }, { name: "Cloud Readiness" }] },
    { name: "Infrastructure Projects", children: [{ name: "Datacenter Build" }, { name: "Server Deployment" }, { name: "Storage Deployment" }, { name: "Network Deployment" }] },
    { name: "Cloud Projects", children: [{ name: "Cloud Migration" }, { name: "Kubernetes" }, { name: "Containers" }, { name: "Automation" }] },
    { name: "Security Projects", children: [{ name: "SOC Implementation" }, { name: "SIEM Deployment" }, { name: "PAM Deployment" }, { name: "IAM Deployment" }, { name: "PKI Deployment" }] },
    { name: "Business Continuity", children: [{ name: "DR Design" }, { name: "DR Testing" }, { name: "BCP Development" }] },
    { name: "Datacenter Services", children: [{ name: "Design" }, { name: "Facility" }, { name: "Infrastructure Operations" }, { name: "Operations" }] },
  ],
  "managed-services": [
    { name: "Infrastructure", children: [
      { name: "Network" }, { name: "Security" },
      { name: "Systems", children: [{ name: "Windows Administration" }, { name: "Server Administration" }, { name: "Linux Administration" }, { name: "Virtualization" }, { name: "Storage Administration" }, { name: "Endpoint Management" }, { name: "Database Administration", children: [{ name: "SQL Server" }, { name: "Oracle" }, { name: "PostgreSQL" }, { name: "MySQL" }] }, { name: "Backup Management", children: [{ name: "Backup Management Service" }, { name: "Backup Monitoring" }, { name: "Restore Testing" }, { name: "Replication Monitoring" }] }] },
    ] },
    { name: "Cybersecurity" },
    { name: "Service Desk", children: [{ name: "24x7 Help Desk" }, { name: "ITSM" }, { name: "Remote Support" }, { name: "Onsite Support" }] },
  ],
};

const rayadahServices = ["IaaS (Infrastructure as a Service)", "BaaS (Backup as a Service)", "DRaaS (Disaster Recovery as a Service)", "SaaS (Software as a Service)", "PaaS (Platform as a Service)", "Storage Services"];

const resources: Resource[] = [
  { type: "Case Study", title: "Building a resilient connectivity foundation for a regulated enterprise", topic: "Reliability", service: "Connectivity" },
  { type: "White Paper", title: "A practical guide to cloud continuity in Saudi Arabia", topic: "Business Continuity", service: "Rayadah Cloud" },
  { type: "Article", title: "What enterprise teams should expect from a measurable SLA", topic: "Operations", service: "Managed Services" },
  { type: "News", title: "TopNet expands its enterprise service experience", topic: "Company", service: "TopNet" },
  { type: "Article", title: "Structuring cybersecurity services around risk and governance", topic: "Security", service: "Cybersecurity" },
  { type: "Case Study", title: "Planning a low-risk co-location migration", topic: "Infrastructure", service: "Co-location" },
];

const pathForService = (label: string) => label === "Rayadah Cloud" ? "/rayadah-cloud" : `/services/${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;

const flattenServiceNodes = (nodes: ServiceNode[]): ServiceNode[] => nodes.flatMap(node => [node, ...flattenServiceNodes(node.children ?? [])]);

function ServiceTree({ nodes, depth = 0 }: { nodes: ServiceNode[]; depth?: number }) {
  return <div className={`taxonomy-level taxonomy-level-${depth}`}>{nodes.map((node,index)=><div className="taxonomy-node" key={`${depth}-${node.name}`}><div className="taxonomy-label"><span>{String(index+1).padStart(2,"0")}</span><strong>{node.name}</strong><b>{node.children?.length ? `${node.children.length} capabilities` : "Included"}</b></div>{node.children?.length ? <ServiceTree nodes={node.children} depth={depth+1} /> : null}</div>)}</div>;
}

function findServicePath(nodes: ServiceNode[], name: string, parents: ServiceNode[] = []): ServiceNode[] | null {
  for (const node of nodes) {
    const next = [...parents, node];
    if (node.name === name) return next;
    const childMatch = findServicePath(node.children ?? [], name, next);
    if (childMatch) return childMatch;
  }
  return null;
}

function getServiceContext(name: string): ServiceContext {
  for (const group of serviceGroups) {
    const roots = serviceHierarchy[group.slug] ?? [];
    const path = findServicePath(roots, name);
    if (!path) continue;
    const node = path[path.length - 1];
    const parent = path[path.length - 2];
    const siblings = (parent?.children ?? roots).filter(item => item.name !== name);
    return { group, node, parent, path, siblings };
  }
  const node: ServiceNode = { name };
  return { group: serviceGroups[0], node, parent: undefined, path: [node], siblings: serviceHierarchy.connectivity };
}

const serviceThemes: Record<string, { statement: string; outcomes: string[][] }> = {
  connectivity: { statement: "Connect sites, people and platforms through a resilient network foundation with clear operational ownership.", outcomes: [["Reliable access","Maintain dependable connectivity across critical locations and users."],["Controlled performance","Align capacity, routing and service levels with business priorities."],["Operational visibility","Monitor service health and escalate incidents through defined workflows."]] },
  "clouding-services": { statement: "Adopt and operate cloud platforms through one accountable model spanning design, migration, protection and support.", outcomes: [["Right-fit platform","Match workload requirements to Rayadah or public-cloud capability."],["Safer transition","Plan dependencies, migration waves and production validation."],["Managed cloud operations","Connect governance, security, backup and ongoing optimization."]] },
  hosting: { statement: "Establish a dependable digital presence through locally supported hosting and domain services.", outcomes: [["Consistent availability","Support customer-facing and internal digital services."],["Simplified ownership","Coordinate hosting, DNS, email and domain requirements."],["Responsive support","Resolve operational issues through a defined service route."]] },
  "co-location": { statement: "Place critical infrastructure in a secure, connected data-center environment with practical operational support.", outcomes: [["Protected infrastructure","Use controlled space, power and physical access."],["Direct interconnection","Connect platforms, carriers and environments efficiently."],["Hands-on operations","Extend internal teams through managed on-site support."]] },
  cybersecurity: { statement: "Improve cyber resilience through managed detection, assessment, governance and continuous security improvement.", outcomes: [["Earlier detection","Identify relevant threats, vulnerabilities and control gaps."],["Clear risk priorities","Turn technical findings into actionable remediation decisions."],["Response readiness","Define monitoring, escalation and incident responsibilities."]] },
  "security-services": { statement: "Apply integrated security controls across the technology layers attackers target most.", outcomes: [["Layered protection","Coordinate network, endpoint, identity, data, email and cloud controls."],["Reduced exposure","Limit unauthorized access and detect abnormal activity."],["Consistent governance","Align security technology with policy and operational ownership."]] },
  "professional-services": { statement: "Move complex technology initiatives from planning to production with specialist design and implementation expertise.", outcomes: [["Confident design","Translate business requirements into an implementable technical plan."],["Controlled delivery","Manage dependencies, validation and handover through clear stages."],["Skills on demand","Extend internal teams with focused technical expertise."]] },
  "managed-services": { statement: "Operate infrastructure and support services through one measurable, continuously improving management model.", outcomes: [["Day-to-day continuity","Maintain systems, networks and user support through defined processes."],["Service visibility","Track incidents, health, changes and performance."],["Accountable improvement","Use reviews and operational evidence to prioritize action."]] },
};

const staticPageHref = (href: string) => {
  if (!href.startsWith("/")) return href;
  if (href === "/") return "./";
  return `?page=${href.slice(1)}`;
};

function Link({ href, children, className = "", onNavigate }: { href: string; children: ReactNode; className?: string; onNavigate?: () => void }) {
  return <a href={staticPageHref(href)} className={className} onClick={onNavigate}>{children}</a>;
}

function Header({ rtl, setRtl }: { rtl: boolean; setRtl: (value: boolean) => void }) {
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && (setMega(false), setMobile(false), setSearch(false));
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <div className="utility">
        <div className="shell utility-inner">
          <span>Enterprise support: +966 11 555 0100</span>
          <span>Saudi Arabia</span>
        </div>
      </div>
      <header className="site-header">
        <div className="shell nav-row">
          <Link href="/" className="wordmark" onNavigate={() => setMobile(false)}>
            <img className="brand-logo" src="./topnet-logo.svg" alt="TopNet" width="631" height="148" />
          </Link>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <Link href="/">Home</Link>
            <Link href="/about">About Us</Link>
            <button className={mega ? "nav-trigger active" : "nav-trigger"} aria-expanded={mega} aria-controls="services-mega" onClick={() => setMega(!mega)}>Services <span>⌄</span></button>
            <Link href="/resources">Resources</Link>
            <Link href="/contact">Contact Us</Link>
            <Link href="/rayadah-cloud" className="rayadah-nav">Rayadah Cloud</Link>
          </nav>
          <div className="header-actions">
            <button className="icon-button" aria-label="Search" onClick={() => setSearch(true)}>⌕</button>
            <button className="language" aria-label="Switch language direction" onClick={() => setRtl(!rtl)}>{rtl ? "EN | ع" : "AR | EN"}</button>
            <Link href="/contact" className="button compact">Request consultation</Link>
            <button className="menu-button" aria-expanded={mobile} aria-controls="mobile-menu" onClick={() => setMobile(!mobile)}>☰ <span>Menu</span></button>
          </div>
        </div>
        {mega && <MegaMenu close={() => setMega(false)} />}
        {mobile && <MobileMenu close={() => setMobile(false)} />}
      </header>
      {search && <SearchDialog close={() => setSearch(false)} />}
    </>
  );
}

function MegaMenu({ close }: { close: () => void }) {
  const [active, setActive] = useState(0);
  return (
    <div id="services-mega" className="mega-menu">
      <div className="shell mega-layout">
        <div className="mega-intro">
          <span className="eyebrow">Integrated ecosystem</span>
          <h2>Find the right capability</h2>
          <p>Browse TopNet’s eight connected service categories and their specialist capabilities.</p>
          <Link href="/services" className="text-link" onNavigate={close}>View all services →</Link>
        </div>
        <div className="mega-categories" role="tablist" aria-label="Service categories">
          {serviceGroups.map((group, index) => <button key={group.slug} role="tab" aria-selected={active === index} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}>{group.name}<span>→</span></button>)}
        </div>
        <div className="mega-services" role="tabpanel">
          <h3>{serviceGroups[active].name}</h3>
          {serviceGroups[active].items.map(item => <Link key={item} href={pathForService(item)} onNavigate={close}>{item}<span>↗</span></Link>)}
          <Link href={`/services/category/${serviceGroups[active].slug}`} className="text-link" onNavigate={close}>Category overview →</Link>
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ close }: { close: () => void }) {
  const [servicesOpen, setServicesOpen] = useState(false);
  return (
    <div id="mobile-menu" className="mobile-menu">
      <Link href="/" onNavigate={close}>Home</Link>
      <Link href="/about" onNavigate={close}>About Us</Link>
      <button aria-expanded={servicesOpen} onClick={() => setServicesOpen(!servicesOpen)}>Services <span>{servicesOpen ? "−" : "+"}</span></button>
      {servicesOpen && <div className="mobile-subnav">{serviceGroups.map(group => <Link key={group.slug} href={`/services/category/${group.slug}`} onNavigate={close}>{group.name}</Link>)}</div>}
      <Link href="/resources" onNavigate={close}>Resources</Link>
      <Link href="/contact" onNavigate={close}>Contact Us</Link>
      <Link href="/rayadah-cloud" className="rayadah-mobile" onNavigate={close}>Rayadah Cloud</Link>
    </div>
  );
}

function SearchDialog({ close }: { close: () => void }) {
  const [query, setQuery] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    window.location.href = `?page=search&q=${encodeURIComponent(query.trim())}`;
  };
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={e => e.target === e.currentTarget && close()}>
      <div className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title">
        <button className="modal-close" aria-label="Close search" onClick={close}>×</button>
        <span className="eyebrow">Site search</span>
        <h2 id="search-title">Search services and resources</h2>
        <form className="search-box" onSubmit={submit}>
          <label className="sr-only" htmlFor="site-search">Search terms</label>
          <input autoFocus id="site-search" name="q" value={query} onChange={e => setQuery(e.target.value)} placeholder="e.g. disaster recovery" />
          <button className="button" type="submit" disabled={!query.trim()}>Search</button>
        </form>
        <p className="help">Suggestions: Cybersecurity · Co-location · SLA · Rayadah Cloud</p>
      </div>
    </div>
  );
}

function Layout({ children }: { children: ReactNode }) {
  const [rtl, setRtl] = useState(false);
  useEffect(() => {
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    document.documentElement.lang = rtl ? "ar" : "en";
    return () => { document.documentElement.dir = "ltr"; document.documentElement.lang = "en"; };
  }, [rtl]);
  return (
    <div className={rtl ? "prototype rtl" : "prototype"}>
      <Header rtl={rtl} setRtl={setRtl} />
      {rtl && <div className="translation-note">نموذج اتجاه عربي RTL — يحتاج المحتوى الكامل إلى ترجمة معتمدة</div>}
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer>
      <div className="shell footer-grid">
        <div><div className="wordmark"><img className="brand-logo footer-logo" src="./topnet-logo.svg" alt="TopNet" width="631" height="148" /></div><p>One accountable digital infrastructure ecosystem for Saudi enterprises and government organizations.</p><p className="muted">TopNet Digital Infrastructure Services · Riyadh, Saudi Arabia</p></div>
        <div><h3>Services</h3>{serviceGroups.slice(0,4).map(group => <Link key={group.slug} href={`/services/category/${group.slug}`}>{group.name}</Link>)}</div>
        <div><h3>Explore</h3><Link href="/rayadah-cloud">Rayadah Cloud</Link><Link href="/resources">Resources</Link><Link href="/about">About TopNet</Link><Link href="/careers">Careers</Link><Link href="/contact">Contact Us</Link></div>
        <div><h3>Connect</h3><div className="social-links"><a href="#" aria-label="TopNet on LinkedIn">in</a><a href="#" aria-label="TopNet on X">X</a><a href="#" aria-label="TopNet on YouTube">▶</a></div><h3>Stay informed</h3><label htmlFor="newsletter">Work email</label><div className="inline-form"><input id="newsletter" type="email" placeholder="name@company.sa" /><button aria-label="Subscribe">→</button></div></div>
      </div>
      <div className="shell footer-base"><span>© 2026 TopNet</span><span>Privacy · Terms · Accessibility · Sitemap</span></div>
    </footer>
  );
}

function Hero({ eyebrow, title, copy, primary = "Request consultation", secondary, compact = false }: { eyebrow: string; title: string; copy: string; primary?: string; secondary?: string; compact?: boolean }) {
  if (compact) {
    return (
      <section className="internal-hero">
        <div className="shell internal-hero-content">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p className="lead">{copy}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="hero">
      <div className="shell hero-grid">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p className="lead">{copy}</p>
          <div className="button-row"><Link href="/contact" className="button">{primary}</Link>{secondary && <Link href="/services" className="button secondary">{secondary}</Link>}</div>
        </div>
        <div className="wire-visual" aria-label="Image or product interface placeholder">
          <div className="visual-label">[ IMAGE / SYSTEM DIAGRAM ]</div>
          <span className="node n1">CONNECT</span><span className="node n2">PROTECT</span><span className="node n3">HOST</span><span className="node n4">MANAGE</span>
          <div className="visual-center">TOPNET<br />ECOSYSTEM</div>
        </div>
      </div>
    </section>
  );
}

function Breadcrumbs({ items }: { items: string[] }) {
  return <nav className="shell breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link>{items.map((item, i) => <span key={item}><b>/</b>{i === items.length - 1 ? item : <Link href="#">{item}</Link>}</span>)}</nav>;
}

function SectionTitle({ eyebrow, title, copy }: { eyebrow?: string; title: string; copy?: string }) {
  return <div className="section-title">{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{copy && <p>{copy}</p>}</div>;
}

function StatBar() {
  const stats = [["250+", "Enterprise clients"], ["1,200+", "Managed connections"], ["99.95%", "Availability target"], ["2006", "Supporting clients since"]];
  return <section className="stat-bar"><div className="shell stats">{stats.map(([value,label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section>;
}

function HeroSymbolParticles() {
  type Particle = { x:number; y:number; ox:number; oy:number; vx:number; vy:number; size:number; phase:number };
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -1000, y: -1000, active: false };
    let particles: Particle[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;
    let scale = 1;
    let stopped = false;

    const image = new Image();
    image.src = "./topnet-symbol.svg";

    const buildParticles = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);

      const sample = document.createElement("canvas");
      const sampleContext = sample.getContext("2d", { willReadFrequently:true });
      if (!sampleContext) return;
      const markHeight = Math.min(height * .72, 540);
      const markWidth = markHeight * (326.51 / 389.73);
      sample.width = Math.max(1, Math.round(width));
      sample.height = Math.max(1, Math.round(height));
      const offsetX = width * .69 - markWidth / 2;
      const offsetY = height * .47 - markHeight / 2;
      sampleContext.drawImage(image, offsetX, offsetY, markWidth, markHeight);
      const pixels = sampleContext.getImageData(0, 0, sample.width, sample.height).data;
      const step = width < 700 ? 10 : 8;
      const next = [];
      for (let y=0; y<sample.height; y+=step) {
        for (let x=0; x<sample.width; x+=step) {
          if (pixels[(y*sample.width+x)*4+3] < 60) continue;
          const previous: Particle | undefined = particles[next.length];
          next.push({
            x: previous?.x ?? x + (Math.random()-.5)*90,
            y: previous?.y ?? y + (Math.random()-.5)*90,
            ox:x, oy:y, vx:0, vy:0,
            size: width < 700 ? 1.8 : 2.1,
            phase:Math.random()*Math.PI*2,
          });
        }
      }
      particles = next;
    };

    const draw = (time:number) => {
      if (stopped) return;
      context.clearRect(0, 0, width, height);
      const radius = width < 700 ? 75 : 115;

      const dotGap = width < 700 ? 18 : 20;
      for (let y=dotGap/2; y<height; y+=dotGap) {
        for (let x=dotGap/2; x<width; x+=dotGap) {
          const dx = x-pointer.x;
          const dy = y-pointer.y;
          const distance = Math.hypot(dx,dy);
          const influence = pointer.active ? Math.max(0,1-distance/(radius*2.25)) : 0;
          const drift = reduceMotion ? 0 : Math.sin(time*.001+x*.018+y*.014)*.35;
          const push = influence*4;
          const dotX = x + (distance ? dx/distance*push : 0) + drift;
          const dotY = y + (distance ? dy/distance*push : 0);
          context.fillStyle = `rgba(112,173,151,${.07+influence*.34})`;
          context.beginPath();
          context.arc(dotX,dotY,.65+influence*.8,0,Math.PI*2);
          context.fill();
        }
      }

      if (pointer.active && !reduceMotion) {
        const glow = context.createRadialGradient(pointer.x,pointer.y,0,pointer.x,pointer.y,radius*2.4);
        glow.addColorStop(0,"rgba(200,227,187,.09)");
        glow.addColorStop(1,"rgba(200,227,187,0)");
        context.fillStyle = glow;
        context.fillRect(pointer.x-radius*2.4,pointer.y-radius*2.4,radius*4.8,radius*4.8);
      }

      for (const particle of particles) {
        if (!reduceMotion) {
          const dx = particle.x-pointer.x;
          const dy = particle.y-pointer.y;
          const distance = Math.hypot(dx,dy) || 1;
          if (pointer.active && distance < radius) {
            const force = (1-distance/radius)*1.8;
            particle.vx += dx/distance*force;
            particle.vy += dy/distance*force;
          }
          particle.vx += (particle.ox-particle.x)*.035;
          particle.vy += (particle.oy-particle.y)*.035;
          particle.vx *= .88;
          particle.vy *= .88;
          particle.x += particle.vx;
          particle.y += particle.vy + Math.sin(time*.0008+particle.phase)*.025;
        } else {
          particle.x = particle.ox;
          particle.y = particle.oy;
        }
        const pointerDistance = Math.hypot(particle.x-pointer.x,particle.y-pointer.y);
        const highlight = pointer.active ? Math.max(0,1-pointerDistance/(radius*1.6)) : 0;
        const alpha = .48 + Math.sin(time*.0015+particle.phase)*.2 + highlight*.28;
        context.fillStyle = `rgba(200,227,187,${reduceMotion ? .68 : alpha})`;
        context.beginPath();
        context.roundRect(particle.x-particle.size/2,particle.y-particle.size/2,particle.size+highlight*1.5,particle.size+highlight*1.5,.8);
        context.fill();
      }
      frame = requestAnimationFrame(draw);
    };

    const move = (event:PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX-rect.left;
      pointer.y = event.clientY-rect.top;
      pointer.active = true;
    };
    const leave = () => { pointer.active = false; };
    const resize = () => buildParticles();
    const start = () => { buildParticles(); frame=requestAnimationFrame(draw); };
    image.addEventListener("load", start, { once:true });
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    window.addEventListener("resize", resize);
    if (image.complete) start();

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-symbol-particles" aria-hidden="true" />;
}

function HomepageConcept() {
  const [activeCapability, setActiveCapability] = useState(0);
  const featuredCapabilities = [
    serviceGroups[0],
    serviceGroups[1],
    serviceGroups[4],
    serviceGroups[3],
    serviceGroups[7],
  ];
  const active = featuredCapabilities[activeCapability];
  const reasons = [
    ["Saudi operated since 2006", "Local infrastructure knowledge shaped by two decades of enterprise delivery."],
    ["System-level thinking", "Connectivity, cloud, security and operations designed as one accountable environment."],
    ["Built around measurable service", "Defined availability, monitoring, escalation and reporting expectations."],
    ["One team through operation", "Specialist design and delivery connected to long-term managed support."],
  ];
  return (
    <div className="topnet-home-concept">
      <section className="concept-hero">
        <div className="concept-hero-grid" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
        <HeroSymbolParticles />
        <div className="shell concept-hero-content">
          <div className="concept-hero-kicker"><span>Saudi digital infrastructure</span><span>Since 2006</span></div>
          <h1>One connected foundation for enterprises that cannot stand still.</h1>
          <div className="concept-hero-bottom">
            <p>TopNet connects, hosts, protects and operates critical technology through one accountable Saudi partner.</p>
            <div className="concept-actions"><Link href="/services" className="concept-action primary">Explore services <span>arrow_forward</span></Link><Link href="/contact" className="concept-action">Talk to an expert <span>arrow_forward</span></Link></div>
          </div>
        </div>
        <a className="concept-scroll" href="#foundation">Scroll to explore <span>arrow_downward</span></a>
      </section>

      <section id="foundation" className="concept-intro">
        <div className="shell concept-intro-grid">
          <div className="concept-blocks" aria-hidden="true"><span /><span /><span /></div>
          <div className="concept-intro-copy"><span className="concept-label">01 / One accountable ecosystem</span><p>TopNet brings connectivity, cloud, data-center infrastructure, cybersecurity and managed operations into one connected service model.</p><div className="concept-history"><strong>20</strong><span>years supporting Saudi enterprise technology</span></div><Link href="/about" className="concept-action subtle">More about TopNet <span>arrow_forward</span></Link></div>
        </div>
      </section>

      <section className="concept-capabilities">
        <div className="shell">
          <div className="concept-heading"><span className="concept-label">02 / Engineering capability</span><h2>Designed, delivered and operated as complete systems.</h2></div>
          <div className="capability-stage">
            <div className="capability-system" aria-live="polite">
              <div className="system-grid" aria-hidden="true" />
              <div className="system-core"><small>ACTIVE LAYER</small><strong>{active.name}</strong><span>{String(activeCapability+1).padStart(2,"0")} / {String(featuredCapabilities.length).padStart(2,"0")}</span></div>
              {active.items.slice(0,4).map((item,i)=><span className={`system-node node-${i+1}`} key={item}>{item}</span>)}
            </div>
            <div className="capability-tabs" role="tablist" aria-label="Featured capabilities">
              {featuredCapabilities.map((group,index)=><button key={group.slug} role="tab" aria-selected={activeCapability===index} onMouseEnter={()=>setActiveCapability(index)} onFocus={()=>setActiveCapability(index)} onClick={()=>setActiveCapability(index)}><span>{String(index+1).padStart(2,"0")}</span><strong>{group.name}</strong><small>{group.description}</small><b>arrow_forward</b></button>)}
            </div>
          </div>
          <Link href="/services" className="concept-action primary capability-all">Explore all eight capability areas <span>arrow_forward</span></Link>
        </div>
      </section>

      <section className="concept-sectors">
        <div className="shell"><div className="concept-heading"><span className="concept-label">03 / Built for critical environments</span><h2>Where reliability, security and operational clarity are non-negotiable.</h2></div><div className="sector-grid">{[["Government","Secure infrastructure aligned with public-sector operations."],["Financial services","Resilient, governed foundations for regulated services."],["Healthcare","Connected environments designed around availability and protection."],["Enterprise","Scalable platforms that grow with complex organizations."]].map(([title,copy],i)=><article key={title}><span>0{i+1}</span><div className={`sector-visual sector-${i+1}`} aria-hidden="true"><i/><i/><i/></div><h3>{title}</h3><p>{copy}</p><Link href="/services" aria-label={`Explore ${title}`}>arrow_forward</Link></article>)}</div></div>
      </section>

      <section className="concept-rayadah">
        <div className="rayadah-atmosphere" aria-hidden="true"><span/><span/><span/><span/></div>
        <div className="shell concept-rayadah-head"><div><span className="concept-label">04 / Featured platform</span><h2>Rayadah Cloud</h2></div><p>A Saudi cloud platform connecting infrastructure, continuity, security and expert operations in one dedicated experience.</p></div>
        <div className="shell rayadah-specs"><div><span>Platform model</span><strong>Local + accountable</strong></div><div><span>Core services</span><strong>IaaS to DRaaS</strong></div><div><span>Operations</span><strong>24/7 options</strong></div></div>
        <div className="shell concept-actions"><Link href="/rayadah-cloud" className="concept-action primary">Explore Rayadah Cloud <span>arrow_forward</span></Link><Link href="/contact" className="concept-action">Plan a cloud workshop <span>arrow_forward</span></Link></div>
      </section>

      <section className="concept-reasons"><div className="shell"><h2>Why work with TopNet</h2><div className="reason-grid">{reasons.map(([title,copy],i)=><article key={title}><span>0{i+1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

      <section className="concept-quote"><div className="shell"><blockquote>“Enterprise infrastructure is strongest when every layer is designed to work together, with one team accountable for the outcome.”</blockquote><span>TopNet operating principle</span></div></section>

      <InsightsSection />

      <section className="concept-contact"><div className="shell concept-contact-panel"><div><span className="concept-label">Work with us</span><h2>Bring us the infrastructure challenge your organization needs to solve.</h2></div><div><p>Discuss connectivity, cloud, security, hosting or managed operations with the appropriate TopNet specialist.</p><Link href="/contact" className="concept-action primary">Start a conversation <span>arrow_forward</span></Link></div></div></section>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <Hero eyebrow="Saudi digital infrastructure" title="One connected ecosystem for resilient enterprise technology" copy="TopNet brings connectivity, cloud, hosting, co-location, cybersecurity, professional services, and managed operations into one accountable structure." secondary="Explore services" />
      <StatBar />
      <section className="section shaded"><div className="shell split"><div className="image-placeholder">[ INFRASTRUCTURE / TEAM IMAGE ]</div><div><SectionTitle eyebrow="About TopNet" title="Supporting Saudi Arabia’s digital growth since 2006" copy="Born in the Kingdom’s early internet era, TopNet grew into a national operator of secure networks and managed platforms." /><Link href="/about" className="button secondary">Our story</Link></div></div></section>
      <ProofSection />
      <RayadahFeature />
      <ClientsSection />
      <InsightsSection />
      <EnquiryBand />
    </>
  );
}

function ClientsSection() {
  const clients = ["Government", "Financial Services", "Healthcare", "Industrial", "Retail", "Education"];
  return <section className="section clients-section"><div className="shell"><SectionTitle eyebrow="Our clients" title="Trusted across critical sectors" copy="Supporting organizations where availability, security and accountable technology operations matter." /><div className="logo-row client-logo-row">{clients.map((client,i)=><div key={client}><span>CLIENT {String(i+1).padStart(2,"0")}</span><strong>{client}</strong></div>)}</div></div></section>;
}

function ProofSection() {
  const proofItems = [["Infrastructure", "Connected network, cloud and data-center delivery across Saudi Arabia"],["Reliability", "Defined availability targets, monitoring and incident escalation"],["Security", "Layered controls, managed monitoring and security expertise"],["Compliance", "Service design aligned with Saudi governance expectations"],["Local presence", "Saudi-based teams supporting enterprise requirements"],["Accountability", "Connected delivery across infrastructure layers"]];
  return <section className="section why-topnet"><div className="shell why-topnet-layout"><div className="why-topnet-intro"><span className="eyebrow">Why TopNet</span><h2>Proof built into every service.</h2><p>Enterprise technology decisions need visible ownership, measurable operations and local expertise—not unsupported promises.</p><Link href="/about" className="text-link">Learn about TopNet →</Link></div><div className="proof-feature-grid">{proofItems.map(([title,copy],i)=><article key={title}><span>{String(i+1).padStart(2,"0")}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></div></section>;
}

function RayadahFeature() {
  return <section className="rayadah-feature"><div className="shell rayadah-feature-inner"><div><span className="rayadah-kicker">Rayadah Cloud <small>by TopNet</small></span><h2>A Saudi cloud platform built for confident enterprise growth.</h2></div><div><p>Run, protect and evolve critical workloads through a dedicated cloud experience backed by TopNet infrastructure expertise.</p><Link href="/rayadah-cloud" className="button rayadah-button">Discover Rayadah Cloud →</Link></div></div></section>;
}

function InsightsSection() {
  return <section className="section shell"><div className="title-row"><SectionTitle eyebrow="Latest insights and news" title="Technical thinking for confident decisions" /><Link href="/resources" className="text-link">Browse all resources →</Link></div><div className="card-grid three">{resources.slice(0,3).map((r,i)=><Link href={`/resources/article-${i+1}`} className="resource-card" key={r.title}><div className="image-placeholder small">[ THUMBNAIL ]</div><span>{r.type} · {r.service}</span><h3>{r.title}</h3><b>Read resource →</b></Link>)}</div></section>;
}

function EnquiryBand() {
  return <section className="section enquiry-band"><div className="shell split"><div><span className="eyebrow">Start a conversation</span><h2>Tell us what your organization needs to achieve</h2><p>A concise enterprise enquiry routes your request to the appropriate TopNet team.</p></div><QuickForm /></div></section>;
}

function QuickForm() {
  const [sent, setSent] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); setAttempted(true); const form=e.currentTarget; if(form.checkValidity()) setSent(true); };
  if (sent) return <div className="success-state" role="status"><b>✓ Enquiry received</b><p>Prototype success state. No data was transmitted.</p><button className="text-link" onClick={()=>{setSent(false);setAttempted(false)}}>Send another</button></div>;
  return <form className="wire-form" noValidate onSubmit={submit}>
    <label>Work email<input required type="email" placeholder="name@organization.sa" aria-describedby={attempted ? "email-error" : undefined} /></label>
    {attempted && <span id="email-error" className="error">Enter a valid work email.</span>}
    <label>Area of interest<select required defaultValue=""><option value="" disabled>Select a service</option>{serviceGroups.map(g=><option key={g.slug}>{g.name}</option>)}</select></label>
    <label>Brief requirement<textarea required rows={3} placeholder="What outcome or challenge should we understand?" /></label>
    <button className="button" type="submit">Request consultation</button>
    <small>Your details are used only to respond to this prototype enquiry.</small>
  </form>;
}

function ServicesPage() {
  const [active, setActive] = useState(0);
  return <>
    <Hero compact eyebrow="Our Services" title="One ecosystem. Eight connected capability areas." copy="A concise orientation to TopNet’s revised service structure for visitors who need to compare options before choosing a specialist capability." />
    <section className="section shell"><SectionTitle eyebrow="Service directory" title="Choose a capability area" copy="The mega menu supports direct access; this page helps decision-makers understand and compare the complete ecosystem." /><div className="service-index">{serviceGroups.map((g,i)=><div className={i===active ? "active" : ""} key={g.slug}><button aria-expanded={i===active} onClick={()=>setActive(i===active?-1:i)}><span>0{i+1}</span><strong>{g.name}</strong><p>{g.description}</p><b>{i===active?"−":"+"}</b></button>{i===active&&<div className="service-index-detail">{g.items.map(item=><Link key={item} href={pathForService(item)}>{item}<span>→</span></Link>)}<Link href={`/services/category/${g.slug}`} className="category-link">View {g.name} category →</Link></div>}</div>)}</div></section>
    <EnquiryBand />
  </>;
}

function CategoryPage({ group }: { group: ServiceGroup }) {
  const isCybersecurity = group.slug === "cybersecurity";
  const hierarchy = serviceHierarchy[group.slug] ?? group.items.map(name=>({name}));
  return <><Breadcrumbs items={["Services",group.name]} /><Hero compact eyebrow="Service category" title={group.name} copy={group.description} /><section className="section category-capabilities"><div className="shell"><div className="category-section-head"><SectionTitle eyebrow="Explore capabilities" title={isCybersecurity ? "Choose the security outcome you need" : `Solutions within ${group.name}`} copy="Choose a service below. Specialist capabilities are summarized within its page without adding further navigation levels." /><Link href="/contact" className="text-link">Not sure where to start? Talk to us →</Link></div><div className="category-capability-grid">{hierarchy.map((node,i)=><article className={i===0&&hierarchy.length>3 ? "featured" : ""} key={node.name}><div className="category-card-top"><span>{String(i+1).padStart(2,"0")}</span><div className="capability-icon">↗</div></div><h3>{node.name}</h3><p>{node.children?.length ? `${node.children.length} connected capabilities are included within ${node.name}.` : `A focused ${node.name.toLowerCase()} service designed around enterprise requirements.`}</p>{node.children?.length ? <div className="category-child-list">{node.children.slice(0,5).map(child=><span key={child.name}>{child.name}</span>)}</div> : null}<Link href={pathForService(node.name)} className="category-card-cta">Explore {node.name} →</Link></article>)}</div></div></section>{isCybersecurity&&<section className="section shaded"><div className="shell security-model"><SectionTitle eyebrow="Cybersecurity model" title="Assess, govern, monitor and respond" /><div><span>01</span><strong>Assess</strong><p>Vulnerability, penetration and architecture review.</p></div><div><span>02</span><strong>Govern</strong><p>Compliance, awareness and risk priorities.</p></div><div><span>03</span><strong>Operate</strong><p>Detection, response, monitoring and improvement.</p></div></div></section>}<ProofSection /><EnquiryBand /></>;
}

function ServiceDetailPage({ name }: { name: string }) {
  const [faq, setFaq] = useState(0);
  const serviceFaqs = [
    ["What is included in the service scope?", "The agreed scope documents design, implementation, service activation, monitoring, support responsibilities, reporting and any optional managed layers."],
    ["How are service levels measured?", "Availability, incidents, response times and service performance are measured against agreed targets and reviewed through scheduled service reports."],
    ["How does TopNet address security and compliance?", "Security requirements are mapped to technical controls, operational responsibilities, evidence collection and escalation procedures during solution design."],
  ];
  const context = getServiceContext(name);
  const theme = serviceThemes[context.group.slug] ?? serviceThemes.connectivity;
  const capabilityNodes = context.node.children?.length ? context.node.children : [
    { name: "Architecture and service design" },
    { name: "Implementation and activation" },
    { name: "Monitoring and operational support" },
    { name: "Governance, reporting and improvement" },
  ];
  const related = context.siblings.slice(0,4);
  return <>
    <Breadcrumbs items={["Services",context.group.name,name]} />
    <section className="service-detail-hero"><div className="shell service-detail-hero-grid"><div className="service-hero-copy"><span className="eyebrow">{context.group.name}{context.parent ? ` · ${context.parent.name}` : ""}</span><h1>{name}</h1><p>{theme.statement}</p><div className="button-row"><Link href="/contact" className="button service-primary-cta">Discuss your requirement</Link><a href="#capabilities" className="text-link service-hero-link">Explore capabilities ↓</a></div></div><div className="service-hero-visual" aria-label={`${name} service model`}><span className="service-visual-label">TOPNET SERVICE MODEL</span><strong>{name}</strong><div className="service-visual-orbit"><span>DESIGN</span><span>ACTIVATE</span><span>OPERATE</span></div><small>{context.group.name}</small></div></div></section>
    <nav className="service-local-nav" aria-label="Service page sections"><div className="shell"><a href="#outcomes">Outcomes</a><a href="#capabilities">Capabilities</a><a href="#delivery">Delivery model</a><a href="#faq">FAQs</a></div></nav>
    <section id="outcomes" className="section shell"><div className="service-outcome-grid"><div className="service-outcome-intro"><span className="eyebrow">What this service enables</span><h2>Turn a technical requirement into an accountable operating outcome.</h2><p>{theme.statement}</p></div><div className="service-outcome-cards">{theme.outcomes.map(([title,copy],i)=><article key={title}><span>0{i+1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <section id="capabilities" className="section service-capability-section"><div className="shell"><SectionTitle eyebrow={context.node.children?.length ? "Service capabilities" : "Delivery scope"} title={context.node.children?.length ? `What is included in ${name}` : `A complete ${name} service`} copy={context.node.children?.length ? "Specialist capabilities are summarized here without creating additional detail pages." : "The delivery scope is shaped around your environment, responsibilities and operating requirements."} /><div className="service-capability-grid">{capabilityNodes.map((node,i)=><article key={node.name}><div className="capability-icon" aria-hidden="true">{String(i+1).padStart(2,"0")}</div><h3>{node.name}</h3><p>{node.children?.length ? `${node.children.length} specialist capabilities are included within this service area.` : "Designed, implemented and supported through TopNet’s accountable delivery model."}</p>{node.children?.length ? <div className="capability-child-links">{node.children.slice(0,6).map(child=><span key={child.name}>{child.name}</span>)}</div> : null}</article>)}</div></div></section>
    <section className="service-evidence"><div className="shell">{[["Availability","99.95% service target"],["Operations","24/7 monitoring options"],["Security","Controls mapped during design"],["Governance","Defined reporting and escalation"]].map(([title,copy])=><div key={title}><span>{title}</span><strong>{copy}</strong></div>)}</div></section>
    <section id="delivery" className="section delivery-section"><div className="shell"><div className="delivery-heading"><SectionTitle eyebrow="Delivery model" title="From requirement to steady-state service" /><p>One accountable journey connects business intent, technical implementation and ongoing operations.</p></div><div className="delivery-journey">{[["01","Discover","Confirm outcomes, dependencies and responsibilities."],["02","Design","Define architecture, controls, scope and service levels."],["03","Activate","Implement, validate and complete operational handover."],["04","Operate","Monitor performance, report evidence and improve the service."]].map(([number,title,copy])=><article key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div><div className="use-case-line"><b>Designed for complex environments</b>{["Government","Financial services","Healthcare","Education","Industrial","Retail"].map(item=><span key={item}>{item}</span>)}</div></div></section>
    <section id="faq" className="section service-faq-section"><div className="shell service-faq-layout"><div><span className="eyebrow">Frequently asked questions</span><h2>What to know before evaluating {name}</h2><p>These questions establish the scope, operating model and evidence needed for an informed decision.</p><Link href="/contact" className="text-link">Ask a service specialist →</Link></div><div className="accordions">{serviceFaqs.map(([q,a],i)=><div key={q}><button aria-expanded={faq===i} onClick={()=>setFaq(faq===i?-1:i)}>{q}<span>{faq===i?"−":"+"}</span></button>{faq===i&&<p>{a}</p>}</div>)}</div></div></section>
    <section className="section related-services-section"><div className="shell"><SectionTitle eyebrow="Continue exploring" title={`Related ${context.parent?.name ?? context.group.name} services`} /><div className="related-service-cards">{related.map((item,i)=><Link key={item.name} href={pathForService(item.name)}><span>0{i+1}</span><h3>{item.name}</h3><b>Explore service ↗</b></Link>)}</div></div></section>
    <EnquiryBand />
  </>;
}

function RayadahPage() {
  const rayadahHierarchy = serviceHierarchy["clouding-services"].find(node=>node.name==="Rayadah Cloud")?.children ?? [];
  const operatingModel = [["Cloud foundation","Compute, storage and networking aligned to workload needs."],["Data resilience","Backup and recovery planned around business criticality."],["Platform enablement","Managed platforms that accelerate application delivery."],["Cloud operations","Monitoring, governance and support after go-live."]];
  return <>
    <section className="rayadah-hero"><div className="shell rayadah-hero-grid"><div><span className="rayadah-kicker">Rayadah Cloud <small>by TopNet</small></span><h1>Build, protect and grow on a Saudi cloud platform.</h1><p>Rayadah Cloud brings infrastructure, continuity, platforms and specialist operations into one dedicated cloud experience.</p><div className="button-row"><Link href="/contact" className="button rayadah-button">Talk to a cloud specialist</Link><a href="#platform" className="text-link">Explore the platform ↓</a></div></div><div className="cloud-orbit" aria-label="Rayadah Cloud platform diagram"><strong>RAYADAH<br/>CLOUD</strong><span className="orbit-one">RUN</span><span className="orbit-two">PROTECT</span><span className="orbit-three">RECOVER</span></div></div></section>
    <div className="rayadah-trust"><div className="shell"><span>Saudi-hosted options</span><span>Enterprise resilience</span><span>Integrated security</span><span>24/7 operational support</span></div></div>
    <section id="platform" className="section rayadah-overview"><div className="shell"><div className="rayadah-story"><div><span className="eyebrow">One cloud operating model</span><h2>More than infrastructure capacity</h2></div><div><p>Rayadah Cloud connects platform capability with design, migration, protection and ongoing operations. Workloads move through one accountable model from assessment to steady-state service.</p><Link href="/contact" className="text-link">Plan a cloud workshop →</Link></div></div><div className="rayadah-model-grid">{operatingModel.map(([title,copy],i)=><article key={title}><span>{String(i+1).padStart(2,"0")}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></div></section>
    <section className="section rayadah-services-section"><div className="shell"><div className="rayadah-services-head"><SectionTitle eyebrow="Rayadah Cloud services" title="Cloud capabilities for your workload" copy="Infrastructure, continuity, platform and storage capabilities are summarized here without additional detail-page levels." /><Link href="/contact" className="text-link">Build a cloud roadmap →</Link></div><div className="rayadah-service-grid">{rayadahHierarchy.map((node,i)=><article key={node.name}><div><span>{String(i+1).padStart(2,"0")}</span><b>{node.children?.length ? `${node.children.length} options` : "Cloud capability"}</b></div><h3>{node.name}</h3><p>{node.children?.length ? `Specialist ${node.name.toLowerCase()} options are available for enterprise workloads.` : "Delivered through a defined architecture, activation and operating model."}</p>{node.children?.length ? <div className="rayadah-service-links">{node.children.map(child=><span key={child.name}>{child.name}</span>)}</div> : null}</article>)}</div></div></section>
    <section className="section rayadah-journey"><div className="shell rayadah-journey-layout"><div><span className="eyebrow">Your cloud journey</span><h2>A clear path from decision to operation</h2><p>Work through one accountable sequence with architecture, controls and operational ownership connected from the start.</p></div><div className="rayadah-journey-steps">{[["01","Assess","Workloads, dependencies and priorities"],["02","Design","Platform, controls and recovery model"],["03","Move","Migration, validation and handover"],["04","Operate","Monitoring, governance and improvement"]].map(([n,t,c])=><article key={n}><span>{n}</span><div><h3>{t}</h3><p>{c}</p></div></article>)}</div></div></section>
    <FaqBlock />
    <EnquiryBand />
  </>;
}

function FaqBlock() {
  const [open,setOpen]=useState(0);
  const answers = ["Rayadah Cloud can support business applications, development environments, data platforms, continuity workloads and services that benefit from flexible Saudi-hosted capacity.","Backup policies can be configured around workload criticality, retention, recovery-point objectives and recovery-time objectives, with testing included in the operating plan.","Security and service levels are defined during solution design, then documented through controls, responsibility boundaries, monitoring, reporting and escalation procedures."];
  return <section className="section rayadah-faq"><div className="shell rayadah-faq-layout"><div><span className="eyebrow">FAQs</span><h2>Plan your Rayadah Cloud evaluation</h2><p>Clarify workload fit, resilience requirements and service responsibilities before defining the target platform.</p></div><div className="accordions">{["Which workloads are suitable for Rayadah Cloud?","What backup and recovery options are available?","How are security, compliance and service levels handled?"].map((q,i)=><div key={q}><button aria-expanded={open===i} onClick={()=>setOpen(open===i?-1:i)}>{q}<span>{open===i?"−":"+"}</span></button>{open===i&&<p>{answers[i]}</p>}</div>)}</div></div></section>;
}

function ResourcesPage() {
  const [query,setQuery]=useState(""); const [type,setType]=useState("All"); const [sort,setSort]=useState("Newest");
  const filtered=useMemo(()=>resources.filter(r=>(type==="All"||r.type===type)&&(`${r.title} ${r.topic} ${r.service}`.toLowerCase().includes(query.toLowerCase()))).sort((a,b)=>sort==="A–Z"?a.title.localeCompare(b.title):0),[query,type,sort]);
  return <><Hero compact eyebrow="Media & Resources" title="Technical insight for infrastructure decisions" copy="Search, filter and browse practical content by topic, industry, service and resource type." primary="Browse case studies" secondary="Explore services" /><section className="section shell"><div className="filter-bar"><label>Search resources<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search title, topic or service" /></label><label>Resource type<select value={type} onChange={e=>setType(e.target.value)}><option>All</option><option>Case Study</option><option>White Paper</option><option>Article</option><option>News</option></select></label><label>Sort<select value={sort} onChange={e=>setSort(e.target.value)}><option>Newest</option><option>A–Z</option></select></label></div><div className="browse-chips"><b>Browse by:</b>{["Topic","Industry","Product / service","Resource type"].map(x=><button key={x}>{x} +</button>)}</div><div className="results-meta"><span>{filtered.length} results</span><button disabled>Saved resources (0)</button></div>{filtered.length?<div className="card-grid three">{filtered.map((r,i)=><Link key={r.title} href={`/resources/article-${i+1}`} className="resource-card"><div className="image-placeholder small">[ {r.type.toUpperCase()} ]</div><span>{r.type} · {r.topic}</span><h3>{r.title}</h3><p>{r.service}</p><b>Open resource →</b></Link>)}</div>:<div className="empty-state" role="status"><span>⌕</span><h3>No matching resources</h3><p>Try removing a filter or using a broader search term.</p><button className="button secondary" onClick={()=>{setQuery("");setType("All")}}>Clear filters</button></div>}</section></>;
}

function ResourceDetailPage() {
  return <><Breadcrumbs items={["Resources","Article"]}/><section className="article-hero"><div className="shell narrow"><span className="eyebrow">White Paper · Business Continuity</span><h1>A practical guide to cloud continuity in Saudi Arabia</h1><p className="lead">A decision framework for infrastructure leaders evaluating resilience, recovery and operational ownership.</p><div className="article-meta">Published: 15 July 2026 · 8 minute read · By TopNet</div></div></section><section className="section shell article-layout"><aside><b>On this page</b><a href="#context">Context</a><a href="#framework">Evaluation framework</a><a href="#next">Next steps</a><button className="button secondary">Download PDF</button></aside><article><div className="image-placeholder">[ ARTICLE HERO / DIAGRAM ]</div><h2 id="context">Context</h2><p>Cloud continuity begins with a shared understanding of critical workloads, business dependencies and the level of disruption each service can tolerate. Infrastructure leaders need recovery plans that connect technical design with operational ownership.</p><blockquote>“A recovery plan is only credible when responsibilities, dependencies and testing evidence are visible.”</blockquote><h2 id="framework">Evaluation framework</h2><p>Structure the evaluation around recovery objectives, dependency mapping, data protection, operating responsibility, testing cadence, regulatory obligations and measurable service levels.</p><div className="callout"><b>Key checklist</b><ul><li>Define workload criticality and ownership</li><li>Validate recovery and backup requirements</li><li>Confirm security, compliance and escalation expectations</li></ul></div><h2 id="next">Next steps</h2><p>Use the related Rayadah Cloud and Business Continuity pathways to continue the evaluation.</p><div className="article-actions"><div><span className="eyebrow">Related topics</span><div className="topic-tags"><Link href="/resources">Cloud continuity</Link><Link href="/resources">Disaster recovery</Link><Link href="/rayadah-cloud">Rayadah Cloud</Link></div></div><div><span className="eyebrow">Share on social media</span><div className="social-share"><button aria-label="Share on LinkedIn">in</button><button aria-label="Share on X">X</button><button aria-label="Copy article link">↗</button></div></div></div></article></section><EnquiryBand /></>;
}

function AboutPage() {
  const leaders = [["Ahmed Al-Harbi","Chief Executive Officer"],["Noura Al-Qahtani","Chief Strategy Officer"],["Khalid Al-Salem","Chief Technology Officer"],["Maha Al-Otaibi","Director of Customer Operations"]];
  const values = [["Technically competent","Apply deep expertise with practical judgment."],["Authoritative","Communicate clearly and take informed decisions."],["Reliable","Deliver consistently and respond when customers need us."],["Strategic","Connect immediate requirements to long-term outcomes."],["Secure","Build protection and responsible operations into every layer."]];
  const certifications = [["ISO","27001","Information security management"],["ISO","9001","Quality management"],["NCA","ECC","Essential Cybersecurity Controls"],["CST","COMPLIANT","Communications and technology services"]];
  return <>
    <Hero compact eyebrow="About TopNet" title="Saudi-born infrastructure expertise, built for accountable delivery" copy="Since 2006, TopNet has supported the Kingdom’s connectivity backbone and grown across secure networks, cloud, data center and managed platforms." />
    <section className="section shell"><div className="split"><div><SectionTitle eyebrow="Who we are" title="One accountable partner across connected infrastructure" copy="TopNet brings connectivity, cloud, hosting, co-location, cybersecurity, professional services and managed operations together for Saudi enterprise and government organizations." /><p className="about-copy">Our role is to simplify ownership across infrastructure layers while giving technology leaders clear service scope, local expertise and an operating model they can evaluate.</p></div><div className="image-placeholder">[ TOPNET OPERATIONS / SAUDI PRESENCE ]</div></div></section>
    <section className="section shaded"><div className="shell"><SectionTitle eyebrow="Our team" title="Leadership and expertise" copy="A multidisciplinary leadership team connecting strategy, technology and customer operations." /><div className="profile-grid">{leaders.map(([name,role])=><div key={name}><div className="profile-placeholder">[ PORTRAIT ]</div><b>{name}</b><span>{role}</span></div>)}</div></div></section>
    <section className="section shell"><SectionTitle eyebrow="Vision & Mission" title="A clear direction for connected digital infrastructure" /><div className="statement-pair"><div><span>Vision</span><p>Enable Saudi organizations to grow through resilient, secure and connected digital infrastructure.</p></div><div><span>Mission</span><p>Bring networks, cloud, security and managed operations together through accountable local delivery.</p></div></div></section>
    <section className="section shaded"><div className="shell"><SectionTitle eyebrow="Our values" title="How TopNet works" /><div className="value-lines">{values.map(([title,copy],i)=><div key={title}><span>0{i+1}</span><h3>{title}</h3><p>{copy}</p></div>)}</div></div></section>
    <section className="section shell"><SectionTitle eyebrow="Company history" title="Built alongside Saudi Arabia’s digital growth" copy="TopNet’s evolution reflects the expanding infrastructure, security and operational needs of organizations across the Kingdom." /><div className="visual-timeline">{[["2006","Foundation","TopNet begins supporting connectivity in Saudi Arabia"],["2012","Expansion","Enterprise network and hosting capability grows"],["2016","Transformation","Cloud, cybersecurity and managed capabilities expand"],["Today","Integrated ecosystem","One accountable enterprise technology ecosystem"]].map(([year,title,copy])=><div key={year}><span>{year}</span><i></i><h3>{title}</h3><p>{copy}</p></div>)}</div></section>
    <ClientsSection />
    <section className="section shaded"><div className="shell"><SectionTitle eyebrow="TopNet certifications" title="Standards, controls and assurance" copy="Prototype certification marks are shown for layout review and must be replaced with approved logo assets before production." /><div className="certification-logos">{certifications.map(([mark,code,copy])=><div key={`${mark}-${code}`}><div className="certification-mark"><strong>{mark}</strong><span>{code}</span></div><p>{copy}</p></div>)}</div></div></section>
    <EnquiryBand />
  </>;
}

function CareersPage() {
  return <><Hero compact eyebrow="Careers at TopNet" title="Help build the infrastructure behind Saudi Arabia’s digital future" copy="Join teams working across connectivity, cloud, security, data centers and managed operations." primary="View open positions" secondary="Learn about TopNet" /><section className="section shell"><SectionTitle eyebrow="Why work at TopNet" title="Meaningful infrastructure work, connected across disciplines" /><div className="proof-grid">{[["Impact","Support critical enterprise and public-sector technology"],["Growth","Technical learning plans, mentoring and certification support"],["Culture","Collaborative teams with clear ownership and practical decision-making"],["Benefits","Competitive package, medical coverage and flexible leave options"]].map(([t,c])=><div key={t}><span className="placeholder-icon">□</span><h3>{t}</h3><p>{c}</p></div>)}</div></section><section className="section shaded"><div className="shell"><SectionTitle eyebrow="Open positions" title="Find your next role" /><div className="job-filter"><label>Team<select><option>All teams</option><option>Technology</option><option>Operations</option></select></label><label>Location<select><option>All locations</option><option>Riyadh</option><option>Jeddah</option></select></label></div><div className="job-list"><Link href="/careers/senior-network-engineer"><span><b>Senior Network Engineer</b><small>Technology · Riyadh · Full-time</small></span><strong>View role →</strong></Link><div className="disabled-job"><span><b>Cloud Operations Specialist</b><small>Operations · Jeddah · Applications opening soon</small></span><button disabled>Opening soon</button></div></div></div></section></>;
}

function JobPage() {
  const [sent,setSent]=useState(false); const [file,setFile]=useState("");
  const submit=(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();if(e.currentTarget.checkValidity())setSent(true)};
  return <><Breadcrumbs items={["Careers","Senior Network Engineer"]}/><section className="job-hero"><div className="shell narrow"><span className="eyebrow">Technology · Full-time · Riyadh</span><h1>Senior Network Engineer</h1><p className="lead">Design, operate and improve resilient enterprise network services across customer and core infrastructure environments.</p><a href="#apply" className="button">Apply for this role</a></div></section><section className="section shell job-layout"><article><h2>Role overview</h2><p>Join TopNet’s technology team to deliver secure, observable and dependable network services for enterprise and government customers.</p><h2>What you will do</h2><ul><li>Design and review LAN, WAN, SD-WAN, routing and VPN solutions</li><li>Lead incident investigation, performance analysis and service improvement</li><li>Maintain architecture, operational and customer handover documentation</li></ul><h2>What you bring</h2><ul><li>Five or more years of enterprise networking experience</li><li>Strong routing, switching, security and troubleshooting knowledge</li></ul></article><aside id="apply"><h2>Apply now</h2>{sent?<div className="success-state"><b>✓ Application ready</b><p>Prototype success state. No application was transmitted.</p></div>:<form className="wire-form" onSubmit={submit}><label>Full name<input required /></label><label>Email<input required type="email" /></label><label>Phone<input required type="tel" /></label><label>CV / résumé<span className="file-control">{file||"PDF or DOC, maximum 10 MB"}<input required type="file" accept=".pdf,.doc,.docx" onChange={e=>setFile(e.target.files?.[0]?.name||"")} /></span></label><label className="checkbox"><input required type="checkbox" /> I agree to the recruitment privacy notice.</label><button className="button" type="submit">Submit application</button></form>}</aside></section></>;
}

function ContactPage() {
  return <><Hero compact eyebrow="Contact TopNet" title="Start with your organization’s requirement" copy="Tell us the outcome, service area and preferred contact route. Your enquiry should be directed to the appropriate enterprise team." primary="Start enquiry" secondary="Explore services" /><section className="section shell contact-layout"><div><SectionTitle eyebrow="Enterprise enquiry" title="How can we help?" copy="Fields marked required support routing without making the first contact burdensome." /><QuickForm /></div><aside><div className="contact-card"><span>01</span><h3>Sales and consultation</h3><p>sales@topnet.example<br />+966 11 555 0100</p></div><div className="contact-card"><span>02</span><h3>Existing customer support</h3><p>support.topnet.example<br />+966 11 555 0199</p></div><div className="contact-card"><span>03</span><h3>Careers</h3><p>Use the application form on an open job.</p><Link href="/careers" className="text-link">View careers →</Link></div></aside></section><section className="section shaded"><div className="shell split"><div><SectionTitle eyebrow="Locations" title="Saudi presence" copy="Teams in Riyadh, Jeddah and Dammam support enterprise requirements across the Kingdom." /><p>Primary office: King Fahd Road, Riyadh · Sunday–Thursday, 08:00–17:00</p></div><div className="map-placeholder">[ MAP PLACEHOLDER ]<span>RIYADH · JEDDAH · DAMMAM</span></div></div></section><FaqBlock /></>;
}

function SearchPage() {
  const [query,setQuery]=useState("disaster recovery");
  useEffect(() => {
    const next = new URLSearchParams(window.location.search).get("q");
    if (next) setQuery(next);
  }, []);
  const all=[...serviceGroups.flatMap(group=>group.items.map(item=>({type:"Service",title:item,href:pathForService(item)}))),...resources.map((r,i)=>({type:r.type,title:r.title,href:`/resources/article-${i+1}`}))];
  const results=all.filter(x=>x.title.toLowerCase().includes(query.toLowerCase()));
  return <><section className="search-hero"><div className="shell"><span className="eyebrow">Search</span><h1>Search TopNet</h1><div className="search-box"><label className="sr-only" htmlFor="results-search">Search services and resources</label><input id="results-search" value={query} onChange={e=>setQuery(e.target.value)} /><button className="button">Search</button></div></div></section><section className="section shell"><div className="results-meta"><span>{results.length} results for “{query}”</span><select aria-label="Filter results"><option>All content</option><option>Services</option><option>Resources</option></select></div>{results.length?<div className="search-results">{results.map(r=><Link href={r.href} key={r.title}><span>{r.type}</span><h2>{r.title}</h2><p>Matching content summary and highlighted terms will appear here.</p><b>Open result →</b></Link>)}</div>:<div className="empty-state"><span>⌕</span><h2>No results found</h2><p>Check spelling, try a broader term, or explore the service directory.</p><Link href="/services" className="button secondary">Browse services</Link></div>}</section></>;
}

function NotFoundPage() {
  return <section className="not-found"><div><span className="eyebrow">404 · Page not found</span><h1>This route is outside the current infrastructure map.</h1><p>Return home, explore the service directory, or search for a capability or resource.</p><div className="button-row"><Link href="/" className="button">Return home</Link><Link href="/services" className="button secondary">Explore services</Link></div></div><div className="wire-404">4<span>□</span>4</div></section>;
}

function resolveServiceName(path: string): string | null {
  const slug=path.split("/").filter(Boolean).pop()||"";
  for(const group of serviceGroups) for(const item of group.items) if(pathForService(item).endsWith(slug)) return item;
  return null;
}

export default function TopNetPrototype({ initialPath = "/" }: { initialPath?: string }) {
  const path=initialPath;
  let page: ReactNode;
  if(path==="/") page=<HomePage />;
  else if(path==="/homepage-concept") page=<HomepageConcept />;
  else if(path==="/services") page=<ServicesPage />;
  else if(path.startsWith("/services/category/")) { const slug=path.split("/").pop(); const group=serviceGroups.find(g=>g.slug===slug); page=group?<CategoryPage group={group}/>:<NotFoundPage/>; }
  else if(path.startsWith("/services/")) { const name=resolveServiceName(path); page=name?<ServiceDetailPage name={name} />:<NotFoundPage/>; }
  else if(path==="/rayadah-cloud") page=<RayadahPage />;
  else if(path==="/resources") page=<ResourcesPage />;
  else if(path.startsWith("/resources/")) page=<ResourceDetailPage />;
  else if(path==="/about") page=<AboutPage />;
  else if(path==="/careers") page=<CareersPage />;
  else if(path.startsWith("/careers/")) page=<JobPage />;
  else if(path==="/contact") page=<ContactPage />;
  else if(path==="/search") page=<SearchPage />;
  else page=<NotFoundPage />;
  return <Layout>{page}</Layout>;
}
