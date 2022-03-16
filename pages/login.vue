<template>
  <v-container>
    <h1>Login</h1>
    <v-form ref="login_form">
      <v-text-field v-model="email" type="email" label="Email" :rules="[required]" prepend-icon="mdi-email" />
      <v-text-field
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        label="Password"
        :rules="[required, min_length, max_length]"
        prepend-icon="mdi-lock"
        :append-icon="showPassword ? 'mid-eye' : 'mdi-eye-off'"
        @click:append="showPassword=!showPassword"
      />
      <v-btn type="submit" @click.prevent="login">
        Login
      </v-btn>
      <div>{{ message }}</div>
      <div class="pt-4">
        <nuxt-link to="/signup">
          Create Account
        </nuxt-link>
      </div>
    </v-form>
  </v-container>
</template>
<script>
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../plugins/firebase'
export default {
  name: 'LoginPage',
  data () {
    return {
      email: '',
      password: '',
      message: '',
      showPassword: false,
      required: value => !!value || '必要です',
      min_length: value => value.length >= 8 || 'short password',
      max_length: value => value.length <= 20 || 'long password'
    }
  },
  methods: {
    login () {
      if (this.$refs.login_form.validate()) {
        signInWithEmailAndPassword(auth, this.email, this.password)
          .then((userCredential) => {
            const user = userCredential.user
            this.message = 'Login! :' + (user.displayName || user.uid)
            this.$store.dispatch('setUser', {
              uid: user.uid,
              displayName: user.displayName
            })
            this.$router.push('/home')
          })
          .catch(() => {
            this.message = 'ログインできません'
          })
      } else {
        this.message = '入力エラーがあります'
      }
    }
  }
}
</script>
<style scoped>
</style>
