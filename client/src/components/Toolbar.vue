<template>
    <v-app-bar dense app fixed flat clipped-right style="top: 64px" class="toolbar" color="grey lighten-3">
      <v-toolbar-items>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              depressed
              rounded
              v-bind="attrs"
              v-on="on"
              color="grey lighten-3">
              <v-icon>
                mdi-plus
              </v-icon>
              New
            </v-btn>
          </template>
          <v-list>
            <form
                name ="form"
                autocomplete="off">
                  <v-list-item :disabled="$store.state.uploadInProgress ? true : false" @click="$refs.fileInput.click()">
                    <v-list-item-title>Photo</v-list-item-title>
                  </v-list-item>
                <input
                  type="file"
                  style="display: none"
                  ref="fileInput"
                  accept="image/jpeg, image/png"
                  multiple
                  @change="onFileChosen">
              </form>
            <v-list-item @click="dialog = true">
              <v-list-item-title>Album</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <new-album-dialog :show="dialog" v-on:close="dialog = false"/>
        <div v-if="$route.name === 'Albums'">        
            
        </div>
        <div v-if="$route.name === 'Photos'">
          
        </div>
      </v-toolbar-items>
      <v-spacer />
      <v-toolbar-items>
        <v-btn depressed color="grey lighten-3" class="upload-button" @click="$emit('showUploadbar')">
          <v-icon class="blue--text">mdi-autorenew</v-icon>
          <div class="text-body-2">Upload of 1 photo is in progress</div>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar> 
</template>

<script>
import NewAlbumDialog from '@/components/NewAlbumDialog'
export default {
  components: {
    NewAlbumDialog
  },
  data () {
    return {
      dialog: false
    }
  },
  methods: {
    onFileChosen(event) {
      console.log(event.target.files)
      this.$store.dispatch('imageChosen', event.target.files)
    }
  }
}
</script>

<style>
.toolbar {
  padding: 0px;
}
.upload-button {
  text-transform: none;
}
</style>