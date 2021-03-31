<template>
  <v-app>
      <div v-if="user.jwtToken" style="margin-bottom: 64px">
        <page-header />
      </div>
      <v-main>
        <router-view  />
      </v-main>
      <v-snackbar
        v-model="showAlertSnackbar"
        bottom middle
        timeout="2000"
        style="text-align: center"
        >
        {{ snackbarText }}
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

export default {
  data() {
    return {
      showAlertSnackbar: false,
      snackbarText: '',
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
      'user'
    ])
  },
  watch: {
    alert () {
      this.snackbarText = this.$store.state.snackbarText
      this.showAlertSnackbar = true
    },
    user (value) {
      if (value.jwtToken) {
        this.mainMargin = 'margin-top: 60px'
      } else {
        this.mainMargin = 'margin-top: 0px'
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
