const { Builder, By, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const { authenticator } = require('otplib');

(async function example() {
  const driver = await new Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(
      new firefox.Options().setPreference('geo.enabled', false).headless()
    )
    .build();

  try {
    await driver.get('https://people.israelit.pro/');
    await type(
      'input[placeholder="Email address or mobile number"]',
      process.env.ZOHO_EMAIL
    );
    await click('#nextbtn');
    await type(
      'input[placeholder="Enter password"]',
      process.env.ZOHO_PASSWORD
    );
    await click('#nextbtn');
    await type(
      'input[placeholder="Enter TOTP"]',
      authenticator.generate(process.env.ZOHO_TOTP)
    );
    await click('#nextbtn');

    console.log('Logged in');

    await (await contains('.out.chlodIng', 'Check-out', 60000)).click();
    await contains('.in.chlodIng', 'Check-in');

    console.log('Check out');
  } catch (e) {
    console.error(e);
  } finally {
    if (driver) {
      await click('#zpeople_userimage');
      await (await contains('.ZPSOut', 'Sign Out')).click();
      await get('input[placeholder="Email address or mobile number"]', 30000);

      console.log('Logged out');
    }
    await driver.quit();
    console.log('Check-out finish');
  }

  async function get(selector, timeout) {
    const el = await driver.wait(
      until.elementLocated(By.css(selector)),
      timeout || 10000
    );
    return driver.wait(until.elementIsVisible(el), timeout || 10000);
  }

  async function contains(selector, text, timeout) {
    const el = await get(selector, timeout);
    const elText = await el.getText();
    if (elText.indexOf(text) >= 0) {
      return el;
    }
    throw new Error(`Element "${selector}" with text "${text}" not found.`);
  }

  async function type(selector, text) {
    const el = await get(selector);
    return el.sendKeys(text);
  }

  async function click(selector) {
    const el = await get(selector);
    return el.click();
  }
})();
