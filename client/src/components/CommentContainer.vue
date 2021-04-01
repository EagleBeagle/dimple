<template>
<v-container class="pa-0">
   <v-row justify="center">
      <v-col cols="12" sm="7" md="4" class="pa-0">
        <v-hover v-slot="{ hover }">
          <v-container class="pa-0 mb-1">
            <v-row justify="start">
                <v-col cols="3" sm="3" md="4" lg="4" xl="3" class="pa-0 px-0 pl-sm-5 pl-xl-10">
                  <v-img v-if="image" :src="image.url" height="60px" width="60px" aspect-ratio="1" class="avatar"></v-img>
                </v-col>
                <v-col cols="8" sm="9" md="8" lg="8" xl="9" align-self="center" class="px-0 pr-sm-5 pr-xl-10">
                  <v-container class="pa-0">
                    <v-row justify="start">
                      <v-col cols="7" sm="7" md="7" class="pa-0" align-self="center" style="text-align: start">
                        <span class="text-body-1 font-weight-bold blue--text pa-0">Biacsi Zoltán</span> 
                        <span class="text-body-2 grey--text text--darken-2 pa-0 ml-2">2h</span>
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-fade-transition>
                        <v-col cols="1" class="pa-0" v-show="hover">
                          <v-icon size="20px">
                            mdi-reply
                          </v-icon>
                        </v-col>
                      </v-fade-transition>
                     <v-fade-transition>
                      <v-col cols="1" class="pa-0" v-show="hover">
                        <v-icon size="20px">
                          mdi-delete
                        </v-icon>
                      </v-col>
                     </v-fade-transition>
                    </v-row>
                    <v-row justify="start">
                      <v-col cols="12" sm="12" md="12" class="pa-0" style="text-align: start; word-wrap: break-word;">
                        <span class="text-body-2">
                          asdsadasdasdjiashdiusadhauisdhsaidhasiduashudidua asdsa dasd asdsadasdasd asd sad asdssa dasd asdsad sadsd asdas
                        </span>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
          </v-container>
        </v-hover> 
        <v-hover v-slot="{ hover }">
          <v-container pa-0>
            <v-row justify="start">
                <v-col cols="3" sm="3" md="4" lg="4" xl="3" class="pa-0 px-0 pl-sm-5 pl-xl-10">
                  <v-img v-if="image" :src="image.url" height="60px" width="60px" aspect-ratio="1" class="avatar"></v-img>
                </v-col>
                <v-col cols="8" sm="9" md="8" lg="8" xl="9" align-self="center" class="px-0 pr-sm-5 pr-xl-10">
                  <v-container class="pa-0">
                    <v-row justify="start">
                      <v-col cols="7" sm="7" md="7" class="pa-0" align-self="center" style="text-align: start">
                        <span class="text-body-1 font-weight-bold blue--text pa-0">Biacsi Zoltán</span> 
                        <span class="text-body-2 grey--text text--darken-2 pa-0 ml-2">2h</span>
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-fade-transition>
                        <v-col cols="1" class="pa-0" v-show="hover">
                          <v-icon size="20px">
                            mdi-reply
                          </v-icon>
                        </v-col>
                      </v-fade-transition>
                     <v-fade-transition>
                      <v-col cols="1" class="pa-0" v-show="hover">
                        <v-icon size="20px">
                          mdi-delete
                        </v-icon>
                      </v-col>
                     </v-fade-transition>
                    </v-row>
                    <v-row justify="start">
                      <v-col cols="12" sm="12" md="12" class="pa-0" style="text-align: start; word-wrap: break-word;">
                        <span class="text-body-2 blue--text" @click="userClicked">Teso</span>
                        <span class="text-body-2">
                          asdsadasdasdjiashdiusadhauisdhsaidhasiduashudidua asdsa dasd asdsadasdasd asd sad asdssa dasd asdsad sadsd asdas
                        </span>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
          </v-container>
        </v-hover>
        <v-container class="pa-0 pb-3">
            <v-row justify="start">
              <v-col cols="3" sm="3" md="4" lg="4" xl="3" class="pa-0 px-0 pl-sm-5 pl-xl-10">
                <v-img v-if="image" :src="image.url" height="60px" width="60px" aspect-ratio="1" class="avatar"></v-img>
              </v-col>
              <v-col cols="8" sm="9" md="8" lg="8" xl="9" align-self="center" class="px-0 pr-sm-5 pr-xl-10 pb-1">
                <v-container class="pa-0">
                  <v-row justify="start">
                    <v-col cols="12" align-self="center" class="pa-0">
                      <v-form>
                        <v-textarea
                          @focus="focused"
                          @blur="unfocused"
                          outlined
                          no-resize
                          dense
                          maxlength="100"
                          hide-details
                          placeholder="Add a comment"
                          height="120px"
                          v-model="comment"
                          append-icon="mdi-send"
                          @click:append="submit()"
                        ></v-textarea>
                      </v-form>
                    </v-col>
                  </v-row>
                </v-container>
              </v-col>
            </v-row>
          </v-container> 
      </v-col>
   </v-row>
</v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: [
    'image'
  ],
  data () {
    return {
      comment: ''
    }
  },
  computed: {
    ...mapState([
      'user'
    ])
  },
  mounted() {
  },
  methods: {
    userClicked() {
      console.log('user')
    },
    focused() {
      this.$emit('writting', true)           
    },
    unfocused() {
      this.$emit('writting', false)
    },
    submit() {
      console.log('todo')
    }
  }
}
</script>

<style>
.avatar {
  border-radius: 50%;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);
}
</style>