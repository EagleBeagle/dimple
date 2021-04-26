<template>
<v-dialog
  v-model="dialog"
  :width="$vuetify.breakpoint.xsOnly ? '100%' : '500'">
  <v-card>
    <v-card-title>
      <span v-if="image" class="text-h5">Share Photo</span>
      <span v-else-if="album" class="text-h5">Share Album</span>
      <v-spacer>
      </v-spacer>
      <v-icon @click="close()">
        mdi-close
      </v-icon>
    </v-card-title>
    <v-card-text class="pb-0 px-1" style="overflow: hidden">
      <v-container class="pa-0">
        <v-row justify="space-around" class="mx-1">
          <v-col cols="4" sm="2" class="py-1">
            <shareNetwork
              network="email"
              :url="url"
              :title="image ? `Dimple: ${user.username} would like to share a photo with you!` : `Dimple: ${user.username} would like to share an album with you!`">
              <v-btn 
                large
                fab
                depressed
                color="grey darken-1"
                class="network-icon">
                <v-icon color="white">
                  mdi-email
                </v-icon>
              </v-btn>
            </shareNetwork>
          </v-col>
          <v-col cols="4" sm="2" class="py-1">
            <shareNetwork
              network="facebook"
              :url="url"
              :title="image ? `${user.username} would like to share a photo with you!` : `${user.username} would like to share an album with you!`">
              <v-btn
                large
                fab
                depressed
                color="#4267B2"
                class="network-icon">
                <v-icon large color="white">
                  mdi-facebook
                </v-icon>
              </v-btn>
            </shareNetwork>
          </v-col>
          <v-col cols="4" sm="2" class="py-1">
            <shareNetwork
              network="messenger"
              :url="url"
              :title="image ? `${user.username} would like to share a photo with you!` : `${user.username} would like to share an album with you!`">
              <v-btn
                large
                fab
                depressed
                color="#00B2FF"
                class="network-icon">
                <v-icon color="white">
                  mdi-facebook-messenger
                </v-icon>
              </v-btn>
            </shareNetwork>
          </v-col>
          <v-col cols="4" sm="2" class="py-1">
            <shareNetwork
              network="reddit"
              :url="url"
              :title="image ? `Dimple: ${user.username} would like to share a photo with you!` : `Dimple: ${user.username} would like to share an album with you!`">
              <v-btn
                large
                fab
                depressed
                color="#FF5700"
                class="network-icon">
                <v-icon large color="white">
                  mdi-reddit
                </v-icon>
              </v-btn>
            </shareNetwork>
          </v-col>
          <v-col cols="4" sm="2" class="py-1">
            <shareNetwork
              network="twitter"
              :url="url"
              :title="image ? `Dimple: ${user.username} would like to share a photo with you!` : `Dimple: ${user.username} would like to share an album with you!`">
              <v-btn
                large
                fab
                depressed
                color="#1DA1F2"
                class="network-icon">
                <v-icon color="white">
                  mdi-twitter
                </v-icon>
              </v-btn>
            </shareNetwork>
          </v-col>
        </v-row>
        <v-row justify="center" class="mt-3">
          <v-col cols="10">
            <v-text-field
              :value="url"
              readonly
              single-line
              outlined
              append-icon="mdi-content-copy"
              @click:append="copyUrl()"
              class="text-body-1"
              ref="url"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: [
    'show',
    'image',
    'album'
  ],
  computed: {
    dialog: {
      get () {
        return this.show
      },
      set () {
        this.clearFields()
        this.$emit('close')
      }
    },
    ...mapState([
      'user'
    ])
  },
  mounted() {
    if (this.image) {
      this.url = `${window.location.origin}/photos/${this.image.fk_username}/${this.image.id}`
    } else if (this.album) {
      this.url = `${window.location.origin}/user/${this.album.fk_username}/photos/${this.album.id}`
    }
  },
  data () {
    return {
      url: ''
    }
  },
  methods: {
    close() {
    this.clearFields()
    this.dialog = false
    },
    async clearFields() {
      
    },
    copyUrl() {
      try {
        const textToCopy = this.$refs.url.$el.querySelector('input')
        textToCopy.select()
        document.execCommand('copy')
        this.$store.dispatch('alert', 'Link copied to clipboard')
      } catch (err) {
        this.$store.dispatch('alert', 'Copying unsuccessful')
      }
    }
  }
}
</script>

<style>
a {
  text-decoration: none;
}

.network-icon {
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);
}
</style>