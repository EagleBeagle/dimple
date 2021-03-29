<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" align="center">
        <v-card class="elevation-12" style="max-width: 800px">
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-row>
                <v-col cols="12" sm="8">
                  <v-card-text class="mt-12">
                    <h1 class="text-center display-2 blue--text">
                      Sign in to Dimple
                    </h1>
                    <h4 class="text-center mlt-4">
                      via email, or any of the following services
                    </h4>
                    <div class="text-center" mt-4 style="margin-top: 10px">
                      <v-btn class="mx-2" fab color="black" outlined>
                        <v-icon>mdi-facebook</v-icon>
                      </v-btn>
                      <v-btn class="mx-2" fab color="black" outlined>
                        <v-icon>mdi-google</v-icon>
                      </v-btn>
                      <v-btn class="mx-2" fab color="black" outlined>
                        <v-icon>mdi-linkedin</v-icon>
                      </v-btn>
                    </div>
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
                    <h3 class="text-center mt-3">
                      Forgot your password?
                    </h3>
                  </v-card-text>
                  <div class="text-center mt-3">
                    <v-btn rounded color="blue" dark @click="signIn()">
                      Sign In
                    </v-btn>
                  </div>
                </v-col>
                <v-col cols="12" sm="4" class="blue">
                  <v-card-text class="white--text mt-12">
                    <h1 class="text-center display-1">Hi!</h1>
                    <h5 class="text-center">Save your photos to Dimple and access them from any device, anywhere</h5>
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
                    <h1 class="text-center display-1">
                      Welcome Back!
                    </h1>
                    <h5 class="text-center">
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
                  <v-card-text class="mt-12">
                    <h1 class="text-center display-2 blue--text">
                      Create Account
                    </h1>
                    <div class="text-center" mt-4 style="margin-top: 10px">
                      <v-btn class="mx-2" fab color="black" outlined>
                        <v-icon>mdi-facebook</v-icon>
                      </v-btn>
                      <v-btn class="mx-2" fab color="black" outlined>
                        <v-icon>mdi-google</v-icon>
                      </v-btn>
                      <v-btn class="mx-2" fab color="black" outlined>
                        <v-icon>mdi-linkedin</v-icon>
                      </v-btn>
                    </div>
                    <h4 class="text-center mt-4">
                      via email, or any of the following services
                    </h4>
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
                  <div class="text-center mt-n5">
                    <v-btn rounded color="blue" class="white--text" :disabled="!valid" @click="signUp()">
                      Sign Up
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
    usernameRules: [
        v => !!v || "The username can't stay empty.",
        v => (v && v.length > 3) || 'The username has to be at least 4 characters long.',
        v => (v && v.length < 26) || "The username can't be longer than 25 characters.",
        v => /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(v) || 'This username format is not allowed.'
      ],
    emailRules: [
      v => !!v || "Email can't stay empty.",
      v => (v && v.length < 26) || "Email can't be longer than 60 characters.",
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
          const response = await UserService.signIn({
            email: this.emailSignIn,
            password: this.passwordSignIn
          })
          localStorage.setItem('user', JSON.stringify(response.data))
          this.$store.dispatch('setUser', response.data)
          this.$router.push({ name: 'Photos', params: { album: 'all' } })
        } catch (err) {
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
          const response = await UserService.signUp({
            username: this.usernameSignUp,
            email: this.emailSignUp,
            password: this.passwordSignUp
          })
          localStorage.setItem('user', JSON.stringify(response.data))
          this.$store.dispatch('setUser', response.data)
          this.$router.push({ name: 'Photos', params: { album: 'all' } })
        } catch (err) {
          console.log(err)
          this.$store.dispatch('alert', 'An error has happened during sign up')
        }
      }
    }
  }
}
</script>

<style>

</style>