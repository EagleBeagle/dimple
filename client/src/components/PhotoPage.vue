<template>
  <div class="photo-page">
    <v-container
      fluid 
      class="photo-background pt-0 pb-0"
      :class="{
            'photo-background-lg': $vuetify.breakpoint.lgAndUp,
            'photo-background-md': $vuetify.breakpoint.mdOnly,
            'photo-background-sm': $vuetify.breakpoint.smOnly,
            'photo-background-xs': $vuetify.breakpoint.xsOnly}">
      <v-row justify="end">
        <v-col
          cols="2" sm="2" align-self="center" 
          style="text-align: start; cursor: pointer"
          v-if="goBackParams"
          @click="backToStream()">
          <span style="color: white">
          <v-icon color="white">
            mdi-arrow-left
          </v-icon>
          Back to photostream
          </span>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="2" sm="1" style="text-align: end">
          <v-icon large color="white" @click="expand = !expand">
            mdi-arrow-expand
          </v-icon>
        </v-col>
      </v-row>
      <v-row justify="space-between">
        <v-col cols="2" sm="1" class="pa-0" align-self="center" style="text-align: start">
          <v-icon
            size="70px" 
            color="white" 
            v-show="leftImages.length !== 0"
            @click="goLeft()">
            mdi-chevron-left
          </v-icon>
        </v-col>
        <v-col cols="8" sm="10" class="pa-0">
          <v-img
            v-if="image"
            :key="image.id"
            contain
            :src="image.url" 
            :height="
              $vuetify.breakpoint.lgAndUp ? '65vh' : 
              $vuetify.breakpoint.mdOnly ? '65vh' : 
              $vuetify.breakpoint.smOnly ? '54vh' : '45vh'" 
            class="photo">
          </v-img>
        </v-col>
        <v-col cols="2" sm="1" class="pa-0" align-self="center" style="text-align: end">
          <v-icon 
            size="70px" 
            color="white"
            v-show="rightImages.length !== 0"
            class="font-weight-thin"
             @click="goRight()">
            mdi-chevron-right
          </v-icon>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-container
          class="pt-6 photo-rail"
          :class="{
            'photo-rail-lg': $vuetify.breakpoint.lgAndUp,
            'photo-rail-md': $vuetify.breakpoint.mdOnly,
            'photo-rail-sm': $vuetify.breakpoint.smOnly,
            'photo-rail-xs': $vuetify.breakpoint.xsOnly}">
          <v-row justify="center">
            <v-col v-if="leftImages.length === 0" cols="2" sm="1" class="pa-0">
              <v-img v-if="image" height="40px" width="40px" aspect-ratio="1" class="thumbnail"></v-img>
            </v-col>
            <v-col v-if="leftImages.length < 2" cols="2" sm="1" class="pa-0">
              <v-img v-if="image" height="40px" width="40px" aspect-ratio="1" class="thumbnail"></v-img>
            </v-col>
            <v-col cols="2" sm="1" class="pa-0" v-for="(image, index) in leftImages" :key="index">
              <v-img v-if="image" :src="image.url" height="40px" width="40px" aspect-ratio="1" class="thumbnail thumbnail-loaded" @click="imageFromThumbnail(index, 'left')"></v-img>
            </v-col>
            <v-col cols="2" sm="1" class="pa-0">
            <v-img v-if="image" :src="image.url" height="40px" width="40px" aspect-ratio="1" class="thumbnail thumbnail-current"></v-img>
            </v-col>
            <v-col cols="2" sm="1" class="pa-0" v-for="(image, index) in rightImages" :key="index + 2">
              <v-img v-if="image" :src="image.url" height="40px" width="40px" aspect-ratio="1" class="thumbnail thumbnail-loaded" @click="imageFromThumbnail(index, 'right')"></v-img>
            </v-col>
            <v-col v-if="rightImages.length < 2" cols="2" sm="1" class="pa-0">
              <v-img v-if="image" height="40px" width="40px" aspect-ratio="1" class="thumbnail"></v-img>
            </v-col>
            <v-col v-if="rightImages.length === 0" cols="2" sm="1" class="pa-0">
              <v-img v-if="image" height="40px" width="40px" aspect-ratio="1" class="thumbnail"></v-img>
            </v-col>
          </v-row>
        </v-container>
        <v-container 
          fluid 
          class="pa-0 pt-6 settings-container"
          :class="{
            'settings-container-lg': $vuetify.breakpoint.lgAndUp,
            'settings-container-md': $vuetify.breakpoint.mdOnly,
            'settings-container-sm': $vuetify.breakpoint.smOnly,
            'settings-container-xs': $vuetify.breakpoint.xsOnly}">
          <v-row justify="center" align-content="center">
            <v-col cols="3" sm="4">
              <v-icon large :color="$vuetify.breakpoint.xsOnly ? 'blue' : 'white'" @click="showShareDialog = true">
                mdi-share
              </v-icon>
              <share-dialog v-if="showShareDialog" :show="showShareDialog" :image="this.image" @close="showShareDialog = false"></share-dialog>
            </v-col>
            <v-col cols="3" sm="4">
              <v-icon large :color="$vuetify.breakpoint.xsOnly ? 'blue' : 'white'" @click="downloadImage">
                mdi-download
              </v-icon>
            </v-col>
            <v-col cols="3" sm="4">
              <v-icon large :color="$vuetify.breakpoint.xsOnly ? 'blue' : 'white'" @click="deleteImage">
                mdi-delete
              </v-icon>
            </v-col>
          </v-row>
          <v-divider></v-divider>
        </v-container>
      </v-row>
      <div v-if="expand" class="expanded-photo-div" tabindex="0">
        <v-icon x-large class="close-expand" color="white" @click="expand = !expand">
          mdi-close
        </v-icon>
        <v-img v-if="image" contain height="100%" :src="image.url"></v-img>
      </div>
    </v-container>
    <v-container class="mt-12 mt-sm-1" v-if="image">
      <v-row justify="center">
        <v-col cols="12" sm="6" xl="7" class="pa-0">
          <v-container class="pa-0 pr-xl-6">
            <v-row justify="center" justify-sm="end">
              <v-col cols="4" sm="3" md="3" lg="2" xl="2" class="pl-xl-16 pr-xl-0">
                <v-img v-if="image" :src="image.url" height="80px" width="80px" aspect-ratio="1" class="avatar"></v-img>
              </v-col>
              <v-col cols="8" sm="6" md="7" lg="5" xl="4" align-self="center">
                <v-container class="pa-0">
                  <v-row justify="start">
                    <v-col cols="7" class="text-h6 pa-0" style="text-align: start">
                      Biacsi Zoltán
                    </v-col>
                  </v-row>
                  <v-row justify="start">
                    <v-col cols="9" class="text-body-2 pa-0 blue--text" style="text-align: start">
                      Uploaded on
                      <span>{{ new Date(image.createdAt).toUTCString().split(', ')[1].split(' ').slice(0, 3).join().replace(',', ' ').replace(',', ' ') }}</span>
                    </v-col>
                  </v-row>
                </v-container>
              </v-col>
            </v-row>
            <v-divider v-if="$vuetify.breakpoint.xsOnly"></v-divider>
          </v-container>
        </v-col>
        <v-col cols="12" sm="6" xl="5" align-self="center" class="pa-0">
          <v-container class="pa-0 pr-xl-16">
            <v-row justify="center" justify-sm="start">
              <v-col cols="12" align-self="center">
                <v-container class="pa-0" style="text-align: start">
                  <v-row justify="center">
                    <v-col cols="5" sm="4" xl="2" align-self="center" class="pa-0 text-subtitle-1 blue--text">
                      10
                    </v-col>
                    <v-col cols="5" sm="4" xl="9" align-self="center" class="pa-0 text-subtitle-1 blue--text">
                      5
                    </v-col>
                  </v-row>
                  <v-row justify="center">
                    <v-col cols="5" sm="4" xl="2" align-self="center" class="pa-0 text-body-2">
                      Faves
                    </v-col>
                    <v-col cols="5" sm="4" xl="9" align-self="center" class="pa-0 text-body-2">
                      Comments
                    </v-col>
                  </v-row>
                  <v-row justify="start">
                  </v-row>
                </v-container>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
    <v-divider v-if="$vuetify.breakpoint.xsOnly"></v-divider>
    <v-divider v-if="$vuetify.breakpoint.smAndUp" style="margin-left: 25%; margin-right: 25%;"></v-divider>
    <v-container class="privacy-container" v-if="image">
      <v-row justify="center">
        <v-col cols="12" sm="4" xl="2" align-self="start" class="pa-0 text-body-1">
          <v-icon class="mr-1" v-if="image.visibility">
            mdi-lock-open-variant-outline
          </v-icon>
          <v-icon class="mr-1" v-else>
            mdi-lock-outline
          </v-icon>
          <span class="pt-2">Viewing privacy:</span>
          <span class="blue--text ml-3">{{ image.visibility ? 'Public' : 'Private' }}</span>
          <v-icon color="blue">
            mdi-chevron-up
          </v-icon>
        </v-col>
      </v-row>
    </v-container>
    <v-divider v-if="$vuetify.breakpoint.xsOnly"></v-divider>
    <v-divider v-if="$vuetify.breakpoint.smAndUp" style="margin-left: 25%; margin-right: 25%;"></v-divider>
    <v-container class="pa-0 mt-5">
      <comment-container :image="image" @writting="switchWrittingComment" />
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ImageService from '@/services/ImageService'
import { Cloudinary } from 'cloudinary-core';
import ShareDialog from '@/components/ShareDialog'
import CommentContainer from '@/components/CommentContainer'
export default {
  components: {
    ShareDialog,
    CommentContainer
  },
  data () {
    return {
      image: null,
      expand: false,
      leftImages: [],
      rightImages: [],
      showShareDialog: false,
      writtingComment: false,
      goBackParams: null
    }
  },
  computed: {
    ...mapState([
      'user'
    ])
  },
  watch: {
    expand() {
      if (this.expand) {
        console.log('adddd')
        document.addEventListener('keyup', this.escPressed)
      } else {
        console.log('remoooove')
        document.removeEventListener('keyup', this.escPressed)
      }
    },
    '$route.params.id': async function() {
      await this.getImage()
      await this.getNeighbouringImages()
    }
  },
  async mounted() {
    this.cloudinaryCore = new Cloudinary({ cloud_name: process.env.VUE_APP_CLOUDINARY_NAME })
    document.addEventListener('keyup', this.arrowsPressed)
    await this.getImage()
    await this.getNeighbouringImages()
  },
  methods: {
    async getImage() { 
      try {
        const image = (await ImageService.get({ id: this.$route.params.id })).data
        image.url = this.cloudinaryCore.url(`${image.fk_username}/${image.id}`)
        this.image = image
      } catch (err) {
        console.log(err)
        if (err.response.status === 403) {
          this.$router.push({ name: 'Photos', params: { album: 'all'}})
        }
      }
    },
    async getNeighbouringImages() {
      const query = this.$route.query
      if (query.page && 
          query.page === 'user' && 
          query.in && 
          query.visibility && 
          query.order) { // all photos of
        try {
          let leftFilter = {
            limit: 2
          }
          let rightFilter = {
            limit: 2
          }
          if (query.visibility !== 'all') {
            leftFilter.visibility = query.visibility
            rightFilter.visibility = query.visibility
          }
          if (query.in === 'all') {
            leftFilter.user = this.image.fk_username
            rightFilter.user = this.image.fk_username
          }
          if (query.in !== 'all') {
            leftFilter.album = query.in
            rightFilter.album = query.in
          }
          if (query.order === 'date:desc') {
            leftFilter.from = this.image.createdAt
            leftFilter.sort = 'date:asc'
            this.leftImages = (await ImageService.get(leftFilter)).data.reverse().map(image => {
              image.url = this.cloudinaryCore.url(`${image.fk_username}/${image.id}`)
              return image
            })
            rightFilter.to = this.image.createdAt
            rightFilter.sort = 'date:desc'
            this.rightImages = (await ImageService.get(rightFilter)).data.map(image => {
              image.url = this.cloudinaryCore.url(`${image.fk_username}/${image.id}`)
              return image
            })
          } else if (query.order === 'date:asc') { // todo
            console.log('asc todo')
          }
        } catch (err) {
          console.log(err)
        }
      } else { // todo todooo

      }
    },
    async imageFromThumbnail(index, side) {
      try {
        if (side === 'left') {
          this.image = this.leftImages[index]
        } else if (side === 'right') {
          this.image = this.rightImages[index]
        }
        this.$router.push({ name: 'Photo', params: { username: this.image.fk_username, id: this.image.id }, query: this.$route.query })
        await this.getNeighbouringImages()
      } catch (err) {
        console.log(err)
        this.$store.dispatch('alert', 'An error happened while trying to go left')
      }
    },
    async goLeft() {
      if (this.leftImages.length > 0) {
        try {
          this.image = this.leftImages[this.leftImages.length - 1]
          this.$router.push({ name: 'Photo', params: { username: this.image.fk_username, id: this.image.id }, query: this.$route.query })
          await this.getNeighbouringImages()
        } catch (err) {
          console.log(err)
          this.$store.dispatch('alert', 'An error happened while trying to go left')
        }
      }
    },
    async goRight() {
      if (this.rightImages.length > 0) {
        try {
          this.image = this.rightImages[0]
          this.$router.push({ name: 'Photo', params: { username: this.image.fk_username, id: this.image.id }, query: this.$route.query })
          await this.getNeighbouringImages()
        } catch (err) {
          console.log(err)
          this.$store.dispatch('alert', 'An error happened while trying to go left')
        }
      }
    },
    backToStream() {
      console.log('todon')
    },
    async downloadImage() {
      try {
        const image = (await ImageService.download(this.image.url)).data
        console.log(image)
        const url = window.URL.createObjectURL(new Blob([image]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${this.image.id}.png`)
        document.body.appendChild(link)
        link.click()
      } catch (err) {
        console.log(err)
        this.$store.dispatch('alert', 'An error has occured while preparing your download')
      }
    },
    async deleteImage() {
      try {
        await ImageService.delete(this.image.id)
        this.$router.push({ name: 'Photos', params: { album: 'all' } })
        this.$store.dispatch('alert', 'Photo deleted successfully.')
      } catch(err) {
        console.log(err)
        this.$store.dispatch('alert', 'An error occured during deletion.')
      }
    },
    escPressed(event) {
      if (event.key === 'Escape') {
        this.expand = !this.expand
      }
    },
    async arrowsPressed(event) {
      if (!this.writtingComment) {
        if (event.key === 'ArrowLeft' || event.keyCode === 65) {
          await this.goLeft()
        } else if (event.key === 'ArrowRight' || event.keyCode === 68) {
          await this.goRight()
        }
      }
    },
    switchWrittingComment(value) {
      this.writtingComment = value
    }
  },
  destroyed() {
    document.removeEventListener('keyup', this.escPressed)
    document.removeEventListener('keyup', this.arrowsPressed)
  }
}
</script>

<style scoped>
.photo-page {
  height: 100%;
}

.photo-background {
  background-color: rgb(71, 71, 71);
}

.photo-background-lg {
  height: 80vh;
}

.photo-background-md {
  height: 80vh;
}

.photo-background-sm {
  height: 70vh;
}

.photo-background-xs {
  height: 70vh;
}

.expanded-photo-div {
  position: fixed;
  background-color: black;
  top: 0px;
  left: 0px;
  height: 100vh;
  width: 100%;
  z-index: 200;
}

.close-expand {
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 200;
}

.photo-rail {
  position: absolute;
}
.photo-rail-lg {
  width: 38vw;
}
.photo-rail-md {
  width: 60vw;
}
.photo-rail-sm {
  width: 100vw;
}
.photo-rail-xs {
  width: 80vw;
}

.thumbnail {
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);
}

.thumbnail-loaded {
  border: 1px solid #ffffff9c;
  cursor: pointer;
}

.thumbnail-current {
  border: 1px solid #ffffff9c;
}

.settings-container {
  position: absolute;
  right: 10px;
  width: 10vw;
}

.settings-container-lg {
  width: 10vw;
}

.settings-container-md {
  width: 15vw;
}

.settings-container-sm {
  width: 20vw;
}

.settings-container-xs {
  right: 0px;
  width: 100vw;
  margin-top: 83px;
}

.avatar {
  border-radius: 50%;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);
}
</style>
