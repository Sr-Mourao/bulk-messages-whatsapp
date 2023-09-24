const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false});
  const page = await browser.newPage();

  await page.goto("https://web.whatsapp.com/");

  await page.setViewport({ width: 1080, height: 1024 });

  await page.type(".search-box__input", "automate beyond recorder");

  const searchResultSelector = ".search-box__link";
  await page.waitForSelector(searchResultSelector);
  await page.click(searchResultSelector);

  const textSelector = await page.waitForSelector(
    "text/Customize and automate"
  );
  const fullTitle = await textSelector?.evaluate((el) => el.textContent);

  console.log('The title of this blog post is "%s".', fullTitle);

  await browser.close();
})();
