<template>
  <v-app-bar fixed min-height="64px" clipped-left flat color="blue">
    <v-toolbar-title 
      class="font-weight-bold text-h3 white--text mr-5" 
      style="cursor: pointer" 
      @click="$router.push({ name: 'Photos', params: { album: 'all' } }).catch(err => {})">dimple
    </v-toolbar-title>
    <v-toolbar-items>
      <v-btn class="white--text" 
        depressed tile color="blue" 
        light 
        @click="$router.push({ name: 'Photos', params: { album: 'all' } }).catch(err => {})">
        You
      </v-btn>
      <v-btn class="white--text" depressed tile color="blue" light>
        Explore
      </v-btn>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-container fill-height>
        <div class="mr-2 white--text text-h5">{{ user.username }}</div>
      </v-container>
      <v-btn class="white--text" depressed tile color="blue" light @click="signOut()">
        Sign out
      </v-btn>
    </v-toolbar-items>
  </v-app-bar> 
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