import Api from '@/services/DimpleApi'
import CloudinaryApi from '@/services/CloudinaryApi'

export default {
  initiateUpload (data) {
    return Api().put('/image', data)
  },

  upload (data) {
    return CloudinaryApi().post('', data)
  },

  finalizeUpload (data) {
    return Api().post('image/finalize', data)
  },

  delete (imageId) {
    return Api().delete(`image/${imageId}`)
  },

  get (data) {
    if (data && data.album) {
      return Api().get(`image?album=${data.album}`)
    }
    return Api().get('image')
  },

  getPrivateImage(id) {
    return Api().get(`image/${id}`, {
      responseType: 'arraybuffer'
    })
  }
}