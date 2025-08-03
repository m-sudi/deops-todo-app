// backend/performance.test.js
const request = require('supertest');
const app = require('./server');
const todoDb = require('./db/todoDb');

// Test suite for API performance
describe('API Performance', () => {
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

    test('Should handle multiple concurrent requests', async () => {
        const promises = [];
        for (let i = 0; i < 10; i++) {
            promises.push(
                request(app)
                    .post('/api/todos')
                    .send({ title: `Concurrent Todo ${i}` })
            );
        }

        const results = await Promise.all(promises);
        results.forEach(res => {
            expect(res.status).toBe(201);
        });

        const getAllRes = await request(app).get('/api/todos');
        expect(getAllRes.body.length).toBe(10);
    });
});
