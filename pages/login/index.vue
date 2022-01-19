<template>
  <div class="auth-page">
      <div class="container page">
          <div class="row">

              <div class="col-md-6 offset-md-3 col-xs-12">
                  <h1 class="text-xs-center">{{ islogin ? 'Sign in' : 'Sign up' }}</h1>
                  <p class="text-xs-center">
                      <!-- <a href="">Have an account?</a> -->
                      <nuxt-link v-if="islogin" to="/register">eed an account?</nuxt-link>
                      <nuxt-link v-else to="/login">Have an account?</nuxt-link>
                  </p>

                  <ul class="error-messages">
                     <template v-for="(messages, field) in errors">
                       <li v-for="(item, index) in messages" :key="index">{{ field }} {{ item }}</li>
                     </template>
                  </ul>

                  <form @submit.prevent="onSubmit">
                      <fieldset v-if="!islogin" class="form-group">
                          <input required v-model="user.username" class="form-control form-control-lg" type="text" placeholder="Your Name">
                      </fieldset>
                      <fieldset class="form-group">
                          <input v-model="user.email" class="form-control form-control-lg" type="email" placeholder="Email" required>
                      </fieldset>
                      <fieldset class="form-group">
                          <input v-model="user.password" class="form-control form-control-lg" type="password" placeholder="Password" required minlength="8">
                      </fieldset>
                      <button class="btn btn-lg btn-primary pull-xs-right">
                          {{ islogin ? 'Sign in' : 'Sign up' }}
                      </button>
                  </form>
              </div>

          </div>
      </div>
  </div>
</template>

<script>
import { register, login } from '../../api/user'
// 在客户端加载 js-cookie包
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  middleware: 'notAuthenticated',
  name: 'LoginIndex',
  data () {
    return {
      user: {
        username: '',
        email: 'lpzmail@163.com',
        password: '12345678'
      },
      errors: {},
    }
  },
  computed: {
    islogin () {
      return this.$route.name === 'login'
    }
  },
  methods: {
    async onSubmit () {
      try{
        console.log(this.islogin)
        const { data } = this.islogin
        ? await login({
            user: this.user
          })
        : await register({
            user: this.user
          })
        this.$store.commit('setUser', data.user)
        // 为了防止刷新页面数据丢失，把数据持久化
        Cookie.set('user', JSON.stringify(data.user))
        this.$router.push('/')
      } catch (err) {
        this.errors = err.response.data.errors
        console.dir(err)
      }
    }
  }
}
</script>

<style>

</style>