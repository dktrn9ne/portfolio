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
