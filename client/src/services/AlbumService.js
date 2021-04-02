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
    return Api().get(`album?${queryString}`)
  },

  download (id) {
    return Api().get(`album/${id}/download`)
  },

  delete (id) {
    return Api().delete(`album/${id}`)
  }
}