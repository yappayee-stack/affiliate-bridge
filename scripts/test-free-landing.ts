import { runTest } from "./auth";

runTest("Free Landing Page Test", async (helper) => {
  const { page } = helper;
  
  await helper.goto("/free");
  await page.waitForTimeout(2000);
  
  // Take full hero screenshot
  await page.screenshot({ path: "/work/temp/free-landing-hero.png", fullPage: false });
  console.log("Hero screenshot saved");
  
  // Scroll to stats
  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "/work/temp/free-landing-stats.png", fullPage: false });
  console.log("Stats screenshot saved");
  
  // Scroll to chapters
  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "/work/temp/free-landing-chapters.png", fullPage: false });
  console.log("Chapters screenshot saved");
  
  // Scroll to final CTA
  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "/work/temp/free-landing-cta.png", fullPage: false });
  console.log("CTA screenshot saved");
  
}).catch(() => process.exit(1));
