const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const users = require('./users')()

const m = (name, text, id) => ({name, text, id})

io.on('connection', socket => {

  socket.on('userJoined', (data, cb) => {
    if(!data.name || !data.room) {
      return cb('Данные некорректны')
    }

    const mainRoom = 'mainRoom';

    socket.join(mainRoom)

    users.remove(socket.id)
    users.add({
      id: socket.id,
      name: data.name,
      room: mainRoom
    })

    cb({userId: socket.id})
    io.to(mainRoom).emit('updateUsers', users.getByRoom(mainRoom))
    socket.emit('newMessage', m('admin', `Добро пожаловать ${data.name}`))

    socket.broadcast.to(mainRoom)
    .emit('newMessage', m('admin', `Пользователь ${data.name} зашел.`))
  })

  socket.on('createMessage', (data, cb) => {
    if(!data.text) {
      return cb('текст не может быть пустым')
    }

    const user = users.get(data.id)
    if(user) {
      io.to(user.room).emit('newMessage', m(user.name, data.text, data.id))
    }
    cb()
  })

  socket.on('disconnect', () => {
    const user = users.remove(socket.id)
    if(user) {
      io.to(user.room).emit('updateUsers', users.getByRoom(user.room))
      io.to(user.room).emit(
        'newMessage',
        m('admin', `Пользователь ${user.name} вышел.`)
      )
    }
  })
})

module.exports = {
  app,
  server
}
