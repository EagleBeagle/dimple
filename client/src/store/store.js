import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    alert: false,
    alertSnackbarText: '',
    update: false,
    updateSnackbarText: '',
    user: {},
    imageData: null,
    imageUploadData: null,
    uploadInProgress: false,
    newAlbum: null,
    sort: {
      category: 'date',
      order: 'desc'
    },
    visibility: 'all',
    searching: false,
    updateShownPhotos: false,
    newPhotoId: null,
    triggerRestoreAll: false,
    triggerDeleteAll: false,
    errorHappening: true,
    updateShownUser: false
  },
  actions: {
    alert({ commit }, text) {
      commit('alert', text)
    },
    update({ commit }, text) {
      commit('update', text)
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
    },
    changeSort({ commit }, sort) {
      commit('changeSort', sort)
    },
    changeVisibility({ commit }, visibility) {
      commit('changeVisibility', visibility)
    },
    setSearching({ commit }, searching) {
      commit ('setSearching', searching)
    },
    updateShownPhotos({ commit }) {
      commit ('updateShownPhotos')
    },
    setNewPhotoId({ commit }, newPhotoId) {
      commit ('setNewPhotoId', newPhotoId)
    },
    triggerRestoreAll({ commit }) {
      commit ('triggerRestoreAll')
    },
    triggerDeleteAll({ commit }) {
      commit ('triggerDeleteAll')
    },
    setErrorHappening({ commit }, errorHappening) {
      commit ('setErrorHappening', errorHappening)
    },
    updateShownUser({ commit }) {
      commit ('updateShownUser')
    }
  },
  mutations: {
    alert(state, text) {
        state.alert = !state.alert
        state.alertSnackbarText = text
    },
    update(state, text) {
      state.update = !state.update
      state.updateSnackbarText = text
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
      state.uploadInProgress = true
    },
    finishUpload(state) {
      state.imageData = null
      state.imageUploadData = null
      state.uploadInProgress = false
    },
    albumAdded(state, newAlbum) {
      state.newAlbum = newAlbum
    },
    changeSort(state, sort) {
      state.sort = sort
    },
    changeVisibility(state, visibility) {
      state.visibility = visibility
    },
    setSearching(state, searching) {
      state.searching = searching
    },
    updateShownPhotos(state) {
      state.updateShownPhotos = !state.updateShownPhotos
    },
    setNewPhotoId(state, newPhotoId) {
      state.newPhotoId = newPhotoId
    },
    triggerRestoreAll(state) {
      state.triggerRestoreAll = !state.triggerRestoreAll
    },
    triggerDeleteAll(state) {
      state.triggerDeleteAll = !state.triggerDeleteAll
    },
    setErrorHappening(state, errorHappening) {
      state.errorHappening = errorHappening
    },
    updateShownUser(state) {
      state.updateShownUser = !state.updateShownUser
    }
  }
})