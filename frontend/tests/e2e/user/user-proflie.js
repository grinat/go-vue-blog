/* global expect, describe, beforeEach, afterEach, test */
const utils = require('../../utils')
const config = require('../../config')

describe("User Profile", () => {
  let page, browser, adminProfileLink

  beforeEach(async () => {
    ({page, browser} = await utils.getBrowser())
  })

  afterEach(async () => {
    await browser.close()
  })

  test("Admin user open profile", async () => {
    await utils.login(page, config.admin)
    await page.click(".my-profile-link")
    await utils.wait(config.navTimeout)
    adminProfileLink = await page.url()
    const text = await utils.getText(page)
    expect(text).toContain(config.admin.name)
    expect(text).toContain(utils.getFromContext('articleTitle'))
    expect(text).toContain("Draft")
  }, config.timeout)

  test("User logout", async () => {
    await utils.login(page, config.admin)
    await page.click(".logout-link")
    await utils.wait(config.navTimeout)
    const text = await utils.getText(page, '.navbar-menu')
    expect(text).toContain('Register')
  }, config.timeout)

  test("User view foreign profile", async () => {
    await page.goto(adminProfileLink)
    await utils.wait(config.navTimeout)
    const text = await utils.getText(page)
    expect(text).not.toContain("Draft")
    expect(text).not.toContain("Edit")
  }, config.timeout)
})
