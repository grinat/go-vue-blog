/* global expect, describe, beforeEach, afterEach, test */
const utils = require('../../utils')
const config = require('../../config')
const faker = require('faker')

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
    await page.click(".create-article-link")
    await utils.wait(config.navTimeout)
    title = faker.lorem.words(
      faker.random.number(7)
    )
    await page.type("input[name=title]", title)
    await page.type(
      ".ql-editor.ql-blank",
      faker.lorem.words(
        faker.random.number(100)
      )
    )
    await page.click("button[type=submit]")
    await utils.wait(config.navTimeout)
    const text = await utils.getText(page)
    expect(text).toContain(title)
    utils.putToContext('articleTitle', title)
  }, config.timeout)

  test("Articles", async () => {
    await page.goto(config.url + '/blog/articles')
    await utils.wait(config.navTimeout)
    const text = await utils.getText(page)
    expect(text).toContain(title)
  }, config.timeout)

})
