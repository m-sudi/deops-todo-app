// backend/core.test.js
const request = require('supertest');
const app = require('../server');
const todoDb = require('../db/todoDb');

// Test suite for basic API health and functionality
describe('Core API Functionality', () => {
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

    test('GET /health should return healthy status', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('healthy');
    });

    test('GET /api/todos should return an empty array initially', async () => {
        const res = await request(app).get('/api/todos');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('POST /api/todos should create a new todo', async () => {
        const newTodo = { title: 'Test Todo' };
        const res = await request(app)
            .post('/api/todos')
            .send(newTodo);

        expect(res.status).toBe(201);
        expect(res.body.title).toBe('Test Todo');
        expect(res.body.completed).toBe(false);
    });

    test('PUT /api/todos/:id should update a todo', async () => {
        // First, create a todo to have something to update
        const createRes = await request(app)
            .post('/api/todos')
            .send({ title: 'Update Test' });

        const todoId = createRes.body.id;

        // Then, update the created todo
        const updateRes = await request(app)
            .put(`/api/todos/${todoId}`)
            .send({ completed: true });

        expect(updateRes.status).toBe(200);
        expect(updateRes.body.completed).toBe(true);
    });

    test('Should return correct todo count', async () => {
        // Create multiple todos
        await request(app).post('/api/todos').send({ title: 'Todo 1' });
        await request(app).post('/api/todos').send({ title: 'Todo 2' });

        const res = await request(app).get('/api/todos');
        expect(res.body.length).toBe(2);
    });

    test('Should update todo with multiple fields', async () => {
        const createRes = await request(app)
            .post('/api/todos')
            .send({ title: 'Multiple Update Test' });

        const updateRes = await request(app)
            .put(`/api/todos/${createRes.body.id}`)
            .send({
                title: 'Updated Title',
                completed: true
            });

        expect(updateRes.status).toBe(200);
        expect(updateRes.body.title).toBe('Updated Title');
        expect(updateRes.body.completed).toBe(true);
    });

    test('Should maintain todo order', async () => {
        // Create todos in a specific order
        await request(app).post('/api/todos').send({ title: 'First Todo' });
        await request(app).post('/api/todos').send({ title: 'Second Todo' });

        const res = await request(app).get('/api/todos');
        expect(res.body[0].title).toBe('First Todo');
        expect(res.body[1].title).toBe('Second Todo');
    });
});
