<template>
  <v-container class="px-8 photo-container" fluid>
    <v-row v-if="images" justify="start" align="start" class="align-self-start">
      <v-col v-if="album" xs="12" sm="12" md="12" lg="12" class="pb-0" style="text-align: left">
        <div class="text-h3 font-weight-regular mt-2 mb-0">{{ album.name }}</div>
      </v-col>
      <v-col v-if="album" xs="12" sm="12" md="12" lg="12" class="py-0 my-0" style="text-align: left">
        <div class="text-h5 my-0 font-weight-light">{{ album.description }}</div>
      </v-col>
      <v-col v-if="!album && $route.params.album === 'all'" xs="12" sm="12" md="12" lg="12" style="text-align: left">
        <div class="text-h3 font-weight-regular my-2">All Photos</div>
      </v-col>
      <v-col v-if="!album && $route.params.album === 'favourites'" xs="12" sm="12" md="12" lg="12" style="text-align: left">
        <div class="text-h3 font-weight-regular my-2">Favourites</div>
      </v-col>
      <v-col v-if="!album && $route.params.album === 'trash'" xs="12" sm="12" md="12" lg="12" style="text-align: left">
        <div class="text-h3 font-weight-regular my-2">Trash</div>
      </v-col>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <photo-grid
      v-if="renderPhotoGrid"
      :images="images"
      :interactionDisabled="interactionDisabled"
      @delete="deleteImage" 
      @reachedBottom="infiniteHandler"
      @imageClicked="imageClicked" />
    <photo-deletion-dialog :show="showDeletionDialog" :deleteAll="shouldDeleteAll" @close="deletionDialogClosed" @confirm="deletionConfirmed" @deleteAll="deleteAll"/>
  </v-container>
</template>

