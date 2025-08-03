const { Pool } = require('pg');
require('dotenv').config();

class TodoDb {
    constructor() {
        this.pool = new Pool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });
    }

    async query(text, params) {
        let client;
        try {
            client = await this.pool.connect();
            const result = await client.query(text, params);
            return result;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        } finally {
            if (client) {
                await client.release();
            }
        }
    }

    async initializeDatabase() {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS todos (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                completed BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        try {
            await this.query(createTableQuery);
            console.log('Database table initialized successfully');
        } catch (error) {
            console.error('Error initializing database:', error);
            throw error;
        }
    }

    async close() {
        try {
            await this.pool.end();
        } catch (error) {
            console.error('Error closing database connection:', error);
            throw error;
        }
    }

    async clearTodos() {
        const clearQuery = 'TRUNCATE TABLE todos RESTART IDENTITY';
        try {
            await this.query(clearQuery);
            console.log('All todos cleared successfully');
        } catch (error) {
            console.error('Error clearing todos:', error);
            throw error;
        }
    }
}

module.exports = new TodoDb();