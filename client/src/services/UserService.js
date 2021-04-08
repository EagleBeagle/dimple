import Api from '@/services/DimpleApi'

export default {
  signUp (credentials) {
    return Api().post('/signup', credentials)
  },

  signIn(credentials) {
    return Api().post('/signin', credentials)
  },

  changeAvatar(username, formData) {
    return Api().put(`/user/${username}/avatar`, formData)
  },

  get(username) {
    return Api().get(`/user/${username}`)
  }
}