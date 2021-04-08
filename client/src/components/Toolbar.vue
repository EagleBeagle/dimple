<template>
    <v-app-bar dense app fixed flat clipped-right style="top: 64px" class="toolbar" color="grey lighten-3">
      <v-toolbar-items>
        <v-menu offset-y tile>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              depressed
              rounded
              v-bind="attrs"
              v-on="on"
              color="grey lighten-3"
              class="text-subtitle-1 text-capitalize">
              <v-icon color="blue">
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
        
        <span v-if="$route.name === 'Photos'">
          
        </span>

      </v-toolbar-items>
      <v-spacer />
      <v-toolbar-items>
      <v-menu offset-y :close-on-content-click="false" tile v-if="$route.name === 'Photos'">
        <template v-slot:activator="{ on, attrs }">
            <v-btn
              depressed
              rounded
              v-bind="attrs"
              v-on="on"
              color="grey lighten-3"
              class="text-none text-subtitle-1">
              <v-icon v-if="sort.order === 'asc'" color="blue" class="pr-1">
                mdi-sort-ascending
              </v-icon>
              <v-icon v-else color="blue" class="pr-1">
                mdi-sort-descending
              </v-icon>
              Upload date
              <v-icon color="grey">
                mdi-chevron-down
              </v-icon>
            </v-btn>
          </template>
          <v-list class="py-0">
            <v-list-item @click="changeSort({ category: 'date', order: 'asc' })">
              <v-list-item-icon class="mx-0">
                <v-icon :color="sort.order === 'asc' ? 'grey' : 'rgb(0,0,0,0)'">mdi-check</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="pl-2 text-body-1">Ascending</v-list-item-content>
            </v-list-item>
            <v-list-item @click="changeSort({ category: 'date', order: 'desc' })">
              <v-list-item-icon class="mx-0">
                <v-icon :color="sort.order === 'desc' ? 'grey' : 'rgb(0,0,0,0)'">mdi-check</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="pl-2 text-body-1">Descending</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu offset-y :close-on-content-click="false" tile v-if="$route.params.username === user.username">
        <template v-slot:activator="{ on, attrs }">
            <v-btn
              depressed
              rounded
              v-bind="attrs"
              v-on="on"
              color="grey lighten-3"
              class="text-subtitle-1 text-capitalize">
              <v-icon v-if="visibility === 'private'" color="blue" class="pr-2">
                mdi-eye-off
              </v-icon>
              <v-icon v-else-if="visibility === 'public'" color="blue" class="pr-2">
                mdi-eye
              </v-icon>
              <v-icon v-else color="blue" class="pr-2">
                mdi-eye-plus
              </v-icon>
              Visibility
              <v-icon color="grey">
                mdi-chevron-down
              </v-icon>
            </v-btn>
          </template>
          <v-list class="py-0">
            <v-list-item @click="changeVisibility('public')">
              <v-list-item-icon class="mx-0">
                <v-icon :color="visibility === 'public' ? 'grey' : 'rgb(0,0,0,0)'">mdi-check</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="pl-2 text-body-1">Public</v-list-item-content>
            </v-list-item>
            <v-list-item @click="changeVisibility('private')">
              <v-list-item-icon class="mx-0">
                <v-icon :color="visibility === 'private' ? 'grey' : 'rgb(0,0,0,0)'">mdi-check</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="pl-2 text-body-1">Private</v-list-item-content>
            </v-list-item>
            <v-list-item @click="changeVisibility('all')">
              <v-list-item-icon class="mx-0">
                <v-icon :color="visibility === 'all' ? 'grey' : 'rgb(0,0,0,0)'">mdi-check</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="pl-2 text-body-1">View all</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-app-bar> 
</template>

<script>
import NewAlbumDialog from '@/components/NewAlbumDialog'
import { mapState } from 'vuex'
export default {
  components: {
    NewAlbumDialog,
  },
  data () {
    return {
      dialog: false
    }
  },
  computed: {
    ...mapState([
      'user',
      'sort',
      'visibility'
    ])
  },
  mounted() {
    console.log(this.$route.name)
  },
  methods: {
    onFileChosen(event) {
      console.log(event.target.files)
      this.$store.dispatch('imageChosen', event.target.files)
    },
    changeSort(sort) {
      this.$store.dispatch('changeSort', sort)
    },
    changeVisibility(visibility) {
      this.$store.dispatch('changeVisibility', visibility)
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