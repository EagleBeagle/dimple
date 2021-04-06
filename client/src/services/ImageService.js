import axios from 'axios'
import Api from '@/services/DimpleApi'
import CloudinaryApi from '@/services/CloudinaryApi'
import store from '@/store/store'

export default {
  initiateUpload (data) {
    return Api().post('/image', data)
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

  update(id, data) {
    console.log(id)
    return Api().put(`image/${id}`, data)
  } ,

  delete (imageId) {
    return Api().delete(`image/${imageId}`)
  },

  cancelUpload(imageId, cancellationToken) {
    const username = store.state.user.username
    return navigator.sendBeacon(`${process.env.VUE_APP_BASE_URL}/image/${username}/${imageId}/cancelupload/${cancellationToken}`)
  },

  get (data) {
    let queryString = ''
    if (data.id) {
      queryString += `&id=${data.id}`
    }
    if (data.user) {
      queryString += `&user=${data.user}`
    }
    if (data.from) {
      queryString += `&from=${data.from}` 
    }
    if (data.to) {
      queryString += `&to=${data.to}` 
    }
    if (data.limit) {
      queryString += `&limit=${data.limit}` 
    }
    if (data.sort) {
      queryString += `&sort=${data.sort}` 
    }
    if (data.album) {
      queryString += `&album=${data.album}` 
    }
    if (data.favourites) {
      queryString += `&favourites=${data.favourites}` 
    }
    if (data.trash) {
      queryString += `&trash=${data.trash}` 
    }
    if (typeof data.visibility !== 'undefined') {
      queryString += `&visibility=${data.visibility}` 
    }
    if (data.explore) {
      queryString += `&explore=${data.explore}` 
    }
    return Api().get(`image?${queryString}`)
  },

  download(url) {
    return axios({ method: 'get', url, responseType: 'arraybuffer' })
  },

  favourite(id) {
    return Api().post(`image/${id}/favourite`)
  },

  unfavourite(id) {
    return Api().delete(`image/${id}/favourite`)
  },

  putToTrash(id) {
    return Api().put(`image/${id}/trash`)
  },

  removeFromTrash(id) {
    return Api().delete(`image/${id}/trash`)
  }
}