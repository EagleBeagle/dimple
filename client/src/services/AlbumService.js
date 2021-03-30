import Api from '@/services/DimpleApi'

export default {
  create (data) {
    return Api().put('/album', data)
  },
  
  get (data) {
    let queryString = ''
    if (data.id) {
      queryString += `&id=${data.id}`
    }
    if (data.user) {
      queryString += `&user=${data.user}`
    }
    return Api().get(`album?${queryString}`)
  },

  delete (id) {
    return Api().delete(`album/${id}`)
  }
}