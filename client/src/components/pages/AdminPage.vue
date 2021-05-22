<template>
  <v-container fluid class="pa-5">
    <v-row justify="start">
      <v-col class style="text-align: left">
        <div class="text-h3 font-weight-regular my-2">Administration</div>
      </v-col>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <v-row justify="space-around">
      <v-col cols="12" md="6" lg="4" class="pa-0">
        <v-card class="ma-2 elevation-5 text-h5">
          <v-card-title>
            Total Users
          </v-card-title>
          <v-card-text>
            <v-container class="pa-0">
              <v-row justify="center">
                <v-col cols="6">
                  <v-icon size="100px" color="green">
                    mdi-account-multiple
                  </v-icon>
                </v-col>
                <v-col v-if="!loadingInfo" cols="6" align-self="center" style="font-size: 50px; color: #4CAF50;">
                  {{ adminInfo.userCount }}
                </v-col>
                <v-col v-else cols="6" align-self="center" style="font-size: 50px; color: #4CAF50;">
                  <v-progress-circular
                    size="50"
                    width="7"
                    indeterminate
                  ></v-progress-circular>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4" class="pa-0">
        <v-card class="ma-2 elevation-5 text-h5">
          <v-card-title>
            Total Photos
          </v-card-title>
          <v-card-text>
            <v-container class="pa-0">
              <v-row justify="center">
                <v-col cols="6">
                  <v-icon size="100px" color="blue">
                    mdi-image-multiple
                  </v-icon>
                </v-col>
                <v-col v-if="!loadingInfo" cols="6" align-self="center" style="font-size: 50px; color: #2196F3;">
                  {{ adminInfo.photoCount }}
                </v-col>
                <v-col v-else cols="6" align-self="center" style="font-size: 50px; color: #2196F3;">
                  <v-progress-circular
                    size="50"
                    width="7"
                    indeterminate
                  ></v-progress-circular>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="12" lg="4" class="pa-0">
        <v-card class="ma-2 elevation-5 text-h5">
          <v-card-title>
            Monthly Cloudinary Usage
          </v-card-title>
          <v-card-text>
            <v-container class="pa-0">
              <v-row justify="center">
                <v-col cols="6">
                  <v-icon size="100px" color="orange">
                    mdi-cloud
                  </v-icon>
                </v-col>
                <v-col v-if="!loadingInfo" cols="6" align-self="center" style="font-size: 50px; color: #FF9800;">
                  {{ adminInfo.cloudinaryUsage }}%
                </v-col>
                <v-col v-else cols="6" align-self="center" style="font-size: 50px; color: #FF9800;">
                  <v-progress-circular
                    size="50"
                    width="7"
                    indeterminate
                  ></v-progress-circular>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" class="pa-2">
        <v-data-table
          :headers="userHeaders"
          :items="users"
          :items-per-page="5"
          :loading="loadingUsers"
          :search="searchUsers"
          class="elevation-5"
          height="30vh">
          <template v-slot:top>
            <v-text-field
              v-model="searchUsers"
              label="Users"
              class="mx-4 pt-4"
            ></v-text-field>
          </template>
          <template v-slot:item.username="{ item }">
            <span style="cursor: pointer" class="font-weight-bold" @click="$router.push({ name: 'Photos', params: { username: item.username, album: 'all' } })">{{ item.username }}</span>
          </template>
          <template v-slot:item.confirmed="{ item }">
            <v-icon
              color="blue"
              v-if="item.confirmed">
              mdi-check
            </v-icon>
            <v-icon
              color="red lighten-2"
              v-else>
              mdi-close
            </v-icon>
          </template>
          <template v-slot:item.admin="{ item }">
            <v-icon
              color="blue"
              v-if="item.admin">
              mdi-check
            </v-icon>
            <v-icon
              color="red lighten-2"
              v-else>
              mdi-close
            </v-icon>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small v-if="!item.admin && item.username !== user.username" @click="setAdmin(item, true)" class="mr-2">
              mdi-account-plus
            </v-icon>
            <v-icon small v-if="item.admin && item.username !== user.username" @click="setAdmin(item, false)" class="mr-2">
              mdi-account-minus
            </v-icon>
            <v-icon small v-if="item.username !== user.username" @click="deleteUser(item)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12" md="6" class="pa-2">
        <v-data-table
          :headers="imageHeaders"
          :items="images"
          :items-per-page="5"
          :loading="loadingImages"
          :search="searchImages"
          class="elevation-5"
          height="30vh">
          <template v-slot:top>
            <v-text-field
              v-model="searchImages"
              label="Photos"
              class="mx-4 pt-4"
            ></v-text-field>
          </template>
          <template v-slot:item.id="{ item }">
            <span class="font-weight-bold" style="cursor: pointer" @click="$router.push({ name: 'Photo', params: { username: item.fk_username, id: item.id } })">{{ item.id }}</span>
          </template>
          <template v-slot:item.fk_username="{ item }">
            <span class="font-weight-bold" style="cursor: pointer" @click="$router.push({ name: 'Photos', params: { username: item.fk_username, album: 'all' } })">{{ item.fk_username }}</span>
          </template>
          <template v-slot:item.cancellationToken="{ item }">
            <v-icon
              color="blue"
              v-if="!item.cancellationToken">
              mdi-check
            </v-icon>
            <v-icon
              color="red lighten-2"
              v-else>
              mdi-close
            </v-icon>
          </template>
          <template v-slot:item.visibility="{ item }">
            <v-icon
              color="blue"
              v-if="item.visibility">
              mdi-eye
            </v-icon>
            <v-icon
              color="blue"
              v-else>
              mdi-eye-off
            </v-icon>
          </template>
          <template v-slot:item.trashed="{ item }">
            <v-icon
              color="blue"
              v-if="item.trashed">
              mdi-check
            </v-icon>
            <v-icon
              color="red lighten-2"
              v-else>
              mdi-close
            </v-icon>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small v-if="!item.visibility" @click="setImageVisibility(item, true)" class="mr-2">
              mdi-eye-plus
            </v-icon>
            <v-icon small v-if="item.visibility" @click="setImageVisibility(item, false)" class="mr-2">
              mdi-eye-minus
            </v-icon>
            <v-icon small @click="deleteImage(item)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" class="pa-2">
        <v-data-table
          :headers="commentHeaders"
          :items="comments"
          :items-per-page="5"
          :loading="loadingComments"
          :search="searchComments"
          class="elevation-5"
          height="30vh">
          <template v-slot:top>
            <v-text-field
              v-model="searchComments"
              label="Comments"
              class="mx-4 pt-4"
            ></v-text-field>
          </template>
          <template v-slot:item.imageId="{ item }">
            <span class="font-weight-bold" style="cursor: pointer" @click="$router.push({ name: 'Photo', params: { username: item.fk_username, id: item.imageId } })">{{ item.imageId }}</span>
          </template>
          <template v-slot:item.fk_username="{ item }">
            <span class="font-weight-bold" style="cursor: pointer" @click="$router.push({ name: 'Photos', params: { username: item.fk_username, album: 'all' } })">{{ item.fk_username }}</span>
          </template>
          <template v-slot:item.replyTo="{ item }">
            <v-icon
              color="blue"
              v-if="item.replyTo">
              mdi-check
            </v-icon>
            <v-icon
              color="red lighten-2"
              v-else>
              mdi-close
            </v-icon>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small @click="deleteComment(item)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12" md="6" class="pa-2">
        <v-data-table
          :headers="albumHeaders"
          :items="albums"
          :items-per-page="5"
          :loading="loadingAlbums"
          :search="searchAlbums"
          class="elevation-5"
          height="30vh">
          <template v-slot:top>
            <v-text-field
              v-model="searchAlbums"
              label="Albums"
              class="mx-4 pt-4"
            ></v-text-field>
          </template>
          <template v-slot:item.name="{ item }">
            <span class="font-weight-bold" style="cursor: pointer" @click="$router.push({ name: 'Photos', params: { username: item.fk_username, album: item.id } })">{{ item.name }}</span>
          </template>
          <template v-slot:item.fk_username="{ item }">
            <span class="font-weight-bold" style="cursor: pointer" @click="$router.push({ name: 'Photos', params: { username: item.fk_username, album: 'all' } })">{{ item.fk_username }}</span>
          </template>
          <template v-slot:item.visibility="{ item }">
            <v-icon
              color="blue"
              v-if="item.visibility">
              mdi-eye
            </v-icon>
            <v-icon
              color="blue"
              v-else>
              mdi-eye-off
            </v-icon>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small v-if="!item.visibility" @click="setAlbumVisibility(item, true)" class="mr-2">
              mdi-eye-plus
            </v-icon>
            <v-icon small v-if="item.visibility" @click="setAlbumVisibility(item, false)" class="mr-2">
              mdi-eye-minus
            </v-icon>
            <v-icon small @click="deleteAlbum(item)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UserService from '@/services/UserService'
