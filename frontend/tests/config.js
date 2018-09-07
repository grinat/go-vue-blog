const config = {
  width: 1200,
  height: 800,
  headless: process.env.TESTING_HEADLESS || false,
  slowMo: 5,
  // '/usr/bin/chromium-browser',
  executablePath: process.env.TESTING_CHROMIUM_PATH || null,
  url: process.env.TESTING_URL || 'http://localhost:9010',
  timeout: 40000,
  navTimeout: 3000,
  admin: {
    email: 'paladin2012gnu@gmail.com',
    name: 'Admin',
    pass: '123456'
  }
}

module.exports = config
