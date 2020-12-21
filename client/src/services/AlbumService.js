import Api from '@/services/DimpleApi'

export default {
  create (data) {
    return Api().put('/album', data)
  },
  
  get (id) {
    if (id) {
      return Api().get(`/album?id=${id}`)
    } else {
      return Api().get('/album')
    }
  }
}