<template>
<v-dialog
  scrollable
  v-model="show"
  :width="$vuetify.breakpoint.xs ? '100%' : '50%'">
  <v-card>
    <v-card-title>
      <v-container class="ma-0 pa-0">
        <v-row justify="space-between" class="mb-1">
          <v-col cols="3" class="ma-0 pa-0">
            <span class="headline font-weight-medium" style="white-space: nowrap">Upload New Photos</span>
          </v-col>
          <v-col cols="5" sm="4" md="3" lg="2" class="ma-0 pa-0" align-self="center">
            <span
              style="white-space: nowrap; cursor: pointer"
              class="pl-0 ma-0 pl-5"
              :class="allSelected ? 'blue--text' : null"
              @click="selectAll()"
            >select all</span>
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>
    <v-divider></v-divider>
    <v-container style="padding-bottom: 0px; padding-top: 0px">
      <v-row justify="space-around">
        <v-col cols="3" style="padding: 0px">
          <v-card-text class="pa-0">
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
              <v-col cols="12" v-if="albums" class="pa-0">
                <v-hover v-slot="{ hover }">
                  <v-card flat outlined tile :color="hover ? 'rgb(235, 235, 235)' : null">
                    <v-card-text class="pa-0 px-4">
                      <v-container class="pa-0">
                        <v-row justify="start" class="mb-2">
                          <v-col cols="9" class="pa-0 text-h6" style="text-align: start" v-if="selectedAlbums.length > 0">
                            Albums
                          </v-col>
                          <v-col cols="8" class="pa-0 text-h6" style="text-align: start; cursor: pointer" v-else @click="addToAlbums()">
                            Add to Albums
                          </v-col>
                          <v-spacer></v-spacer>
                          <v-fade-transition>
                            <v-col cols="2" v-if="hover" class="pa-0 pr-0" align-self="center">
                              <v-icon color="blue" @click="addToAlbums()">
                                mdi-plus
                              </v-icon>
                            </v-col>
                          </v-fade-transition>
                        </v-row>
                        <v-row justify="start" v-if="!differentAlbumsSelected && selectedAlbums.length > 0">
                          <v-col cols="3" class="pa-1" v-for="album in selectedAlbums" :key="album.id">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on, attrs }">
                                <v-img
                                  v-if="album.images.length > 0" 
                                  aspect-ratio="1" 
                                  :src="album.images[0].url"
                                  v-bind="attrs"
                                  v-on="on">
                                </v-img>
                                <v-img 
                                  v-else 
                                  aspect-ratio="1"
                                  style="border: 1px solid grey"
                                  v-bind="attrs"
                                  v-on="on">
                                  <v-container class="pa-0" fill-height>
                                    <v-row justify="center">
                                      <v-col cols="12" align-self="center" class="pa-0">
                                        <v-icon large>
                                          mdi-image-multiple
                                        </v-icon>
                                      </v-col>
                                    </v-row>
                                  </v-container>
                                </v-img>
                              </template>
                              <span>{{ album.name }}</span>
                            </v-tooltip>
                          </v-col>
                        </v-row>
                        <v-row v-else-if="differentAlbumsSelected && selectedAlbums.length > 0">
                          <v-col cols="12" style="text-align: center" class="text-body1">
                            Different albums selected
                          </v-col>
                        </v-row>
                        <add-to-albums-dialog
                          v-if="addToAlbumsDialog" 
                          :show="addToAlbumsDialog"
                          :selectedAlbums="selectedAlbums"
                          :inUploadDialog="true" 
                          @updateAlbums="updateAlbums" 
                          @close="addToAlbumsDialog = false" />
                      </v-container>
                    </v-card-text>
                  </v-card>
                </v-hover>
              </v-col>
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
        <v-divider vertical></v-divider>
        <v-col cols="8" style="padding: 0px">
        <v-card-text class="photo-grid" style="height: 400px;">
          <v-container style="upload-container" fluid>
            <v-row justify="start">
              <v-col cols="12" sm="6" md="4" lg="3" class="pa-2" v-for="(imagePreview, index) in imagePreviews" :key="index">
                <v-img 
                  :src="imagePreview.src" 
                  v-bind:class="[imagePreview.selected ? 'selected' : 'not-selected', 'photo']"
                  aspect-ratio="1"
                  @click="select(imagePreview.id)">
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
import { Cloudinary } from 'cloudinary-core';
import { mapState } from 'vuex'
import AlbumService from '@/services/AlbumService'
import ImageService from '@/services/ImageService'
import AddToAlbumsDialog from '@/components/AddToAlbumsDialog'
export default {
  components: { AddToAlbumsDialog },
  data () {
    return {
      show: false,
      albums: [],
      imagePreviews: [],
      selectedAlbums: [],
      allAlbums: [],
      differentAlbumsSelected: false,
      privateCheckbox: false,
      privateCheckboxIndeterminate: true,
      allSelected: false,
      addToAlbumsDialog: false
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
        this.albums = (await AlbumService.get({ user: this.user.username })).data.map(album => {
          album.images = album.images.map(image => {
            image.url = this.cloudinaryCore.url(`${image.fk_username}/${image.id}`)
            return image
          })
          return album
        })
        this.show = true
      }
    },
  },
  mounted() {
    this.cloudinaryCore = new Cloudinary({ cloud_name: process.env.VUE_APP_CLOUDINARY_NAME });
  },
  methods: {
    edit() {
      this.imagePreviews = this.imagePreviews.map((imagePreview) => {
        if (imagePreview.selected) {
            imagePreview.private = this.privateCheckbox
        }
        return imagePreview
      })
      this.selectedAlbums = []
    },
    selectAll() {
      console.log('hej')
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
        this.show = false
      } catch (err) {
        console.log(err)
      }
    },
    addToAlbums() {
      this.addToAlbumsDialog = true
    },
    updateAlbums(selectedAlbums) {
      this.albums = selectedAlbums
      this.addToAlbumsDialog = false
      this.imagePreviews = this.imagePreviews.map(imagePreview => {
        if (imagePreview.selected) {
          imagePreview.selectedAlbums = [...selectedAlbums]
        }
        return imagePreview
      })
      this.selectedAlbums = [...selectedAlbums]
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