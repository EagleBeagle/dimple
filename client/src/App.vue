<template>
  <v-app>
      <div v-if="user.jwtToken" style="margin-bottom: 64px">
        <page-header />
      </div>
      <v-main>
        <router-view  />
      </v-main>
      <v-snackbar
        v-if="showUpdateSnackbar && ['Photos', 'UserAlbums', 'UserPeople'].includes($route.name)"
        v-model="showUpdateSnackbar"
        top
        class="mt-6"
        timeout="5000"
        style="text-align: center"
        multi-line>
        <v-container class="pa-1 pl-3">
          <v-row justify="space-between">
            <v-col cols="1" class="pa-0" align-self="center">
              <v-icon color="white">
                mdi-bell
              </v-icon>
            </v-col>
            <v-col cols="10" class="pa-0 pl-2" style="font-size: 14px; text-align: start" align-self="center">
              {{ updateSnackbarText }}
            </v-col>
            <v-col cols="1" class="pa-0" align-self="center">
              <v-icon color="white" @click="hideNotification">
                mdi-close
              </v-icon>
            </v-col>
          </v-row>
        </v-container>
      </v-snackbar>
      <v-snackbar
        v-if="showAlertSnackbar"
        v-model="showAlertSnackbar"
        bottom middle
        timeout="2000"
        style="text-align: center"
        >
        {{ alertSnackbarText }}
      </v-snackbar>
      <upload-dialog />
      <upload-snackbar v-if="user.jwtToken" />
  </v-app>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import UploadSnackbar from '@/components/UploadSnackbar'
import UploadDialog from '@/components/UploadDialog'
import { mapState } from 'vuex'
import UserService from '@/services/UserService'
export default {
  data() {
    return {
      showAlertSnackbar: false,
      alertSnackbarText: '',
      showUpdateSnackbar: false,
      updateSnackbarText: '',
      mainMargin: 'margin-top: 0px'
    }
  },
  components: {
    PageHeader,
    UploadSnackbar,
    UploadDialog
  },
  mounted() {
    if (this.user.jwtToken) {
      this.mainMargin = 'margin-top: 64px'
    } else {
      this.mainMargin = 'margin-top: 0px'
    }
  },
  computed: {
    ...mapState([
      'alert',
      'update',
      'user'
    ])
  },
  watch: {
    alert () {
      this.alertSnackbarText = this.$store.state.alertSnackbarText
      this.showAlertSnackbar = true
    },
    update () {
      this.updateSnackbarText = this.$store.state.updateSnackbarText
      this.showUpdateSnackbar = true
    },
    user (value) {
      if (value.jwtToken) {
        this.mainMargin = 'margin-top: 60px'
      } else {
        this.mainMargin = 'margin-top: 0px'
      }
    }
  },
  methods: {
    async hideNotification() {
      try {
        this.showUpdateSnackbar = false
        await UserService.update(this.user.username, {
          notification: ''
        })
      } catch {
        this.showUpdateSnackbar = false
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 0px;
}

html, body {
  overflow-x: hidden;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.snack-container {
  padding: 0px;
}

.image-preview>* {
  backdrop-filter: blur(1px);
}

.album-select {
  width: 100px;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
