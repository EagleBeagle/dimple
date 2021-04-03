<template>
<v-dialog
  v-model="dialog"
  :width="$vuetify.breakpoint.smAndUp ? '20%' : '100%'"
  scrollable>
  <v-card>
    <v-card-title class="headline">
      Add to albums
    </v-card-title>
    <v-card-text class="album-card pa-0">
      <v-container class="px-4 pt-0">
        <span v-for="(album, index) in albums" :key="index">
          <v-hover v-slot="{ hover }">
            <v-row justify="start" @click="selected(album)" class="album" :class="hover ? 'hovered' : null">
              <v-col cols="2">
                <v-img v-if="album.images.length > 0" :src="album.images[0].url" aspect-ratio="1"></v-img>
                <v-img v-else aspect-ratio="1" style="border: 1px solid grey">
                  <v-icon small :style="$vuetify.breakpoint.lgAndUp ? 'top: 10%' : null">
                    mdi-image-multiple
                  </v-icon>
                </v-img>
              </v-col>
              <v-col cols="8" class="text-body-1 pa-0" align-self="center" style="text-align: start">
                {{ album.name }}
              </v-col>
              <v-col cols="1" class="pr-0" align-self="center">
                <v-icon v-if="album.selected" color="blue">
                  mdi-checkbox-marked-circle
                </v-icon>
                <v-icon v-else>
                  mdi-checkbox-blank-circle-outline
                </v-icon>
              </v-col>
            </v-row>
          </v-hover>
        </span>
      </v-container>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        depressed
        class="blue--text"
        @click="save()">
        SAVE
      </v-btn>
      <v-btn
        depressed
        class="red--text"
        @click="close()">
        CANCEL
      </v-btn>
    </v-card-actions>
  </v-card>
  </v-dialog>
</template>

<script>
import { Cloudinary } from 'cloudinary-core';
import { mapState } from 'vuex'
import AlbumService from '@/services/AlbumService'
import ImageService from '@/services/ImageService'
export default {
  props: [
    'show',
    'image',
    'selectedAlbums',
    'inUploadDialog'
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
    },
    ...mapState([
      'user'
    ])
  },
  data () {
    return {
      albums: [],
    }
  },
  async mounted () {
    this.cloudinaryCore = new Cloudinary({ cloud_name: process.env.VUE_APP_CLOUDINARY_NAME });
    await this.getAlbums()
    console.log(this.albums)
  },
  methods: {
    async getAlbums() {
      try {
        this.albums = (await AlbumService.get({ user: this.user.username })).data.map(album => {
          album.images = album.images.map(image => {
            image.url = this.cloudinaryCore.url(`${image.fk_username}/${image.id}`)
            return image
          })
          this.selectedAlbums.forEach(selectedAlbum => {
            if (selectedAlbum.name === album.name) {
              album.selected = true
            }
          })
          return album
        })
        console.log(this.albums)
      } catch (err) {
        console.log(err)
        this.$store.dispatch('alert', 'An error happened while fetching your albums')
        this.close()
      }
    },
    selected(album) {
      if (!album.selected) {
        album.selected = true
      } else {
        album.selected = false
      }
      this.albums = [...this.albums]
    },
    async save() {
      try {
        const selectedAlbums = []
        this.albums.forEach(album => {
          if (album.selected) {
            selectedAlbums.push(album.id)
          }
        })
        if (!this.inUploadDialog) {
          await ImageService.update(this.image.id, {
            albums: selectedAlbums
          })
          this.$store.dispatch('alert', 'Albums updated successfully')
        }
        this.$emit('updateAlbums', this.albums.filter(album => selectedAlbums.includes(album.id)))
        this.close()
      } catch (err) {
        console.log(err)
        this.$store.dispatch('alert', 'Album update unsuccessful')
        this.close()
      }
    },
    close() {
    this.dialog = false
    },
    async clearFields() {
      
    }
  }
}
</script>

<style scoped>
.album-card {
  max-height: 25vh;
}

.album-card::-webkit-scrollbar {display:none;}

.hovered {
  background-color: rgb(197, 199, 201);
}

.album {
  cursor: pointer;
}
</style>