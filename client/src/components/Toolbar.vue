<template>
    <v-app-bar dense app fixed flat outlined style="top: 48px" class="toolbar">
      <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              depressed
              rounded
              v-bind="attrs"
              v-on="on">
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
                  <v-list-item @click="$refs.fileInput.click()">
                    <v-list-item-title>Photo</v-list-item-title>
                  </v-list-item>
                <input
                  type="file"
                  style="display: none"
                  ref="fileInput"
                  accept="image/jpeg, image/png"
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
      const image = event.target.files[0]
      this.$store.dispatch('imageChosen', image)
    }
  }
}
</script>

<style>
.toolbar {
  padding: 0px;
}
</style>