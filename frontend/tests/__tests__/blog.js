const utils = require('../utils')

describe("Blog", () => {
  let page, browser, title

  beforeEach(async () => {
    ({page, browser} = await utils.getBrowser())
  })

  afterEach(async () => {
    await browser.close()
  })
})
