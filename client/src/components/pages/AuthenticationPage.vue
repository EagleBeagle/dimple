<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" align="center">
        <v-card class="elevation-12" style="max-width: 800px">
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-row>
                <v-col cols="12" md="8">
                  <v-card-text class="mt-12">
                    <h1 class="text-center text-h2 font-weight-regular mb-8 blue--text">
                      Sign in to Dimple
                    </h1>
                    <v-form
                      ref="form"
                      v-model="valid"
                      autocomplete="on"
                      >
                      <v-text-field
                        v-model="emailSignIn"
                        label="Email"
                        name="Email"
                        prepend-icon="mdi-email"
                        type="text"
                        color="blue"
                        />
                      <v-text-field
                        v-model="passwordSignIn"
                        id="password"
                        label="Password"
                        name="Password"
                        prepend-icon="mdi-lock"
                        type="password"
                        color="blue"
                        />
                    </v-form>
                    <h3 class="text-center mt-3 text-subtitle-1 font-weight-bold">
                      <span style="cursor: pointer" @click="$router.push({ name: 'ForgotPassword' }).catch(() => {})">Forgot your password?</span>
                    </h3>
                  </v-card-text>
                  <div class="text-center mt-3">
                    <v-btn depressed color="blue" dark width="95px" @click="signIn()">
                      <span v-if="!loading">Sign In</span>
                      <v-progress-circular v-else size="25" indeterminate></v-progress-circular>
                    </v-btn>  
                  </div>
                </v-col>
                <v-col cols="12" md="4" class="blue">
                  <v-card-text class="white--text mt-12">
                    <h1 class="text-center text-h4">Hi!</h1>
                    <h5 class="text-center  text-subtitle-2 font-weight-regular">Save your photos to Dimple and access them from any device, anywhere</h5>
                  </v-card-text>
                  <div class="text-center">
                    <v-btn rounded outlined="" dark @click="step++">
                      Sign Up
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>
            <v-window-item :value="2">
              <v-row class="fill-height">
                <v-col cols="12" sm="4" class="blue">
                  <v-card-text class="white--text mt-12">
                    <h1 class="text-center text-h4">
                      Welcome Back!
                    </h1>
                    <h5 class="text-center text-subtitle-2 font-weight-regular">
                      Sign in to continue managing your photo collection
                    </h5>
                  </v-card-text>
                  <div class="text-center">
                    <v-btn rounded outlined dark @click="step--">
                      Sign In
                    </v-btn>
                  </div>
                </v-col>
                <v-col cols="12" sm="8">
                  <v-card-text class="mt-9">
                    <h1 class="text-center text-h2 font-weight-regular mb-5 blue--text">
                      Create Account
                    </h1>
                    <v-form
                      ref="form"
                      v-model="valid"
                      lazy-validation
                      autocomplete="off">
                      <v-text-field
                        v-model="usernameSignUp"
                        :rules="usernameRules"
                        label="Username"
                        name="Name"
                        prepend-icon="mdi-account"
                        type="text"
                        color="blue"
                        />
                      <v-text-field
                        v-model="emailSignUp"
                        :rules="emailRules"
                        label="Email"
                        name="Email"
                        prepend-icon="mdi-email"
                        type="text"
                        color="blue"
                        />
                      <v-text-field
                        v-model="passwordSignUp"
                        :rules="passwordRules"
                        label="Password"
                        name="Password"
                        prepend-icon="mdi-lock"
                        type="password"
                        color="blue"
                        />
                    </v-form>
                  </v-card-text>
                  <div class="text-center mt-3">
                    <v-btn depressed color="blue" class="white--text" :disabled="!valid" width="100px" @click="signUp()">
                      <span v-if="!loading">Sign Up</span>
                      <v-progress-circular v-else size="25" indeterminate></v-progress-circular>
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UserService from '@/services/UserService'
export default {
  data: () => ({
    step: 1,
    emailSignIn: null,
    passwordSignIn: null,
    usernameSignUp: null,
    emailSignUp: null,
    passwordSignUp: null,
    valid: true,
    loading: false,
    usernameRules: [
        v => !!v || "Username can't stay empty.",
        v => (v && v.length > 3) || 'The username has to be at least 4 characters long.',
        v => (v && v.length < 26) || "The username can't be longer than 25 characters.",
        v => /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(v) || 'This username format is not allowed.'
      ],
    emailRules: [
      v => !!v || "Email can't stay empty.",
      v => (v && v.length < 320) || "Email can't be longer than 320 characters.",
      v => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/igm.test(v) || 'E-mail must be valid.'
    ],
    passwordRules: [
      v => !!v || "Password can't stay empty.",
      v => (v && v.length > 7) || 'The password has to be at least 8 characters long.',
      v => (v && v.length < 33) || "The password can't exceed 32 characters.",
      v => /^(?!\$).*/igm.test(v) || 'E-mail must be valid.'
    ],
  }),
  methods: {
    async signIn() {
        try {
          if (!this.emailSignIn || !this.passwordSignIn) {
            this.$store.dispatch('alert', 'Please fill in both fields')
            return
          }
          this.loading = true
          const response = await UserService.signIn({
            email: this.emailSignIn,
            password: this.passwordSignIn
          })
          if (response.data.avatar) {
            response.data.avatar = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/w_300/${response.data.username}/avatar/${response.data.avatar}`
          }
          localStorage.setItem('user', JSON.stringify(response.data))
          this.$store.dispatch('setUser', response.data)
          this.loading = false
          this.$router.push({ name: 'Explore' }).catch(() => {})
        } catch (err) {
          this.loading = false
          let errorMessage
          if (err.response.data.error === 'account doesnt exist') {
            errorMessage = 'No account exists with the given credentials'
          } else {
            errorMessage = 'An error has happened signing in'
          }
          this.$store.dispatch('alert', errorMessage)
        }
    },
    async signUp() {
      if(this.$refs.form.validate()) {
        try {
          this.loading = true
          const response = await UserService.signUp({
            username: this.usernameSignUp,
            email: this.emailSignUp,
            password: this.passwordSignUp
          })
          localStorage.setItem('user', JSON.stringify(response.data))
          this.$store.dispatch('setUser', response.data)
          this.loading = false
          this.$store.dispatch('alert', 'Account created successfully')
          this.$router.push({ name: 'Explore' }).catch(() => {})
        } catch (err) {
          this.loading = false
          if (err.response && err.response.data === 'Username already in use') {
            this.$store.dispatch('alert', 'Username already in use.')
          } else if (err.response && err.response.data === 'Email already in use') {
            this.$store.dispatch('alert', 'Email already in use.')
          } else {
            this.$store.dispatch('alert', 'An error has happened during sign up')
          }
        }
      }
    }
  }
}
</script>

<style>

</style>