import ImageService from '@/services/ImageService'
import CommentService from '@/services/CommentService'
import AlbumService from '@/services/AlbumService'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      adminInfo: {},
      loadingInfo: true,
      users: [],
      userHeaders: [
        { text: 'Username', value: 'username' },
        { text: 'Email', value: 'email' },
        { text: 'Confirmed', value: 'confirmed', align: 'center' },
        { text: 'Registration date', value: 'createdAt' },
        { text: 'Photo count', value: 'imageCount' },
        { text: 'Admin', value: 'admin' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      loadingUsers: true,
      searchUsers: '',
      images: [],
      imageHeaders: [
        { text: 'ID', value: 'id' },
        { text: 'Owner', value: 'fk_username' },
        { text: 'Visibility', value: 'visibility', align: 'center' },
        { text: 'Creation date', value: 'createdAt' },
        { text: 'Trashed', value: 'trashed', align: 'center' },
        { text: 'Validated', value: 'cancellationToken', align: 'center' },
        { text: 'Favourites', value: 'favouriteCount' },
        { text: 'Comments', value: 'commentCount' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      loadingImages: true,
      searchImages: '',
      albums: [],
      albumHeaders: [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Owner', value: 'fk_username' },
        { text: 'Visibility', value: 'visibility' },
        { text: 'Creation date', value: 'createdAt' },
        { text: 'Photos', value: 'imageCount' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      loadingAlbums: true,
      searchAlbums: '',
      comments: [],
      commentHeaders: [
        { text: 'Owner', value: 'fk_username' },
        { text: 'Text', value: 'text' },
        { text: 'Photo', value: 'imageId' },
        { text: 'Creation date', value: 'createdAt' },
        { text: 'Reply', value: 'replyTo' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'center' }
      ],
      loadingComments: true,
      searchComments: ''
    }
  },
  async mounted() {
    await this.getAdminInfo()
    await this.getUsers()
    await this.getImages()
    await this.getComments()
    await this.getAlbums()
  },
  computed: {
    ...mapState([
      'user'
    ])
  },
  methods: {
    async getAdminInfo() {
      try {
        this.loadingInfo = true
        this.adminInfo = (await UserService.getAdminInfo()).data
        this.loadingInfo = false
      } catch (err) {
        this.loadingInfo = false
        this.$store.dispatch('alert', 'An error happened while page info')
      }
    },
    async getUsers() {
      try {
        this.loadingUsers = true
        this.users = (await UserService.search('', true)).data
        this.loadingUsers = false
      } catch (err) {
        this.loadingUsers = false
        this.$store.dispatch('alert', 'An error happened while fetching users')
      }
    },
    async getImages() {
      try {
        this.loadingImages = true
        this.images = (await ImageService.get({ admin: true })).data
        this.loadingImages = false
      } catch (err) {
        this.loadingImages = false
        this.$store.dispatch('alert', 'An error happened while fetching images')
      }
    },
    async getAlbums() {
      try {
        this.loadingAlbums = true
        this.albums = (await AlbumService.get({ admin: true })).data
        this.loadingAlbums = false
      } catch (err) {
        this.loadingAlbums = false
        this.$store.dispatch('alert', 'An error happened while fetching albums')
      }
    },
    async getComments() {
      try {
        this.loadingComments = true
        this.comments = (await CommentService.get({ admin: true })).data
        this.loadingComments = false
      } catch (err) {
        this.loadingComments = false
        this.$store.dispatch('alert', 'An error happened while fetching comments')
      }
    },
    async setAdmin(user, admin) {
      try {
        await UserService.update(user.username, { admin })
        this.users = this.users.map(localUser => {
          if (localUser.username === user.username) {
            localUser.admin = admin
          }
          return localUser
        })
      } catch (err) {
        this.$store.dispatch('alert', 'An error happened while changing admin status of user.')
      }
    },
    async deleteUser(user) {
      try {
        await UserService.delete(user.username)
        this.users = this.users.filter(localUser => localUser.username !== user.username)
        this.$store.dispatch('alert', 'User deleted successfully.')
      } catch (err) {
        this.$store.dispatch('alert', 'An error happened during user deletion.')
      }
    },
    async setImageVisibility(image, visibility) {
      try {
        await ImageService.update(image.id, { visibility })
        this.images = this.images.map(localImage => {
          if (localImage.id === image.id) {
            localImage.visibility = visibility
          }
          return localImage
        })
      } catch (err) {
        this.$store.dispatch('alert', 'An error happened while changing visibility of image.')
      }
    },
    async deleteImage(image) {
      try {
        await ImageService.delete(image.id)
        this.images = this.images.filter(localImage => localImage.id !== image.id)
        this.$store.dispatch('alert', 'Photo deleted successfully.')
      } catch (err) {
        this.$store.dispatch('alert', 'An error happened during image deletion.')
      }
    },
    async deleteComment(comment) {
      try {
        await CommentService.delete(comment.id)
        this.comments = this.comments.filter(localComment => localComment.id !== comment.id)
        this.$store.dispatch('alert', 'Comment deleted successfully.')
      } catch (err) {
        this.$store.dispatch('alert', 'An error happened during comment deletion.')
      }
    },
    async setAlbumVisibility(album, visibility) {
      try {
        await AlbumService.update(album.id, { visibility })
        this.albums = this.albums.map(localAlbum => {
          if (localAlbum.id === album.id) {
            localAlbum.visibility = visibility
          }
          return localAlbum
        })
      } catch (err) {
        this.$store.dispatch('alert', 'An error happened while changing visibility of album.')
      }
    },
    async deleteAlbum(album) {
      try {
        await AlbumService.delete(album.id)
        this.albums = this.albums.filter(localAlbum => localAlbum.id !== album.id)
        this.$store.dispatch('alert', 'Album deleted successfully.')
      } catch (err) {
        this.$store.dispatch('alert', 'An error happened during album deletion.')
      }
    }
  }
}
</script>

<style>

</style>