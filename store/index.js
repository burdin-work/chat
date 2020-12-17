export const actions = {}

export const state = () => ({
  user: {},
  messages: [],
  users: [],
  todos: []
})

export const mutations = {
  setUser(state,user) {
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
