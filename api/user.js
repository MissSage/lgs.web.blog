import {request} from '@/plugins/request'


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
  const params={
    uLoginName:data.name,
    uLoginPWD:data.pass
  }
  return request({
    method: 'POST',
    url: '/api/User/Post',
    data:params
  })
}

export const GetUserByToken=token=>{
  return request({
    method:'GET',
    url:'/api/User/GetInfoByToken?token='+token
  })
}

export const UpdateUser=data=>{
  return request({
    method:'POST',
    url:'/api/User/Edit',
    data
  })
}