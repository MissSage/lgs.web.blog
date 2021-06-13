/**
 * Nuxt.js 配置文件
 */
import * as config from './Public/config'
module.exports = {
  build:{
    extend(config,{isClient}){
      if(isClient){
        config.devtool = 'source-map'
      }
    },
    filenames: {
      chunk: ({ isDev }) => (isDev ? '[name].js' : '[id].[contenthash].js')
    }
  },
  router: {
    linkActiveClass: 'active',
    // 自定义路由表规则
    extendRoutes (routes, resolve) {
      // 清除 Nuxt.js 基于 pages 目录默认生成的路由表规则
      routes.splice(0)

      routes.push(...[
        {
          path: '/',
          component: resolve(__dirname, 'pages/layout/'),
          children: [
            {
              path: '', // 默认子路由
              name: 'home',
              component: resolve(__dirname, 'pages/home/')
            },
            {
              path: '/login',
              name: 'login',
              component: resolve(__dirname, 'pages/login/')
            },
            {
              path: '/register',
              name: 'register',
              component: resolve(__dirname, 'pages/login/')
            },
            {
                path: '/editor',
                name: 'editor',
                component: resolve(__dirname, 'pages/editor/')
            },
            {
              path: '/article/:slug',
              name: 'article',
              component: resolve(__dirname, 'pages/article/')
            },
            {
              path: '/settings',
              name: 'settings',
              component: resolve(__dirname, 'pages/settings/')
            },
            {
              path: '/profile/:username',
              name: 'profile',
              component: resolve(__dirname, 'pages/profile/')
            }
          ]
        },
        {
          name: 'customerror404',
          path: '*',
          component: resolve(__dirname, 'pages/error/404.vue')
        }
      ])
    }
  },
  // server: {
  //   host: config.baseRemoteHost,
  //   port: config.baseRemotePort
  // },
  axios: {
    // baseURL:'http://localhost',
    // baseURL:'http://localhost:3000',
    baseURL:config.LOCALHOST,
    // See https://github.com/nuxt-community/axios-module#options
    proxy: true, // 表示开启代理
    prefix: '/api', // 表示给请求url加个前缀 /api
    credentials: true // 表示跨域请求时是否需要使用凭证
  },
  proxy: {
    '/api': {
        // target: 'http://www.miaojiangjiang.com:90', // 目标接口域名
        //target:config.proxyLocalUrl,
        target:process.env.NODE_ENV==='production'? config.proxyRemoteUrl:config.proxyLocalUrl,
        changeOrigin: true, // 表示是否跨域
        // pathRewrite: {
        //   '^/api': '', // 把 /api 替换成‘’
        // }
    }
  },
  
  modules: [
    '@nuxtjs/axios', 
    '@nuxtjs/proxy'
  ],
  devtool: '#source-map',
  // 注册插件
  plugins: [
    '~/plugins/dayjs.js',
    // '~/plugins/router.js',
    '~/plugins/request.js',
    {
      src: '~plugins/TextEditor.js',
      ssr: false
    },
    '~/plugins/elementui.js'
  ],
}
