<template>
  <v-container class="pa-0 ma-0 photo-container" fluid>
    <v-row justify="start"> <!-- v-masonry property -->
      <v-col cols="12" sm="6" md="4" lg="3" class="image-div pa-3" v-for="(image, index) in images" :key="index">
        <kinesis-container v-if="!invalidImageIndices.has(index)">
          <kinesis-element :strength="10" type="depth">
            <v-hover v-slot="{hover}">
              <v-card class="image-card" elevation="20" @click="$emit('imageClicked', image)">
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
                        v-if="$route.name !== 'Explore'"
                        v-on:click.stop
                        icon
                        large
                        color="white"
                        class="delete"
                        @click="$emit('delete', image)">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                      <v-icon v-if="image.trashed" size="200px" class="restore" color="rgb(255, 255, 255, 0.5)" >mdi-restore</v-icon>
                      <div v-if="image.trashed" class="overlay-content text-h6">
                        Click to restore
                      </div>
                    </v-overlay>
                  </v-fade-transition>
                </v-img>
              </v-card>
            </v-hover>
          </kinesis-element>
        </kinesis-container>
      </v-col>
      <infinite-loading @infinite="infiniteHandler">
        <span slot="no-more"></span>
        <span slot="no-results"></span>
        <span slot="spinner"></span>
      </infinite-loading>
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
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: [
    'images'
  ],
  data () {
    return {
      invalidImageIndices: new Set(),
      showDialog: false,
      enlargedImage: null,
    }
  },
  methods: {
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
  top: 80%;
  left: 50%;
  transform:translate(-50%,-50%);
  color: rgb(255, 255, 255, 0.7);
}

.delete {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 1;
}

.delete:hover {
  color: black;
}

.restore {
  top:50%;
  transform:translate(0,-50%);
}
</style>