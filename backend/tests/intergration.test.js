// backend/integration.test.js
const request = require('supertest');
const app = require('../server');
const todoDb = require('../db/todoDb');

// Test suite for database integration and data consistency
describe('Database Integration', () => {
    // Initialize the database once before all tests in this suite
    beforeAll(async () => {
        await todoDb.initializeDatabase();
    });

    // Close the database connection once after all tests in this suite have run
    afterAll(async () => {
        await todoDb.close();
    });

    // Clear all todos before each individual test to ensure a clean state
    beforeEach(async () => {
        await todoDb.clearTodos();
    });

    test('Should persist todo in the database after creation', async () => {
        const newTodo = { title: 'Database Test Todo' };
        const res = await request(app)
            .post('/api/todos')
            .send(newTodo);

        expect(res.status).toBe(201);

        // Verify the todo exists in the database by fetching it directly
        const dbTodo = await todoDb.getTodoById(res.body.id);
        expect(dbTodo).toBeTruthy();
        expect(dbTodo.title).toBe(newTodo.title);
    });

    test('Should maintain data consistency after updates', async () => {
        // Create a todo
        const createRes = await request(app)
            .post('/api/todos')
            .send({ title: 'Consistency Test' });

        const todoId = createRes.body.id;

        // Update the todo via the API
        await request(app)
            .put(`/api/todos/${todoId}`)
            .send({ completed: true });

        // Verify the final state in the database
        const dbTodo = await todoDb.getTodoById(todoId);
        expect(dbTodo.completed).toBe(true);
    });
});
