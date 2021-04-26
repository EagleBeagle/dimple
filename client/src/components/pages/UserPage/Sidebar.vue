<template>
  <v-navigation-drawer app clipped permanent :mini-variant="$vuetify.breakpoint.smAndDown" style="top: 64px">
    <v-list nav class="pa-0">
      <v-list-item class="px-2 mb-0" v-if="shownUser">
        <v-container class="pa-0 py-2">
          <v-row justify="start">
            <v-col cols="12" md="4" class="pa-xs-3 pa-sm-3">
              <v-hover v-slot="{hover}">
                <v-img
                  class="avatar"
                  :class="shownUser.avatar ? null: 'no-avatar'"
                  :style="shownUser.username === user.username ? 'cursor: pointer' : null"
                  aspect-ratio="1" 
                  width="80px" 
                  :src="shownUser.avatar ? shownUser.avatarUrl : null" @click="(shownUser.username === user.username && $refs.fileInput) ? $refs.fileInput.click() : null">
                  <v-icon v-if="!shownUser.avatar" :size="$vuetify.breakpoint.smAndDown ? '30px' : '50px'" class="no-avatar-icon">
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
            <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="8" class="pa-0" align-self="center">
              <span class="text-h5 font-weight-medium" style="text-align: start">{{ shownUser.username }}</span>
            </v-col>
          </v-row>
        </v-container>
      </v-list-item>
      <v-divider class="mx-2"></v-divider>
      <v-list-item-group
        color="primary"
        class="pa-2">
        <v-list-item ref="albumsButton" @click="goTo('UserAlbums')">
          <v-list-item-icon>
            <v-icon>mdi-image-album</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Albums</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          ref="photosButton" 
          @click="goTo('Photos', { username: $route.params.username, album: 'all' })">
          <v-list-item-icon>
            <v-icon>mdi-image-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Photos</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item ref="favesButton" @click="goTo('Photos', { username: $route.params.username, album: 'favourites' })">
          <v-list-item-icon>
            <v-icon>mdi-star</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Favourites</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item ref="trashButton" v-if="user.username === $route.params.username" @click="goTo('Photos', { username: $route.params.username, album: 'trash' })">
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
        <v-col cols="5" class="blue--text pa-0 font-weight-light" style="text-align: center" :class="$vuetify.breakpoint.mdAndUp ? 'text-h3' : 'text-h5'">
          {{ shownUser.imageCount }}
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="8" class="pa-0 font-weight-light" style="text-align: center" :class="$vuetify.breakpoint.mdAndUp ? 'text-h4' : 'text-body-2'">
          <span v-if="shownUser.imageCount > 1">Photos</span>
          <span v-else>Photo</span>
        </v-col>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import UserService from '@/services/UserService'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      shownUser: null,
      loading: false
    }
  },
  computed: {
    ...mapState([
      'user',
      'updateShownUser'
    ])
  },
  watch: {
    '$route.params': async function () {
      await this.getUser()
    },
    'updateShownUser': async function () {
      await this.getUser()
    }
  },
  async mounted() {
    await this.getUser()
  },
  methods: {
    goTo(route, params) {
      if (this.$route.name !== route || (this.$route.name === 'Photos' && this.$route.params.album !== params.album)) {
        this.$router.push({ name: route, params }).catch(() => {})
      } else {
        this.$router.push({ query: {} }).catch(() => {})
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
        this.shownUser.avatarUrl = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/w_300/${this.user.username}/avatar/${avatarId}`
        this.$store.dispatch('alert', 'Avatar successfully set.')
        this.user.avatar = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/w_300/${this.user.username}/avatar/${avatarId}`
        this.$store.dispatch('setUser', this.user)
        this.loading = false
      } catch (err) {
        this.$store.dispatch('alert', 'An error happened while changing your avatar.')
      }
    },
    async getUser() {
      try {
        const username = this.$route.params.username
        const response = (await UserService.get(username)).data
        response.avatarUrl = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/w_300/${username}/avatar/${response.avatar}`
        this.shownUser = response
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.$router.push({ name: 'ContentNotFoundError' }).catch(() => {})
        } else {
          this.$router.push({ name: 'GenericError' }).catch(() => {})
        }
      }
    }
  }
}
</script>

<style scoped>
.avatar {
  border-radius: 50%;
  border: 2px #2196F3 solid
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