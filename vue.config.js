const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  devServer: {
    // open: true,
    open: false,
    port: 6060,
    https: false,
    host: 'localhost'
  }
})
