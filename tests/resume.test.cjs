const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
const resume = fs.readFileSync(path.join(root, "resume.html"), "utf8");
const script = fs.readFileSync(path.join(root, "assets", "resume.js"), "utf8");

test("portfolio exposes the proof resume in navigation and selected work", () => {
  assert.match(home, /href="resume\.html">Proof Resume/);
  assert.match(home, /Interactive Resume \/ Verified Evidence/);
});

test("resume renders fourteen evidence records and required primary sources", () => {
  const claimButtons = resume.match(/class="proof-claim(?: active)?"/g) || [];
  assert.equal(claimButtons.length, 14);
  for (const source of [
    "cadence\/pull\/35",
    "enterprise-agent-workbench",
    "proofrail-ai-evals",
    "portfolio\/pull\/8",
    "Bravado\/pull\/2",
    "youtube\\.com\\/watch\\?v=lGcV7AUBELs",
    "youtube\\.com\\/@UniqueAccessEnt",
    "books\\/edition\\/The_History_of_Gangster_Rap",
    "thehypemagazine\\.com",
  ]) {
    assert.match(script, new RegExp(source));
  }
});

test("resume social metadata and evidence standard are explicit", () => {
  assert.match(
    resume,
    /property="og:image"[\s\S]*?content="https:\/\/mauricethomas\.online\/assets\/evidence-resume-og\.png"/,
  );
  assert.match(resume, /Planned work is never presented as completed work/);
  assert.match(resume, /“Pending” means a public/);
  assert.doesNotMatch(resume, /ShooterOS/);
});

test("token activity stats stay off the homepage and proof resume", () => {
  for (const page of [home, resume, script]) {
    assert.doesNotMatch(page, /Lifetime tokens|8\.8B|413\.3M|Personal ChatGPT activity|ai-native-practice/);
  }
});

test("marketing proof uses live figures and does not invent ad budgets", () => {
  assert.match(home, /id="marketing"/);
  assert.match(home, /4,194,196/);
  assert.match(home, /60\.1K subscribers/);
  assert.match(home, /14,613,706/);
  assert.match(home, /as of November 26, 2026/);
  assert.match(home, /thank you for your\s+friendship and support/);
  assert.match(home, /Evidence pending/);
  assert.match(script, /His role on the campaign is evidence pending/);
  assert.match(home, /not stated as fact/);
  assert.doesNotMatch(home + script, /\$40|\$100|40,000|100,000/);
});
