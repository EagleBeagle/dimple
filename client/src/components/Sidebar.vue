<template>
  <v-navigation-drawer app clipped>
    <v-list
        nav
        
      >
        <v-list-item-group
          color="primary"
          mandatory
        >
          <v-list-item @click="goTo('Albums')">
            <v-list-item-icon>
              <v-icon>mdi-image-album</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Albums</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="goTo('Photos', { album: 'all' })">
            <v-list-item-icon>
              <v-icon>mdi-image-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>All Photos</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="$emit('selection-changed', 'favourites')">
            <v-list-item-icon>
              <v-icon>mdi-star</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Favourites</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="$emit('selection-changed', 'trash')">
            <v-list-item-icon>
              <v-icon>mdi-trash-can</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Trash</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    goTo(route, params) {
      if (this.$route.name !== route || (this.$route.name === 'Photos' && this.$route.params.album !== params.album)) {
        this.$router.push({ name: route, params })
      }
    }
  }
}
</script>

<style>

</style>