import { randomUUID } from 'node:crypto';

export const todos = [];
export const toDos = todos;

// Listar todos los ToDos
export function getAllTodos() {
    return todos;
}

// Obtener un ToDo de forma individual
export function getTodoById(id) {
    return todos.find(todo => todo.id === id);
}

// Crear un ToDo
export function insert(title) {
    const todo = {
        id: randomUUID(),
        title,
        completed: false
    };
    todos.push(todo);
    return todo;
}

// Actualizar parcialmente un ToDo
export function updateTodoById(id, updates) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.title = updates.title || todo.title;
        if (updates.completed !== undefined) {
            todo.completed = updates.completed;
        }
        return todo;
    }
    return null;
}

// Eliminar un ToDo
export function deleteTodoById(id) {
    const index = todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
        todos.splice(index, 1);
        return true;
    }
    return false;
}
