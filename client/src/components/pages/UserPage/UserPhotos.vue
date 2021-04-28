<template>
  <v-container class="px-4 px-sm-8 photo-container" fluid>
    <v-row v-if="images" justify="start" align="start" class="align-self-start">
      <v-col v-if="album" cols="12" sm="12" md="12" lg="12" class="pb-0" style="text-align: left">
        <div v-if="album.name" class="font-weight-regular mt-2 mb-0" :class="$vuetify.breakpoint.mdAndUp ? 'text-h3' : 'text-h4'">{{ album.name }}</div>
        <div v-else class="pa-0 ma-0">
          <div class="font-weight-regular mt-2 mb-0" :class="$vuetify.breakpoint.mdAndUp ? 'text-h3' : 'text-h4'">Who's this person?</div>
        </div>
      </v-col>
      <v-col v-if="album" cols="12" sm="6" class="py-0 my-0" style="text-align: left; word-wrap: break-word">
        <div v-if="album.name && album.type !== 'people'" class="my-0 font-weight-light" :class="$vuetify.breakpoint.mdAndUp ? 'text-h5' : 'text-body-1'">{{ album.description }}</div>
        <div v-else-if="album.type === 'people' && $route.params.username === user.username">
          <v-container class="pa-0 pl-5 pa-sm-0">
            <v-row justify="start">
              <v-col cols="1" class="pa-0" style="text-align: center" align-self="center">
                <v-icon color="blue" @click="showPersonNameDialog = true">
                  mdi-pencil
                </v-icon>
              </v-col>
              <v-col cols="11" class="pa-0" align-self="center">
                <span
                  class="my-0 font-weight-light"
                  :class="$vuetify.breakpoint.mdAndUp ? 'text-h5' : 'text-body-1'"
                  style="cursor: pointer"
                  @click="showPersonNameDialog = true">
                  <span v-if="!album.name">Click here to give a name</span>
                  <span v-else>Change name</span>
                </span>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-col>
      <v-spacer v-if="album"></v-spacer>
      <v-col 
        v-if="album && $route.params.username === user.username" 
        cols="12" sm="6" 
        :style="$vuetify.breakpoint.smAndUp ? 'text-align: end' : 'text-align: center'" 
        class="py-0 pt-2 pt-sm-0 text-h5 font-weight-light" 
        align-self="end">
        <span class="pt-2" v-if="!$vuetify.breakpoint.smOnly" :class="$vuetify.breakpoint.mdAndUp ? 'text-h5' : 'text-body-1'">Viewing privacy:</span>
          <v-menu top offset-y nudge-top="10">
            <template v-slot:activator="{ on, attrs }">
              <span style="cursor: pointer" v-bind="attrs" v-on="on">
                <span class="blue--text ml-3" :class="$vuetify.breakpoint.mdAndUp ? 'text-h5' : 'text-body-1'">{{ album.visibility ? 'Public' : 'Private' }}</span>
                <v-icon color="blue">
                  mdi-chevron-up
                </v-icon>
              </span>
            </template>
            <v-list>
              <v-list-item @click="updateAlbumVisibility(true)">
                <v-list-item-title :class="album.visibility ? 'font-weight-bold' : null">Public</v-list-item-title>
              </v-list-item>
              <v-list-item @click="updateAlbumVisibility(false)">
                <v-list-item-title :class="!album.visibility ? 'font-weight-bold' : null">Private</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
      </v-col>
      <v-col v-if="!album && $route.params.album === 'all'" xs="12" sm="12" md="12" lg="12" style="text-align: left">
        <div v-if="$route.params.username === user.username" class="text-h3 font-weight-regular my-2">All Photos</div>
        <div v-else class="text-h3 font-weight-regular my-2">{{ $route.params.username }}'s Photos</div>
      </v-col>
      <v-col v-if="!album && $route.params.album === 'favourites'" xs="12" sm="12" md="12" lg="12" style="text-align: left">
        <div v-if="$route.params.username === user.username" class="text-h3 font-weight-regular my-2">Favourites</div>
        <div v-else class="text-h3 font-weight-regular my-2">{{ $route.params.username }}'s Favourites</div>
      </v-col>
      <v-col v-if="!album && $route.params.album === 'trash'" xs="12" sm="12" md="12" lg="12" style="text-align: left">
        <div class="text-h3 font-weight-regular my-2">Trash</div>
      </v-col>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <v-row v-if="images && images.length === 0 && !loading">
      <v-col cols="12" class="grey--text text-h4 mt-10">
        <span v-if="user.username === $route.params.username">No photos</span>
        <span v-else>No photos to show</span>
      </v-col>
    </v-row>
    <photo-grid
      v-if="renderPhotoGrid"
      :images="images"
      :interactionDisabled="interactionDisabled"
      @delete="deleteImage" 
      @reachedBottom="infiniteHandler"
      @imageClicked="imageClicked" />
    <delete-confirm-dialog 
      :show="showDeletionDialog" 
      :deleteAll="shouldDeleteAll" 
      type="photo"
      @close="deletionDialogClosed" 
      @confirm="deletionConfirmed" 
      @deleteAll="deleteAll" />
    <person-name-dialog 
      v-if="showPersonNameDialog"
      :show="showPersonNameDialog" 
      @close="showPersonNameDialog = false" 
      @confirm="namePerson" />
  </v-container>
