<template>
  <v-app-bar fixed min-height="64px" clipped-left flat color="blue" :style="$vuetify.breakpoint.smAndDown ? 'padding-top: 4px' : null">
    <v-toolbar-title 
      class="font-weight-bold white--text mr-5" 
      style="cursor: pointer"
      :class="$vuetify.breakpoint.smAndDown ? 'text-h4' : 'text-h3'"
      @click="$router.push({ name: 'Explore' }).catch(err => {})">dimple
    </v-toolbar-title>
    <v-toolbar-items v-if="$vuetify.breakpoint.mdAndUp">
      <v-btn class="white--text" 
        depressed tile color="blue" 
        light 
        @click="$router.push({ name: 'Photos', params: { username: user.username, album: 'all' } }).catch(err => {})">You</v-btn>
      <v-btn class="white--text" 
        depressed tile color="blue" 
        light
        @click="$router.push({ name: 'Explore' }).catch(err => {})">
        Explore
      </v-btn>
    </v-toolbar-items>
    <v-spacer v-if="$vuetify.breakpoint.smAndUp"></v-spacer>
    <v-toolbar-items v-if="$vuetify.breakpoint.smAndUp">
    <v-container class="pa-0" fill-height>
      <v-menu 
        class="menu"
        tile
        offset-y
        v-model="searchFocused"
        :close-on-click="false"
        :open-on-click="false"
        nudge-bottom="3">
        <template v-slot:activator="{ on }">
          <v-text-field 
            outlined 
            hide-details 
            single-line 
            dense
            full-width 
            :class="$vuetify.breakpoint.smOnly ? 'text-field-sm' : 'text-field'" 
            background-color="white"
            placeholder="Search"
            :append-icon="searchText.length ? 'mdi-close-circle' : null"
            @click:append="searchText = ''"
            prepend-inner-icon="mdi-magnify"
            v-on="on"
            @focus="enableSearchFocus"
            @blur="disableSearchFocus"
            v-model="searchText"
            ref="searchField">
          </v-text-field>
        </template>
        <v-card tile flat class="search-card">
          <v-card-text class="pa-0 search-card-text">
            <v-container class="pa-0 px-3" v-if="searchResults.length && !loading">
              <v-row justify="center">
                <v-col
                  cols="12" 
                  class="pa-0" 
                  style="cursor: pointer" 
                  v-for="(searchedUser, index) in searchResults" 
                  :key="index" 
                  @click="goToUser(searchedUser)">
                  <v-hover v-slot="{ hover }">
                    <v-container class="pa-0 py-2" :class="hover ? 'hovered' : null">
                      <v-row justify="center">
                        <v-col cols="3" class="pa-0">
                          <v-img :src="searchedUser.avatar" class="avatar ml-1" :class="searchedUser.avatar ? null: 'no-avatar'" aspect-ratio="1" width="50px">
                            <v-container v-if="!searchedUser.avatar" class="pa-0" fill-height>
                              <v-row justify="center">
                                <v-col cols="12" class="pa-0" align-self="center">
                                  <v-icon size="40px" style="text-align: center">
                                    mdi-account
                                  </v-icon>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-img>
                        </v-col>
                        <v-col cols="9" class="pa-0 pl-3" align-self="center">
                          <v-container class="pa-0">
                            <v-row justify="start">
                              <v-col cols="12" class="pa-0" style="text-align: left">
                                <span class="grey--text text--darken-3 text-body-1 font-weight-medium">
                                  {{ searchedUser.username }}
                                </span>
                              </v-col>
                              <v-col cols="12" class="pa-0" style="text-align: left" >
                                <span class="text-body-2 font-weight-medium">
                                  {{ searchedUser.imageCount }} photos
                                </span>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-hover>
                </v-col>
              </v-row>
            </v-container>
            <v-container v-else-if="loading" fill-height>
              <v-row>
                <v-col cols="12" class="text-h6 font-weight-medium">
                  <v-progress-circular color="blue" indeterminate></v-progress-circular>
                </v-col>
              </v-row>
            </v-container>
            <v-container v-else fill-height style="height: 100%">
              <v-row>
                <v-col cols="12" class="text-h6 font-weight-medium">
                  No results
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-container>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <form
      name ="form"
      autocomplete="off">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :disabled="$store.state.uploadInProgress ? true : false" @click="!user.confirmationToken ? $refs.fileInput.click() : showAlertDialog = true"
            color="white"
            light
            :x-large="$vuetify.breakpoint.mdAndUp"
            class="white--text"
            icon
            v-bind="attrs"
            v-on="on">
            <v-icon :x-large="$vuetify.breakpoint.mdAndUp" color="white">
              mdi-cloud-upload
            </v-icon>
          </v-btn>
        </template>
        <span>Upload photos</span>
      </v-tooltip>
      <alert-dialog 
        v-if="showAlertDialog" 
        :show="showAlertDialog"
        :title="'Whoops'"
        :text="'You need to confirm your email address before you can start uploading photos.'"
        @close="showAlertDialog = false">
      </alert-dialog>
      <input
        type="file"
        style="display: none"
        ref="fileInput"
        accept="image/jpeg, image/png"
        multiple
        @change="onFileChosen">
    </form>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-if="user.admin" @click="$router.push({ name: 'AdminPage' }).catch(() => {})"
          color="white"
          light
          :x-large="$vuetify.breakpoint.mdAndUp"
          class="white--text mx-xs-0 mx-sm-1"
          icon
          v-bind="attrs"
          v-on="on">
          <v-icon :x-large="$vuetify.breakpoint.mdAndUp" color="white">
            mdi-application-cog
          </v-icon>
        </v-btn>
      </template>
      <span>Admin page</span>
    </v-tooltip>
    <v-toolbar-items>
      <div class="pr-2">
      <v-img :src="user.avatar" class="avatar ml-1" :class="user.avatar ? null: 'no-avatar'" style="cursor: pointer; text-align: center" aspect-ratio="1" width="52px"
        @click="$router.push({ name: 'Photos', params: { username: user.username, album: 'all' } }).catch(() => {})">
        <v-container class="pa-0" fill-height>
          <v-row justify="center">
            <v-col cols="12" class="pa-0" align-self="center">
              <v-icon v-if="!user.avatar" size="40px" style="text-align: center">
                mdi-account
              </v-icon>
            </v-col>
          </v-row>
        </v-container>
      </v-img>
      </div>
      <v-btn v-if="$vuetify.breakpoint.mdAndUp" class="white--text" depressed tile color="blue" light @click="signOut()">
        Log out
      </v-btn>
    </v-toolbar-items>
    <v-tooltip bottom v-if="$vuetify.breakpoint.smAndDown">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="white"
          light
          class="white--text mx-xs-0 mx-sm-1"
          icon
          v-bind="attrs"
          v-on="on"
          @click="signOut()">
          <v-icon color="white">
            mdi-logout
          </v-icon>
        </v-btn>
      </template>
      <span>Log out</span>
    </v-tooltip>
  </v-app-bar> 
