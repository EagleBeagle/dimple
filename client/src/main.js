import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store/store'
import VueKinesis from 'vue-kinesis'
import Cloudinary from 'cloudinary-vue'
import InfiniteLoading from 'vue-infinite-loading';

Vue.config.productionTip = false
Vue.use(VueKinesis)
Vue.use(Cloudinary, {
  configuration: {
    cloudName: process.env.CLOUDINARY_NAME
  }
})


Vue.use(InfiniteLoading)

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
