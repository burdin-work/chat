const app = require('express')()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const usersRoutes = require('./routes/users.routes')
const messagesRoutes = require('./routes/messages.routes')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const users = require('./users')()
const moment = require('moment')

mongoose
  .connect(
    'mongodb+srv://user47925947254394:sJ28T1kG557jG3l67h@cluster0.egvo5.mongodb.net/chat_db'
  )
  .then(() => console.log('MongoDB connected...'))
  .catch((error) => console.error(error))

mongoose.set('useFindAndModify', false)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(usersRoutes)
app.use(messagesRoutes)

const m = (senderId, text, _id, time, senderName) => ({
  senderId,
  text,
  _id,
  time,
  senderName
})

io.on('connection', (socket) => {
  let currentUser

  socket.on('userJoined', (data, cb) => {
    currentUser = data.user

    if (!data.user.name || !data.user.room || !data.user.id) {
      return cb('Данные некорректны')
    }
    const room = data.user.room

    socket.join(room)
    users.remove(data.user.id)
    data.user.socketID = socket.id
    users.add(data.user)

    socket.emit('changeStatus', { id: currentUser.id, status: true })
    socket.emit('changeUserStatusBD', { _id: currentUser.id, status: true })

    socket.broadcast
      .to(room)
      .emit(
        'newMessage',
        m(
          'system',
          `${data.user.name}`,
          new Date().getTime(),
          moment().format('LT'),
          'admin'
        )
      )
    cb({ id: data.user.id })
  })

  socket.on('joinDialogRoom', (data, cb) => {
    const room = data
    socket.join(room)
    cb()
  })

  socket.on('createMessage', (message, cb) => {
    if (message) {
      io.to(message.room).emit('newMessage', {
        room: message.room,
        senderId: message.senderId,
        text: message.text,
        time: message.time,
        senderName: message.senderName
      })
    }
    cb()
  })

  socket.on('disconnect', () => {
    console.log(currentUser)
    if (currentUser) {
      console.log(!!currentUser)
      io.emit('changeStatus', { id: currentUser.id, status: false })
      io.emit('changeUserStatusBD', { _id: currentUser.id, status: false })
      io.to(currentUser.room).emit(
        'newMessage',
        m('admin', `Пользователь ${currentUser.name} вышел.`)
      )
    }
  })
})

module.exports = {
  app,
  server
}
