export const state = () => ({
  user: {},
  messages: [],
  users: [],
  todos: []
})

export const actions = {

  async identUser({ commit, dispatch }, data) {
    //localStorage.setItem('testObject', 'aaaaaaaaaaaaa')
    if (localStorage.id
      && localStorage.name
      && localStorage.avatar
      && localStorage.room) {
      console.log('Indentification is good! Hello, ' + localStorage.name)
    } else {
      console.log('We dont know you, stranger!')
      try {
        const userDB = await this.$axios.$post('/create', data)
        commit('setUser', userDB)
      } catch (e) {
        console.error(e)
        throw e
      }
    }
  }
}

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  updateTodos(state, todos) {
    state.todos = todos
  },
  SOCKET_newMessage(state, message) {
    state.messages.push(message)
  },
  SOCKET_updateUsers(state, users) {
    state.users = users
  }
}
