<template>
    <v-app-bar dense app fixed flat clipped-right style="top: 64px" class="toolbar" color="grey lighten-3">
      <v-toolbar-items>
        <v-btn
          v-if="$route.name === 'Photos' && user.username === $route.params.username && $route.params.album === 'trash'"
          depressed
          rounded
          color="grey lighten-3"
          class="text-none text-subtitle-1"
          @click="$store.dispatch('triggerRestoreAll')">
          <v-icon color="blue">
            mdi-restore
          </v-icon>
          <span v-if="$vuetify.breakpoint.smAndUp">Restore all</span>
        </v-btn>
        <v-btn
          v-if="$route.name === 'Photos' && user.username === $route.params.username && $route.params.album === 'trash'"
          depressed
          rounded
          color="grey lighten-3"
          class="text-none text-subtitle-1"
          @click="$store.dispatch('triggerDeleteAll')">
          <v-icon color="blue">
            mdi-delete-forever
          </v-icon>
          <span v-if="$vuetify.breakpoint.smAndUp">Delete all</span>
        </v-btn>
        <v-btn
          v-if="$route.name === 'UserAlbums' && user.username === $route.params.username"
          depressed
          rounded
          color="grey lighten-3"
          class="text-subtitle-1 text-capitalize"
          @click="!user.confirmationToken ? showNewAlbumDialog = true : showAlertDialog = true">
          <v-icon color="blue">
            mdi-plus
          </v-icon>
          <span v-if="$vuetify.breakpoint.smAndUp">New</span>
        </v-btn>
        <alert-dialog 
          v-if="showAlertDialog" 
          :show="showAlertDialog"
          :title="'Whoops'"
          :text="'You need to confirm your email address before you can start creating albums.'"
          @close="showAlertDialog = false">
        </alert-dialog>
        <v-btn
          v-if="$route.name === 'Photos' && !['all', 'favourites', 'trash'].includes($route.params.album)  && user.username === $route.params.username"
          depressed
          rounded
          color="grey lighten-3"
          class="text-subtitle-1 text-capitalize"
          @click="addPhotosToAlbum()">
          <v-icon color="blue" class="pr-1">
            mdi-plus-box-multiple
          </v-icon>
          <span v-if="$vuetify.breakpoint.smAndUp">Add photos</span>
          <add-photos-to-album-dialog
          v-if="showAddPhotosDialog" 
          :show="showAddPhotosDialog" 
          :album="albumToAddPhotos" 
          @updatePhotos="updatePhotos"
          @close="showAddPhotosDialog = false" />
        </v-btn>
        <new-album-dialog :show="showNewAlbumDialog" v-on:close="showNewAlbumDialog = false"/>
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
              <span v-if="$vuetify.breakpoint.smAndUp">Upload date</span>
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
              <span v-if="$vuetify.breakpoint.smAndUp">Visibility</span>
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
import NewAlbumDialog from '@/components/pages/UserPage/NewAlbumDialog'
import AddPhotosToAlbumDialog from '@/components/pages/UserPage/AddPhotosToAlbumDialog'
import AlertDialog from '@/components/common/AlertDialog'
import AlbumService from '@/services/AlbumService'
import { mapState } from 'vuex'
export default {
  components: {
    NewAlbumDialog,
    AddPhotosToAlbumDialog,
    AlertDialog
  },
  data () {
    return {
      showNewAlbumDialog: false,
      showAddPhotosDialog: false,
      showAlertDialog: false,
      albumToAddPhotos: null
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
    changeSort(sort) {
      this.$store.dispatch('changeSort', sort)
    },
    changeVisibility(visibility) {
      this.$store.dispatch('changeVisibility', visibility)
    },
    async addPhotosToAlbum() {
      try {
        this.albumToAddPhotos = (await AlbumService.get({ id: this.$route.params.album })).data
        console.log(this.albumToAddPhotos)
        this.showAddPhotosDialog = true
      } catch (err) {
        console.log(err)
        this.$store.dispatch('alert', 'Error while trying to add photos to album')
      }
    },
    updatePhotos() {
      this.$store.dispatch('updateShownPhotos')
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