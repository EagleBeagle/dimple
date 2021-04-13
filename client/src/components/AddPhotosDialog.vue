<template>
<v-dialog
  v-if="album"
  v-model="dialog"
  :width="$vuetify.breakpoint.smAndUp && images.length > 0 ? '50%' : $vuetify.breakpoint.smAndUp ? '30%' : '100%'"
  scrollable>
  <v-card>
    <v-card-title class="headline">
      Add photos to {{ album.name }}
    </v-card-title>
    <v-card-text class="album-card pa-0">
      <v-container style="upload-container" fluid>
        <v-row justify="start">
          <v-col cols="4" sm="6" md="4" lg="3" class="pa-2" v-for="(image, index) in images" :key="index">
            <v-img 
              :src="image.url" 
              v-bind:class="[image.selected ? 'selected' : 'not-selected', 'photo']"
              aspect-ratio="1"
              style="cursor: pointer"
              @click="select(index)">
            </v-img>
          </v-col>
          <infinite-loading @infinite="infiniteHandler">
            <span slot="no-more"></span>
            <span slot="no-results"></span>
            <span slot="spinner"></span>
          </infinite-loading>
        </v-row>
      </v-container>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        depressed
        class="blue--text"
        large
        :disabled="selectedCount < 1"
        @click="save()">
        SAVE
      </v-btn>
      <v-btn
        depressed
        large
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
import ImageService from '@/services/ImageService'
import AlbumService from '@/services/AlbumService'
export default {
  props: [
    'show',
    'album'
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
      images: [],
      albumImages: [],
      lastDate: null,
      selectedCount: 0,
      reachedBottom: false
    }
  },
  async mounted () {
    this.cloudinaryCore = new Cloudinary({ cloud_name: process.env.VUE_APP_CLOUDINARY_NAME });
    this.albumImages = await this.getAlbumImages()
    this.images = await this.getImages({})
  },
  methods: {
    async getImages(filter) {
      try {
        filter.sort = `date:desc`
        filter.user = this.$route.params.username
        const images = (await ImageService.get(filter)).data.filter((image) => {
          if (!this.albumImages.includes(image.id)) {
            image.url = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/${image.fk_username}/${image.id}`
            return image
          }
        })
        if (images.length) {
          this.lastDate = images[images.length - 1].createdAt
        }
        return images
      } catch (err) {
        console.log(err)
        this.$store.dispatch('alert', 'Failed to fetch photos')
        this.close()
      }
    },
    async getAlbumImages() {
      try {
        const images = (await ImageService.get({ album: this.album.id })).data.map(image => image.id)
        return images
      } catch (err) {
        console.log(err)
        this.$store.dispatch('alert', 'Failed to fetch photos of your album')
        this.close()
      }
    },
    async save() {
      try {
        const selectedImages = []
        this.images.forEach(image => {
          if (image.selected) {
            selectedImages.push(image.id)
          }
        })
        await AlbumService.update(this.album.id, { images: selectedImages })
        this.$store.dispatch('alert', 'Photos added successfully')
        this.$emit('updatePhotos', selectedImages)
        this.close()
      } catch (err) {
        console.log(err)
        this.$store.dispatch('alert', 'Album update unsuccessful')
        this.close()
      }
    },
    select(id) {
      console.log(this.images[id])
      if (this.images[id].selected) {
        this.images[id].selected = false
        this.selectedCount--
      } else {
        this.images[id].selected = true
        this.selectedCount++
      }
      this.images = [...this.images]
    },
    async infiniteHandler($state) {
      let images
      if (this.lastDate) {
          images = await this.getImages({
            to: this.lastDate
          })
      } else {
        images = await this.getImages({})
      }
      if (images.length) {
        this.images.push(...images)
        $state.loaded()
      } else {
        $state.complete()
        this.reachedBottom = true
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
  min-height: 20vh;
  max-height: 51vh;
}

.album-card::-webkit-scrollbar {display:none;}

.hovered {
  background-color: rgb(197, 199, 201);
}

.album {
  cursor: pointer;
}
</style>