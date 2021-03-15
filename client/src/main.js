import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store/store'
import VueKinesis from 'vue-kinesis'
import Cloudinary from 'cloudinary-vue'
import { VueMasonryPlugin } from 'vue-masonry'
import VueSelectImage from 'vue-select-image'

Vue.config.productionTip = false
Vue.use(VueKinesis)
Vue.use(Cloudinary, {
  configuration: {
    cloudName: process.env.CLOUDINARY_NAME
  }
})

Vue.use(VueMasonryPlugin)
Vue.use(VueSelectImage)

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
