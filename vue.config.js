const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
// vue.config.js
module.exports = {
  devServer: {
    host: 'localhost',
    port: 3000,
    https: true,
    proxy: {
      '/api': {
        target: 'https://cmsapidev.luckyluy.net',
        changeOrigin: true
      }
    }
  }
};


// module.exports = {
//   devServer: {
//     proxy: {
//       '/api': {
//         target: 'https://cmsapidev.luckyluy.net',
//         // target: 'http://127.0.0.1:3000',
//         changeOrigin: true,
//         pathRewrite: { '^/api': '' }, 
//         secure: false,
//       },
//     },
//   },
//   configureWebpack: {
//     plugins: [
//       new (require('webpack')).DefinePlugin({
//         __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
//       }),
//     ],
//   },
// };


