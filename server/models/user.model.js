const { model, Schema } = require('mongoose')

const userSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  online: {
    type: Boolean,
    required: true
  },
  id: {
    type: String,
    unique: true,
    required: true
  }
})

module.exports = model('users', userSchema)
