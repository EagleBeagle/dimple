<template>
  <v-snackbar
    light
    multi-line
    color="white"
    timeout="-1"
    v-model="show"
    bottom right
    class="pb-2 pr-2"
    style="text-align: center;"
    >
    <v-container class="snack-container pa-0">
      <v-expand-transition>
        <v-row v-show="expand" class="upload-details">
          <v-col class="py-0">
            <v-container class="pa-0">
              <v-row align="center" justify="space-around" class="pb-3">
                <v-col cols="1" lg="1" class="snack-column">
                  <v-img>
                    <v-icon>
                      mdi-emoticon-happy
                    </v-icon>
                  </v-img>
                </v-col>
                <v-col cols="9" lg="9" class="snack-column d-flex justify-end">
                  <v-progress-linear v-if="showLoadingCircle" :value="progress" color="blue">
                  </v-progress-linear>
                  <v-icon v-if="showSuccess" color="green">mdi-emoticon-happy</v-icon>
                  <v-icon v-if="showFailure" color="red">mdi-emoticon-sad</v-icon>
                </v-col>
              </v-row>
              <v-row align="center" justify="space-around" class="pb-3">
                <v-col cols="1" lg="1" class="snack-column">
                  <v-img>
                    <v-icon>
                      mdi-emoticon-happy
                    </v-icon>
                  </v-img>
                </v-col>
                <v-col cols="9" lg="9" class="snack-column d-flex justify-end">
                  <v-progress-linear v-if="showLoadingCircle" :value="progress" color="blue">
                  </v-progress-linear>
                  <v-icon v-if="showSuccess" color="green">mdi-emoticon-happy</v-icon>
                  <v-icon v-if="showFailure" color="red">mdi-emoticon-sad</v-icon>
                </v-col>
              </v-row>
              <v-row align="center" justify="space-around" class="pb-3">
                <v-col cols="1" lg="1" class="snack-column">
                  <v-img>
                    <v-icon>
                      mdi-emoticon-happy
                    </v-icon>
                  </v-img>
                </v-col>
                <v-col cols="9" lg="9" class="snack-column d-flex justify-end">
                  <v-progress-linear v-if="showLoadingCircle" :value="progress" color="blue">
                  </v-progress-linear>
                  <v-icon v-if="showSuccess" color="green">mdi-emoticon-happy</v-icon>
                  <v-icon v-if="showFailure" color="red">mdi-emoticon-sad</v-icon>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-expand-transition>
      <v-row v-show="expand">
        <v-col class="pt-0 pb-3">
          <v-divider class="elevation-5"></v-divider>
        </v-col>
      </v-row>
      <v-row align="center" justify="space-around">
        <v-col cols="1" lg="1" class="snack-column ml-3">
          <v-progress-circular v-if="showLoadingCircle" :value="progress" rotate="-90" color="blue">
            {{ progress }}
          </v-progress-circular>
          <v-icon v-if="showSuccess" color="green">mdi-emoticon-happy</v-icon>
          <v-icon v-if="showFailure" color="red">mdi-emoticon-sad</v-icon>
        </v-col>
        <v-col xs="6" sm="8" md="8" lg="8" class="snack-column">
          <div class="h4 font-weight-bold gray--text pl-3">{{ title }}</div>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="1" lg="1" class="snack-column mr-2">
          <v-btn icon @click="expand = !expand">
            <v-icon>
              mdi-chevron-up
            </v-icon>
          </v-btn>
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
      title: 'Uploading 1 photo',
      showLoadingCircle: true,
      showSuccess: false,
      showFailure: false,
      uploading: false,
      progress: 0,
      expand: false
    }
  },
  beforeMount () {
    
    window.addEventListener('unload', () => {
      if (!this.uploading) return
      try {
        console.log('lelelelel')
        ImageService.cancelUpload(this.imageUploadData.get('public_id'))
      } catch (err) {
        console.log(err)
      }
    })
    window.addEventListener('beforeunload', async event => {
      if (!this.uploading) return
      console.log(event)
      event.preventDefault()
      event.returnValue = ""
      console.log(event)
      return 'sadadasdsadasdsa'
    })
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
          this.uploading = true
          response = await ImageService.upload(imageUploadData, this.uploadProgress)
          this.uploading = false
          this.progress = 0
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
          this.uploading = false
          this.progress = 0
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
    },
    uploadProgress(percent) {
      this.progress = percent
    }
  }
}
</script>

<style>
.snack-column {
  padding: 0px;
}
.upload-details {
  max-height: 50vh;
  overflow: auto;
}

.upload-details::-webkit-scrollbar {
  display:none;
}
</style>