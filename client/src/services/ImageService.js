import Api from '@/services/DimpleApi'
import CloudinaryApi from '@/services/CloudinaryApi'


export default {
  initiateUpload (data) {
    return Api().put('/image', data)
  },

  upload (data, onProgress) {
    let config = { 
      onUploadProgress(progressEvent) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        if (onProgress) onProgress(percentCompleted)
        return percentCompleted
      }
    }
    return CloudinaryApi().post('', data, config)
  },

  finalizeUpload (data) {
    return Api().post('image/finalize', data)
  },

  delete (imageId) {
    return Api().delete(`image/${imageId}`)
  },

  cancelUpload(imageId) {
    return navigator.sendBeacon(`${process.env.VUE_APP_BASE_URL}/image/${imageId}/cancelupload`)
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