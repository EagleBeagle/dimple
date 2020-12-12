<template>
<v-dialog
  v-model="show"
  width="500">
  <v-card>
    <v-card-title class="headline">
      Upload New Photo
    </v-card-title>
    <v-card-text>
      <v-container style="upload-container">
        <v-row justify="space-around">
          <v-col xs="6" sm="6" md="6" lg="6" align-self="center" class="column">
            <v-img v-if="imagePreview" :src="imagePreview" width="150" height="150" max-width="150" max-height="150">
            </v-img>
          </v-col>
          <v-col xs="6" sm="6" md="6" lg="6" class="column">
            <v-container class="upload-container">
              <v-row class="mr-1">
                <v-select
                  class="album-select"
                  v-model="selectedAlbums"
                  :items="allAlbums"
                  label="Albums"
                  multiple>
                  <template v-slot:selection="{ item, index }">
                    <span v-if="index === 0">{{ item + ',' }}&nbsp;</span>
                    <span v-if="index === 1">{{ item }}&nbsp;</span>
                    <span
                      v-if="index === 2"
                      class="grey--text caption"
                    >
                      (+{{ selectedAlbums.length - 2 }} others)
                    </span>
                  </template>
                </v-select>
              </v-row>
              <v-row class="mr-1">
                <v-select
                  :items="visibilityItems"
                  label="Visibility"
                  v-model="visibility"
                ></v-select>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>

    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        depressed
        class="blue--text"
        @click="upload()"
      >
        CREATE
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
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState([
      'imageData'
    ])
  },
  watch: {
    async imageData(value) {
      if (value) {
        this.clearFields()
        this.imagePreview = URL.createObjectURL(this.imageData)
        const albums = (await AlbumService.get()).data
            this.allAlbums = albums.map(album => {
              return album.name
        })
        this.show = true
      }
    }
  },
  data () {
    return {
      show: false,
      imagePreview: null,
      selectedAlbums: [],
      allAlbums: [],
      visibilityItems: ['Private', 'Public'],
      visibility: 'Private',
    }
  },
  methods: {
    async upload() {
      try {
        const formData = new FormData()
        formData.append('image', this.imageData)
        formData.append('visibility', this.visibility === 'Private' ? 0 : 1)
        formData.append('albums', this.selectedAlbums)
        this.$store.dispatch('initiateUpload', formData)
        this.show = false
      } catch (err) {
        console.log(err)
      }
    },
    close() {
      this.clearFields()
      this.show = false
    },
    async clearFields() {
      this.selectedAlbums = []
      this.visibility = 'Private'
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

</style>