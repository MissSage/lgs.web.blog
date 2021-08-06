
module.exports = {
  router: {
    linkActiveClass: 'active',
    // 自定义路由表规则
    extendRoutes (routes, resolve) {
      // 清除 Nuxt.js 基于 pages 目录默认生成的路由表规则
      routes.splice(0)

      routes.push(...[
        {
          path: '/',
          component: resolve(__dirname, 'pages/layout/layout.vue'),
          children: [
            {
              path: '', // 默认子路由
              name: 'home',
              component: resolve(__dirname, 'pages/home/home.vue')
            },
            {
              path: '/login',
              name: 'login',
              component: resolve(__dirname, 'pages/login/login.vue')
            },
            {
              path: '/register',
              name: 'register',
              component: resolve(__dirname, 'pages/login/login.vue')
            },
            {
                path: '/editor',
                name: 'editor',
                component: resolve(__dirname, 'pages/editor/editor.vue')
            },
            {
              path: '/article/:slug',
              name: 'article',
              component: resolve(__dirname, 'pages/article/article.vue')
            },
            {
              path: '/settings',
              name: 'settings',
              component: resolve(__dirname, 'pages/settings/settings.vue')
            },
            {
              path: '/profile/:username',
              name: 'profile',
              component: resolve(__dirname, 'pages/profile/profile.vue')
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
  server: {
    host:'0.0.0.0',
    port: 3000
  },
  axios: {
    baseURL:'http://www.miaojiangjiang.com:90',
    proxy: true, // 表示开启代理
    prefix: '/api', // 表示给请求url加个前缀 /api
    credentials: true // 表示跨域请求时是否需要使用凭证
  },
  proxy: {
    '/api': {
        target:process.env.NODE_ENV==='production'? 'http://www.miaojiangjiang.com:90':'http://localhost:8081',
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
