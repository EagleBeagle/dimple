import Api from '@/services/Api'

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