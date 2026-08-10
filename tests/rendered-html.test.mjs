import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("builds a static TopNet prototype shell", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.match(
    html,
    /<title>TopNet Website Architecture — Low-Fidelity Prototype<\/title>/i,
  );
  assert.match(html, /id="root"/);
  assert.match(html, /assets\/index-[^"]+\.js/);
  assert.match(html, /assets\/index-[^"]+\.css/);
});

test("uses static page routing and no server runtime", async () => {
  const [prototype, main, packageJson] = await Promise.all([
    readFile(new URL("../app/TopNetPrototype.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/main.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  assert.match(prototype, /\?page=/);
  assert.match(main, /URLSearchParams/);
  assert.doesNotMatch(packageJson, /vinext|next|wrangler|cloudflare/i);
  assert.match(packageJson, /vite build/);
});

test("uses complete prototype content without unresolved placeholders", async () => {
  const [prototype, architecture] = await Promise.all([
    readFile(new URL("../app/TopNetPrototype.tsx", import.meta.url), "utf8"),
    readFile(new URL("../UX_ARCHITECTURE.md", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(prototype, /Content required/i);
  assert.doesNotMatch(prototype, /\bTBC\b/i);
  assert.match(prototype, /99\.95% service target/);
  assert.match(prototype, /sales@topnet\.example/);
  assert.match(prototype, /No data was transmitted/);
  assert.match(architecture, /Sitemap findings and normalization/);
  assert.match(architecture, /Final UX review/);
});

test("applies the client feedback across primary templates", async () => {
  const prototype = await readFile(
    new URL("../app/TopNetPrototype.tsx", import.meta.url),
    "utf8",
  );
  assert.match(prototype, />Home<\/Link>/);
  assert.match(prototype, />About Us<\/Link>/);
  assert.match(prototype, /className="rayadah-nav"/);
  assert.match(prototype, /Careers<\/Link>/);
  assert.match(prototype, /social-links/);
  assert.doesNotMatch(prototype, /Build from a reliable foundation/);
  assert.match(prototype, /A concise orientation to TopNet/);
  assert.match(prototype, /Assess, govern, monitor and respond/);
  assert.match(prototype, /className="service-detail-hero"/);
  assert.match(prototype, /What this service enables/);
  assert.match(prototype, /What is included in \$\{name\}/);
  assert.match(prototype, /className="service-capability-grid"/);
  assert.match(prototype, /className="service-hero-visual"/);
  assert.match(prototype, /From requirement to steady-state service/);
  assert.match(prototype, /Related \$\{context\.parent\?\.name \?\? context\.group\.name\} services/);
  assert.match(prototype, /A Saudi cloud platform built for confident enterprise growth/);
  assert.match(prototype, /visual-timeline/);
  assert.match(prototype, /certification-logos/);
  assert.doesNotMatch(prototype, /Verification profile/);
  assert.match(prototype, /Related topics/);
  assert.match(prototype, /Share on social media/);
  assert.match(prototype, /function ClientsSection/);
  assert.match(prototype, /Trusted across critical sectors/);
  assert.match(prototype, /Eight connected capability areas/);
  assert.match(prototype, /Cybersecurity Services/);
  assert.match(prototype, /Security Services/);
  assert.match(prototype, /Azure Design, Plan, Implement, and Management/);
  assert.match(prototype, /Managed Detection & Response/);
  assert.match(prototype, /Next Generation Firewall \(NGFW\)/);
  assert.match(prototype, /Environmental and Water-Leak Detection/);
  assert.match(prototype, /Replication Monitoring/);
  assert.match(prototype, /group\.items\.map\(item=>\(\{type:"Service"/);
  assert.match(prototype, /for\(const item of group\.items\)/);
  assert.doesNotMatch(prototype, /child\.name\)}[^\n]*Explore capability/);
  assert.doesNotMatch(prototype, /href=\{pathForService\(child\.name\)\}/);
});
