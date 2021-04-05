<template>
  <v-container class="px-8 photo-container" fluid>
    <v-row v-if="images && images.length !== 0" justify="start" align="start" class="align-self-start">
      <v-col v-if="album" xs="12" sm="12" md="12" lg="12" class="pb-0" style="text-align: left">
        <div class="display-1 mt-2 mb-0">{{ album.name }}</div>
      </v-col>
      <v-col v-if="album" xs="12" sm="12" md="12" lg="12" class="py-0 my-0" style="text-align: left">
        <div class="text-subtitle-1 my-0">{{ album.description }}</div>
      </v-col>
      <v-col v-if="!album && $route.params.album === 'all'" xs="12" sm="12" md="12" lg="12" style="text-align: left">
        <div class="display-1 my-2">All Photos</div>
      </v-col>
      <v-col v-if="!album && $route.params.album === 'favourites'" xs="12" sm="12" md="12" lg="12" style="text-align: left">
        <div class="display-1 my-2">Favourites</div>
      </v-col>
      <v-col v-if="!album && $route.params.album === 'trash'" xs="12" sm="12" md="12" lg="12" style="text-align: left">
        <div class="display-1 my-2">Trash</div>
      </v-col>
    </v-row>
    <photo-grid
      :images="images" 
      @delete="deleteImage" 
      @reachedBottom="infiniteHandler"
      @open="openImage" />
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
      cloudinaryCore: null,
      oldestDate: null,
      newestDate: null
    }
  },
  async mounted() {
    this.cloudinaryCore = new Cloudinary({ cloud_name: process.env.VUE_APP_CLOUDINARY_NAME })
    await this.getAlbum()
    this.images = await this.getImages({ sort: 'date:desc' })
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
      const images = await this.getImages({ sort: 'date:desc' })
      if (images) {
        this.images.push(...images)
      }
    }
  },
  methods: {
    async getAlbum() {
      try {
        if (!['all', 'favourites', 'trash'].includes(this.$route.params.album)) {
          const response = await AlbumService.get({ id: this.$route.params.album })
          this.album = response.data
        } else {
          this.album = null
        }
      } catch (err) {
        console.log(err)
      }
    },
    async getImages(filter) { // itt kell majd lekezelni a hiányzó képeket
      try {
        if (this.$route.params.album === 'all') {
          filter.user = this.user.username
          const images = (await ImageService.get(filter)).data.map((image) => {
            image.url = this.cloudinaryCore.url(`${image.fk_username}/${image.id}`)
            return image
          })
          if (images.length) {
            this.oldestDate = images[images.length - 1].createdAt
          }
          return images
        } else if (this.$route.params.album === 'favourites') {
          filter.user = this.user.username
          filter.favourites = true
          const images = (await ImageService.get(filter)).data.map((image) => {
            image.url = this.cloudinaryCore.url(`${image.fk_username}/${image.id}`)
            return image
          })
          if (images.length) {
            this.oldestDate = images[images.length - 1].createdAt
          }
          return images
        } else if (this.$route.params.album === 'trash') {
          filter.trash = true
          const images = (await ImageService.get(filter)).data.map((image) => {
            image.url = this.cloudinaryCore.url(`${image.fk_username}/${image.id}`)
            return image
          })
          if (images.length) {
            this.oldestDate = images[images.length - 1].createdAt
          }
          return images
        } else {
          filter.album = this.$route.params.album
          const images = (await ImageService.get(filter)).data.map((image) => {
            image.url = this.cloudinaryCore.url(`${image.fk_username}/${image.id}`)
            return image
          })
          if (images.length) {
            this.oldestDate = images[images.length - 1].createdAt
          }
          return images
        }
      } catch (err) {
        console.log(err)
      }
    },
    async openImage(image) { // ezt kell még todozni
      this.$router.push({
        name: 'Photo',
        params: {
          username: image.fk_username,
          id: image.id
        },
        query: {
          in: this.$route.params.album,
          visibility: 'all',
          page: 'user',
          order: 'date:desc'
        }
      })
    },
    async deleteImage(imageToDelete) {
      try {
        if (!imageToDelete.trashed) {
          await ImageService.putToTrash(imageToDelete.id)
          this.$store.dispatch('alert', 'Photo has been moved to trash.')
        } else {
          await ImageService.delete(imageToDelete.id)
          this.$store.dispatch('alert', 'Photo deleted successfully.')
        }
        this.images = this.images.filter(image => image.id !== imageToDelete.id)
      } catch(err) {
        console.log(err)
        this.$store.dispatch('alert', 'An error occured during deletion.')
      }
    },
    async infiniteHandler($state) {
      console.log('handled')
      let images
      if (this.oldestDate) {
        images = await this.getImages({
          to: this.oldestDate,
          sort: 'date:desc'
        })
      } else {
        images = await this.getImages({ sort: 'date:desc' })
      }
      if (images.length) {
        this.images.push(...images)
        $state.loaded()
      } else {
        $state.complete()
      }
    }
  }
}
</script>

<style>

</style>