const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto("http://127.0.0.1:8765/resume.html", {
    waitUntil: "networkidle",
  });
  await page.locator('[data-proof="agents"]').first().click();
  await page.waitForFunction(
    () =>
      document.querySelector("#proof-title")?.textContent ===
      "Reliable agent workflows",
  );
  const href = await page.locator("#proof-link").getAttribute("href");
  if (!href?.includes("enterprise-agent-workbench"))
    throw new Error("Agent proof source did not update");

  await page.locator('.inline-claim[data-proof="payments"]').click();
  await page.waitForFunction(
    () =>
      document.querySelector("#proof-title")?.textContent ===
      "Payment integrity controls",
  );

  await page.setViewportSize({ width: 390, height: 844 });
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  if (overflow)
    throw new Error("Resume has horizontal overflow at mobile width");
  if (errors.length)
    throw new Error(`Unexpected page errors: ${errors.join(" | ")}`);

  await browser.close();
  console.log(
    "3 resume browser checks passed; proof switching and mobile layout verified.",
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
