<template>
<v-dialog
  v-if="albums"
  v-model="dialog"
  :width="$vuetify.breakpoint.smAndUp && albums.length > 0 ? '50%' : $vuetify.breakpoint.smAndUp ? '30%' : '100%'"
  scrollable>
  <v-card class="album-container">
    <v-card-title class="headline">
      <span v-if="albums.length > 0">This photo is in {{ `${albums.length} ${albums.length === 1 ? 'album' : 'albums'}` }}</span>
      <span v-else>This photo is not in any albums yet</span>
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
              @click="addToAlbumsDialog = true">
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
        @click="addToAlbumsDialog = true">
        Edit albums
      </v-btn>
    </v-card-actions>
    <add-to-albums-dialog
        v-if="addToAlbumsDialog" 
        :show="addToAlbumsDialog" 
        :image="image" 
        :selectedAlbums="albums"
        @updateAlbums="updateAlbums"
        @close="addToAlbumsDialog = false" />
  </v-card>
  </v-dialog>
</template>

<script>
import { Cloudinary } from 'cloudinary-core';
import AlbumService from '@/services/AlbumService'
import AlbumGrid from '@/components/AlbumGrid'
import AddToAlbumsDialog from '@/components/AddToAlbumsDialog'
export default {
  components: { AlbumGrid, AddToAlbumsDialog },
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
        this.clearFields()
        this.$emit('close')
      }
    }
  },
  data () {
    return {
      albums: null,
      addToAlbumsDialog: false
    }
  },
  async mounted() {
    this.cloudinaryCore = new Cloudinary({ cloud_name: process.env.VUE_APP_CLOUDINARY_NAME });
    await this.getAlbums()
  },
  methods: {
    async getAlbums() {
      try {
        console.log(this.image.id)
        this.albums = (await AlbumService.get({ imageId: this.image.id })).data.map(album => {
          album.images = album.images.map(image => {
            image.url = this.cloudinaryCore.url(`${image.fk_username}/${image.id}`)
            return image
          })
          return album
        })
      } catch (err) {
        console.log(err)
        this.$store.dispatch('alert', 'An error happened while fetching your albums')
        this.close()
      }
    },
    openAlbum(album) {
      this.$router.push({ name: 'Photos', params: { username: album.fk_username,  album: album.id } })
    },
    updateAlbums(selectedAlbums) {
      this.albums = selectedAlbums.map(selectedAlbum => {
        selectedAlbum.images.push(this.image)
        return selectedAlbum
      })
    },
    close() {
      this.dialog = false
    },
    async clearFields() {
      console.log('lel')
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