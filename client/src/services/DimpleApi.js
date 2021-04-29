import axios from 'axios'
import store from '@/store/store'

export default () => {
  return axios.create({
    baseURL: process.env.VUE_APP_BASE_URL_DEV,
    headers: {
      Authorization: `Bearer ${store.state.user.jwtToken}`
    }
  })
}