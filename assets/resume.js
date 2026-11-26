const evidence = {
  release: {
    number: "01",
    status: "Verified",
    title: "Production release discipline",
    claim:
      "Delivered changes through GitHub pull requests with CI-gated builds, regression suites, browser and desktop smoke tests, reproducible release checks, and human-controlled deployment.",
    source: "Cadence PR #35 — merged October 13, 2026",
    detail:
      "353 unit and integration tests across 30 files, Node 22 CI, production-browser checks, built Electron smoke tests, zero reported dependency vulnerabilities, and byte-for-byte release archive verification.",
    type: "GitHub · merged pull request",
    href: "https://github.com/dktrn9ne/cadence/pull/35",
    link: "Inspect merged PR",
  },
  agents: {
    number: "02",
    status: "Verified",
    title: "Reliable agent workflows",
    claim:
      "Built TypeScript and Node.js agent systems with stateful workflows, internal-knowledge retrieval, role-aware permissions, schema validation, approval gates, and auditable execution traces.",
    source: "Enterprise Agent Workbench",
    detail:
      "The reference architecture implements MCP tools, session state, least-privilege allowlists, consequential-action approvals, escalation logic, audit instrumentation, and explicit reliability metrics.",
    type: "GitHub · public repository",
    href: "https://github.com/dktrn9ne/enterprise-agent-workbench",
    link: "Inspect repository",
  },
  evals: {
    number: "03",
    status: "Verified",
    title: "AI evaluation and release gates",
    claim:
      "Developed provider-neutral AI evaluation infrastructure that records criterion-level evidence, failure classes, tool-use correctness, pass rates, latency, and model spend.",
    source: "Proofrail AI Evals",
    detail:
      "Proofrail runs repeatable trials, validates 21 evaluation-design surfaces, maintains a regression corpus, and returns a CI-ready pass or fail decision with traceable evidence.",
    type: "GitHub · public repository",
    href: "https://github.com/dktrn9ne/proofrail-ai-evals",
    link: "Inspect repository",
  },
  payments: {
    number: "04",
    status: "Verified",
    title: "Payment integrity controls",
    claim:
      "Engineered payment-recovery and transaction-integrity controls including duplicate-receipt prevention, atomic success recording, exact amount reconciliation, and validated transaction recovery.",
    source: "Cadence payment architecture",
    detail:
      "Cadence blocks ambiguous retries, validates payer, recipient, amount, asset, source tag and ledger status, locks attempted payment terms, and reconciles remaining balances in integer micro-units.",
    type: "GitHub · code and documentation",
    href: "https://github.com/dktrn9ne/cadence/blob/main/README.md",
    link: "Read technical evidence",
  },
  deployment: {
    number: "05",
    status: "Verified",
    title: "CI-gated deployment",
    claim:
      "Used exact-head CI approval before merging and publishing through an existing Git-based production deployment integration.",
    source: "Portfolio PR #8 — merged October 4, 2026",
    detail:
      "The change passed 12 unit tests, 18 browser checks, visual review, and diff validation before its authorized merge and Vercel publication.",
    type: "GitHub · merged pull request",
    href: "https://github.com/dktrn9ne/portfolio/pull/8",
    link: "Inspect merged PR",
  },
  operations: {
    number: "06",
    status: "Corroborated",
    title: "Customer and platform operations",
    claim:
      "Brings customer-facing operations experience from Facebook Marketplace launch work, business-integrity processes, policy development, escalation, and high-volume technology operations.",
    source: "LinkedIn experience record",
    detail:
      "The profile documents a Senior Process Specialist role supporting Marketplace launch, policy and business-integrity work, alongside current AI evaluation and product-building experience.",
    type: "LinkedIn · professional history",
    href: "https://www.linkedin.com/in/mrt45/details/experience/",
    link: "View LinkedIn evidence",
  },
  production: {
    number: "07",
    status: "Verified",
    title: "Production-oriented code delivery",
    claim:
      "Shipped tested Python and Node.js integrations with deterministic validation, audit commands, output verification, and lightweight continuous integration.",
    source: "Bravado PR #2 — merged October 14, 2026",
    detail:
      "The integration passed 25 Python regression tests, three Node tests, runtime and motion audits, a complete 1,860-frame render, and export verification.",
    type: "GitHub · merged pull request",
    href: "https://github.com/dktrn9ne/Bravado/pull/2",
    link: "Inspect merged PR",
  },
  savage: {
    number: "08",
    status: "Verified",
    title: "33 Savage video, 2017",
    claim:
      "The Lamorne Morris “33 Savage” video, published January 13, 2017 on the Lamorner Bros channel, displays 4,194,196 views. YouTube also abbreviates that count as 4.1M views.",
    source: "YouTube · Lamorner Bros · as of November 26, 2026",
    detail:
      "The public description credits music, production, direction, and editing to other people and does not name Maurice Thomas. His role on the campaign is evidence pending. The live count replaces a resume figure of 4.1M+ views.",
    type: "YouTube · public video",
    href: "https://www.youtube.com/watch?v=lGcV7AUBELs",
    link: "Watch the video",
  },
  channel: {
    number: "09",
    status: "Verified",
    title: "Unique Access Entertainment channel",
    claim:
      "The Unique Access Entertainment YouTube channel displays 60.1K subscribers on its header. The About tab displays 14,613,706 views and 2,805 videos.",
    source: "YouTube · @UniqueAccessEnt · as of November 26, 2026",
    detail:
      "The channel joined May 8, 2016. The header also abbreviates the catalog as 2.8K videos. It is publicly Soren Baker’s Unique Access Entertainment channel. Maurice Thomas’s marketing role there is evidence pending.",
    type: "YouTube · channel",
    href: "https://www.youtube.com/@UniqueAccessEnt",
    link: "Open the channel",
  },
  acknowledgment: {
    number: "10",
    status: "Verified",
    title: "Named in the acknowledgments",
    claim:
      "Named in the acknowledgments of Soren Baker’s The History of Gangster Rap (Abrams Image, 2018) for friendship and support.",
    source: "Google Books preview · Abrams Image, 2018",
    detail:
      "The acknowledgments read: “Billy Johnson Jr., Shawndi Johnson, William “B-Luv” Taylor, Tracii McGregor, Tom Ruge, Aren Rostamian, Vidal Marsh, Slink Johnson, J. Wells, James Kreisberg, Omar Burgess, Maurice Thomas, Valerie Sakmary, and Andre Grant, thank you for your friendship and support.” Amazon’s sample search also lists the name in the back matter. The line is a personal thanks, not a marketing credit, and it does not say he made the book a best seller. The Abrams Image paperback is ISBN 9781419729157.",
    type: "Google Books · preview",
    href: "https://www.google.com/books/edition/The_History_of_Gangster_Rap/wIFnDwAAQBAJ?hl=en&gbpv=1",
    link: "Open the Google Books preview",
  },
  chart: {
    number: "11",
    status: "Corroborated",
    title: "First-week Amazon chart report",
    claim:
      "The Hype Magazine reported that The History of Gangster Rap became the No. 1 new release on Amazon’s Music History & Criticism chart during its first week in stores.",
    source: "The Hype Magazine · October 12, 2018",
    detail:
      "The report covers a Barnes & Noble signing at The Grove and states the first-week chart position. It does not attribute that position to Maurice Thomas. On November 26, 2026, the Amazon paperback page showed no Best Seller badge. It listed Best Sellers Rank #256,016 in Books, #47 in Rap Music, and #188 in Music History & Criticism.",
    type: "Press report · chart claim",
    href: "https://www.thehypemagazine.com/2018/10/12/exclusive-the-history-of-gangster-rap-book-signing-and-qa-with-author-soren-baker-hosted-by-hip-hop-icon-dana-dane/",
    link: "Read the report",
  },
  proclamation: {
    number: "12",
    status: "Evidence pending",
    title: "City of Austin DKTR N9NE Day",
    claim:
      "The portfolio records a February 6, 2018 City of Austin mayoral proclamation, DKTR N9NE Day, as a mark of creative and cultural recognition.",
    source: "Evidence pending · no public proclamation located",
    detail:
      "No city proclamation, council record, or press report naming DKTR N9NE Day or the February 6, 2018 date was found. The February 6, 2018 council page is a special called meeting on a sick-pay ordinance, not a music proclamation. The linked page explains how Austin proclamation days work and does not name DKTR N9NE.",
    type: "Portfolio record · unverified externally",
    href: "https://www.austintexas.gov/arts-culture/music-videos",
    link: "How proclamation days work",
  },
  campaigns: {
    number: "13",
    status: "Evidence pending",
    title: "Orange Line and Unique Access campaigns",
    claim:
      "A resume line says he supported campaign execution for Orange Line Media, Unique Access Entertainment, and Soren Baker Books, including Meta and Google Ads.",
    source: "Companies are public · the role is not",
    detail:
      "Voyage LA documents Orange Line, Inc. as Soren Baker’s company, covering books, consulting, and the Unique Access Entertainment channel. Unique Access’s own about page describes the network. Neither page documents Maurice Thomas’s role, annual budgets, or ad tactics such as retargeting and lookalikes. Those resume details are not stated as fact.",
    type: "Evidence pending",
    href: "https://voyagela.com/interview/meet-soren-baker-orange-line-inc-glendale/",
    link: "Read the Orange Line interview",
  },
  metaops: {
    number: "14",
    status: "Corroborated",
    title: "Meta platform operations, 2016–2018",
    claim:
      "Supported Facebook Marketplace launch and business-integrity operations through policy work, escalation, and cross-functional communication.",
    source: "LinkedIn experience record",
    detail:
      "This is the same corroboration as claim 06. The proof resume records a Senior Process Specialist title. The homepage still says Senior Process Executive and is left unchanged. A distinct ads-policy scope is evidence pending and is not stated as fact.",
    type: "LinkedIn · professional history",
    href: "https://www.linkedin.com/in/mrt45/details/experience/",
    link: "View LinkedIn evidence",
  },
};
const fields = {
  number: document.querySelector("#proof-number"),
  status: document.querySelector("#proof-status"),
  title: document.querySelector("#proof-title"),
  claim: document.querySelector("#proof-claim"),
  source: document.querySelector("#proof-source"),
  detail: document.querySelector("#proof-detail"),
  type: document.querySelector("#proof-type"),
  link: document.querySelector("#proof-link"),
};
function showProof(key, scroll = false) {
  const item = evidence[key];
  if (!item) return;
  fields.number.textContent = `CLAIM / PROOF ${item.number}`;
  fields.status.textContent = `● ${item.status.toUpperCase()}`;
  fields.title.textContent = item.title;
  fields.claim.textContent = `“${item.claim}”`;
  fields.source.textContent = item.source;
  fields.detail.textContent = item.detail;
  fields.type.textContent = item.type;
  fields.link.href = item.href;
  fields.link.innerHTML = `${item.link} <span>↗</span>`;
  document
    .querySelectorAll(".proof-claim")
    .forEach((button) =>
      button.classList.toggle("active", button.dataset.proof === key),
    );
  if (scroll)
    document
      .querySelector("#proof-viewer")
      .scrollIntoView({ behavior: "smooth", block: "center" });
}
document
  .querySelectorAll("[data-proof]")
  .forEach((button) =>
    button.addEventListener("click", () =>
      showProof(
        button.dataset.proof,
        !button.classList.contains("proof-claim"),
      ),
    ),
  );
function openFromHash() {
  const key = location.hash.replace("#", "");
  if (evidence[key]) showProof(key);
}
openFromHash();
window.addEventListener("hashchange", openFromHash);
