export const alert = {
  namespaced: true,
  state: {
    alert: false,
    snackbarText: ''
  },
  actions: {
    alert({ commit }, text) {
        commit('alert', text)
    }
  },
  mutations: {
    alert(state, text) {
        state.alert = !state.alert
        state.snackbarText = text
    }
  }
}