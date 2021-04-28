<template>
  <v-container class="px-4 px-sm-4 px-md-16 photo-container" fluid>
    <v-row v-if="images" justify="start" align="start" class="align-self-start px-xs-0 px-sm-4 px-md-16">
      <v-col xs="12" sm="12" md="12" lg="12" class="pb-0" style="text-align: left">
        <div class="text-h2 font-weight-regular mt-2 mb-0">Explore</div>
      </v-col>
    </v-row>
    <v-divider class="my-3 mt-8 mx-16"></v-divider>
    <v-row v-if="loading">
      <v-col cols="12" class="grey--text text-h4 mt-10">
        <v-progress-circular
          size="50"
          width="5"
          color="blue"
          indeterminate
        ></v-progress-circular>
      </v-col>
    </v-row>
    <photo-grid
      :images="images" 
      @reachedBottom="infiniteHandler"
      @imageClicked="imageClicked" 
      class="px-xs-0 px-sm-4 px-md-16"/>
  </v-container>
</template>

<script>
import PhotoGrid from '@/components/common/PhotoGrid'
import ImageService from '@/services/ImageService'
import { mapState } from 'vuex'
export default {
  components: {
    PhotoGrid
  },
  data () {
    return {
      images: [],
      lastDate: null,
      cloudinaryCore: null,
      loading: false
    }
  },
  computed: {
    ...mapState([
      'user'
    ])
  },
  methods: {
    async getImages(filter) { // itt kell majd lekezelni a hiányzó képeket
      try {
        filter.sort = `date:desc`
        filter.explore = true
        const images = (await ImageService.get(filter)).data.map((image) => {
          image.url = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload/w_600/${image.fk_username}/${image.id}`
          return image
        })
        if (images.length) {
          this.lastDate = images[images.length - 1].createdAt
        }
        return images
      } catch (err) {
        this.$router.push({ name: 'GenericError' }).catch(() => {})
      }
    },
    async imageClicked(image) { // ezt kell még todozni
      this.$router.push({
        name: 'Photo',
        params: {
          username: image.fk_username,
          id: image.id
        },
        query: {
          in: this.$route.params.album,
          visibility: this.visibility,
          page: 'explore',
          order: `date:desc`
        }
      }).catch(() => {})
    },
    async infiniteHandler($state) {
      try {
        let images
        if (this.lastDate) {
          images = await this.getImages({
            to: this.lastDate,
            limit: 20
          })
        } else {
          this.loading = true
          images = await this.getImages({ limit: 20 })
          const last = this.$route.query.last
          if (last) {
            const lastDate = new Date(last)
            const createdDates = images.map(image => new Date(image.createdAt).toISOString())
            if (!createdDates.includes(lastDate.toISOString())) {
              const imagesToLast = await this.getImages({
                from: new Date(lastDate.setMilliseconds(lastDate.getMilliseconds() - 1)).toISOString()
              })
              if (imagesToLast) {
                images = imagesToLast
              }
              setTimeout(() => {
              window.scrollTo(0, document.body.scrollHeight)
              }, 1)
            }
          }
        }
        if (images.length) {
          this.images.push(...images)
          $state.loaded()
        } else {
          $state.complete()
        }
        this.loading = false
      } catch (err) {
        this.loading = false
        this.$store.dispatch('alert', 'Failed to fetch photos')
      }
    }
  }
}
</script>

<style>

</style>