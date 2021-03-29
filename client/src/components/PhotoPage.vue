<template>
  <v-img v-if="image" :src="image.url">

  </v-img>
</template>

<script>
import { mapState } from 'vuex'
import ImageService from '@/services/ImageService'
import { Cloudinary } from 'cloudinary-core';
export default {
  data () {
    return {
      image: null
    }
  },
  computed: {
    ...mapState([
      'user'
    ])
  },
  async mounted() {
    this.cloudinaryCore = new Cloudinary({ cloud_name: process.env.VUE_APP_CLOUDINARY_NAME })
    await this.getImage();
  },
  methods: {
    async getImage() { 
      try {
        const image = (await ImageService.get({ id: this.$route.params.id })).data
        console.log(image)
        image.url = this.cloudinaryCore.url(`${image.fk_username}/${image.id}`)
        this.image = image
      } catch (err) {
        console.log(err)
        if (err.response.status === 403) {
          this.$router.push({ name: 'Photos', params: { album: 'all'}})
        }
      }
    },
  }
}
</script>
