import Api from '@/services/DimpleApi'
import CloudinaryApi from '@/services/CloudinaryApi'
import store from '@/store/store'

export default {
  initiateUpload (data) {
    return Api().put('/image', data)
  },

  upload (data, onProgress, onError) {
    let requests = []
    for (let i = 0; i < data.length; i++) {
      requests.push(
        CloudinaryApi().post('', data[i], {
          onUploadProgress(progressEvent) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            if (onProgress) onProgress(percentCompleted, i)
            return percentCompleted
          }
        }).catch(() => {
          onError(i)
        })
      )
    }
    return Promise.all(requests)
    /* let config = { 
      onUploadProgress(progressEvent) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        if (onProgress) onProgress(percentCompleted, data.index)
        return percentCompleted
      }
    }
    return CloudinaryApi().post('', data, config) */
  },

  finalizeUpload (data) {
    return Api().post('image/finalize', data)
  },

  delete (imageId) {
    return Api().delete(`image/${imageId}`)
  },

  cancelUpload(imageId, cancellationToken) {
    const username = store.state.user.username
    return navigator.sendBeacon(`${process.env.VUE_APP_BASE_URL}/image/${username}/${imageId}/cancelupload/${cancellationToken}`)
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