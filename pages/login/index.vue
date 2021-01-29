<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? "Sign in" : "Sign up" }}</h1>
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
                v-model="user.username"
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
                required
              />
            </fieldset>

            <fieldset class="form-group">
              <input
                v-model="user.password"
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                required
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? "Sign in" : "Sign up" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register, GetUserByToken } from "@/api/user";

// 仅在客户端加载 js-cookie 包
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  middleware: "notAuthenticated",
  name: "LoginIndex",
  computed: {
    isLogin() {
      return this.$route.name === "login";
    },
  },
  data() {
    return {
      user: {
        name: "admins",
        pass: "admins",
      },
      errors: {}, // 错误信息
    };
  },

  methods: {
    async onSubmit() {
      debugger
      try {
        // 提交表单请求登录
        const { data } = this.isLogin
          ? await login(this.user)
          : await register(this.user);
        console.log(data)
        if(data.success==true){
          this.$store.commit("setToken", data.response);
          Cookie.set('token',data.response)
          GetUserByToken(data.response).then(result=>{
            let res=result.data;
            console.log(res)
            if(res.success==true){
              this.$store.commit("setUser", res.response);
              Cookie.set("user", res.response)
              this.$router.push("/")
            }else{
              console.log(res)
            }
          })
        }else{
          console.log(data)
        }
        // 跳转到首页
      } catch (err) {
        console.log(err)
        this.errors = err.response.data.errors;
      }
    },
  },
};
</script>

<style>
</style>
