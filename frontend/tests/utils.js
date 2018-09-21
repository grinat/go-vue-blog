const puppeteer = require('puppeteer')
const config = require('./config')

const context = {}

const utils = {
  putToContext: function (key, value) {
    context[key] = value
  },
  getFromContext: function (key) {
    return context[key]
  },
  getBrowser: async function () {
    const {width, height} = config
    let launchConfig = Object.assign({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-translate',
        '--disable-extensions',
        `--window-size=${width},${height}`
      ]
    }, config)
    if (!launchConfig.executablePath) {
      delete launchConfig.executablePath
    }
    let browser = await puppeteer.launch(launchConfig)
    let page = await browser.newPage()
    await page.setViewport({ width, height })
    await this.wait(config.navTimeout)
    return {
      browser, page
    }
  },
  wait: async function (delay = 500) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true)
      }, delay)
    })
  },
  login: async function (page, user = {}) {
    await page.goto(config.url + '/user/login')
    await page.type("input[name=email]", user.email)
    await page.type("input[name=pass]", user.pass)
    await page.click("button[type=submit]")
    await this.wait(config.navTimeout)
    // await page.waitForNavigation()
  },
  getText: async function (page, selector) {
    if (selector) {
      return page.evaluate(selector => document.body.querySelector(selector).textContent, selector)
    }
    return page.evaluate(() => document.body.textContent)
  },
  getHTML: async function (page, selector) {
    if (selector) {
      return page.evaluate(selector => document.body.querySelector(selector).innerHTML, selector)
    }
    return page.evaluate(() => document.body.innerHTML)
  }
}

module.exports = utils
