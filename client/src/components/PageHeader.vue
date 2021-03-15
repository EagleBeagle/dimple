<template>
<div>
  <v-app-bar fixed dense clipped-left clipped-right app flat outlined color="blue">
    <v-toolbar-title class="font-weight-bold display-1 white--text">dimple</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <div class="mr-2 white--text text-h5">{{ user.username }}</div>
      <v-btn class="white--text" depressed tile color="blue" light @click="signOut()">
        Sign out
      </v-btn>
    </v-toolbar-items>
  </v-app-bar> 
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'user'
    ])
  },
  methods: {
    signOut() {
      localStorage.removeItem('user')
      this.$store.dispatch('unsetUser')
      this.$router.push({ name: 'Authentication' })
    }
  }
}
</script>

<style>
</style>