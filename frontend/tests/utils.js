const puppeteer = require('puppeteer')
const config = require('./config')

const utils = {
  getBrowser: async function() {
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
    return {browser, page}
  },
  wait: async function (delay = 500) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true)
      }, delay)
    })
  },
  getText: async function (page, selector) {
    if (selector) {
      return page.evaluate(() => document.querySelector(selector).textContent)
    }
    return page.evaluate(() => document.body.textContent)
  }
}

module.exports = utils
