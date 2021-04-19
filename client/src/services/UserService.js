import Api from '@/services/DimpleApi'

export default {
  signUp (credentials) {
    return Api().post('/signup', credentials)
  },

  signIn(credentials) {
    return Api().post('/signin', credentials)
  },

  confirm(confirmationToken) {
    return Api().put(`/user/confirm/${confirmationToken}`)
  },

  forgotPassword(email) {
    return Api().put(`/user/forgotpassword`, email)
  },

  resetPassword(resetPasswordToken, password) {
    return Api().put(`/user/resetpassword/${resetPasswordToken}`, { password })
  },

  changeAvatar(username, formData) {
    return Api().put(`/user/${username}/avatar`, formData)
  },

  get(username) {
    return Api().get(`/user/${username}`)
  },

  search(text, admin) {
    let queryString = `&search=${text}`
    if (admin) {
      queryString = `&admin=true${queryString}`
    } else {
      queryString += '&limit=20'
    }
    return Api().get(`/user?${queryString}`)
  },

  update(username, data) {
    return Api().put(`/user/${username}`, data)
  },
  
  delete(username) {
    return Api().delete(`/user/${username}`)
  },
  
  getAdminInfo() {
    return Api().get('/admin')
  }
}