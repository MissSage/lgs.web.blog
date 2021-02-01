# lgs.web.blog

ligoushi的博客网站

## 数据操作封装

对axios数据请求进行处理

### api操作插件api.js

- 首先定义我们可能需要的api数据请求方法：article.js和user.js,大致内容如下:
  - user.js

    ```js
    import axios from 'axios'
    // 用户登录
    export const login = data => {
      return axios.get('/api/Login/GetTokenNuxt',{params:data})
    }
    // 用户注册
    export const register = data => {
      return axios.post('/api/User/Post',
        {
          params:{
            uLoginName:data.name,
            uLoginPWD:data.pass
          }
        }
      )
    }
    export const GetUserByToken=token=>{
      return axios.get(`/api/User/GetInfoByToken?token=${token}`)
    }
    ```

  - article.js与user.js内容格式一致，主要就是导出一些数据请求方法

- 创建插件
  
  ```js
  //在plugins中创建api.js，代码如下：
  import * as article from '../api/article'//操作文章的api方法
  import * as user from '../api/user'//操作用户的api方法
  
  //1) 将api操作方法解构到request中
  const request = {
    ...article,
    ...user
    // testGet : (params) => {
    //   return axios.get('/web-service/testGet',{
    //     params
    //   })
    // },
    // testPost : (params) => {
    //   return axios.get('/web-service/testPost',params)
    // },
    //......
  }
    
  //2) 定义axios变量等待接收axios,保证axios可用
  var axios = null
  export default ({ $axios }, inject) => {
  
    //3 保存内置的axios
    axios = $axios
  
    //4) 将自定义request交于nuxt
    inject('request', request)
  }
  ```

- 然后注册插件

  ```js
  // 在nuxt.config.js中添加如下内容
  plugins: [
      '~/plugins/api.js'
  ],
  ```

- 配置axios

  ```js
  //在nuxt.config.js中添加如下内容
  axios: {
    baseURL:'http://localhost',
    proxy: true, // 表示开启代理
    prefix: '/api', // 表示给请求url加个前缀 /api
    credentials: true // 表示跨域请求时是否需要使用凭证
  },
  //跨域代理
  proxy: {
    '/api': {
        target: 'http://www.xxx.com', // 目标接口域名
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
  build:{
    vendor: ['axios']//防止重复打包
  },
  ```

### 使用

- 在asyncData中使用axios
  
  ```js
  // 前端服务端执行
  async asyncData( context ) {
    let baseResult = await context.app.$request.getArticles()
    return {
      myResponse : baseResult.data
    }
  },
  ```

- 在vue函数中使用

  ```js
  //页面加载成功 (前端客户端执行)
  async mounted() {
    //发送ajax
    let baseResult = await this.$request.getArticles()
  }

## 请求拦截

- 前面讲了对axios的封装，下面讲一下请求拦截
- 有需要的可以添加此内容，比如请求头添加TOKEN等
- 什么是请求拦截？
  - 请求拦截就是在请求发送前后对请求进行处理
  - 接口方法：
    - axios.onRequest：在请求前对请求进行额外的处理
    - axios.onResponse：在请求响应后进行额外的处理
    - axios.onError：在请求发生错误时进行额外的处理
- 这里是使用插件的形式对请求进行处理，具体流程和上面的数据操作封装过程大致相同，都是先写好插件，再注册插件就行了
  - 首先在Plugins目录下创建request.js，内容如下：

    ```js
    export default function({ $axios, redirect,store }) {
      $axios.onRequest(config => {
        const { token } = store.state
        console.log(config)
        if (token) {
          //给请求头添加授权token
          config.headers.Authorization = `Bearer ${token}`
        }
        return config;
      });
      
      $axios.onResponse(response => {
        return Promise.resolve(response.data);
      });
      
      $axios.onError(error => {
        return Promise.reject(error);
      });
    }
    ```
  
  - 注册插件

    ```js
    // 在nuxt.config.js中添加如下内容
    plugins: [
        '~/plugins/request.js'
    ],
    ```

- request插件到这里就完成了，其会在请求时自动进行相应的操作
