/* global expect */
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

require('../e2e/user/user-login-register')
require('../e2e/blog/blog')
require('../e2e/user/user-proflie')
