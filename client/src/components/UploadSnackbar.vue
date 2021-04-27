<template>
  <v-snackbar
    light
    multi-line
    color="white"
    timeout="-1"
    v-model="show"
    v-if="show"
    bottom right
    class="pb-2 pr-2"
    style="text-align: center;"
    >
    <v-container class="snack-container pa-0">
      <v-expand-transition>
        <v-row v-show="expand" class="upload-details">
          <v-col class="py-0">
            <v-container class="pa-0">
              <v-row v-for="(file, i) in fileMetadata" :key="i" align="center" justify="space-around" class="pb-3">
                <v-col cols="1" lg="1" class="snack-column">
                  <v-img class="thumbnail" :src="file.src" width="25px" height="25px">
                    <transition name="fade">
                    <v-icon v-if="file.finished && !file.failed" size="25px" class="font-weight-bold thumbnail-icon" color="green accent-4" style="padding-right: 1px">
                      mdi-check
                    </v-icon>
                    <v-icon v-if="file.failed" class="font-weight-bold thumbnail-icon" color="red" style="padding-right: 1px">
                      mdi-close
                    </v-icon>
                    </transition>
                  </v-img>
                </v-col>
                <v-col cols="9" lg="9" class="snack-column d-flex justify-end">
                  <v-progress-linear :value="file.progress" :color="!file.failed ? 'blue' : 'blue lighten-2' ">
                  </v-progress-linear>
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
          <v-progress-circular v-if="showLoadingCircle" :value="overallProgress" rotate="-90" color="blue">
            <!-- {{ overallProgress }} -->
          </v-progress-circular>
          <v-fade-transition>
            <v-icon v-if="showSuccess" color="green">mdi-emoticon-happy</v-icon>
            <v-icon v-if="showFailure" color="red">mdi-emoticon-sad</v-icon>
          </v-fade-transition>
        </v-col>
        <v-col cols="9" sm="8" md="8" lg="8" class="snack-column">
          <div class="text-h6 pl-3 ml-3">
              <span v-if="uploadCount === 1 && (!showSuccess && !showFailure)">Uploading 1 photo</span>
              <span v-if="uploadCount > 1 && (!showSuccess && !showFailure)">Uploading {{ uploadCount }} photos</span>
              <span v-if="showFailure">Some uploads failed</span>
              <span v-if="showSuccess">Upload successful</span>
          </div>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="1" lg="1" class="snack-column mr-2">
          <v-btn icon @click="expand = !expand">
            <v-icon v-if="!expand">
              mdi-chevron-up
            </v-icon>
            <v-icon v-else>
              mdi-chevron-down
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
      uploadCount: 0,
      overallUploadCount: 0,
      showLoadingCircle: true,
      showSuccess: false,
      showFailure: false,
      uploading: false,
      fileMetadata: [],
      overallProgress: 0,
      previousProgresses: [],
      cancellationTokens: [],
      failure: false,
      expand: false
    }
  },
  beforeMount () {
    
    window.addEventListener('unload', async () => {
      if (!this.uploading) return
      try {
        for (let i = 0; i < this.imageUploadData.length; i++) {
          if (!this.fileMetadata[i].finalized) {
            await ImageService.cancelUpload(this.imageUploadData[i].formData.get('public_id'), this.cancellationTokens[i])
          }
        }
      } catch (err) {
        this.$store.dispatch('alert', 'Error while cancelling uploads.')
      }
    })
    window.addEventListener('beforeunload', async event => {
      if (!this.uploading) return
      event.preventDefault()
      event.returnValue = ""
      return 'sadadasdsadasdsa'
    })
  },
  computed: {
    ...mapState([
      'imageUploadData'
    ])
  },
  watch: { // itt
    async imageUploadData (value) {
      if (value) {
        let response
        this.fileMetadata = []
        const uploadDataArray = []
        this.uploadCount = 0
        this.show = true
        this.uploading = true
        this.uploadCount = this.imageUploadData.length
        this.overallUploadCount = this.imageUploadData.length
        this.cancellationTokens = []
        for (let i = 0; i < this.imageUploadData.length; i++) {
          const file = this.imageUploadData[i].formData.get('file')
          this.fileMetadata.push({
            src: URL.createObjectURL(file),
            progress: 0,
            failed: false,
            finished: false,
            finalized: false
          })
          this.cancellationTokens.push(this.imageUploadData[i].cancellationToken)
          uploadDataArray.push(this.imageUploadData[i].formData)
        } 
        // Failure teszt
        /* this.fileMetadata.push({
            src: URL.createObjectURL(this.imageUploadData[0].get('file')),
            progress: 0,
            failed: false // ?
          })
        uploadDataArray.push(this.imageUploadData)
        this.uploadCount++ */
        try {
          response = await ImageService.upload(uploadDataArray, this.uploadProgress, this.errorLocator)

          for (let i = 0; i < response.length; i++) {
            try {
              if (response[i] && response[i].status === 200) {
                this.fileMetadata[i].finalized = true
              } else {
                await ImageService.cancelUpload(this.imageUploadData[i].formData.get('public_id'), this.cancellationTokens[i])
              }
            } catch(err) {
              this.failure = true
              this.fileMetadata[i].finished = false
              this.fileMetadata[i].failed = true
            }
          }

          this.uploading = false
          this.showLoadingCircle = false

          if (this.failure) {
            this.showFailure = true
          } else {
            this.showSuccess = true
          }
          this.$store.dispatch('finishUpload')
          this.$store.dispatch('updateShownUser')
          setTimeout(() => {
              this.show = false
              this.clear()
            }, 2000)
        } catch (err) {
          setTimeout(() => {
              this.show = false
              this.clear()
            }, 2000)
        }
        return
      }
    }
  },
  methods: {
    clear() {
      this.showLoadingCircle = true
      this.title = 'Uploading Photo'
      this.showSuccess = false
      this.showFailure = false
      this.uploadCount = 0
      this.overallUploadCount = 0
      this.fileMetadata = []
      this.overallProgress = 0
      this.failure = false
      this.expand = false
    },
    uploadProgress(percent, index) {
      if (!this.fileMetadata[index].failed) {
        this.previousProgresses[index] = this.fileMetadata[index].progress
        this.fileMetadata[index].progress = percent
      } 
      setTimeout(() => {
        if (percent === 100 && !this.fileMetadata[index].failed && !this.fileMetadata[index].finished) {
          this.fileMetadata[index].finished = true
          this.uploadCount--
        }
      }, 1000)
      
      let sumProgress = 0
      for (let i = 0; i < this.overallUploadCount; i++) {
        if (!this.fileMetadata[i].failed) {
          sumProgress += this.fileMetadata[i].progress
        }
      }
      this.overallProgress = sumProgress / this.overallUploadCount
    },
    errorLocator(index) {
      this.fileMetadata[index].failed = true
      this.fileMetadata[index].progress = this.previousProgresses[index]
      this.uploadCount--
      this.overallUploadCount--
      this.failure = true
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

.thumbnail-icon {
  backdrop-filter: blur(4px);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s
}

.fade-enter,
.fade-leave-to {
    opacity: 0
}

div.v-snack:not(.v-snack--absolute) {
  height: 100%;
}
</style>