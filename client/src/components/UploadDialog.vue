<template>
<v-dialog
  scrollable
  v-model="show"
  width="1100px">
  <v-card>
    <v-card-title class="headline">
      Upload New Photos
    </v-card-title>
    <v-divider></v-divider>
    <v-container style="padding-bottom: 0px; padding-top: 0px">
      <v-row justify="center">
        <v-col cols="3" style="padding: 0px">
          <v-card-text>
          <v-container style="upload-container">
            <v-row justify="space-around">
              <v-col cols="12" class="column">
                <v-container class="upload-container">
                  <v-row v-if="!selectedCount">
                    <div class="text-h6 font-weight-regular">
                      Select photos to edit...
                    </div>
                  </v-row>
                  <v-row v-else>
                    <div v-if="selectedCount === 1" class="text-h6 font-weight-regular">
                      Editing 1 photo
                    </div>
                    <div v-else class="text-h6 font-weight-regular">
                      Editing {{ selectedCount }} photos
                    </div>
                  </v-row>
                  <v-row v-if="selectedCount" class="mr-1 mt-5">
                    <v-select
                      class="album-select"
                      v-model="selectedAlbums"
                      :items="allAlbums"
                      label="Albums"
                      :placeholder="differentAlbumsSelected ? 'Different albums selected' : null"
                      multiple>
                      <template v-slot:selection="{ item, index }">
                        <span v-if="index === 0">{{ item + ',' }}&nbsp;</span>
                        <span v-if="index === 1">{{ item }}&nbsp;</span>
                        <span
                          v-if="index === 2"
                          class="grey--text caption"
                        >
                          <span class="ml-1">(+{{ selectedAlbums.length - 2 }} others)</span>
                        </span>
                      </template>
                    </v-select>
                  </v-row>
                  <v-row v-if="selectedCount" class="mr-1">
                    <v-checkbox
                      v-model="privateCheckbox"
                      label="Private"
                      :indeterminate="privateCheckboxIndeterminate"
                    ></v-checkbox>
                  </v-row>
                  <v-row v-if="selectedCount" class="mr-1 mt-5">
                    <v-btn
                      color="blue"
                      block
                      outlined
                      @click="edit()">
                      Done
                    </v-btn>
                  </v-row>
                </v-container>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="8" style="padding: 0px">
        <v-card-text class="photo-grid" style="height: 400px;">
          <v-container style="upload-container">
            <v-row justify="start">
              <v-col cols="12" sm="6" md="4" lg="3" align-self="center" v-for="imagePreview in imagePreviews" :key="imagePreview.id" v-masonry>
                <v-img 
                  :src="imagePreview.src" 
                  v-bind:class="[imagePreview.selected ? 'selected' : 'not-selected', 'photo']"
                  min-width="160px" 
                  max-height="150px" 
                  max-width="150px"
                  @click="select(imagePreview.id)"
                  @load="$redrawVueMasonry()">
                </v-img>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        </v-col>
      </v-row>
    </v-container>
    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        depressed
        class="blue--text"
        @click="upload()"
      >
        UPLOAD
      </v-btn>
      <v-btn
        depressed
        class="red--text"
        @click="close()"
      >
        CANCEL
      </v-btn>
    </v-card-actions>
  </v-card>
  </v-dialog>
</template>

