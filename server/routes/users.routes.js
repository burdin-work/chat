const { Router } = require('express')
const User = require('../models/user.model')
const router = Router()


router.post('/create', async (req, res) => {

  const user = new User({
    name: req.body.name,
    avatar: req.body.avatar,
    room: req.body.room,
    online: true
  })

  user.id = user._id
  try {
    await user.save()
    res.json(user)
  } catch (e) {
    console.error(e)
  }

})


router.get('/users', async (req, res) => {
  const users = await User.find()
  res.json(users)
})

router.put('/change_room/:id', async (req, res) => {
  try {
    const $set = {
      room: req.body.room
    }
    await User.findOneAndUpdate({ _id: req.params.id }, $set)
    res.status(204).json()
  } catch (e) {
    res.status(500).json(e)
  }
})

router.put('/change_status/:id', async (req, res) => {
  try {
    const $set = {
      online: req.body.status
    }
    await User.findOneAndUpdate({ _id: req.params.id }, $set)
    res.status(204).json()
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router
