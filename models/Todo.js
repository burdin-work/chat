// 1 - объект, 2 - функция
const { Schema, model } = require('mongoose')
// типы указываются через глобальные классы в js
const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
})

module.exports = model('Todo', schema)
