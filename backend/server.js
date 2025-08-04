// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(helmet());
// app.use(cors());
// app.use(express.json());

// // In-memory storage for demo (replace with database)
// let todos = [
//   { id: 1, title: 'Learn DevOps', completed: false },
//   { id: 2, title: 'Build CI/CD Pipeline', completed: false }
// ];

// // Health check endpoint
// app.get('/health', (req, res) => {
//   res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
// });

// // Get all todos
// app.get('/api/todos', (req, res) => {
//   res.json(todos);
// });

// // Create new todo
// app.post('/api/todos', (req, res) => {
//   const { title } = req.body;
//   if (!title) {
//     return res.status(400).json({ error: 'Title is required' });
//   }

//   const newTodo = {
//     id: Date.now(),
//     title,
//     completed: false
//   };

//   todos.push(newTodo);
//   res.status(201).json(newTodo);
// });

// // Update todo
// app.put('/api/todos/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const { title, completed } = req.body;

//   const todo = todos.find(t => t.id === id);
//   if (!todo) {
//     return res.status(404).json({ error: 'Todo not found' });
//   }

//   if (title !== undefined) todo.title = title;
//   if (completed !== undefined) todo.completed = completed;

//   res.json(todo);
// });

// // Delete todo
// app.delete('/api/todos/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const index = todos.findIndex(t => t.id === id);

//   if (index === -1) {
//     return res.status(404).json({ error: 'Todo not found' });
//   }

//   todos.splice(index, 1);
//   res.status(204).send();
// });

// // Start server
// if (require.main === module) {
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// }

// module.exports = app;
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const todoRoutes = require('./routes/todoRoutes');
const todoDb = require('./db/todoDb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database
    await todoDb.initializeDatabase();
    console.log('Database connected and initialized');

    // Start server
    if (require.main === module) {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    throw error;
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await todoDb.close();
  process.exit(0);
});

startServer();

module.exports = app;