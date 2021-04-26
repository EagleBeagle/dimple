<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" align="center">
        <v-card class="elevation-12" style="max-width: 400px">
          <v-card-text class="mt-0">
            <h1 class="text-center text-h4 font-weight-regular mb-2 blue--text">
              Forgot your password?
            </h1>
            <v-form>
              <v-text-field
                v-model="email"
                label="Email"
                name="Email"
                class="email-forgot-field my-5"
                prepend-icon="mdi-email"
                type="text"
                color="blue" />
            </v-form>
            <v-btn depressed color="blue" class="white--text" :disabled="!email.length" width="125px" @click="requestPasswordReset()">
              <span v-if="!loading">Remind me</span>
              <v-progress-circular v-else size="25" indeterminate></v-progress-circular>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UserService from '@/services/UserService'
export default {
  data() {
    return {
      email: '',
      loading: false
    }
  },
  methods: {
    async requestPasswordReset() {
      try {
        this.loading = true
        await UserService.forgotPassword({
          email: this.email
        })
        this.loading = false
        this.$router.push({ name: 'Authentication' }).catch(() => {})
        this.$store.dispatch('alert', 'An email has been sent to you with further details.')
      } catch (err) {
        this.loading = false
        if (err.response.status === 404) {
          this.$store.dispatch('alert', 'No user exists with the given email.')
        } else {
          this.$store.dispatch('alert', 'An error has happened while requesting password reset.')
        }
        this.$router.push({ name: 'Authentication' }).catch(() => {})
      }
    }
  }
}
</script>

<style scoped>
.email-forgot-field {
  width: 300px;
}
</style>
