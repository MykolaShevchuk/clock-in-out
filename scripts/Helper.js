const { Builder } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const { By, until } = require('selenium-webdriver');

class Helper {
  constructor(driver) {
    this.driver = driver;
  }

  static async init() {
    const driver = await new Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(
        new firefox.Options().setPreference('geo.enabled', false).headless()
      )
      .build();

    return new Helper(driver);
  }

  visit(url) {
    console.log(`Visit "${url}"`);
    return this.driver.get(url);
  }

  async get(selector, timeout) {
    console.log(`Get element "${selector}"`);
    const el = await this.driver.wait(
      until.elementLocated(By.css(selector)),
      timeout || 6000
    );
    return this.driver.wait(until.elementIsVisible(el), timeout || 6000);
  }

  async contains(selector, text, timeout) {
    console.log(`Contains element "${selector}" with text "${text}"`);
    const els = await this.driver.wait(
      until.elementsLocated(By.css(selector)),
      timeout || 6000
    );
    for (let el of els) {
      const elText = await el.getText();
      if (elText.indexOf(text) >= 0) {
        return el;
      }
    }
    throw new Error(`Element "${selector}" with text "${text}" not found.`);
  }

  async type(selector, text) {
    console.log(`Type text "${text}" into element "${selector}"`);
    const el = await this.get(selector);
    return el.sendKeys(text);
  }

  async click(selector) {
    console.log(`Click element "${selector}"`);
    const el = await this.get(selector);
    return el.click();
  }

  async quit() {
    await this.driver.quit();
  }
}

module.exports = Helper;
