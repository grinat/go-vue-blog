const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const nodeExternals = require('webpack-node-externals')
const merge = require('lodash.merge')

const TARGET_NODE = process.env.WEBPACK_TARGET === 'node'

const createApiFile = TARGET_NODE
  ? './create-api-server.js'
  : './create-api-client.js'

module.exports = {
  configureWebpack: () => ({
    // include regenerator runtime
    // https://github.com/vuejs/vue/issues/5559
    entry: TARGET_NODE
      ? ["regenerator-runtime/runtime", "./src/entry-server"]
      : ["regenerator-runtime/runtime", "./src/entry-client"],
    target: TARGET_NODE ? 'node' : 'web',
    node: TARGET_NODE ? undefined : false,
    plugins: [
      TARGET_NODE
        ? new VueSSRServerPlugin()
        : new VueSSRClientPlugin()
    ],
    externals: TARGET_NODE ? nodeExternals({
      whitelist: ["regenerator-runtime/runtime", /\.css$/]
    }) : undefined,
    output: {
      libraryTarget: TARGET_NODE
        ? 'commonjs2'
        : undefined
    },
    optimization: {
      splitChunks: false,
      // https://github.com/nuxt/nuxt.js/issues/1552
      /* minimizer: [
        // we specify a custom UglifyJsPlugin here to get source maps in production
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          uglifyOptions: {
            collapseWhitespace: false
          }
        })
      ], */
    },
    resolve: {
      alias: {
        'create-api': createApiFile
      }
    }
  }),
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options =>
        merge(options, {
          optimizeSSR: false
        })
      )
  }
}
