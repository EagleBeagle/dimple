import Api from '@/services/DimpleApi'

export default {
  create (data) {
    return Api().post('/album', data)
  },
  
  get (data) {
    let queryString = ''
    if (data.id) {
      queryString += `&id=${data.id}`
    }
    if (data.user) {
      queryString += `&user=${data.user}`
    }
    if (data.imageId) {
      queryString += `&image=${data.imageId}`
    }
    if (typeof data.visibility !== 'undefined') {
      queryString += `&visibility=${data.visibility}`
    }
    return Api().get(`album?${queryString}`)
  },

  update (id, images) {
    return Api().put(`album/${id}`, images)
  },

  download (id) {
    return Api().get(`album/${id}/download`)
  },

  delete (id) {
    return Api().delete(`album/${id}`)
  }
}