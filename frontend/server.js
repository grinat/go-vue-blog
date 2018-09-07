const fs = require('fs')
const path = require('path')
const express = require('express')
var cookieParser = require('cookie-parser')
const { createBundleRenderer } = require('vue-server-renderer')

const app = express()
app.use(cookieParser())

function createRenderer (bundle, options) {
    return createBundleRenderer(bundle, Object.assign(options, {
        runInNewContext: true
    }))
}

let renderer
const templatePath = path.resolve(__dirname, './public/index.html')

const bundle = require('./dist/vue-ssr-server-bundle.json')
const template = fs.readFileSync(templatePath, 'utf-8')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
renderer = createRenderer(bundle, {
    template,
    clientManifest
})

app.use('/js', express.static(path.resolve(__dirname, './dist/js')))
app.use('/css', express.static(path.resolve(__dirname, './dist/css')))

app.get('*', (req, res) => {

    res.setHeader("Content-Type", "text/html")

    const context = {
        title: '', // default title
        url: req.url,
        cookies: req.cookies
    }

    renderer.renderToString(context, (err, html) => {
        if (err) {
            if (err.url) {
                res.redirect(err.url)
            } else {
                // Render Error Page or Redirect
                res.status(500).end('500 | Internal Server Error')
                console.error(`error during render : ${req.url}`)
                console.error(err.stack)
            }
        }
        res.status(context.HTTPStatus || 200)
        res.send(html)
    })
})

module.exports = app
