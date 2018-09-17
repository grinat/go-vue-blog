/* global expect, describe, beforeEach, afterEach, test */
const utils = require('../../utils')
const config = require('../../config')

describe("User register/login", () => {
  let page, browser

  beforeEach(async () => {
    ({page, browser} = await utils.getBrowser())
  })

  afterEach(async () => {
    await browser.close()
  })

  test("Register admin", async () => {
    await page.goto(config.url + '/user/register')
    await utils.wait()
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
