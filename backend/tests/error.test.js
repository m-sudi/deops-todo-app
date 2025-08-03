// backend/error.test.js
const request = require('supertest');
const app = require('../server');
const todoDb = require('../db/todoDb');

// Test suite for API error handling and edge cases
describe('API Error Handling and Constraints', () => {
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

    test('POST /api/todos should return 400 if title is missing', async () => {
        const res = await request(app)
            .post('/api/todos')
            .send({}); // Sending an empty object

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Title is required');
    });

    test('Should handle non-existent todo updates gracefully', async () => {
        const res = await request(app)
            .put('/api/todos/999999') // Using an ID that is unlikely to exist
            .send({ completed: true });

        expect(res.status).toBe(404);
    });

    test('Should handle malformed todo creation requests', async () => {
        const res = await request(app)
            .post('/api/todos')
            .send({ invalidField: 'test' }); // Sending a field the API doesn't expect

        expect(res.status).toBe(400);
    });

    test('Should enforce title length constraints', async () => {
        const longTitle = 'a'.repeat(256); // Assuming max length is 255
        const res = await request(app)
            .post('/api/todos')
            .send({ title: longTitle });

        expect(res.status).toBe(400);
    });

    test('Should handle special characters in todo titles', async () => {
        const specialTitle = 'Test @#$%^&*()';
        const res = await request(app)
            .post('/api/todos')
            .send({ title: specialTitle });

        expect(res.status).toBe(201);
        expect(res.body.title).toBe(specialTitle);
    });
});
