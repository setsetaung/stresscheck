<template>
  <v-container>
    <h1>Sign up</h1>
    <v-text-field v-model="email" type="email" label="Email" />
    <v-text-field v-model="password" type="password" label="Password" />
    <v-text-field v-model="confirmPassword" type="password" label="Password" />
    <v-text-field v-model="name" type="text" label="Name" />
    <v-btn color="primary" @click="signup">
      Signup
    </v-btn>
    <div>{{ message }}</div>
  </v-container>
</template>

<script>
import { createUserWithEmailAndPassword, updateProfile } from '@firebase/auth'
import { auth } from '../plugins/firebase'
export default {
  name: 'SignupPage',
  data () {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      message: ''
    }
  },
  methods: {
    signup () {
      if (this.email.trim() && this.password.trim()) {
        if (this.password === this.confirmPassword) {
          createUserWithEmailAndPassword(auth, this.email, this.password)
            .then((userCredential) => {
              const user = userCredential.user
              updateProfile(user, { displayName: this.name })
                .then(() => {
                  const user = auth.currentUser
                  this.message = 'アカウントが作成されました' + user.uid
                })
              this.$router.push('/login')
            })
            .catch((err) => {
              this.message = err.message
            })
        } else {
          this.message = 'パスワードが一致しません'
        }
      }
    }
  }
}
</script>

<style>

</style>
