import Api from '@/services/DimpleApi'

export default {
  create (data) {
    return Api().post('/comment', data)
  },
  get (data) {
    let queryString = ''
    if (data.imageId) {
      queryString += `&imageId=${data.imageId}`
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
    return Api().get(`comment?${queryString}`)
  },

  delete (commentId) {
    return Api().delete(`comment/${commentId}`)
  },
}