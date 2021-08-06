<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? 'Sign in' : 'Sign up' }}</h1>
          <p class="text-xs-center">
            <!-- <a href="">Have an account?</a> -->
            <nuxt-link v-if="isLogin" to="/register"
              >Need an account?</nuxt-link
            >
            <nuxt-link v-else to="/login">Have an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ field }} {{ message }}
              </li>
            </template>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset class="form-group">
              <input
                v-model="user.name"
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
                required
              />
            </fieldset>

            <fieldset class="form-group">
              <input
                v-model="user.pass"
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                required
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? 'Sign in' : 'Sign up' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register, GetUserByToken } from '@/api/user'
import { mapState } from 'vuex'
// 仅在客户端加载 js-cookie 包
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  middleware: 'notAuthenticated',
  name: 'LoginIndex',
  computed: {
    ...mapState(['lastPath']),
    isLogin() {
      return this.$route.name === 'login'
    },
  },
  data() {
    return {
      user: {
        name: 'admins',
        pass: 'admins',
      },
      errors: {}, // 错误信息
      token: '',
    }
  },
  methods: {
    async onSubmit() {
      try {
        // 提交表单请求登录
        const { data } = this.isLogin
          ? await login(this.user)
          : await register(this.user)
        // console.log(data)
        if (data.success == true) {
          if (this.isLogin) {
            this.$store.commit('setToken', data.response)
            Cookie.set('token', data.response)
            this.token = data.response
            this.getUserInfo()
          }else{
            login(this.user).then(res=>{
              if(res.data.success){
              this.$store.commit('setToken', res.data.response)
              Cookie.set('token', res.data.response)
              this.token = res.data.response
              this.getUserInfo()
            }else{
              console.log(data.msg)
              this.$router.push('/login')
            }
            })
            
          }
        } else {
          console.log(data.msg)
        }
        // 跳转到首页
      } catch (err) {
        console.log(err)
        this.errors = err.response.data.errors
      }
    },
    async getUserInfo() {
      if (this.toke === '') {
        console.log('token was not got')
        return
      }
      const { data } = await GetUserByToken(this.token)
      if (data.success == true) {
        this.$store.commit('setUser', data.response)
        Cookie.set('user', data.response)
        if (this.lastPath) {
          this.$router.push(this.lastPath) // 登录成功后，返回上次进入的页面；
        } else {
          this.$router.push('/')
        }
      } else {
        console.log(data)
      }
    },
  },
}
</script>

<style>
</style>
