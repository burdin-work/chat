export const state = () => ({
  user: {},
  interlocutor: {},
  messages: [],
  messageInfo: {},
  users: []
})

export const actions = {
  async createUser({ commit, dispatch }, data) {
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

  async joinDialog({ commit, dispatch }, data) {

    commit('SOCKET_updateUserRoom', data.dialogRoom)
    localStorage.room = data.dialogRoom

    dispatch('getMessages', data.dialogRoom)
    dispatch('changeUserRoomBD', {
      _id: this.state.user.id,
      room: data.dialogRoom
    })
  },

  async changeUserRoomBD({ dispatch, commit }, { _id, room }) {
    return await this.$axios.$put('/change_room/' + _id, { room })
  },

  async SOCKET_sendBotMessage(message, data) {
    try {
      await this.$axios.$post('/send_message', data)
    } catch (e) {
      console.error(e)
      throw e
    }
  },
  async SOCKET_changeUserStatusBD({ dispatch, commit }, { _id, status }) {
    return await this.$axios.$put('/change_status/' + _id, { status })
  }
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

  SOCKET_updateUserRoom(state, room) {
    state.user.room = room
  },

  updateMessages(state, messages) {
    state.messages = messages
  },
  SOCKET_pushNewMessage(state, message) {
    state.messages.push(message)
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
  },
  SOCKET_changeStatus(state, data) {
    state.users.find((user) => (user.id = data.id)).online = data.status
  }
}
