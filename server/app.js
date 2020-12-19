const app = require('express')()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth.routes')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const users = require('./users')()

mongoose.connect('mongodb+srv://user47925947254394:sJ28T1kG557jG3l67h@cluster0.egvo5.mongodb.net/chat_db')
  .then(() => console.log('MongoDB connected...'))
  .catch(error => console.error(error))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(authRoutes)


const m = (name, text, id) => ({name, text, id})
io.on('connection', socket => {

  socket.on('userJoined', (data, cb) => {
    if(!data.name || !data.room) {
      return cb('Данные некорректны')
    }

    const room = data.room;

    socket.join(room)

    users.remove(socket.id)
    users.add({
      id: socket.id,
      name: data.name,
      room: room
    })

    cb({userId: socket.id})
    io.to(room).emit('updateUsers', users.getByRoom(room))
    socket.emit('newMessage', m('admin', `Добро пожаловать ${data.name}`))

    socket.broadcast.to(room)
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
