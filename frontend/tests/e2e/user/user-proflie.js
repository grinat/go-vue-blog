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

  test("User cant edit foreign profile", async () => {
    // go to prifle
    await page.goto(adminProfileLink)
    await utils.wait(config.navTimeout)
    const text = await utils.getText(page)
    expect(text).not.toContain('Edit')
  })

  test("Can edit profile", async () => {
    await utils.login(page, config.admin)
    // go to prifle
    await page.goto(adminProfileLink)
    await utils.wait(config.navTimeout)
    // go to prifle edit
    await page.click(".profile-edit-btn")
    await utils.wait(config.navTimeout)
    // upd name
    let newName = config.admin.name + 'Upd'
    await page.type("input[name=name]", 'Upd')
    await page.click("button[type=submit]")
    await utils.wait(config.navTimeout)
    // chek for new name in profile
    const text = await utils.getText(page)
    expect(text).toContain(newName)
  }, config.timeout)
})
