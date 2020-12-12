import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    alert: false,
    snackbarText: '',
    user: {},
    imageData: null,
    imageUploadData: null,
    newAlbum: null
  },
  actions: {
    alert({ commit }, text) {
        commit('alert', text)
    },
    setUser({ commit }, user) {
      commit('setUser', user)
    },
    unsetUser({ commit }) {
      commit('unsetUser')
    },
    imageChosen({ commit }, imageData) {
      commit('imageChosen', imageData)
    },
    initiateUpload({ commit }, imageUploadData) {
      commit('initiateUpload', imageUploadData)
    },
    finishUpload({ commit }) {
      commit('finishUpload')
    },
    albumAdded({ commit }, newAlbum) {
      commit('albumAdded', newAlbum)
    }
  },
  mutations: {
    alert(state, text) {
        state.alert = !state.alert
        state.snackbarText = text
    },
    setUser(state, user) {
      state.user = user
    },
    unsetUser(state) {
      state.user = {}
    },
    imageChosen(state, imageData) {
      state.imageData = imageData
    },
    initiateUpload(state, imageUploadData) {
      state.imageUploadData = imageUploadData
    },
    finishUpload(state) {
      state.imageData = null
      state.imageUploadData = null
    },
    albumAdded(state, newAlbum) {
      state.newAlbum = newAlbum
    }
  }
})