<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" align="center">
        <v-card class="elevation-12" style="max-width: 400px;">
          <v-card-text class="mt-0">
            <h1 class="text-center text-h4 font-weight-regular mb-2 blue--text">
              Reset your password
            </h1>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              autocomplete="off">
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="New Password"
                name="Password"
                style="min-height: 128px"
                class="password-field py-8"
                prepend-icon="mdi-lock"
                type="password"
                color="blue"/>
            </v-form>
            <v-btn depressed color="blue" class="white--text" :disabled="!valid" width="125px" @click="resetPassword()">
              <span v-if="!loading">CONFIRM</span>
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
      password: null,
      loading: false,
      valid: false,
      passwordRules: [
        v => !!v || "Password can't stay empty.",
        v => (v && v.length > 7) || 'The password has to be at least 8 characters long.',
        v => (v && v.length < 33) || "The password can't exceed 32 characters.",
        v => /^(?!\$).*/igm.test(v) || 'E-mail must be valid.'
      ]
    }
  },
  methods: {
    async resetPassword() {
      try {
        this.loading = true
        await UserService.resetPassword(this.$route.params.resetPasswordToken, this.password)
        this.loading = false
        this.$store.dispatch('alert', 'Password reset successful')
        this.$router.push({ name: 'Authentication' }).catch(() => {})
      } catch (err) {
        this.loading = false
        this.$store.dispatch('alert', 'Password reset failed')
        this.$router.push({ name: 'Authentication' }).catch(() => {})
      }
    }
  }
}
</script>

<style scoped>
.password-field {
  width: 300px;
}
</style>