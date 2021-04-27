<template>
<v-dialog
  v-if="albums"
  v-model="dialog"
  :width="$vuetify.breakpoint.mdAndUp ? '50%' : '100%'"
  scrollable>
  <v-card class="album-container">
    <v-card-title :class="$vuetify.breakpoint.smAndUp ? 'headline' : 'text-body-1 font-weight-bold'">
      <span v-if="albums.length > 0">This photo is in {{ `${albums.length} ${albums.length === 1 ? 'album' : 'albums'}` }}</span>
      <span v-else :class="$vuetify.breakpoint.smAndUp ? 'headline' : 'text-body-2 font-weight-bold'" >This photo is not in any albums yet</span>
      <v-spacer></v-spacer>
      <v-icon @click="close()">
        mdi-close
      </v-icon>
    </v-card-title>
    <v-card-text class="album-grid" v-if="albums.length > 0">
      <album-grid v-if="albums" :albums="albums" :inDialog="true" @open="openAlbum" />
    </v-card-text>
    <v-card-text v-else>
      <v-container fill-height>
        <v-row>
          <v-col cols="12">
            <v-btn
              depressed
              large
              color="blue"
              class="white--text"
              @click="addPhotoToAlbumsDialog = true">
              Add to albums
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions v-if="albums.length > 0">
      <v-spacer></v-spacer>
      <v-btn
        depressed
        large
        color="blue"
        class="white--text"
        @click="addPhotoToAlbumsDialog = true">
        Edit albums
      </v-btn>
    </v-card-actions>
    <add-photo-to-albums-dialog
        v-if="addPhotoToAlbumsDialog" 
        :show="addPhotoToAlbumsDialog" 
        :image="image" 
        :selectedAlbums="albums"
        @updateAlbums="updateAlbums"
        @close="addPhotoToAlbumsDialog = false" />
  </v-card>
  </v-dialog>
</template>

<script>
import AlbumService from '@/services/AlbumService'
import AlbumGrid from '@/components/common/AlbumGrid'
import AddPhotoToAlbumsDialog from '@/components/pages/PhotoPage/AddPhotoToAlbumsDialog'
export default {
  components: { AlbumGrid, AddPhotoToAlbumsDialog },
  props: [
    'show',
    'image'
  ],
  computed: {
    dialog: {
      get () {
        return this.show
      },
      set () {
        this.$emit('close')
      }
    }
  },
  data () {
    return {
      albums: null,
      addPhotoToAlbumsDialog: false
    }
  },
  async mounted() {
    await this.getAlbums()
  },
  methods: {
    async getAlbums() {
      try {
        this.albums = (await AlbumService.get({ imageId: this.image.id })).data.map(album => {
          album.images = album.images.map(image => {
            image.url = image.url = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/w_400/${image.fk_username}/${image.id}`
            return image
          })
          return album
        })
      } catch (err) {
        this.$store.dispatch('alert', 'An error happened while fetching your albums')
        this.close()
      }
    },
    openAlbum(album) {
      this.$router.push({ name: 'Photos', params: { username: album.fk_username,  album: album.id } }).catch(() => {})
    },
    updateAlbums(selectedAlbums) {
      this.albums = selectedAlbums.map(selectedAlbum => {
        selectedAlbum.images.push(this.image)
        selectedAlbum.imageCount++
        return selectedAlbum
      })
    },
    close() {
      this.dialog = false
    }
  }
}
</script>

<style scoped>
.album-container {
  min-height: 20vh;
  max-height: 63vh;
}
.album-grid::-webkit-scrollbar {display:none;}
</style>