<template>
  <div v-if="!errorHappening" class="photo-page">
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
          <v-row justify="center" align-content="center" v-if="image">
            <v-col v-if="image.fk_username !== user.username" :cols="image.fk_username === user.username ? 3 : 4" :sm="image.fk_username === user.username ? 3 : 4">
              <v-icon v-if="!image.favouritedByUser" large :color="$vuetify.breakpoint.xsOnly ? 'blue' : 'white'" @click="favourite()">
                mdi-star-outline
              </v-icon>
              <v-icon v-else large :color="$vuetify.breakpoint.xsOnly ? 'blue' : 'white'" @click="unfavourite()">
                mdi-star
              </v-icon>
              <album-dialog v-if="showAlbumDialog" :show="showAlbumDialog" :image="image" @close="showAlbumDialog = false"></album-dialog>
            </v-col>
            <v-col v-if="image.fk_username === user.username" :cols="image.fk_username === user.username ? 3 : 4" :sm="image.fk_username === user.username ? 3 : 4">
              <v-icon large :color="$vuetify.breakpoint.xsOnly ? 'blue' : 'white'" @click="showAlbumDialog = true">
                mdi-image-album
              </v-icon>
              <album-dialog v-if="showAlbumDialog" :show="showAlbumDialog" :image="image" @close="showAlbumDialog = false"></album-dialog>
            </v-col>
            <v-col :cols="image.fk_username === user.username ? 3 : 4" :sm="image.fk_username === user.username ? 3 : 4" v-if="image && image.visibility">
              <v-icon large :color="$vuetify.breakpoint.xsOnly ? 'blue' : 'white'" @click="showShareDialog = true">
                mdi-share
              </v-icon>
              <share-dialog v-if="showShareDialog" :show="showShareDialog" :image="image" @close="showShareDialog = false"></share-dialog>
            </v-col>
            <v-col :cols="image.fk_username === user.username ? 3 : 4" :sm="image.fk_username === user.username ? 3 : 4">
              <v-icon large :color="$vuetify.breakpoint.xsOnly ? 'blue' : 'white'" @click="downloadImage">
                mdi-download
              </v-icon>
            </v-col>
            <v-col :cols="image.fk_username === user.username ? 3 : 4" :sm="image.fk_username === user.username ? 3 : 4" v-if="image.fk_username === user.username">
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
                <v-img v-if="image && photoOwner" :src="photoOwner.avatar" class="avatar" :class="photoOwner.avatar ? null: 'no-avatar'" aspect-ratio="1" width="80px"
                  style="cursor: pointer" @click="$router.push({ name: 'Photos', params: { username: photoOwner.username, album: 'all' } }).catch(() => {})">
                  <v-icon v-if="!photoOwner.avatar" size="80px" class="no-avatar-icon">
                    mdi-account
                  </v-icon>
                </v-img>
              </v-col>
              <v-col cols="8" sm="6" md="7" lg="5" xl="4" align-self="center">
                <v-container class="pa-0">
                  <v-row justify="start">
                    <v-col cols="7" class="text-h6 pa-0" style="text-align: start; cursor: pointer" @click="$router.push({ name: 'Photos', params: { username: photoOwner.username, album: 'all' } }).catch(() => {})">
                      {{ image.fk_username }}
                    </v-col>
                  </v-row>
                  <v-row justify="start">
                    <v-col cols="9" class="text-body-2 pa-0 blue--text" style="text-align: start">
                      Uploaded on
                      <span>{{ new Date(image.createdAt).toUTCString().split(', ')[1].split(' ').slice(0, 3).join(' ')}}</span>
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
                      {{ image.favouriteCount }}
                    </v-col>
                    <v-col cols="5" sm="4" xl="9" align-self="center" class="pa-0 text-subtitle-1 blue--text">
                      {{ commentCount }}
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
          <v-menu top offset-y nudge-top="10">
            <template v-slot:activator="{ on, attrs }">
              <span style="cursor: pointer" v-bind="attrs" v-on="on">
                <span class="blue--text ml-3">{{ image.visibility ? 'Public' : 'Private' }}</span>
                <v-icon color="blue">
                  mdi-chevron-up
                </v-icon>
              </span>
            </template>
            <v-list>
              <v-list-item @click="updateVisibility(true)">
                <v-list-item-title :class="image.visibility ? 'font-weight-bold' : null">Public</v-list-item-title>
              </v-list-item>
              <v-list-item @click="updateVisibility(false)">
                <v-list-item-title :class="!image.visibility ? 'font-weight-bold' : null">Private</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-container>
    <v-divider v-if="$vuetify.breakpoint.xsOnly"></v-divider>
    <v-divider v-if="$vuetify.breakpoint.smAndUp" style="margin-left: 25%; margin-right: 25%;"></v-divider>
    <v-container class="pa-0 mt-5">
      <comment-container v-if="image" :image="image" @writting="switchWrittingComment" @count="updateCommentCount" />
    </v-container>
  </div>
  <div v-else style="height: 100%">
    <generic-error-page />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ImageService from '@/services/ImageService'
