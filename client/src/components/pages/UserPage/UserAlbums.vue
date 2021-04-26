<template>
<v-container class="px-8 album-container" fluid>
    <v-row justify="start">
      <v-col class style="text-align: left">
        <div v-if="$route.params.username === user.username" class="text-h3 font-weight-regular my-2">Your Albums</div>
        <div v-else class="text-h3 font-weight-regular my-2">{{ $route.params.username }}'s albums</div>
      </v-col>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <v-row v-if="loading">
      <v-col cols="12" class="grey--text text-h4 mt-10">
        <v-progress-circular
          size="50"
          width="5"
          color="blue"
          indeterminate
        ></v-progress-circular>
      </v-col>
    </v-row>
    <v-row v-else-if="albums && albums.length > 0" class="pa-0">
      <album-grid
        v-if="renderAlbumGrid"
        :albums="albums"
        @addPhotos="addPhotos"
        @share="share"
        @open="openAlbum"
        @download="downloadAlbum"
        @delete="deleteAlbum" />
    </v-row>
    <v-row v-else-if="albums && albums.length === 0">
      <v-col cols="12" class="grey--text text-h4 mt-10">
        <span v-if="user.username === $route.params.username">You don't have any albums yet</span>
        <span v-else>No albums to show</span>
      </v-col>
    </v-row>
    <share-dialog 
      v-if="showShareDialog"
      :show="showShareDialog"
      :album="albumToShare"
      @close="showShareDialog = false" />
    <add-photos-to-album-dialog
        v-if="showAddPhotosDialog" 
        :show="showAddPhotosDialog" 
        :album="albumToAddPhotos" 
        @updatePhotos="updatePhotos"
        @close="showAddPhotosDialog = false" />
    <delete-confirm-dialog 
      v-if="showDeletionDialog"
      :show="showDeletionDialog" 
      type="album"
      @close="deletionCancelled" 
      @confirm="deletionConfirmed" />
  </v-container>
</template>

<script>
import AlbumService from '@/services/AlbumService'
import AlbumGrid from '@/components/common/AlbumGrid'
import ShareDialog from '@/components/common/ShareDialog'
import AddPhotosToAlbumDialog from '@/components/pages/UserPage/AddPhotosToAlbumDialog'
import DeleteConfirmDialog from '@/components/pages/UserPage/DeleteConfirmDialog'
import { mapState } from 'vuex'
export default {
  components: {
    AlbumGrid,
    ShareDialog,
    AddPhotosToAlbumDialog,
    DeleteConfirmDialog
  },
  data () {
    return {
      albums: [],
      albumToShare: null,
      albumToAddPhotos: null,
      albumToDelete: null,
      renderAlbumGrid: true,
      showShareDialog: false,
      showAddPhotosDialog: false,
      showDeletionDialog: false,
      loading: false
    }
  },
  mounted() {
    this.getAlbums()
  },
  computed: {
    ...mapState([
      'newAlbum',
      'user',
      'visibility'
    ])
  },
  watch: {
    newAlbum() {
      this.albums.push(this.newAlbum)
    },
    async visibility() {
      await this.getAlbums()
      this.rerenderAlbumGrid()
      window.scrollTo(0, 0)
    }
  },
  methods: {
    openAlbum(album) {
      this.$router.push({ name: 'Photos', params: { username: album.fk_username,  album: album.id } }).catch(() => {})
    },
    async getAlbums() {
      try {
        let filter = {
          user: this.$route.params.username
        }
        if (this.visibility === 'public') {
          filter.visibility = true
        } else if (this.visibility === 'private') {
          filter.visibility = false
        }
        this.loading = true
        this.albums = (await AlbumService.get(filter)).data.map(album => {
          album.images = album.images.map(image => {
            image.url = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/${image.fk_username}/${image.id}`
            return image
          })
          return album
        })
        this.loading = false
      } catch (err) {
        this.loading = false
        this.$store.dispatch('alert', 'An error has happened while fetching your albums')
      }
    },
    async downloadAlbum(id) {
      try {
        const url = (await AlbumService.download(id)).data
        window.open(url)
      } catch (err) {
        this.$store.dispatch('alert', 'An error has occured while preparing your download')
      }
    },
    async deleteAlbum(id) {
      this.albumToDelete = id
      this.showDeletionDialog = true
    },
    async deletionConfirmed() {
      try {
        await AlbumService.delete(this.albumToDelete)
        this.albums = this.albums.filter(album => album.id !== this.albumToDelete)
        this.showDeletionDialog = false
        this.$store.dispatch('alert', 'Album deleted successfully.')
        this.albumToDelete = null
      } catch (err) {
        this.albumToDelete = null
        this.showDeletionDialog = false
        this.$store.dispatch('alert', 'An error occured during deletion')
      }
    },
    deletionCancelled() {
      this.showDeletionDialog = false
      this.albumToDelete = null
    },
    rerenderAlbumGrid() {
      this.renderAlbumGrid = false;
      this.$nextTick(() => {
        this.renderAlbumGrid = true;
      });
    },
    addPhotos(album) {
      this.albumToAddPhotos = album
      this.showAddPhotosDialog = true
    },
    share(album) {
      this.albumToShare = album
      this.showShareDialog = true 
    },
    updatePhotos(selectedPhotos) {
      selectedPhotos.forEach(selectedPhoto => {
        this.albumToAddPhotos.images.push({ url: `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/${this.albumToAddPhotos.fk_username}/${selectedPhoto}` })
        this.albumToAddPhotos.imageCount++
      })
    }
  }
}
</script>

<style>
.album-container {
  padding: 0px;
}

.vignette {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  box-shadow: 0 -70px 70px -40px rgb(43, 43, 43) inset;
}

.overlay-div {
  position: absolute;
  width: 100%;
  height: 100%;
}

.overlay-container {
  position: absolute;
  bottom: 0px;
  z-index: 2;
  word-wrap: break-word;
}

.album-name {
  text-align: start;
  text-shadow: 0px 0px 15px rgb(43, 43, 43);
}

.album-image-count {
  text-align: start;
}

.album-setting-icon {
  cursor: pointer;
}

</style>