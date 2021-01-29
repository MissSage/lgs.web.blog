/**
 * 验证是否登录的中间件
 */
import Cookies from 'js-cookie'
export default function ({ store, redirect }) {
  // If the user is not authenticated
  if (!store.state.token) {
    var token=Cookies.get('token')
    if(token){
      store.commit('setToken',token)
    }else{
      return redirect('/login')
    }
  }
}
