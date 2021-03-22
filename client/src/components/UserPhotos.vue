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
    <photo-grid :images="images" @delete="deleteImage" />
  </v-container>
</template>

<script>
import PhotoGrid from '@/components/PhotoGrid'
import ImageService from '@/services/ImageService'
import AlbumService from '@/services/AlbumService'
import { Cloudinary } from 'cloudinary-core';
import { mapState } from 'vuex'
export default {
  components: {
    PhotoGrid
  },
  data () {
    return {
      album: null,
      images: [],
      cloudinaryCore: null
    }
  },
  async mounted() {
    this.cloudinaryCore = new Cloudinary({ cloud_name: process.env.VUE_APP_CLOUDINARY_NAME });
    await this.getAlbum()
    await this.getImages()
  },
  computed: {
    ...mapState([
      'user'
    ])
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
    async getImages() { // itt kell majd lekezelni a hiányzó képeket
      try {
        if (this.$route.params.album === 'all') {
          this.images = (await ImageService.get()).data.map((image) => {
            image.url = this.cloudinaryCore.url(`${this.user.username}/${image.id}`)
            console.log(image.url)
            return image
          })
          console.log(this.images)
        } else {
          this.images = (await ImageService.get({
            album: this.$route.params.album
          })).data.map((image) => {
            image.url = this.cloudinaryCore.url(`${this.user.username}/${image.id}`)
            return image
          }) 
        }
      } catch (err) {
        console.log(err)
      }
    },
    async deleteImage(id) {
      try {
        await ImageService.delete(id)
        this.images = this.images.filter(image => image.id !== id)
        this.$store.dispatch('alert', 'Photo deleted successfully.')
      } catch(err) {
        console.log(err)
        this.$store.dispatch('alert', 'An error occured during deletion.')
      }
    }
  }
}
</script>

<style>

</style>