</template>

<script>
import PhotoGrid from '@/components/common/PhotoGrid'
import DeleteConfirmDialog from '@/components/pages/UserPage/DeleteConfirmDialog'
import ImageService from '@/services/ImageService'
import AlbumService from '@/services/AlbumService'
import PersonNameDialog from '@/components/pages/UserPage/PersonNameDialog'
import { mapState } from 'vuex'
export default {
  components: {
    PhotoGrid,
    DeleteConfirmDialog,
    PersonNameDialog
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
      interactionDisabled: false,
      loading: false,
      showPersonNameDialog: false
    }
  },
  async mounted() {
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
      window.scrollTo(0, 0)
      this.loading = true
      await this.getAlbum()
      this.images = await this.getImages({ limit: 20 })
      this.rerenderPhotoGrid()
      this.loading = false
    },
    async sort() {
      this.loading = true
      this.images = await this.getImages({ limit: 20 })
      this.rerenderPhotoGrid()
      window.scrollTo(0, 0)
      this.loading = false
    },
    async visibility() {
      this.loading = true
      this.images = await this.getImages({ limit: 20 })
      this.rerenderPhotoGrid()
      window.scrollTo(0, 0)
      this.loading = false
    },
    async updateShownPhotos() {
      this.loading = true
      this.images = await this.getImages({ limit: 20 })
      this.rerenderPhotoGrid()
      this.loading = false
    },
    async newPhotoId() {
      try {
        const newPhoto = (await ImageService.get({ id: this.newPhotoId })).data
        newPhoto.url = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/w_600/${newPhoto.fk_username}/${newPhoto.id}`
        const albumIds = (await AlbumService.get({ imageId: newPhoto.id })).data.map(album => album.id)
        albumIds.push('all')
        if (albumIds.includes(this.$route.params.album)) {
          if (this.sort.order === 'desc') {
            this.images = [newPhoto, ...this.images]
          } else {
            this.images = [...this.images, newPhoto]
          }
        }
      } catch (err) {
        return
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
        this.$store.dispatch('alert', 'Cannot retrieve album information.')
      }
    },
    async getImages(filter) { // itt kell majd lekezelni a hiányzó képeket
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
            image.url = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/w_600/${image.fk_username}/${image.id}`
            return image
          })
          if (images.length) {
            this.lastDate = images[images.length - 1].createdAt
            const query = JSON.parse(JSON.stringify(this.$route.query))
            query.last = this.lastDate
          }
          return images
        } else if (this.$route.params.album === 'favourites') {
          filter.user = this.$route.params.username
          filter.favourites = true
          const images = (await ImageService.get(filter)).data.map((image) => {
            image.url = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/w_600/${image.fk_username}/${image.id}`
            return image
          })
          if (images.length) {
            this.lastDate = images[images.length - 1].createdAt
          }
          return images
        } else if (this.$route.params.album === 'trash') {
          filter.trash = true
          const images = (await ImageService.get(filter)).data.map((image) => {
            image.url = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/w_600/${image.fk_username}/${image.id}`
            return image
          })
          if (images.length) {
            this.lastDate = images[images.length - 1].createdAt
          }
          return images
        } else {
          filter.album = this.$route.params.album
          const images = (await ImageService.get(filter)).data.map((image) => {
            image.url = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/w_600/${image.fk_username}/${image.id}`
            return image
          })
          if (images.length) {
            this.lastDate = images[images.length - 1].createdAt
          }
          return images
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.$router.push({ name: 'ContentNotFoundError' }).catch(() => {})
        } else {
          this.$router.push({ name: 'GenericError' }).catch(() => {})
        }
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
            user: this.$route.params.username,
            visibility: this.visibility,
            page: 'user',
            order: `${this.sort.category}:${this.sort.order}`
          }
        }).catch(() => {})
      } else {
        try {
          await ImageService.removeFromTrash(image.id)
          if (this.$route.params.album === 'trash') {
            this.images = this.images.filter(imageToFilter => imageToFilter.id !== image.id )
          }
          this.$store.dispatch('alert', 'Photo restored')
        } catch (err) {
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
        this.$store.dispatch('alert', 'An error occured during deletion.')
      }
    },


    async deletionConfirmed() {
      try {
        this.interactionDisabled = true
        this.showDeletionDialog = false
        await ImageService.delete(this.photoToDelete.id)
        this.$store.dispatch('alert', 'Photo deleted successfully.')
        this.$store.dispatch('updateShownUser')
        this.images = this.images.filter(image => image.id !== this.photoToDelete.id)
        this.photoToDelete = null
        this.interactionDisabled = false
      } catch(err) {
        this.photoToDelete = null
        this.interactionDisabled = false
        this.showDeletionDialog = false
        this.$store.dispatch('alert', 'An error occured during deletion.')
      }
    },
    
    async deleteAll() {
      try {
        const imagesToDelete = [...this.images]
        this.interactionDisabled = true
        this.showDeletionDialog = false
        for (let i = 0; i < imagesToDelete.length; i++) {
          await ImageService.delete(imagesToDelete[i].id)
          this.images = this.images.filter(image => image.id !== imagesToDelete[i].id)
        }
        
        this.interactionDisabled = false
        this.$store.dispatch('alert', 'All photos deleted')
        this.$store.dispatch('updateShownUser')
        this.shouldDeleteAll = false
      } catch(err) {
        this.showDeletionDialog = false
        this.interactionDisabled = false
        this.shouldDeleteAll = false
        this.$store.dispatch('alert', 'An error occured during deletion.')
      }
    },

    deletionDialogClosed() {
      this.showDeletionDialog = false
      this.shouldDeleteAll = false
    },
    async updateAlbumVisibility(visibility) {
      if (visibility !== this.album.visibility) {
        try {
          await AlbumService.update(this.album.id, { visibility })
          this.album.visibility = visibility
        } catch (err) {
          this.$store.dispatch('alert', 'An error occured while changing viewing privacy')
        }
      }
    },
    async namePerson(name) {
      try {
        await AlbumService.update(this.album.id, { name })
        this.album.name = name
        this.$store.dispatch('alert', 'Person named successfully.')
      } catch {
        this.$store.dispatch('alert', 'Failed to name person.')
      }
    },
    async infiniteHandler($state) {
      try {
        let images
        if (this.lastDate) {
          if (this.sort.order === 'desc') {
            images = await this.getImages({
              to: this.lastDate,
              limit: 20
            })
          } else {
            images = await this.getImages({
              from: this.lastDate,
              limit: 20
            })
          }
        } else {
          this.loading = true
          images = await this.getImages({ limit: 20 })
          const last = this.$route.query.last
          if (last) {
            const lastDate = new Date(last)
            const createdDates = images.map(image => new Date(image.createdAt).toISOString())
            if (!createdDates.includes(lastDate.toISOString())) {
              if (this.sort.order === 'desc') {
                const imagesToLast = await this.getImages({
                  from: new Date(lastDate.setMilliseconds(lastDate.getMilliseconds() - 1)).toISOString()
                })
                if (imagesToLast) {
                  images = imagesToLast
                }
              } else {
                const imagesToLast = await this.getImages({
                  to: new Date(lastDate.setMilliseconds(lastDate.getMilliseconds() + 1)).toISOString()
                })
                if (imagesToLast) {
                  images = imagesToLast
                }
              }
              setTimeout(() => {
              window.scrollTo(0, document.body.scrollHeight)
              }, 1)
            }
          }
        }
        if (images && images.length) {
          this.images.push(...images)
          $state.loaded()
        } else {
          $state.complete()
        }
        this.loading = false
      } catch (err) {
        this.$store.dispatch('alert', 'Failed to fetch photos')
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