<template>
<v-container class="px-8 album-container" fluid>
    <v-row justify="start">
      <v-col class="pb-0" style="text-align: left">
        <div class="display-1 my-2">Your Albums</div>
      </v-col>
    </v-row>
    <v-row justify="start">
      <v-col cols="12" sm="6" md="4" lg="3" class="pa-4" v-for="album in albums" :key="album.id">
        <v-card tile @click="open(album.id)" height="100%">
          <div class="overlay-div white--text text-h4 font-weight-medium">
              {{ album.name }}
            </div>
          <v-container fill-height v-if="album.images.length === 0" class="pa-0">
            <div class="vignette"></div>
            <v-card-text class="pa-0">
              <v-img aspect-ratio="1">
                <v-icon size="100px" style="top: 33%">
                  mdi-image-multiple
                </v-icon>
              </v-img>
            </v-card-text>
          </v-container>
          <v-card-text v-else-if="album.images.length === 2 || album.images.length === 3" class="pa-0 thumbnail">
          <div class="vignette"></div>
          <v-container class="py-0">
            <v-row>
              <v-col cols="6" v-for="(image, index) in album.images" :key="index" class="pa-0">
                <v-img aspect-ratio="1" :src="image.url">
                  
                </v-img>
              </v-col>
              <v-col cols="6" class="pa-0">
                <v-img aspect-ratio="1">
                  <v-icon size="100px" style="top: 18%">
                    mdi-image-multiple
                  </v-icon>
                </v-img>
              </v-col>
            </v-row>
          </v-container>
          </v-card-text>
          <v-card-text v-else-if="album.images.length === 4" class="pa-0 thumbnail">
          <div class="vignette"></div>
          <v-container class="py-0">
            <v-row>
              <v-col cols="6" v-for="(image, index) in album.images" :key="index" class="pa-0">
                <v-img aspect-ratio="1" :src="image.url">
                  
                </v-img>
              </v-col>
            </v-row>
          </v-container>
          </v-card-text>
        </v-card>
        <!-- <v-card-title class="text-h5 blue--text text--darken-3 justify-center">
          {{ album.name }}
        </v-card-title> -->
      </v-col>
    </v-row>
  </v-container>
  
</template>

<script>
import AlbumService from '@/services/AlbumService'
import { mapState } from 'vuex'
import { Cloudinary } from 'cloudinary-core';
export default {
  data () {
    return {
      albums: []
    }
  },
  mounted() {
    this.cloudinaryCore = new Cloudinary({ cloud_name: process.env.VUE_APP_CLOUDINARY_NAME });
    this.getAlbums()
  },
  computed: {
    ...mapState([
      'newAlbum',
      'user'
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
        this.albums = (await AlbumService.get()).data.map(album => {
          album.images = album.images.map(image => {
            console.log(image)
            image.url = this.cloudinaryCore.url(`${this.user.username}/${image.id}`)
            return image
          })
          return album
        })
        console.log(this.albums)
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
  left: 20px;
  bottom: 20px;
  z-index: 2;
  max-width: 94%;
  word-wrap: break-word;
}

.album {
  width: 200px;
  height: 200px;
}
</style>