<template>
  <v-snackbar
    light
    multi-line
    color="white"
    timeout="-1"
    v-model="show"
    bottom right
    style="text-align: center;"
    >
    <v-container class="snack-container">
      <v-row align="center" justify="space-between">
        <v-col xs="11" lg="8" class="snack-column">
          <div class="h4 font-weight-bold gray--text pl-3">{{ title }}</div>
        </v-col>
        <v-spacer></v-spacer>
        <v-col xs="4" class="snack-column d-flex justify-end">
          <v-progress-circular v-if="showLoadingCircle" indeterminate color="blue" />
          <v-icon v-if="showSuccess" color="green">mdi-emoticon-happy</v-icon>
          <v-icon v-if="showFailure" color="red">mdi-emoticon-sad</v-icon>
        </v-col>
      </v-row>
    </v-container>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'
import ImageService from '@/services/ImageService'
export default {
  data () {
    return {
      show: false,
      title: 'Uploading Photo',
      showLoadingCircle: true,
      showSuccess: false,
      showFailure: false
    }
  },
  computed: {
    ...mapState([
      'imageUploadData'
    ])
  },
  watch: {
    async imageUploadData (value) {
      if (value) {
        let response
        const imageUploadData = value
        try {
          this.show = true
          response = await ImageService.upload(imageUploadData)
          console.log(response)
          this.showLoadingCircle = false
          this.title = 'Upload Complete'
          this.showSuccess = true
          setTimeout(() => {
            this.show = false
            this.clear()
          }, 2000)
          this.$store.dispatch('finishUpload')
          await ImageService.finalizeUpload({
            publicId: imageUploadData.get('public_id'),
            url: response.data.secure_url
          })
        } catch (err) {
          if (!response || response.status !== 200) {
            try {
              await ImageService.delete(imageUploadData.get('public_id'))
            } catch (err) {
              console.log(err)
            }
          }
          this.showFailre = true
          this.title = 'Upload Failed'
          this.showLoadingCircle = false
          this.showFailure = true
          this.$store.dispatch('finishUpload')
          console.log(err)
          setTimeout(() => {
            this.show = false
            this.clear()
          }, 2000)
        }
      }
    }
  },
  methods: {
    clear() {
      this.showLoadingCircle = true
      this.title = 'Uploading Photo'
      this.showSuccess = false
      this.showFailure = false
    }
  }
}
</script>

<style>
.snack-column {
  padding: 0px;
}
</style>