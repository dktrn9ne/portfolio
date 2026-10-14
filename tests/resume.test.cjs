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

test("resume renders seven evidence records and required primary sources", () => {
  const claimButtons = resume.match(/class="proof-claim(?: active)?"/g) || [];
  assert.equal(claimButtons.length, 7);
  for (const source of [
    "cadence\/pull\/35",
    "enterprise-agent-workbench",
    "proofrail-ai-evals",
    "portfolio\/pull\/8",
    "Bravado\/pull\/2",
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
  assert.doesNotMatch(resume, /ShooterOS/);
});
