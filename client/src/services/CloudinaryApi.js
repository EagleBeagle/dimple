import axios from 'axios'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${process.env.VUE_APP_CLOUDINARY_NAME}/image/upload`

export default () => {
  return axios.create({
    baseURL: CLOUDINARY_UPLOAD_URL
  })
}