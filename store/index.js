
export const state = () => ({
  user: {},
  interlocutor: {},
  messages: [],
  messageInfo: {},
  users: []
})

export const actions = {

  async createUser({ commit, dispatch }, data) {

    console.log('We dont know you, stranger!')
    try {
      const userDB = await this.$axios.$post('/create', data)
      commit('setUser', userDB)
    } catch (e) {
      console.error(e)
      throw e
    }
  },

  async getUsers({ commit }) {
    try {
      const usersDB = await this.$axios.$get('/users')
      commit('SOCKET_updateUsers', usersDB)
    } catch (e) {
      console.error(e)
      throw e
    }
  },

  async sendMessage({ commit, dispatch }, data) {
    console.log('I am starting to send message!')
    try {
      const message = await this.$axios.$post('/send_message', data)
      commit('setMessageInfo', message)
    } catch (e) {
      console.error(e)
      throw e
    }
  },

  async getMessages({ commit }, room) {
    try {
      const messagesRoom = await this.$axios.$get('/messages/' + room)
      commit('updateMessages', messagesRoom)
    } catch (e) {
      console.error(e)
      throw e
    }
  },

  async joinDialog({ commit, dispatch }, data ) {

    commit('updateUserRoom', data.dialogRoom)
    localStorage.room = data.dialogRoom

    dispatch('getMessages', data.dialogRoom)
    dispatch('changeUserRoom', {_id: this.state.user.id, room: data.dialogRoom})
  },

  async changeUserRoom({dispatch, commit}, {_id, room}) {
    return await this.$axios.$put('/change_room/' + _id, {room})
  },
  async SOCKET_changeUserStatus({dispatch, commit}, {_id, status}) {
    return await this.$axios.$put('/change_status/' + _id, {status})
  },
}

export const mutations = {
  setUser(state, user) {
    state.user = user

    if (!localStorage.id) {
      localStorage.id = user.id
      localStorage.name = user.name
      localStorage.avatar = user.avatar
      localStorage.room = user.room
    }
  },

  updateUserRoom(state, room) {
    state.user.room = room
  },

  updateMessages(state, messages) {
    state.messages = messages
  },

  setMessageInfo(state, message) {
    state.messageInfo = message
  },

  setInterlocutor(state, interlocutor) {
    state.interlocutor = interlocutor
  },

  SOCKET_newMessage(state, message) {
    state.messages.push(message)
  },
  SOCKET_updateUsers(state, users) {
    state.users = users
  }
}
