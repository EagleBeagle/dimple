import Api from '@/services/DimpleApi'

export default {
  signUp (credentials) {
    return Api().post('/signup', credentials)
  },

  signIn(credentials) {
    return Api().post('/signin', credentials)
  }
}