<template>
  <v-container class="pa-0 ma-0 photo-container" fluid>
    <v-row justify="start"> <!-- v-masonry property -->
      <masonry
        :cols="{default: 4, 1264: 3, 960: 2, 600: 1}" 
        :gutter="30">
        <div class="image-div" v-for="(image, index) in images" :key="index" @click="enlarge(image)">
          <kinesis-container>
            <kinesis-element :strength="10" type="depth">
              <cld-image
                class="grid-image"
                :publicId="`${user.username}/${image.id}`"
                cloudName="dimplecloud"
                @load="$redrawVueMasonry()">
              </cld-image>
            </kinesis-element>
          </kinesis-container>
        </div>
      </masonry>
      <!-- <v-col xs="cols" sm="6" md="4" lg="3" v-for="image in images" :key="image.id">
        <kinesis-container>
          <kinesis-element :strength="10" type="depth">
            <v-card elevation="20" @click="enlarge(image)">
              <cld-image
                class="grid-image"
                :publicId="`${user.username}/${image.id}`"
                cloudName="dimplecloud"
                @load="$redrawVueMasonry()">
            </cld-image>
            </v-card>
          </kinesis-element>
        </kinesis-container>
      </v-col> -->
      <image-dialog :show="showDialog" :image="enlargedImage" v-on:close="showDialog = false"/>
    </v-row>
  </v-container>
</template>

<script>
import ImageDialog from '@/components/ImageDialog'
import { mapState } from 'vuex'
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
  computed: {
    ...mapState([
      'user'
    ])
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

.image-div {
  cursor: pointer;
  margin-bottom: 30px;
}

img {
  max-width: 100%;
  max-height: 100%;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.575);
}
</style>