<template>
  <v-container class="pa-0 ma-0 photo-container" fluid>
      <transition-group name="fade" class="row wrap justify-start">
        <v-col cols="6" sm="4" md="4" lg="3" class="image-div pa-1 pa-sm-3 item" v-for="image in images" :key="image.id" style="animation-duration: 0.3s">
          <kinesis-container>
            <kinesis-element :strength="10" type="depth">
              <v-hover v-slot="{hover}">
                <v-card class="image-card" :elevation="$vuetify.breakpoint.smAndUp ? '20' : '3'" @click="!interactionDisabled ? $emit('imageClicked', image) : null">
                  <v-img 
                    class="image"
                    aspect-ratio="1"
                    :src="image.url">
                    <v-fade-transition>
                      <v-overlay
                        v-if="hover && $vuetify.breakpoint.smAndUp && !interactionDisabled"
                        absolute
                        color="#000000"
                        :opacity="$vuetify.breakpoint.xsOnly ? '0' : '0.3'">
                        <v-btn
                          v-if="$route.name !== 'Explore' && ($route.name === 'Photos' && $route.params.album !== 'favourites') && $store.state.user.username === image.fk_username"
                          v-on:click.stop
                          icon
                          large
                          color="white"
                          class="delete"
                          @click="$emit('delete', image)">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-icon v-if="image.trashed" size="200px" class="restore" color="rgb(255, 255, 255, 0.5)" >mdi-restore</v-icon>
                        <div v-if="!image.trashed" class="overlay-content text-h6">
                          <v-container class="pa-2">
                            <v-row justify="start" class="mx-1">
                              <v-col cols="6" class="pa-0 text-h5 white--text" style="text-align: left">
                                {{ image.fk_username }}
                              </v-col>
                              <v-spacer></v-spacer>
                              <v-col cols="2" class="pa-0 text-body-1 white--text mr-2" align-self="center">
                                <v-icon class="pr-1">
                                  mdi-star-outline
                                </v-icon>
                                <span>{{ image.favouriteCount }}</span>
                              </v-col>
                              <v-col cols="2" class="pa-0 text-body-1 white--text" align-self="center">
                                <v-icon class="pr-1">
                                  mdi-comment-outline
                                </v-icon>
                                <span>{{ image.commentCount }}</span>
                              </v-col>
                            </v-row>
                          </v-container>
                        </div>
                        <div v-if="image.trashed" class="overlay-trash text-h6">
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
      </transition-group>
      <infinite-loading @infinite="infiniteHandler">
        <span slot="no-more"></span>
        <span slot="no-results"></span>
        <span slot="spinner"></span>
      </infinite-loading>
  </v-container>
</template>

<script>
export default {
  props: [
    'images',
    'interactionDisabled'
  ],
  methods: {
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
  transition: all 0.5s;
  display: inline-block;
}

.v-overlay__content {
  height: 100%;
  width: 100%;
}

.overlay-trash {
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

.overlay-content {
  position: absolute;
  width: 100%;
  bottom: 0px;
  color: rgba(133, 132, 132, 0.7);
}

.fade-leave-active {
  position: absolute;
}
</style>