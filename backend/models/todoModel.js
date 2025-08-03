const db = require('../db/todoDb');

class TodoModel {
    static async findAll() {
        const query = 'SELECT * FROM todos ORDER BY id DESC';
        const result = await db.query(query);
        return result.rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM todos WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    static async create(data) {
        const query = `
            INSERT INTO todos (title, completed) 
            VALUES ($1, $2) 
            RETURNING *
        `;
        const result = await db.query(query, [data.title, data.completed || false]);
        return result.rows[0];
    }

    static async update(id, data) {
        const updateFields = [];
        const values = [];
        let paramIndex = 1;

        if (data.title !== undefined) {
            updateFields.push(`title = $${paramIndex++}`);
            values.push(data.title);
        }

        if (data.completed !== undefined) {
            updateFields.push(`completed = $${paramIndex++}`);
            values.push(data.completed);
        }

        updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
            UPDATE todos 
            SET ${updateFields.join(', ')} 
            WHERE id = $${paramIndex} 
            RETURNING *
        `;

        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM todos WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    static async count() {
        const query = 'SELECT COUNT(*) FROM todos';
        const result = await db.query(query);
        return parseInt(result.rows[0].count);
    }
}

module.exports = TodoModel;