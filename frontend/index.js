// const API_BASE = window.location.protocol + '//' + window.location.hostname + ':3000/api';

const API_BASE = window.location.protocol + '//' + window.location.hostname + ':3000/api';

function showStatus(message, type = 'success') {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
    setTimeout(() => {
        status.style.display = 'none';
    }, 3000);
}

async function loadTodos() {
    try {
        const response = await fetch(`${API_BASE}/todos`);
        if (!response.ok) throw new Error('Failed to load todos');

        const todos = await response.json();
        displayTodos(todos);
    } catch (error) {
        showStatus('Failed to load todos: ' + error.message, 'error');
    }
}

function displayTodos(todos) {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        todoItem.innerHTML = `
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                           onchange="toggleTodo(${todo.id}, this.checked)">
                    <span class="todo-text">${todo.title}</span>
                    <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
                `;
        todoList.appendChild(todoItem);
    });
}

async function addTodo() {
    const input = document.getElementById('todoInput');
    const title = input.value.trim();

    if (!title) {
        showStatus('Please enter a todo title', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title }),
        });

        if (!response.ok) throw new Error('Failed to add todo');

        input.value = '';
        showStatus('Todo added successfully!');
        loadTodos();
    } catch (error) {
        showStatus('Failed to add todo: ' + error.message, 'error');
    }
}

async function toggleTodo(id, completed) {
    try {
        const response = await fetch(`${API_BASE}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed }),
        });

        if (!response.ok) throw new Error('Failed to update todo');

        showStatus('Todo updated successfully!');
        loadTodos();
    } catch (error) {
        showStatus('Failed to update todo: ' + error.message, 'error');
    }
}

async function deleteTodo(id) {
    if (!confirm('Are you sure you want to delete this todo?')) return;

    try {
        const response = await fetch(`${API_BASE}/todos/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete todo');

        showStatus('Todo deleted successfully!');
        loadTodos();
    } catch (error) {
        showStatus('Failed to delete todo: ' + error.message, 'error');
    }
}

// Allow Enter key to add todo
document.getElementById('todoInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Load todos when page loads
loadTodos();