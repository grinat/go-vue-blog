/* global expect, describe, beforeEach, afterEach, test */
const utils = require('../../utils')
const config = require('../../config')
const faker = require('faker')
const path = require('path')

const EDITOR_SELECTOR = '.ql-container .ql-editor'

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
      EDITOR_SELECTOR,
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

  test("Upload image", async () => {
    await utils.login(page, config.admin)
    await page.click(".create-article-link")
    await utils.wait(config.navTimeout)
    const filePath = path.join(process.cwd(), '/tests/mocks/images/Souryuu.Asuka.Langley.full.2049052.jpg')
    await page.type(
      EDITOR_SELECTOR,
      filePath
    )
    const input = await page.$('#file-upload')
    await input.uploadFile(filePath)
    await page.waitForSelector(EDITOR_SELECTOR + ' img')
  }, config.timeout)

})
