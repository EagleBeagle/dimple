<template>
  <v-container class="px-8 photo-container" fluid>
    <v-row v-if="images.length !== 0" justify="start" align="start" class="align-self-start">
      <v-col v-if="album" xs="12" sm="12" md="12" lg="12" class="pb-0" style="text-align: left">
        <div class="display-1 mt-2 mb-0">{{ album.name }}</div>
      </v-col>
      <v-col v-if="album" xs="12" sm="12" md="12" lg="12" class="py-0 my-0" style="text-align: left">
        <div class="text-subtitle-1 my-0">{{ album.description }}</div>
      </v-col>
      <v-col v-if="!album" xs="12" sm="12" md="12" lg="12" style="text-align: left">
        <div class="display-1 my-2">All Photos</div>
      </v-col>
    </v-row>
    <photo-grid :images="images" />
  </v-container>
</template>

<script>
import PhotoGrid from '@/components/PhotoGrid'
import ImageService from '@/services/ImageService'
import AlbumService from '@/services/AlbumService'
export default {
  components: {
    PhotoGrid
  },
  data () {
    return {
      album: null,
      images: []
    }
  },
  async mounted() {
    await this.getAlbum()
    await this.getImages()
  },
  watch: {
    '$route.params.album': async function () {
      this.images = []
      await this.getAlbum()
      await this.getImages()
    }
  },
  methods: {
    async getAlbum() {
      if (this.$route.params.album && this.$route.params.album !== 'all') {
        try {
          const response = await AlbumService.get(this.$route.params.album)
          this.album = response.data
        } catch (err) {
          console.log(err)
        }
      } else {
        this.album = null
      }
    },
    async getImages() {
      try {
        if (this.$route.params.album === 'all') {
          this.images = (await ImageService.get()).data // itt tudjuk megoldani hogy url-t használjunk
        } else {
          this.images = (await ImageService.get({
            album: this.$route.params.album
          })).data
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style>

</style>