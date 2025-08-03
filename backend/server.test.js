//backend/server.test.js 
const request = require('supertest');
const app = require('./server');
const todoDb = require('./db/todoDb');

describe('Todo API', () => {
  // Close the database connection after all tests
  afterAll(async () => {
    await todoDb.close();
  });
  test('GET /health should return healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  test('GET /api/todos should return todos array', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/todos should create new todo', async () => {
    const newTodo = { title: 'Test Todo' };
    const res = await request(app)
      .post('/api/todos')
      .send(newTodo);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Todo');
    expect(res.body.completed).toBe(false);
  });

  test('POST /api/todos should return 400 if no title', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Title is required');
  });

  test('PUT /api/todos/:id should update todo', async () => {
    // First create a todo
    const createRes = await request(app)
      .post('/api/todos')
      .send({ title: 'Update Test' });

    const todoId = createRes.body.id;

    // Then update it
    const updateRes = await request(app)
      .put(`/api/todos/${todoId}`)
      .send({ completed: true });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.completed).toBe(true);
  });

  test('DELETE /api/todos/:id should delete todo', async () => {
    // First create a todo
    const createRes = await request(app)
      .post('/api/todos')
      .send({ title: 'Delete Test' });

    const todoId = createRes.body.id;

    // Then delete it
    const deleteRes = await request(app)
      .delete(`/api/todos/${todoId}`);

    expect(deleteRes.status).toBe(204);
  });
});
