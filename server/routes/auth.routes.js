const { Router } = require('express')
const User = require('../models/user.model')
const router = Router()


// api/auth/admin/create
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
    res.json({
      name: user.name,
      avatar: user.avatar,
      id: user.id,
      room: user.room,
      online: true
    })
  } catch (e) {
    console.error(e)
  }

})

module.exports = router
