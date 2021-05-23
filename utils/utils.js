import { proxyRemoteUrl,proxyLocalUrl } from '../Public/config.js'
export const getFullPath=(uri)=>{
    if(uri){
        let baseURL = process.env.NODE_ENV == "production" ? proxyRemoteUrl : proxyLocalUrl
        return baseURL+'/'+uri
    }else{
        return null
    }
    
}