import UserService from '@/services/UserService'
import { Cloudinary } from 'cloudinary-core';
import ShareDialog from '@/components/ShareDialog'
import AlbumDialog from '@/components/AlbumDialog'
import CommentContainer from '@/components/CommentContainer'
import GenericErrorPage from '@/components/GenericErrorPage'
export default {
  components: {
    ShareDialog,
    AlbumDialog,
    CommentContainer,
    GenericErrorPage
  },
  data () {
    return {
      image: null,
      expand: false,
      leftImages: [],
      rightImages: [],
      showShareDialog: false,
      showAlbumDialog: false,
      writtingComment: false,
      goBackParams: null,
      commentCount: 0,
      lastSwitchedPhotoTime: null,
      photoOwner: null
    }
  },
  computed: {
    ...mapState([
      'user',
      'searching',
      'errorHappening'
    ])
  },
  watch: {
    expand() {
      if (this.expand) {
        document.addEventListener('keyup', this.escPressed)
      } else {
        document.removeEventListener('keyup', this.escPressed)
      }
    },
    '$route.params.id': async function() {
      await this.getImage()
      await this.getNeighbouringImages()
      await this.getOwner()
    }
  },
  async mounted() {
    this.cloudinaryCore = new Cloudinary({ cloud_name: process.env.VUE_APP_CLOUDINARY_NAME })
    document.addEventListener('keyup', this.arrowsPressed)
    window.scrollTo(0, 0)
    await this.getImage()
    await this.getNeighbouringImages()
    await this.getOwner()
  },
  methods: {
    async getImage() { 
      try {
        const image = (await ImageService.get({ id: this.$route.params.id })).data
        if (image.trashed) {
          this.$router.push({
            name: 'Photos',
            params: {
              album: 'trash'
          }}).catch(() => {})
          return
        }
        image.url = image.url = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/${image.fk_username}/${image.id}`
        this.image = image
      } catch (err) {
        console.log(err)
        this.$store.dispatch('setErrorHappening', true)
        if (err.response && err.response.status === 403) {
          this.$router.push({ name: 'Photos', params: { username: this.user.username, album: 'all'}}).catch(() => {})
        }
      }
    },
    async getOwner() {
      try {
        const user = (await UserService.get(this.image.fk_username)).data
        if (user.avatar) {
          user.avatar = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/${user.username}/avatar/${user.avatar}`
        }
        this.photoOwner = user
        console.log(this.photoOwner)
      } catch (err) {
        console.log(err)
        this.$store.dispatch('setErrorHappening', true)
        if (err.response && err.response.status === 403) {
          this.$router.push({ name: 'Photos', params: { username: this.user.username, album: 'all'}}).catch(() => {})
        }
      }
    },
    async getNeighbouringImages() {
      const query = this.$route.query
      if (query.page && 
          query.visibility && 
          query.order) { // all photos of
        try {
          let leftFilter = {
            limit: 2
          }
          let rightFilter = {
            limit: 2
          }
          if (query.visibility === 'public') {
            leftFilter.visibility = true
            rightFilter.visibility = true
          } else if (query.visibility === 'private') {
            leftFilter.visibility = false
            rightFilter.visibility = false
          }
          if (query.page === 'user') {
             if (query.in === 'all') {
              leftFilter.user = this.image.fk_username
              rightFilter.user = this.image.fk_username
            } else if (query.in === 'favourites') {
              leftFilter.favourites = true
              rightFilter.favourites = true
              leftFilter.user = this.user.username
              rightFilter.user = this.user.username
            } else if (query.in === 'trash') {
              leftFilter.trash = true
              rightFilter.trash = true
            } else {
              leftFilter.album = query.in
              rightFilter.album = query.in
            }
          } else if (query.page === 'explore') {
            leftFilter.explore = true
            rightFilter.explore = true
          }
          if (query.order === 'date:desc') {
            leftFilter.from = this.image.createdAt
            leftFilter.sort = 'date:asc'
            this.leftImages = (await ImageService.get(leftFilter)).data.reverse().map(image => {
              image.url = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/${image.fk_username}/${image.id}`
              return image
            })
            rightFilter.to = this.image.createdAt
            rightFilter.sort = 'date:desc'
            this.rightImages = (await ImageService.get(rightFilter)).data.map(image => {
              image.url = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/${image.fk_username}/${image.id}`
              return image
            })
          } else if (query.order === 'date:asc') {
            leftFilter.to = this.image.createdAt
            leftFilter.sort = 'date:desc'
            this.leftImages = (await ImageService.get(leftFilter)).data.reverse().map(image => {
              image.url = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/${image.fk_username}/${image.id}`
              return image
            })
            rightFilter.from = this.image.createdAt
            rightFilter.sort = 'date:asc'
            this.rightImages = (await ImageService.get(rightFilter)).data.map(image => {
              image.url = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/${image.fk_username}/${image.id}`
              return image
            })
          } else if (query.order === 'popularity:desc') {
            console.log('popularity:desc')
          } else if (query.order === 'popularity:asc') {
            console.log('popularity:asc')
          }
        } catch (err) {
          this.$store.dispatch('setErrorHappening', true)
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
        this.$router.push({ name: 'Photo', params: { username: this.image.fk_username, id: this.image.id }, query: this.$route.query }).catch(() => {})
        await this.getNeighbouringImages()
      } catch (err) {
        this.$store.dispatch('setErrorHappening', true)
        this.$store.dispatch('alert', 'An error happened while trying to go left')
      }
    },
    async goLeft() {
      if (this.leftImages.length > 0) {
        if (this.lastSwitchedPhotoTime) {
          const timePassed = Date.now() - this.lastSwitchedPhotoTime
          if (timePassed < 250) {
            return
          }
        }
        try {
          this.image = this.leftImages[this.leftImages.length - 1]
          this.$router.push({ name: 'Photo', params: { username: this.image.fk_username, id: this.image.id }, query: this.$route.query }).catch(() => {})
          this.lastSwitchedPhotoTime = Date.now()
          await this.getNeighbouringImages()
        } catch (err) {
          this.$store.dispatch('setErrorHappening', true)
          this.$store.dispatch('alert', 'An error happened while trying to go left')
        }
      }
    },
    async goRight() {
      if (this.rightImages.length > 0) {
        if (this.lastSwitchedPhotoTime) {
          const timePassed = Date.now() - this.lastSwitchedPhotoTime
          if (timePassed < 250) {
            return
          }
        }
        try {
          this.image = this.rightImages[0]
          this.$router.push({ name: 'Photo', params: { username: this.image.fk_username, id: this.image.id }, query: this.$route.query }).catch(() => {})
          this.lastSwitchedPhotoTime = Date.now()
          await this.getNeighbouringImages()
        } catch (err) {
          this.$store.dispatch('setErrorHappening', true)
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
        if (!this.image.trashed) {
          await ImageService.putToTrash(this.image.id)
          this.$router.push({ name: 'Photos', params: { username: this.user.username, album: 'all' } }).catch(() => {})
          this.$store.dispatch('alert', 'Photo has been moved to trash.')
        } else {
          await ImageService.delete(this.image.id)
          this.$router.push({ name: 'Photos', params: { username: this.user.username, album: 'all' } }).catch(() => {})
          this.$store.dispatch('alert', 'Photo deleted successfully.')
        }
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
        if (!this.searching && (event.key === 'ArrowLeft' || event.keyCode === 65)) {
          await this.goLeft()
        } else if (!this.searching && (event.key === 'ArrowRight' || event.keyCode === 68)) {
          await this.goRight()
        }
      }
    },
    switchWrittingComment(value) {
      this.writtingComment = value
    },
    async updateVisibility(visibility) {
      if (visibility !== this.image.visibility) {
        try {
          await ImageService.update(this.image.id, { visibility })
          this.image.visibility = visibility
        } catch (err) {
          console.log(err)
          this.$store.dispatch('alert', 'An error occured while changing viewing privacy')
        }
      }
    },
    updateCommentCount(count) {
      this.commentCount = count
    },
    async favourite() {
      try {
        await ImageService.favourite(this.image.id)
        this.image.favouriteCount++
        this.image.favouritedByUser = true
      } catch (err) {
        console.log(err)
        if (err.response.status === 403) {
          this.$store.dispatch('alert', 'Confirm your email address to make photos your favourites.')
        } else {
          this.$store.dispatch('alert', 'An error occured while favouriting the photo')
        }
      }
    },
    async unfavourite() {
      try {
        await ImageService.unfavourite(this.image.id)
        this.image.favouriteCount--
        this.image.favouritedByUser = false
      } catch (err) {
        console.log(err)
        this.$store.dispatch('alert', 'An error occured while unfavouriting the photo')
      }
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
  width: 12vw;
  margin-right: 5px;
}

.settings-container-md {
  width: 17vw;
  margin-right: 5px;
}

.settings-container-sm {
  width: 25vw;
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

.no-avatar {
  border: 2px #2196F3 solid;
}

.no-avatar-icon {
  position: absolute;
  background-color: white;
  top: 50%;
  left: 50%;
  transform:translate(-50%,-50%);
}
</style>
