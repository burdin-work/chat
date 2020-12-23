const { Router } = require('express')
const Message = require('../models/message.model')
const User = require('../models/user.model')
const router = Router()


router.post('/send_message', async (req, res) => {

  const message = new Message({
    room: req.body.room,
    text: req.body.text,
    time: req.body.time,
    senderId: req.body.senderId,
    senderName: req.body.senderName
  })
  message.id = message._id

  try {
    await message.save()
    res.json(message)
  } catch (e) {
    console.error(e)
  }
})

router.get('/messages/:room', async (req, res) => {
  const room = req.params.room
  const messages = await Message.find({ room: { $eq: room } })

  res.json(messages)
})

module.exports = router