<script>
import PhotoGrid from '@/components/PhotoGrid'
import PhotoDeletionDialog from '@/components/PhotoDeletionDialog'
import ImageService from '@/services/ImageService'
import AlbumService from '@/services/AlbumService'
import { Cloudinary } from 'cloudinary-core'
import { mapState } from 'vuex'
export default {
  components: {
    PhotoGrid,
    PhotoDeletionDialog
  },
  data () {
    return {
      album: null,
      renderPhotoGrid: true,
      images: [],
      cloudinaryCore: null,
      lastDate: null,
      newestDate: null,
      showDeletionDialog: false,
      photoToDelete: null,
      shouldDeleteAll: false,
      interactionDisabled: false
    }
  },
  async mounted() {
    console.log('Uj')
    this.cloudinaryCore = new Cloudinary({ cloud_name: process.env.VUE_APP_CLOUDINARY_NAME })
    await this.getAlbum()
  },
  computed: {
    ...mapState([
      'user',
      'sort',
      'visibility',
      'updateShownPhotos',
      'newPhotoId',
      'triggerRestoreAll',
      'triggerDeleteAll'
    ])
  },
  watch: {
    '$route.params': async function () {
      this.images = []
      await this.getAlbum()
      const images = await this.getImages({})
      this.rerenderPhotoGrid()
      if (images) {
        this.images.push(...images)
      }
    },
    async sort() {
      this.images = []
      this.images = await this.getImages({})
      this.rerenderPhotoGrid()
      window.scrollTo(0, 0)
    },
    async visibility() {
      this.images = []
      this.images = await this.getImages({})
      this.rerenderPhotoGrid()
      window.scrollTo(0, 0)
    },
    async updateShownPhotos() {
      this.images = []
      this.images = await this.getImages({})
      this.rerenderPhotoGrid()
    },
    async newPhotoId() {
      try {
        const newPhoto = (await ImageService.get({ id: this.newPhotoId })).data
        newPhoto.url = `https://res.cloudinary.com/dimplecloud/image/upload/${newPhoto.fk_username}/${newPhoto.id}`
        const albumIds = (await AlbumService.get({ imageId: newPhoto.id })).data.map(album => album.id)
        albumIds.push('all')
        if (albumIds.includes(this.$route.params.album)) {
          if (this.sort.order === 'desc') {
            this.images.unshift(newPhoto)
          }
        }
      } catch (err) {
        console.log(err)
      }
    },
    async triggerRestoreAll() {
      const imagesToRestore = [...this.images]
      this.interactionDisabled = true
      for (let i = 0; i < imagesToRestore.length; i++) {
        try {
          await ImageService.removeFromTrash(imagesToRestore[i].id)
          this.images = this.images.filter(image => image.id !== imagesToRestore[i].id )
        } catch (err) {
          console.log(err)
          this.$store.dispatch('alert', 'An error happened while restoring a photo')
        }
      }
      this.interactionDisabled = false
      this.$store.dispatch('alert', 'All photos restored')
    },
    async triggerDeleteAll() {
      this.shouldDeleteAll = true
      this.showDeletionDialog = true
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
        this.$router.push({ name: 'Error' }).catch(() => {})
      }
    },
    async getImages(filter) { // itt kell majd lekezelni a hiányzó képeket
      console.log('GETIMAGES HíVVVVVVVVAAAAAAAAAAAAAAA')
      try {
        filter.sort = `${this.sort.category}:${this.sort.order}`
        if (this.visibility === 'public') {
          filter.visibility = true
        } else if (this.visibility === 'private') {
          filter.visibility = false
        }
        if (this.$route.params.album === 'all') {
          filter.user = this.$route.params.username
          const images = (await ImageService.get(filter)).data.map((image) => {
            image.url = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/${image.fk_username}/${image.id}`
            return image
          })
          if (images.length) {
            this.lastDate = images[images.length - 1].createdAt
          }
          return images
        } else if (this.$route.params.album === 'favourites') {
          filter.user = this.$route.params.username
          filter.favourites = true
          const images = (await ImageService.get(filter)).data.map((image) => {
            image.url = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/${image.fk_username}/${image.id}`
            return image
          })
          if (images.length) {
            this.lastDate = images[images.length - 1].createdAt
          }
          return images
        } else if (this.$route.params.album === 'trash') {
          filter.trash = true
          const images = (await ImageService.get(filter)).data.map((image) => {
            image.url = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/${image.fk_username}/${image.id}`
            return image
          })
          if (images.length) {
            this.lastDate = images[images.length - 1].createdAt
          }
          return images
        } else {
          filter.album = this.$route.params.album
          console.log('itt')
          const images = (await ImageService.get(filter)).data.map((image) => {
            image.url = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/${image.fk_username}/${image.id}`
            return image
          })
          console.log(images)
          if (images.length) {
            this.lastDate = images[images.length - 1].createdAt
          }
          return images
        }
      } catch (err) {
        console.log(err)
        this.$router.push({ name: 'Error' }).catch(() => {})
      }
    },
    async imageClicked(image) { // ezt kell még todozni
      if (!image.trashed) {
        this.$router.push({
          name: 'Photo',
          params: {
            username: image.fk_username,
            id: image.id
          },
          query: {
            in: this.$route.params.album,
            visibility: this.visibility,
            page: 'user',
            order: `${this.sort.category}:${this.sort.order}`
          }
        })
      } else {
        try {
          await ImageService.removeFromTrash(image.id)
          if (this.$route.params.album === 'trash') {
            this.images = this.images.filter(imageToFilter => imageToFilter.id !== image.id )
          }
          this.$store.dispatch('alert', 'Photo restored')
        } catch (err) {
          console.log(err)
          this.$store.dispatch('alert', 'An error happened while restoring the photo')
        }
      }
    },
    async deleteImage(photoToDelete) {
      try {
        if (!photoToDelete.trashed) {
          await ImageService.putToTrash(photoToDelete.id)
          this.$store.dispatch('alert', 'Photo has been moved to trash.')
          this.images = this.images.filter(image => image.id !== photoToDelete.id)
        } else {
          this.showDeletionDialog = true
          this.photoToDelete = photoToDelete
        }
      } catch(err) {
        console.log(err)
        this.$store.dispatch('alert', 'An error occured during deletion.')
      }
    },


    async deletionConfirmed() {
      try {
        this.interactionDisabled = true
        await ImageService.delete(this.photoToDelete.id)
        this.$store.dispatch('alert', 'Photo deleted successfully.')
        this.images = this.images.filter(image => image.id !== this.photoToDelete.id)
        this.photoToDelete = null
        this.interactionDisabled = false
      } catch(err) {
        console.log(err)
        this.photoToDelete = null
        this.interactionDisabled = false
        this.$store.dispatch('alert', 'An error occured during deletion.')
      }
    },
    
    async deleteAll() {
      try {
        const imagesToDelete = [...this.images]
        this.interactionDisabled = true
        for (let i = 0; i < imagesToDelete.length; i++) {
          await ImageService.delete(imagesToDelete[i].id)
          this.images = this.images.filter(image => image.id !== imagesToDelete[i].id)
        }
        
        this.interactionDisabled = false
        this.$store.dispatch('alert', 'All photos deleted')
        this.shouldDeleteAll = false
      } catch(err) {
        console.log(err)
        this.interactionDisabled = false
        this.shouldDeleteAll = false
        this.$store.dispatch('alert', 'An error occured during deletion.')
      }
    },

    deletionDialogClosed() {
      this.showDeletionDialog = false
      this.shouldDeleteAll = false
    },

    async infiniteHandler($state) {
      let images
      if (this.lastDate) {
        if (this.sort.order === 'desc') {
          images = await this.getImages({
            to: this.lastDate
          })
        } else {
          images = await this.getImages({
            from: this.lastDate
          })
        }
      } else {
        images = await this.getImages({})
      }
      if (images && images.length) {
        this.images.push(...images)
        $state.loaded()
      } else {
        $state.complete()
      }
    },
    rerenderPhotoGrid() {
      this.renderPhotoGrid = false;
      this.$nextTick(() => {
        this.renderPhotoGrid = true;
      });
    }
  }
}
</script>

<style>

</style>