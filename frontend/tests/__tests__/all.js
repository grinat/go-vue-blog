/* global expect, describe, beforeEach, afterEach, test */
const utils = require('../utils')
const config = require('../config')
const faker = require('faker')

expect.extend({
  toBeOneOf (received, values = []) {
    let pass = false
    values.forEach(v => {
      if (received.indexOf(v) > -1) {
        pass = true
      }
    })
    return {
      message: () => `expected doesnt find ${values.join(', ')}`,
      pass
    }
  }
})

describe("User", () => {
  let page, browser

  beforeEach(async () => {
    ({page, browser} = await utils.getBrowser())
  })

  afterEach(async () => {
    await browser.close()
  })

  test("Register admin", async () => {
    await page.goto(config.url + '/user/register')
    await page.type("input[name=email]", config.admin.email)
    await page.type("input[name=name]", config.admin.name)
    await page.type("input[name=pass]", config.admin.pass)
    await page.type("input[name=passRepeat]", config.admin.pass)
    await page.click("button[type=submit]")
    await utils.wait(config.navTimeout)
    if (await page.$("input[name=email]")) {
      const text = await utils.getText(page)
      expect(text).toBeOneOf(['Email is busy'])
    }
  }, config.timeout)

  test("Login admin", async () => {
    await utils.login(page, config.admin)
  }, config.timeout)
})

describe("Blog", () => {
  let page, browser, title

  beforeEach(async () => {
    ({ page, browser } = await utils.getBrowser())
  })

  afterEach(async () => {
    await browser.close()
  })

  test("Create article", async () => {
    await utils.login(page, config.admin)
    // chrome doesnt support history api?
    // https://github.com/GoogleChrome/puppeteer/issues/1736
    await page.click(".create-article")
    await utils.wait(config.navTimeout)
    title = faker.lorem.words()
    await page.type("input[name=title]", title)
    await page.type(
      "textarea[name=description]",
      faker.lorem.words(
        faker.random.number(100)
      )
    )
    await page.click("button[type=submit]")
    await utils.wait(config.navTimeout)
    const text = await utils.getText(page)
    expect(text).toContain(title)
  }, config.timeout)

  test("Articles", async () => {
    await page.goto(config.url + '/blog/articles')
    await utils.wait(config.navTimeout)
    const text = await utils.getText(page)
    expect(text).toContain(title)
  }, config.timeout)

})
