<template>
<v-container class="px-8 album-container" fluid>
    <v-row justify="start">
      <v-col class="pb-0" style="text-align: left">
        <div class="display-1 my-2">Your Albums</div>
      </v-col>
    </v-row>
    <v-row class="pa-0">
      <album-grid
        :albums="albums"
        @open="openAlbum"
        @download="downloadAlbum"
        @delete="deleteAlbum" />
    </v-row>
  </v-container>
  
</template>

<script>
import AlbumService from '@/services/AlbumService'
import AlbumGrid from '@/components/AlbumGrid'
import { mapState } from 'vuex'
import { Cloudinary } from 'cloudinary-core';
export default {
  components: {
    AlbumGrid
  },
  data () {
    return {
      albums: []
    }
  },
  mounted() {
    this.cloudinaryCore = new Cloudinary({ cloud_name: process.env.VUE_APP_CLOUDINARY_NAME });
    this.getAlbums()
  },
  computed: {
    ...mapState([
      'newAlbum',
      'user'
    ])
  },
  watch: {
    newAlbum() {
      this.albums.push(this.newAlbum)
    }
  },
  methods: {
    openAlbum(id) {
      this.$router.push({ name: 'Photos', params: { album: id } })
    },
    async getAlbums() {
      try {
        this.albums = (await AlbumService.get({ user: this.user.username })).data.map(album => {
          album.images = album.images.map(image => {
            image.url = this.cloudinaryCore.url(`${this.user.username}/${image.id}`)
            return image
          })
          return album
        })
      } catch (err) {
        console.log(err)
        this.$store.dispatch('alert', 'An error has happened while fetching your albums')
      }
    },
    async downloadAlbum(id) {
      try {
        const url = (await AlbumService.download(id)).data
        window.open(url)
      } catch (err) {
        console.log(err)
        this.$store.dispatch('alert', 'An error has occured while preparing your download')
      }
    },
    async deleteAlbum(id) {
      try {
        await AlbumService.delete(id)
        this.albums = this.albums.filter(album => album.id !== id)
        this.$store.dispatch('alert', 'Album deleted successfully.')
      } catch (err) {
        console.log(err)
        this.$store.dispatch('alert', 'An error occured during deletion')
      }
    }
  }
}
</script>

<style>
.album-container {
  padding: 0px;
}

.vignette {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  box-shadow: 0 -70px 70px -40px rgb(43, 43, 43) inset;
}

.overlay-div {
  position: absolute;
  width: 100%;
  height: 100%;
}

.overlay-container {
  position: absolute;
  bottom: 0px;
  z-index: 2;
  word-wrap: break-word;
}

.album-name {
  text-align: start;
  text-shadow: 0px 0px 15px rgb(43, 43, 43);
}

.album-image-count {
  text-align: start;
}

.album-setting-icon {
  cursor: pointer;
}

</style>