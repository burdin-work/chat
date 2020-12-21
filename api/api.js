export const usersAPI = {
  async getUsers () {
    try {
      const usersDB = await this.$axios.$get('/users')
      updateUsers(usersDB)
      console.log(usersDB)
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}

