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
  socket.on('userJoined', (data, cb) => {
    if (!data.user.name || !data.user.room || !data.user.id) {
      return cb('Данные некорректны')
    }
    const room = data.user.room

    socket.join(room)

    users.remove()
    users.reload(data.users)

    cb({ id: data.user.id })

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
  })

  socket.on('joinDialogRoom', (data, cb) => {
    const room = data
    socket.join(room)
    console.log('I am in new room')
  })


  socket.on('createMessage', (message, cb) => {
    console.log('message --- ' + message)
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

  /*  socket.on('disconnect', () => {
    const user = users.remove(socket.id)
    if (user) {
      io.to(user.room).emit('updateUsers', users.getByRoom(user.room))
      io.to(user.room).emit(
        'newMessage',
        m('admin', `Пользователь ${user.name} вышел.`)
      )
    }
  })*/
})

module.exports = {
  app,
  server
}
