export const state = () => ({
  user: {},
  messages: [],
  users: []
})

export const mutations = {
  setUser(state,user) {
    state.user = user
  },
  SOCKET_newMessage(state, message) {
    state.messages.push(message)
  },
  SOCKET_updateUsers(state, users) {
    state.users = users
  }
}
