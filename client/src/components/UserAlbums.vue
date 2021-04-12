<template>
<v-container class="px-8 album-container" fluid>
    <v-row justify="start">
      <v-col class="pb-0" style="text-align: left">
        <div v-if="$route.params.username === user.username" class="text-h3 font-weight-regular my-2">Your Albums</div>
        <div v-else class="text-h3 font-weight-regular my-2">{{ $route.params.username }}'s albums</div>
      </v-col>
    </v-row>
    <v-row class="pa-0">
      <album-grid
        v-if="renderAlbumGrid"
        :albums="albums"
        @addPhotos="addPhotos"
        @share="share"
        @open="openAlbum"
        @download="downloadAlbum"
        @delete="deleteAlbum" />
    </v-row>
    <share-dialog 
      v-if="showShareDialog"
      :show="showShareDialog"
      :album="albumToShare"
      @close="showShareDialog = false" />
    <add-photos-dialog
        v-if="showAddPhotosDialog" 
        :show="showAddPhotosDialog" 
        :album="albumToAddPhotos" 
        @updatePhotos="updatePhotos"
        @close="showAddPhotosDialog = false" />
  </v-container>
  
</template>

<script>
import AlbumService from '@/services/AlbumService'
import AlbumGrid from '@/components/AlbumGrid'
import ShareDialog from '@/components/ShareDialog'
import AddPhotosDialog from '@/components/AddPhotosDialog'
import { mapState } from 'vuex'
import { Cloudinary } from 'cloudinary-core';
export default {
  components: {
    AlbumGrid,
    ShareDialog,
    AddPhotosDialog
  },
  data () {
    return {
      albums: [],
      albumToShare: null,
      albumToAddPhotos: null,
      renderAlbumGrid: true,
      showShareDialog: false,
      showAddPhotosDialog: false
    }
  },
  mounted() {
    this.cloudinaryCore = new Cloudinary({ cloud_name: process.env.VUE_APP_CLOUDINARY_NAME });
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
      this.$router.push({ name: 'Photos', params: { username: album.fk_username,  album: album.id } })
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
        this.albums = (await AlbumService.get(filter)).data.map(album => {
          album.images = album.images.map(image => {
            image.url = this.cloudinaryCore.url(`${image.fk_username}/${image.id}`)
            return image
          })
          return album
        })
      } catch (err) {
        console.log(err)
        this.$store.dispatch('alert', 'An error has happened while fetching your albums')
      }
    },
    async downloadAlbum(id) {
      try {
        const url = (await AlbumService.download(id)).data
        window.open(url)
      } catch (err) {
        console.log(err)
        this.$store.dispatch('alert', 'An error has occured while preparing your download')
      }
    },
    async deleteAlbum(id) {
      try {
        await AlbumService.delete(id)
        this.albums = this.albums.filter(album => album.id !== id)
        this.$store.dispatch('alert', 'Album deleted successfully.')
      } catch (err) {
        console.log(err)
        this.$store.dispatch('alert', 'An error occured during deletion')
      }
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
        if (this.albumToAddPhotos.imageCount < 4) {
          this.albumToAddPhotos.images.push(this.cloudinaryCore.url(`${this.albumToAddPhotos.fk_username}/${selectedPhoto}`))
        }
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