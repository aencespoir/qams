const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true, // 转义第三方依赖
  publicPath: '/portal/apps/com.awspaas.user.apps.app202206219731/',
  // publicPath: '/',
  runtimeCompiler: true,
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/api': {
        // 目标地址
        target: 'http://192.168.50.12:8088',
        // target: 'http://192.168.30.232:8088',
        // 设置允许跨域
        changeOrigin: true,
        pathRewrite: {
          //把访问路径中的/api替换掉
          '^/api': ''
        }
      }
    }
  },
  // 配置主题色, 需要安装6+版本less-loader@6.2.0
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#ef4d5b', // 红色
            // 'primary-color': '#0da157', // 绿色
            // 'primary-color': '#008ed5', // 蓝色
          },
          javascriptEnabled: true,
        }
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@src', path.resolve(__dirname, './src'))
      .set('@assets', path.resolve(__dirname, './src/assets'))
      .set('@views', path.resolve(__dirname, './src/views'))
      .set('@components', path.resolve(__dirname, './src/components'))
      .set('@api', path.resolve(__dirname, './src/utils/api'))
  }
})
