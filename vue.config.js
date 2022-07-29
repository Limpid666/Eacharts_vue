const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  devServer: {
    open: true,
    port: 6060,
    https: false,
    host: 'localhost'
  }
})