<script>
import AlbumService from '@/services/AlbumService'
import ImageService from '@/services/ImageService'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      show: false,
      imagePreviews: [],
      selectedAlbums: [],
      allAlbums: [],
      differentAlbumsSelected: false,
      privateCheckbox: false,
      privateCheckboxIndeterminate: true
    }
  },
  computed: {
    ...mapState([
      'imageData'
    ]),
    selectedCount() {
      let sum = 0;
      this.imagePreviews.forEach((imagePreview) => {
        if (imagePreview.selected) {
          sum += 1
        }
      })
      return sum
    },
  },
  watch: {
    async imageData(value) {
      if (value) {
        this.clearFields()
        this.imagePreviews = []
        for (let i = 0; i < this.imageData.length; i++) {
          this.imagePreviews.push({
            id: i,
            src: URL.createObjectURL(this.imageData[i]),
            selected: false,
            selectedAlbums: [],
            private: false
          })
        }
        const albums = (await AlbumService.get()).data
            this.allAlbums = albums.map(album => {
              return album.name
        })
        this.show = true
      }
    }
  },
  methods: {
    edit() {
      this.imagePreviews = this.imagePreviews.map((imagePreview) => {
        if (imagePreview.selected) {
            imagePreview.selectedAlbums = [...this.selectedAlbums]
            imagePreview.selected = false
            imagePreview.private = this.privateCheckbox
        }
        return imagePreview
      })
      this.selectedAlbums = []
    },
    async upload() {
      try {
        let allFormData = []
        for (let i = 0; i < this.imageData.length; i++) {
          const response = (await ImageService.initiateUpload({
            visibility: this.imagePreviews[i].private  ? 0 : 1,
            albums: this.imagePreviews[i].selectedAlbums
          })).data
          const cancellationToken = response.cancellationToken
          const formData = new FormData()
          formData.append('file', this.imageData[i])
          formData.append('signature', response.signature)
          formData.append('timestamp', response.timestamp)
          formData.append('public_id', response.publicId)
          formData.append('folder', this.$store.state.user.username)
          formData.append('api_key', process.env.VUE_APP_CLOUDINARY_API_KEY)
          allFormData.push({
            formData,
            cancellationToken
          })
        }
        this.$store.dispatch('initiateUpload', allFormData)
        this.show = false
      } catch (err) {
        console.log(err)
      }
    },
    select(id) {
      this.differentAlbumsSelected = false
      this.privateCheckboxIndeterminate = false
      //console.log('választás')
      if (this.imagePreviews[id].selected) {
        this.imagePreviews[id].selected = false
      } else {
        this.imagePreviews[id].selected = true
      }
      if (this.selectedCount === 0) {
        this.selectedAlbums = []
      } else if (this.selectedCount === 1) {
        this.imagePreviews.forEach((imagePreview) => {
          if (imagePreview.selected) {
            //console.log(imagePreview.id)
            this.selectedAlbums = [...imagePreview.selectedAlbums]
            this.privateCheckbox = imagePreview.private
          }
        })
      } else if (this.selectedCount > 1 && this.sameAlbumsSelected()) {
        this.imagePreviews.forEach((imagePreview) => {
          if (imagePreview.selected && imagePreview.selectedAlbums.length > 0) {
            //console.log(imagePreview.id)
            this.selectedAlbums = [...imagePreview.selectedAlbums]
          }
        })
      } else {
        this.differentAlbumsSelected = true
        this.selectedAlbums = []
      }

      if (this.selectedCount > 1 && this.sameVisibilitySelected()) {
        this.imagePreviews.forEach((imagePreview) => {
          if (imagePreview.selected) {
            this.privateCheckbox = imagePreview.private
          }
        })
      } else if (this.selectedCount > 1 && !this.sameVisibilitySelected()) {
        this.privateCheckboxIndeterminate = true
      }
    },
    sameAlbumsSelected() {
      let sameAlbums = true
      let selectedImagePreviews = this.imagePreviews.filter((imagePreview) => {
        if (imagePreview.selected) {
          return imagePreview
        }
      })
      for (let i = 0; i < selectedImagePreviews.length; i++) {
        let selectedAlbums = selectedImagePreviews[i].selectedAlbums
        for (let j = i + 1; j < selectedImagePreviews.length; j++) {
          let otherSelectedAlbums = selectedImagePreviews[j].selectedAlbums
          if (selectedAlbums.length !== otherSelectedAlbums.length) {
            sameAlbums = false
            break
          }
          for (let k = 0; k < selectedAlbums.length; k++) {
            if (selectedAlbums[k] !== otherSelectedAlbums[k]) {
              sameAlbums = false
              break
            }
          }
        }
      
      }
      return sameAlbums
    },
    sameVisibilitySelected() {
      let selectedImagePreviews = this.imagePreviews.filter((imagePreview) => {
        if (imagePreview.selected) {
          return imagePreview
        }
      })
      if (selectedImagePreviews.length === 0 || selectedImagePreviews.length === 1) {
        return true
      }
      const privacy = selectedImagePreviews[0].private
      for (let i = 1; i < selectedImagePreviews.length; i++) {
        if (privacy !== selectedImagePreviews[i].private) {
          return false
        }
      }

      return true
    },
    close() {
      this.clearFields()
      this.show = false
    },
    async clearFields() {
      this.selectedAlbums = []
      this.privateCheckbox = false
    }
  }
}
</script>

<style>
.upload-container {
  padding: 0px
}

.column {
  padding: 0px
}

.photo-grid {
  overflow: auto;
}

.selected {
  border: 4px solid #2196F3;
  border-radius: 5px;
}

.not-selected {
  border: 4px solid rgb(158, 158, 158, 0.2);
  border-radius: 5px;
  background-clip: padding-box;
}

.not-selected:hover {
  border: 4px solid #92c8f5;
  border-radius: 5px;
  background-clip: padding-box;
}

.photo {
  transition: 0.2s;
}

.photo-grid::-webkit-scrollbar {display:none;}
</style>