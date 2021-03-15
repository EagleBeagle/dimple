<template>
  <v-container class="pa-0 ma-0 photo-container" fluid>
    <v-row justify="start" v-masonry>
      <v-col xs="cols" sm="6" md="4" lg="3" v-for="image in images" :key="image.id">
        <kinesis-container>
          <kinesis-element :strength="10" type="depth">
              <v-card elevation="20" @click="enlarge(image)">
              <v-img :src="image.url" @load="$redrawVueMasonry()"></v-img>
              </v-card>
          </kinesis-element>
        </kinesis-container>
      </v-col>
      <image-dialog :show="showDialog" :image="enlargedImage" v-on:close="showDialog = false"/>
    </v-row>
  </v-container>
</template>

<script>
import ImageDialog from '@/components/ImageDialog'
export default {
  props: [
    'images'
  ],
  components: {
    ImageDialog
  },
  data () {
    return {
      showDialog: false,
      enlargedImage: null
    }
  },
  methods: {
    enlarge(image) {
      this.enlargedImage = image
      this.showDialog = true
    }
  }
}
</script>

<style>
.photo-container {
  padding-top: 0px;
}
</style>