</template>

<script>
import { mapState } from 'vuex'
import UserService from '@/services/UserService'
import AlertDialog from '@/components/common/AlertDialog'
export default {
  data() {
    return {
      searchText: '',
      searchFocused: false,
      searchResults: [],
      loading: false,
      showAlertDialog: false
    }
  },
  components: {
    AlertDialog
  },
  computed: {
    ...mapState([
      'user'
    ])
  },
  watch: {
    async searchText() {
      if (this.searchText.length) {
        try {
          this.loading = true
          this.searchResults = (await UserService.search(this.searchText)).data.map(user => {
            if (user.avatar) {
              user.avatar = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/w_300/${user.username}/avatar/${user.avatar}`
            }
            return user
          })
          this.loading = false
        } catch (err) {
          this.loading = false
          this.$store.dispatch('alert', 'An error occured with searching')
        }
      } else {
        this.searchResults = []
      }
    }
  },
  mounted() {
    window.addEventListener('keyup', this.enterPressed)
  },
  methods: {
    signOut() {
      localStorage.removeItem('user')
      this.$store.dispatch('unsetUser')
      this.$store.dispatch('changeSort', { category: 'date', order: 'desc' })
      this.$store.dispatch('changeVisibility', 'all')
      this.$router.push({ name: 'Authentication' }).catch(() => {})
    },
    async enableSearchFocus() {
      this.searchFocused = true
      this.$store.dispatch('setSearching', true)
    },
    async disableSearchFocus() {
      setTimeout(() => {
        this.searchFocused = false
      }, 100)
      this.$store.dispatch('setSearching', false)
    },
    enterPressed(e) {
      if (e.keyCode === 13 && this.searchFocused && this.searchResults.length) {
        this.$router.push({ name: 'Photos', params: { username: this.searchResults[0].username, album: 'all' } }).catch(() => {})
        this.searchText = ''
        this.$refs.searchField.blur()
      } else if (e.keyCode === 65 || e.keyCode === 68 || e.keyCode === 37 || e.keyCode === 39) {
        e.preventDefault()
      }
    },
    onFileChosen(event) {
      const files = [...event.target.files]
      this.$store.dispatch('imageChosen', files)
      event.target.value = null
    },
    goToUser(searchedUser) {
      this.searchText = ''
      this.$router.push({ name: 'Photos', params: { username: searchedUser.username, album: 'all' } }).catch(() => {})
    }
  },
  destroyed() {
    document.removeEventListener('keyup', this.enterPressed)
  }
}
</script>

<style scoped>
.text-field {
  width: 300px;
}

.text-field-sm {
  width: 200px;
}
.avatar {
  border-radius: 50%;
  background-color: white;
  border: 2px #2196F3 solid;
}

.no-avatar {
  border: 2px #2196F3 solid;
}

.no-avatar-icon {
  background-color: white;
}

.search-card {
  width: 300px;
}

.search-card-text {
  height: 300px;/* or any height you want */
  overflow-y: auto;
  overflow-x: hidden;
}

.hovered {
  background-color: rgb(219, 220, 221);
}
</style>