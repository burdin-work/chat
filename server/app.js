const app = require('express')()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const usersRoutes = require('./routes/users.routes')
const messagesRoutes = require('./routes/messages.routes')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const moment = require('moment')
const axios = require('axios')

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

const m = (room, senderId, text, time, senderName) => ({
  room,
  senderId,
  text,
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

    socket.emit('changeStatus', { id: currentUser.id, status: true })
    socket.emit('changeUserStatusBD', { _id: currentUser.id, status: true })

    socket.broadcast
      .to(room)
      .emit(
        'newMessage',
        m(
          currentUser.room,
          'admin',
          `User ${currentUser.name} has logged in.`,
          moment().format('LT'),
          'system'
        )
      )

    socket.emit('spamBotAnswer')

    cb({ id: data.user.id })
  })

  socket.on('joinDialogRoom', (data, cb) => {
    const room = data
    socket.join(room)
    socket.emit('updateUserRoom', room)
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
    cb(message)
  })

  // bots
  socket.on('echoBotAnswer', (message, cb) => {
    if (message) {
      const answer = m(
        message.room,
        'echoBot',
        `${message.text}`,
        moment().format('LT'),
        'Echo bot'
      )
      io.to(message.room).emit('newMessage', answer)
      socket.emit('sendBotMessage', answer)
    }
  })
  socket.on('reverseBotAnswer', (message, cb) => {
    if (message) {
      const answer = m(
        message.room,
        'reverseBot',
        `${message.text
          .split('')
          .reverse()
          .join('')}`,
        moment().format('LT'),
        'Reverse bot'
      )
      setTimeout(() => {
        io.to(message.room).emit('newMessage', answer)
        socket.emit('sendBotMessage', answer)
      }, 3000)
    }
  })

  socket.on('spamBotAnswer', (message, cb) => {
    let timerId = setInterval(
      () =>
        axios
          .get('http://api.icndb.com/jokes/random')
          .then((res) => {
            const joke = res.data.value.joke

            const answer = m(
              message.room,
              'spamBot',
              joke,
              moment().format('LT'),
              'Spam bot'
            )
            io.to(message.room).emit('newMessage', answer)
            socket.emit('sendBotMessage', answer)
          })
          .catch(function(error) {}),
      Math.floor(Math.random() * (120000 - 10000)) + 10000
    )
  })

  socket.on('disconnect', () => {
    if (currentUser) {
      io.emit('changeStatus', { id: currentUser.id, status: false })
      io.emit('changeUserStatusBD', { _id: currentUser.id, status: false })
      io.to(currentUser.room).emit(
        'newMessage',
        m(
          currentUser.room,
          'admin',
          `User ${currentUser.name} has logged out.`,
          moment().format('LT'),
          'system'
        )
      )
    }
  })
})

module.exports = {
  app,
  server
}
