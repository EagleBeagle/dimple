<template>
<v-dialog
  scrollable
  v-model="show"
  :width="$vuetify.breakpoint.smAndDown ? '100%' : $vuetify.breakpoint.mdOnly ? '70%' : '50%'">
  <v-card>
    <v-card-title>
      <v-container class="pa-0 ma-0">
        <v-row justify="space-between" class="mb-sm-1">
          <v-col cols="3" class="ma-0 pa-0">
            <span class="text-h5 font-weight-medium" style="white-space: nowrap">Upload New Photos</span>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="3" lg="2" class="ma-0 pa-0" align-self="center" v-if="$vuetify.breakpoint.smAndUp">
            <span
              style="white-space: nowrap; cursor: pointer; text-align: end"
              class="pl-0 ma-0 pl-5"
              :class="allSelected ? 'blue--text' : null"
              @click="selectAll()"
            >select all</span>
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>
    <v-divider></v-divider>
    <v-container class="py-0">
      <v-row justify="space-around">
        <v-col cols="3" class="pa-0" v-if="$vuetify.breakpoint.smAndUp">
          <v-card-text>
          <v-container class="ml-4">
            <v-row v-if="!selectedCount" justify="center">
              <div class="text-h6 font-weight-regular" style="text-align: center">
                Select photos to edit...
              </div>
            </v-row>
            <v-row v-else justify="start" class="mt-5">
              <div v-if="selectedCount === 1" class="text-h6 font-weight-regular">
                Editing 1 photo
              </div>
              <div v-else class="text-h6 font-weight-regular">
                Editing {{ selectedCount }} photos
              </div>
            </v-row>
            <v-row v-if="selectedCount" class="mr-1 mt-5" justify="center">
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
            <v-row v-if="selectedCount" class="mr-1" justify="start">
              <v-checkbox
                v-model="privateCheckbox"
                label="Private"
                :indeterminate="privateCheckboxIndeterminate"
              ></v-checkbox>
            </v-row>
            <v-row v-if="selectedCount" class="mr-1 mt-5" justify="center">
              <v-btn
                color="blue"
                block
                outlined
                @click="edit()">
                Done
              </v-btn>
            </v-row>
          </v-container>
        </v-card-text>
        </v-col>
        <v-divider v-if="$vuetify.breakpoint.smAndUp" vertical></v-divider>
        <v-col cols="12" sm="8" class="pa-0">
        <v-card-text class="photo-grid" :style="$vuetify.breakpoint.smAndUp ? 'height: 400px;' : 'height: 300px'">
          <v-container style="upload-container" fluid :class="$vuetify.breakpoint.xsOnly ? 'pa-1' : ''">
            <v-row justify="start">
              <v-col cols="4" sm="6" md="4" lg="3" :class="$vuetify.breakpoint.smAndUp ? 'pa-2' : 'pa-1'" v-for="(imagePreview, index) in imagePreviews" :key="index">
                <v-img 
                  :src="imagePreview.src" 
                  v-bind:class="[imagePreview.selected ? 'selected' : 'not-selected', 'photo']"
                  aspect-ratio="1"
                  @click="$vuetify.breakpoint.smAndUp ? select(imagePreview.id) : null">
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
        width="82px"
        @click="!loading ? upload() : null">
        <span v-if="!loading">UPLOAD</span>
        <v-progress-circular
          v-else
          size="25"
          width="3"
          color="blue"
          indeterminate
        ></v-progress-circular>
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
      privateCheckboxIndeterminate: true,
      allSelected: false,
      loading: false
    }
  },
  computed: {
    ...mapState([
      'imageData',
      'user'
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
        if (this.imageData.length > 50) {
          this.$store.dispatch('alert', "You can't upload more than 50 photos at a time.")
        }
        for (let i = 0; i < this.imageData.length; i++) {
          if (this.imageData[i].size >= 10 * 1024 * 1024) {
            this.$store.dispatch('alert', "The maximum file size limit is 10MB.")
            return
          }
          this.imagePreviews.push({
            id: i,
            src: URL.createObjectURL(this.imageData[i]),
            selected: false,
            selectedAlbums: [],
            private: false
          })
        }
        const albums = (await AlbumService.get({ user: this.user.username })).data
            this.allAlbums = albums.map(album => {
              return album.name
        })
        this.show = true
      }
    },
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
    selectAll() {
      if (!this.allSelected) {
        this.imagePreviews = this.imagePreviews.map((imagePreview) => {
          imagePreview.selected = true
          return imagePreview
        })
        this.allSelected = !this.allSelected
      }
    },
    async upload() {
      try {
        let allFormData = []
        this.loading = true
        for (let i = 0; i < this.imageData.length; i++) {
          const response = (await ImageService.initiateUpload({
            visibility: this.imagePreviews[i].private  ? false : true,
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
        this.loading = false
        this.show = false
      } catch (err) {
        this.loading = false
        this.$store.dispatch('alert', 'An error happened during upload initialization')
        this.clearFields()
        this.show = false
      }
    },
    select(id) {
      this.differentAlbumsSelected = false
      this.privateCheckboxIndeterminate = false
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
            this.selectedAlbums = [...imagePreview.selectedAlbums]
            this.privateCheckbox = imagePreview.private
          }
        })
      } else if (this.selectedCount > 1 && this.sameAlbumsSelected()) {
        this.imagePreviews.forEach((imagePreview) => {
          if (imagePreview.selected && imagePreview.selectedAlbums.length > 0) {
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
      if (this.selectedCount !== this.imagePreviews.length) {
        this.allSelected = false
      } else {
        this.allSelected = true
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
      this.allSelected = false
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

img {
  max-width: 100%;
  max-height: 100%;
}
</style>