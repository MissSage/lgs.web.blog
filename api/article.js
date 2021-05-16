import {request} from '@/plugins/request'

// 上传文章
export const postArticle = data => {
    console.log(request)
    return request({
        method: 'POST',
        url: '/api/blogarticle',
        // headers:{
        //     Accept: 'application/json-patch+json',
        // },
        params:data
    })
}
export const getArticles=data=>{
    return request({
        method:'GET',
        url:'/api/blogarticle',
        params:data
    })
}
export const getArticle=slug=>{
    return request({
        method:'GET',
        url:`/api/blogarticle/${slug}`
    })
}
export const getComments=data=>{
    return request({
        method:'GET',
        url:`/api/blogarticle_comments`,
        params:data
    })
}
//提交评论
export const postComment=data=>{
    return request({
        method:'POST',
        url:'/api/blogarticle_comments',
        params:data
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