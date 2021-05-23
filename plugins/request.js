/**
 * 基于 axios 封装的请求模块
 */

import axios from 'axios'
import { LOCALHOST } from '../Public/config'
// 创建请求对象
export const request = axios.create({
  // baseURL: 'http://www.miaojiangjiang.com:90/',
  baseURL:LOCALHOST
})

//通过插件机制获取到上下文对象（query、params、req、res、app、store...）
//插件导出函数必须作为 default 成员
export default ({ store ,redirect}) => {
  // 请求拦截器
  // Add a request interceptor
  // 任何请求都要经过请求拦截器
  // 我们可以在请求拦截器中做一些公共的业务处理,例如统一设置 token
  request.interceptors.request.use(config=>{
    // Do something before request is sent
    // 请求就会经过这里
    const { token } = store.state
    // console.log(config)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 返回 config 请求配置对象
    return config
  },error=>{
    return Promise.reject(error)
  })
  request.interceptors.response.use(response=>{
    return response
  },function(error){
    console.dir(error)
    let res=error.response.data

    if(res.status==401){
      return redirect('/login')
    }
    return Promise.resolve(error.response)
  })
  
}
