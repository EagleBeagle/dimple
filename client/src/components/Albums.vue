<template>
<v-container class="px-8 album-container" fluid>
    <v-row justify="start">
      <div class="display-1 my-2">Your Albums</div>
    </v-row>
    <v-row justify="start">
      <v-col xs="4" lg="3" v-for="album in albums" :key="album.id">
        <v-card rounded hover @click="open(album.id)" style="height: 100px">
          <v-container fill-height>
          <v-card-text class="text-h5 blue--text text--darken-3 justify-center">{{ album.name }}</v-card-text>

          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  
</template>

<script>
import AlbumService from '@/services/AlbumService'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      albums: []
    }
  },
  mounted() {
    this.getAlbums()
  },
  computed: {
    ...mapState([
      'newAlbum'
    ])
  },
  watch: {
    newAlbum() {
      this.albums.push(this.newAlbum)
    }
  },
  methods: {
    open(id) {
      this.$router.push({ name: 'Photos', params: { album: id } })
    },
    async getAlbums() {
      try {
        const data = (await AlbumService.get()).data
        this.albums = data
      } catch (err) {
        console.log(err)
        this.$store.dispatch('alert', 'An error has happened while fetching your albums')
      }
    }
  }
}
</script>

<style>
.album-container {
  padding: 0px;
}


</style>