import Api from '@/services/Api'

export default {
  upload (data) {
    return Api().put('image', data)
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