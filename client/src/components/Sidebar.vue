<template>
  <v-navigation-drawer app clipped style="top: 64px">
    <v-list nav class="pa-0">
      <v-list-item class="px-2 mb-0" v-if="shownUser">
        <v-container class="pa-0 py-2">
          <v-row justify="start">
            <v-col cols="4" class="pa-0 pl-2">
              <v-hover v-slot="{hover}">
                <v-img
                  class="avatar"
                  :class="shownUser.avatar ? null: 'no-avatar'"
                  :style="shownUser.username === user.username ? 'cursor: pointer' : null"
                  aspect-ratio="1" 
                  width="80px" 
                  :src="shownUser.avatar ? shownUser.avatarUrl : null" @click="(shownUser.username === user.username && $refs.fileInput) ? $refs.fileInput.click() : null">
                  <v-icon v-if="!shownUser.avatar" size="60px" class="no-avatar-icon">
                    mdi-account
                  </v-icon>
                  <v-fade-transition>
                    <v-overlay
                      v-if="hover && shownUser.username === user.username"
                      color="#000000"
                      opacity="0.2">
                      <v-icon large class="change-avatar-icon" color="white">mdi-pencil</v-icon>
                      <form
                        name ="form"
                        autocomplete="off">
                        <input
                          type="file"
                          style="display: none"
                          ref="fileInput"
                          accept="image/jpeg, image/png"
                          @change="changeAvatar">
                      </form>
                    </v-overlay>
                  </v-fade-transition>
                  <v-overlay
                    v-if="loading"
                    color="#000000"
                    opacity="0.2">
                    <v-progress-circular
                      indeterminate
                      size="40"
                      class="change-avatar-icon"
                      color="white"
                    ></v-progress-circular>
                  </v-overlay>
                </v-img>
              </v-hover>
            </v-col>
            <v-col cols="8" class="pa-0" align-self="center">
              <span class="text-h5 font-weight-medium" style="text-align: start">{{ shownUser.username }}</span>
            </v-col>
          </v-row>
        </v-container>
      </v-list-item>
      <v-divider class="mx-2"></v-divider>
      <v-list-item-group
        color="primary"
        class="pa-2">
        <v-list-item @click="goTo('UserAlbums')">
          <v-list-item-icon>
            <v-icon>mdi-image-album</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Albums</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="goTo('Photos', { username: $route.params.username, album: 'all' })">
          <v-list-item-icon>
            <v-icon>mdi-image-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>All Photos</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="goTo('Photos', { username: $route.params.username, album: 'favourites' })">
          <v-list-item-icon>
            <v-icon>mdi-star</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Favourites</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="goTo('Photos', { username: $route.params.username, album: 'trash' })">
          <v-list-item-icon>
            <v-icon>mdi-trash-can</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Trash</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
      <v-divider class="mx-2"></v-divider>
    </v-list>
    <v-container class="pa-0 navigation-bottom" v-if="shownUser">
        <v-row justify="center">
        </v-row>
        <v-row justify="center">
          <v-col cols="5" class="blue--text pa-0 text-h3 font-weight-light" style="text-align: center">
            {{ shownUser.imageCount }}
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="8" class="pa-0 text-h4 font-weight-light" style="text-align: center">
            Photos
          </v-col>
        </v-row>
      </v-container>
  </v-navigation-drawer>
</template>

<script>
import UserService from '@/services/UserService'
import { mapState } from 'vuex'
import { Cloudinary } from 'cloudinary-core'
export default {
  data () {
    return {
      shownUser: null,
      loading: false
    }
  },
  computed: {
    ...mapState([
      'user'
    ])
  },
  watch: {
    '$route.params': async function () {
      await this.getUser()
    }
  },
  async mounted() {
    this.cloudinaryCore = new Cloudinary({ cloud_name: process.env.VUE_APP_CLOUDINARY_NAME })
    await this.getUser()
  },
  methods: {
    goTo(route, params) {
      if (this.$route.name !== route || (this.$route.name === 'Photos' && this.$route.params.album !== params.album)) {
        this.$router.push({ name: route, params })
      }
    },
    async changeAvatar(event) {
      const formData = new FormData()
      const image = event.target.files[0]
      formData.append('image', image)
      try {
        this.loading = true
        const avatarId = (await UserService.changeAvatar(this.user.username, formData)).data
        this.shownUser.avatar = true
        this.shownUser.avatarUrl = this.cloudinaryCore.url(`${this.user.username}/avatar/${avatarId}`)
        this.$store.dispatch('alert', 'Avatar successfully set.')
        this.loading = false
      } catch (err) {
        console.log(err)
        this.$store.dispatch('alert', 'An error happened while changing your avatar.')
      }
    },
    async getUser() {
      try {
        const username = this.$route.params.username
        const response = (await UserService.get(username)).data
        response.avatarUrl = this.cloudinaryCore.url(`${username}/avatar/${response.avatar}`)
        this.shownUser = response
        console.log(this.shownUser.avatar)
      } catch (err) {
        console.log(err)
        this.$store.dispatch('alert', 'Failed to retrive user.')
      }
    }
  }
}
</script>

<style scoped>
.avatar {
  border-radius: 50%;
}
.navigation-bottom {
  position: absolute;
  bottom: 10%
}

.change-avatar-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform:translate(-50%,-50%);
}

.no-avatar {
  border: 1px #2196F3 solid;
}

.no-avatar-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform:translate(-50%,-50%);
}
</style>