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
    uploadInProgress: false,
    newAlbum: null,
    sort: {
      category: 'date',
      order: 'desc'
    },
    visibility: 'all',
    searching: false
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
    },
    changeSort({ commit }, sort) {
      commit('changeSort', sort)
    },
    changeVisibility({ commit }, visibility) {
      commit('changeVisibility', visibility)
    },
    setSearching({ commit }, searching) {
      commit ('setSearching', searching)
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
      console.log(searching)
    }
  }
})