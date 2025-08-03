const TodoModel = require('../models/todoModel');

class TodoDao {
    async findAll() {
        try {
            return await TodoModel.findAll();
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    }

    async findById(id) {
        try {
            return await TodoModel.findById(id);
        } catch (error) {
            console.error('Error in findById:', error);
            throw error;
        }
    }

    async create(data) {
        try {
            return await TodoModel.create(data);
        } catch (error) {
            console.error('Error in create:', error);
            throw error;
        }
    }

    async updateById(data, id) {
        try {
            return await TodoModel.update(id, data);
        } catch (error) {
            console.error('Error in updateById:', error);
            throw error;
        }
    }

    async deleteById(id) {
        try {
            return await TodoModel.delete(id);
        } catch (error) {
            console.error('Error in deleteById:', error);
            throw error;
        }
    }

    async getCount() {
        try {
            return await TodoModel.count();
        } catch (error) {
            console.error('Error in getCount:', error);
            throw error;
        }
    }

    async checkExist(id) {
        try {
            const todo = await this.findById(id);
            return !!todo;
        } catch (error) {
            console.error('Error in checkExist:', error);
            throw error;
        }
    }
}

module.exports = new TodoDao();