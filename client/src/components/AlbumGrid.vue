<template>
<v-container class="pa-0 album-container" fluid>
    <transition-group name="fade" class="row wrap justify-start">
      <v-col cols="12" sm="6" md="4" lg="3" class="pa-4 album" v-for="album in albums" :key="album.id" style="animation-duration: 0.3s">
        <v-hover v-slot="{hover}">
          <v-card  tile @click="$emit('open', album)" :hover="inDialog" height="100%">
            <div class="overlay-div">
                <v-container class="overlay-container pa-0">
                  <v-row justify="start">
                    <v-col cols="12" :class="inDialog ? 'text-h6' : 'text-h4'" class="album-name pa-0 pl-8 pr-4 white--text font-weight-medium">
                      {{ album.name }}
                    </v-col>
                  </v-row>
                  <v-row justify="start">
                    <v-col cols="12" class="album-image-count pa-0 pl-10 pb-4 text-subtitle-1 white--text">
                      {{ album.imageCount }} photos
                    </v-col>
                  </v-row>
                  <v-expand-transition v-if="!inDialog">
                    <v-row justify="space-around" v-if="hover">
                      <v-col cols="3" class="pa-0">
                        <v-icon v-on:click.stop large color="white" class="album-setting-icon" @click="$emit('addPhotos', album)">
                          mdi-plus
                        </v-icon>
                      </v-col>
                      <v-col cols="3" class="pa-0 mb-1">
                        <v-icon v-on:click.stop large color="white" class="album-setting-icon"
                          @click="album.visibility ? $emit('share', album) : showAlertDialog = true">
                          mdi-share
                        </v-icon>
                      </v-col>
                      <v-col cols="3" class="pa-0">
                        <v-icon v-on:click.stop large color="white" class="album-setting-icon" :disabled="!album.images.length" @click="$emit('download', album.id)">
                          mdi-download
                        </v-icon>
                      </v-col>
                      <v-col cols="3" class="pa-0">
                        <v-icon v-on:click.stop large color="white" class="album-setting-icon" @click="$emit('delete', album.id)">
                          mdi-delete-outline
                        </v-icon>
                      </v-col>
                    </v-row>
                  </v-expand-transition>
                </v-container>
            </div>
            <v-container fill-height v-if="album.images.length === 0" class="pa-0">
              <div class="vignette"></div>
              <v-card-text class="pa-0">
                <v-img aspect-ratio="1">
                  <v-icon size="100px" style="top: 33%">
                    mdi-image-multiple
                  </v-icon>
                </v-img>
              </v-card-text>
            </v-container>
            <v-card-text v-else-if="album.images.length === 1" class="pa-0 thumbnail">
            <div class="vignette"></div>
            <v-container class="py-0">
              <v-row>
                <v-col cols="12" v-for="(image, index) in album.images" :key="index" class="pa-0">
                  <v-img aspect-ratio="1" :src="image.url">
                    
                  </v-img>
                </v-col>
              </v-row>
            </v-container>
            </v-card-text>
            <v-card-text v-else-if="album.images.length === 2" class="pa-0 thumbnail">
            <div class="vignette"></div>
            <v-container class="py-0">
              <v-row >
                <v-col cols="12" v-for="(image, index) in album.images" :key="index" class="pa-0" >
                  <v-img aspect-ratio="2" :src="image.url">            
                  </v-img>
                </v-col>
              </v-row>
            </v-container>
            </v-card-text>
            <v-card-text v-else-if="album.images.length === 3" class="pa-0 thumbnail">
            <div class="vignette"></div>
            <v-container class="py-0">
              <v-row>
                <v-col :cols="index < 2 ? 6 : 12" v-for="(image, index) in album.images" :key="index" class="pa-0">
                  <v-img :aspect-ratio="index < 2 ? 1 : 2" :src="image.url">
                  </v-img>
                </v-col>
              </v-row>
            </v-container>
            </v-card-text>
            <v-card-text v-else-if="album.images.length === 4" class="pa-0 thumbnail">
            <div class="vignette"></div>
            <v-container class="py-0">
              <v-row>
                <v-col cols="6" v-for="(image, index) in album.images" :key="index" class="pa-0">
                  <v-img aspect-ratio="1" :src="image.url">
                  </v-img>
                </v-col>
              </v-row>
            </v-container>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </transition-group>
    <alert-dialog
      v-if="showAlertDialog"
      :show="showAlertDialog"
      @close="showAlertDialog = false"
      title="Whoops"
      text="Private albums can't be shared. Change the visibility of the album to public if you still want to share it."/>
  </v-container>
</template>

<script>
import AlertDialog from '@/components/AlertDialog'
export default {
  props: [
    'albums',
    'inDialog'
  ],
  data() {
    return {
      showAlertDialog: false
    }
  },
  components: {
    AlertDialog
  },
  mounted() {
  }
}
</script>

<style>
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

.album {
  transition: all 0.6s;
  display: inline-block;
}

</style>