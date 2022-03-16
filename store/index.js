export const state = () => ({
  user: null
})

// getter
export const getters = {
  isAuthenticated (state) {
    return !!state.user
  }
}

// setter
export const mutations = {
  setUser (state, user) {
    state.user = user
  }
}

export const actions = {
  setUser ({ commit }, user) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('setUser', user)
        resolve()
      }, 500)
    })
  }
}
