const express = require('express');
const todoController = require('../controllers/todoController');

const router = express.Router();

// Get all todos
router.get('/', todoController.getAllTodos.bind(todoController));

// Get todo by id
router.get('/:id', todoController.getTodoById.bind(todoController));

// Create new todo
router.post('/', todoController.createTodo.bind(todoController));

// Update todo
router.put('/:id', todoController.updateTodo.bind(todoController));

// Delete todo
router.delete('/:id', todoController.deleteTodo.bind(todoController));

// Get todo count
router.get('/stats/count', todoController.getTodoCount.bind(todoController));

module.exports = router;