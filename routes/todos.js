const { Router } = require('express')
const Todo = require('../models/Todo')
const router = Router()
router.get('/', async (req, res) => {
  const todos = await Todo.find({})
  console.log('7-- ', todos)
  res.render('index', {
    title: 'Todos list',
    isIndex: true,
    todos
  })
})
module.exports = router
