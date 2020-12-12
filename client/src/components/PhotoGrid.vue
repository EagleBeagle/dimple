<template>
  <v-container class="px-8 photo-container" fill-height fluid>
    <v-row v-if="imageData.length !== 0" justify="start" align="start" class="align-self-start">
      <v-col v-if="album" xs="12" sm="12" md="12" lg="12" class="pb-0" style="text-align: left">
        <div class="display-1 mt-2 mb-0">{{ album.name }}</div>
      </v-col>
      <v-col v-if="album" xs="12" sm="12" md="12" lg="12" class="py-0 my-0" style="text-align: left">
        <div class="text-subtitle-1 my-0">{{ album.description }}</div>
      </v-col>
      <v-col v-if="!album" xs="12" sm="12" md="12" lg="12" style="text-align: left">
        <div class="display-1 my-2">All Photos</div>
      </v-col>
      <v-col xs="10" sm="6" md="4" lg="3" v-for="image in imageData" :key="image.id">
        <kinesis-container>
          <kinesis-element :strength="10" type="depth">
              <v-card elevation="20" @click="enlarge(image)">
              <v-img v-if="image.src" :src="image.src"></v-img>

              </v-card>
          </kinesis-element>
        </kinesis-container>
      </v-col>
    </v-row>
    <v-row v-if="imageData.length === 0 && this.loading" justify="center" class="align-self-center">
      <v-col xs="12" sm="12" md="12" lg="12">
        <div class="grey--text text--accent-3 text-h4">Loading your photos...</div>
      </v-col>
      <v-col>
        <v-progress-circular
        indeterminate
        color="primary"
      ></v-progress-circular>
      </v-col>
    </v-row>
  <image-dialog :show="showDialog" :image="enlargedImage" v-on:close="showDialog = false"/>
  </v-container>
</template>

<script>
import ImageService from '@/services/ImageService'
import AlbumService from '@/services/AlbumService'
import ImageDialog from '@/components/ImageDialog'
export default {
  components: {
    ImageDialog
  },
  data () {
    return {
      album: null,
      imageData: [],
      baseUrl: 'http://localhost:8080/image/',
      loading: false,
      showDialog: false,
      enlargedImage: null
    }
  },
  async mounted() {
    await this.getAlbum()
    await this.getImages()
  },
  watch: {
    '$route.params.album': async function () {
      this.imageData = []
      await this.getAlbum()
      await this.getImages()
    }
  },
  methods: {
    async getAlbum() {
      if (this.$route.params.album && this.$route.params.album !== 'all') {
        try {
          const response = await AlbumService.get(this.$route.params.album)
          this.album = response.data
        } catch (err) {
          console.log(err)
        }
      } else {
        this.album = null
      }
    },
    async getImages() {
      this.loading = true
      try {
        let imageData
        if (this.$route.params.album === 'all') {
          imageData = (await ImageService.get()).data
        } else {
          imageData = (await ImageService.get({
            album: this.$route.params.album
          })).data
        }
        for (const image of imageData) {
          const arraybuffer = (await ImageService.getPrivateImage(image.id)).data
          const bytes = new Uint8Array(arraybuffer)
          const blob = new Blob([bytes], { type: `image/${image.id.split('.')[1]}` })
          const url = URL.createObjectURL(blob)
          image.src = url
        }
        this.imageData = Object.assign({}, imageData)
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    async getPrivateImage(id) {
      const image = (await ImageService.getPrivateImage(id)).data
      return image
    },
    enlarge(image) {
      this.enlargedImage = image
      this.showDialog = true
    }
  }
}
</script>

<style>
.photo-container {
  padding-top: 0px;
}
</style>