# lgs.web.blog

ligoushi的博客网站

## 1 项目搭建

### 1.1 脚手架工具 create-nuxt-app

- 确保安装npx

```npx create-nuxt-app <项目名>```

- 或者使用yarn

```yarn create nuxt-app <项目名>```

### 1.2 手动从头开始新建项目

#### 1.2.1 创建文件

```node
  mkdir <项目名>
  cd <项目名>
```

#### 1.2.2 初始化package.json

```npm init -y```

#### 1.2.3 安装Nuxt

```npm i nuxt```

#### 1.2.4 设置启动脚本

- 在package.json中

```json
"scripts":{
  "dev":"nuxt"
}"
```

#### 1.2.5 创建页面

- 在根目录中添加pages目录，nuxt默认以pages作为项目页面目录，会自动为此目录中的页面生成路由
- 添加首页index.vue,并添加初始页面代码

#### 1.2.6 启动项目

```npm run dev```

- 项目默认启动3000端口

## 2 Git代码管理

### 2.1 初始化Git

```git init```

### 2.2 设置远程仓库

```git remote add origin <你的仓库地址>```

### 2.3 添加文件到本地库

```git add .```

- 最后的 . 表示添加当前项目中的所有文件到本地库

### 2.4 提交

- 把所有添加到本地库的文件更新成确定提交状态
```git commit -m '你的提交备注内容'```

### 2.5 推送

- 把文件推送到远程仓库

```node
git push <本地库的名称> <你要推送到的分支>
git push origin master
```

### 2.6 gitignore

- 不必要的文件不用推送到远程库，添加.gitignore文件到项目根目录下，并添加内容指示不需要推送的目录或文件

```text
// .gitignore文件
node_modules
.nuxt
```

- 也可以是使用git仓库默认生成的gitignore文件，确保模板是Node即可

## 3 路由

### 3.1 路由导航

- router-link

```vue
<router-link to="/">首页</router-link>
```

- 编程式导航

```js
this.$router.push('/')
```

### 3.2 动态路由

```text
目录结构
| user
  | _id.vue
```

- 这里的_id表示这个文件可以接收参数名为id的参数
- 比如访问localhost:3000/user/1,可以在_id.vue中使用$route.params.id来获取参数1

## 4 布局组件

- 想要为项目添加布局，可以在项目根目录下添加layouts目录，里面可以定义多个布局模板，在具体的页面中调用不同的模板就可以为页面生成不同的布局

```vue
export default {
  name:'text',
  layout:'foo'//使用foo布局模板，不配置此项目则使用default模板
}
```

- 注意：只要有layouts目录就必需有default.vue作为默认组件，每个页面没有使用布局的默认加载default

## 5 数据操作封装

对axios数据请求进行处理

### 5.1 api操作插件api.js

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

- 配置axios代理

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

### 5.2 使用

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

## 6 请求拦截

### 6.1 什么是请求拦截？

- 请求拦截就是在请求发送前后对请求进行处理
- 接口方法：
  - axios.onRequest：在请求前对请求进行额外的处理
  - axios.onResponse：在请求响应后进行额外的处理
  - axios.onError：在请求发生错误时进行额外的处理

### 6.2 制作请求拦截插件

具体流程和上面的数据操作封装过程大致相同，都是先写好插件，再注册插件就行了

#### 6.2.1 创建插件

在Plugins目录下创建request.js，内容如下：

  ```js
  export default function({ $axios, redirect,store }) {
    $axios.onRequest(config => {
      // 这里使用到store状态管理
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
  
#### 6.2.2 注册插件

  ```js
  // 在nuxt.config.js中添加如下内容
  plugins: [
      '~/plugins/request.js'
  ],
  ```

- request插件到这里就完成了，其会在请求时自动进行相应的操作

## 7 数据请求封装优化

### 7.1为什么要优化？

前面对数据请求进行了封装，但是api文件中还要引入到相关的api请求方法，这样每次添加或者更新api请求方法都要更新此文件，这样显示不是我们所想要的，我们可以把请求方法与插件脱离开

### 7.2 优化插件

- 数据请求都要依赖axios,我们把axio封装到request文件中，调整后的request.js文件如下：

```js
/**
 * 基于 axios 封装的请求模块
 */

import axios from 'axios'
// 创建请求对象
export const request = axios.create({
  // baseURL: 'http://***/'
  timeout:100000
})

//通过插件机制获取到上下文对象（query、params、req、res、app、store...）
//插件导出函数必须作为 default 成员
export default ({ store ,redirect}) => {
  // 请求拦截器
  // 任何请求都要经过请求拦截器
  // 我们可以在请求拦截器中做一些公共的业务处理,例如统一设置 token
  request.interceptors.request.use(function (config) {
    const { token } = store.state
    // console.log(config)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 返回 config 请求配置对象
    return config
  }, function (error) {
    // 如果请求失败(此时请求还没有发出去)就会进入这里
    return Promise.reject(error)
  })
  // 响应拦截器
  // 可以对数据进行初步的操作
  // 也可以进行权限判断等操作
  request.interceptors.response.use(response=>{
    return response
  },function(error){
    console.log(error.response)
    let res=error.response

    if(res.status==401){
      return redirect('/login')
    }
    return Promise.resolve(error.response)
  })
}
```

- 这个时候，具体api请求方法需要进行改动了，比如上面数据封装请求中提到的user.js

  ```js
  // 不再直接使用axios，而是使用封装了axios的request.js
  import { request } from '@/plugins/request'
  // 用户登录
  export const login = data => {
    return request({
      method: 'GET',
      url: '/api/Login/GetTokenNuxt',
      params: data
    })
  }

  // 用户注册
  export const register = data => {
    return request({
      method: 'POST',
      url: '/api/User/Post',
      params:{uLoginName:data.name,uLoginPWD:data.pass}
    })
  }

  export const GetUserByToken=token=>{
    return request({
      method:'GET',
      url:'/api/User/GetInfoByToken?token='+token
    })
  }
  ```

## 8 asyncData

### 8.1 什么是asyncData?

- asyncData是异步获取数据的方法，可以在设置页面组件数据之前能异步的获取或处理数据
- asyncData会在组件每次加载之前被调用，可以在服务端或路由更新之前被调用
- 在这个方法被调用时，第一个参数是当前页面的上下文对象

### 8.2 怎么使用

```js
import { getArticle } from '@/api/article'
export default {
  name: 'ArticleIndex',
  // params结构于content上下文
  async asyncData ({ params }) {
    console.log(params)
    const {data} = await getArticle(params.slug)
    const article = data.response
    return {
      article
    }
  },
  head () {
    return {
      title: `${this.article.btitle} - 叨叨咪`,
      meta: [
        { hid: 'description', name: 'description', content: this.article.digest }
      ]
    }
  }
}
```

## 9 应用部署

### 打包Nuxt.js应用
