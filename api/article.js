import { request } from '@/plugins/request'

// 上传文章
export const postArticle = data => {
    return request({
        method: 'POST',
        url: '/api/Blog',
        // headers:{
        //     Accept: 'application/json-patch+json',
        // },
        params:data
    })
}
export const getArticles=data=>{
    return request({
        method:'GET',
        url:'/api/Blog',
        params:data
    })
}
export const getArticle=slug=>{
    return request({
        method:'GET',
        url:`/api/Blog/${slug}`
    })
}
//上传图片
export const upLoadImage=(data)=>{
    return request({
        method:'POST',
        url:'/api/Img',
        data
    })
}