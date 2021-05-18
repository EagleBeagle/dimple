<template>
  <v-container class="pa-0 px-10" fill-height fluid>
    <v-row justify="center">
      <v-col cols="12" class="pa-0">
        <v-container class="pa-0">
          <v-row justify="center">
            <v-col cols="12" class="text-h1 blue--text">
              404
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" class="pa-0" :class="$vuetify.breakpoint.smAndUp ? 'text-h2' : 'text-h4'" >
              Page not found
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" class="pa-0 font-weight-light" :class="$vuetify.breakpoint.smAndUp ? 'text-h6' : 'text-subtitle-1'">
              Verify that you're trying to reach a valid page, or try again later.
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" class="pa-0 font-weight-light" :class="$vuetify.breakpoint.smAndUp ? 'text-h6' : 'text-subtitle-2'">
              Here's a link to
              <span class="blue--text" style="cursor: pointer" @click="$router.push({ name: 'Photos', params: { username: $store.state.user.username, album: 'all' } }).catch(() => {})">your page</span>.
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

</script>

<style>

</style>
