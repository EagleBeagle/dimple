<template>
  <v-container class="pa-0 ma-0 photo-container" fluid>
    <v-row justify="start"> <!-- v-masonry property -->
      <v-col cols="12" sm="4" md="3" lg="2" class="image-div pa-3" v-for="(image, index) in images" :key="index" @click="enlarge(image)">
        <kinesis-container v-if="!invalidImageIndices.has(index)">
          <kinesis-element :strength="10" type="depth">
            <v-hover v-slot="{hover}">
              <v-card class="image-card" elevation="20" @click="enlarge(image)">
                <v-img 
                  class="image"
                  aspect-ratio="1"
                  :src="image.url" @error="imageError(index)">
                  <v-fade-transition>
                    <v-overlay
                      v-if="hover"
                      absolute
                      color="#000000"
                      opacity="0.2">
                      <v-btn
                        v-on:click.stop
                        icon
                        color="white"
                        class="delete"
                        @click="$emit('delete', image.id)">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                      <div class="overlay-content">
                        asdadas
                      </div>
                    </v-overlay>
                  </v-fade-transition>
                </v-img>
              </v-card>
            </v-hover>
          </kinesis-element>
        </kinesis-container>
      </v-col>
      <infinite-loading @infinite="infiniteHandler"></infinite-loading>
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
export default {
  props: [
    'images'
  ],
  components: {
    ImageDialog
  },
  data () {
    return {
      invalidImageIndices: new Set(),
      showDialog: false,
      enlargedImage: null,
    }
  },
  methods: {
    enlarge(image) {
      this.enlargedImage = image
      this.showDialog = true
    },
    imageError(index) {
     this.invalidImageIndices.add(index)
     console.log(this.invalidImageIndices.has(index))
    },
    infiniteHandler($state) {
      this.$emit('reachedBottom', $state)
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
}

.v-overlay__content {
  height: 100%;
  width: 100%;
}

.overlay-content {
  position: absolute;
  bottom: 0;
  left: 80%;
}

.delete {
  position: absolute;
  top: 5px;
  right: 5px;
}

.delete:hover {
  color: black;
}

</style>