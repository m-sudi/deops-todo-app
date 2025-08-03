const todoDao = require('../dao/todoDao');

class TodoService {
    async getAllTodos() {
        try {
            return await todoDao.findAll();
        } catch (error) {
            console.error('Service error in getAllTodos:', error);
            throw new Error('Failed to retrieve todos');
        }
    }

    async getTodoById(id) {
        try {
            const todo = await todoDao.findById(id);
            if (!todo) {
                throw new Error('Todo not found');
            }
            return todo;
        } catch (error) {
            console.error('Service error in getTodoById:', error);
            throw error;
        }
    }

    async createTodo(todoData) {
        try {
            if (!todoData.title || todoData.title.trim() === '') {
                throw new Error('Title is required');
            }

            const newTodo = await todoDao.create({
                title: todoData.title.trim(),
                completed: todoData.completed || false
            });

            return newTodo;
        } catch (error) {
            console.error('Service error in createTodo:', error);
            throw error;
        }
    }

    async updateTodo(id, updateData) {
        try {
            const exists = await todoDao.checkExist(id);
            if (!exists) {
                throw new Error('Todo not found');
            }

            if (updateData.title !== undefined && updateData.title.trim() === '') {
                throw new Error('Title cannot be empty');
            }

            const updatedTodo = await todoDao.updateById(updateData, id);
            return updatedTodo;
        } catch (error) {
            console.error('Service error in updateTodo:', error);
            throw error;
        }
    }

    async deleteTodo(id) {
        try {
            const exists = await todoDao.checkExist(id);
            if (!exists) {
                throw new Error('Todo not found');
            }

            const deletedTodo = await todoDao.deleteById(id);
            return deletedTodo;
        } catch (error) {
            console.error('Service error in deleteTodo:', error);
            throw error;
        }
    }

    async getTodoCount() {
        try {
            return await todoDao.getCount();
        } catch (error) {
            console.error('Service error in getTodoCount:', error);
            throw new Error('Failed to get todo count');
        }
    }
}

module.exports = new TodoService();