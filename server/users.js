class Users {
  constructor() {
    this.users = []
  }

  get(id) {
    return this.users.find(user => user.id === id)
  }

  add(user) {
    this.users.push(user)
  }

  remove(socketId) {
    const user = this.get(socketId)

    if(user) {
      this.users = this.users.filter(u => user.id !== u.id)
    }

    return user
  }

  getByRoom(room) {
    return this.users.filter(user => user.room === room)
  }
}

module.exports = function() {
  return new Users()
}
