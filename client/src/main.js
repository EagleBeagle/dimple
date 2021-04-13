import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store/store'
import VueKinesis from 'vue-kinesis'
import Cloudinary from 'cloudinary-vue'
import InfiniteLoading from 'vue-infinite-loading'
import VueSocialSharing from 'vue-social-sharing'
import VueTimeago from 'vue-timeago'
import Vue2Animate from 'vue2-animate/dist/vue2-animate.min.css'

Vue.config.productionTip = false
Vue.use(VueKinesis)
Vue.use(Cloudinary, {
  configuration: {
    cloudName: process.env.CLOUDINARY_NAME
  }
})

Vue.use(VueTimeago, {
  name: 'Timeago',
  locale: 'en'
})

Vue.use(InfiniteLoading)
Vue.use(VueSocialSharing)
Vue.use(Vue2Animate)

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
