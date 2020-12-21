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

module.exports = router
