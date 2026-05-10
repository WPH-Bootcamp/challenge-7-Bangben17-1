import type { Todo, CreateTodoPayload, FilterType } from './types.js';
import { generateId } from './utils.js';
import { loadTodos, saveTodos } from './storage.js';

// ===Mengambil semua To-Do dari storage===
export function getAllTodos(): Todo[] {
  return loadTodos();
}

// ===Mengambil To-Do berdasarkan filter status===
export function getFilteredTodos(filter: FilterType): Todo[] {
  const todos = loadTodos();
  if (filter === 'ALL') return todos;
  return todos.filter((todo) => todo.status === filter);
}

// ===Menambahkan To-Do baru===
export function addTodo(payload: CreateTodoPayload): Todo {
  const title = payload.title.trim();
  if (title.length === 0) {
    throw new Error('Judul to-do tidak boleh kosong.');
  }

  const todos = loadTodos();

  const newTodo: Todo = {
    id: generateId(),
    title,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };

  todos.push(newTodo);
  saveTodos(todos);

  return newTodo;
}

// ===Mengubah status To-Do menjadi DONE===
export function completeTodo(id: string): Todo {
  const todos = loadTodos();
  const index = todos.findIndex((todo) => todo.id === id);

  if (index === -1) {
    throw new Error(`To-Do dengan id "${id}" tidak ditemukan.`);
  }

  todos[index] = { ...todos[index], status: 'DONE' };
  saveTodos(todos);

  return todos[index];
}

// ===Mengembalikan status To-Do menjadi ACTIVE===
export function uncompleteTodo(id: string): Todo {
  const todos = loadTodos();
  const index = todos.findIndex((todo) => todo.id === id);

  if (index === -1) {
    throw new Error(`To-Do dengan id "${id}" tidak ditemukan.`);
  }

  todos[index] = { ...todos[index], status: 'ACTIVE' };
  saveTodos(todos);

  return todos[index];
}

// ===Menghapus To-Do berdasarkan id===
export function deleteTodo(id: string): void {
  const todos = loadTodos();
  const filtered = todos.filter((todo) => todo.id !== id);

  if (filtered.length === todos.length) {
    throw new Error(`To-Do dengan id "${id}" tidak ditemukan.`);
  }

  saveTodos(filtered);
}

// ===Menghitung statistik To-Do===
export function getTodoStats(): {
  total: number;
  active: number;
  done: number;
} {
  const todos = loadTodos();
  const done = todos.filter((t) => t.status === 'DONE').length;
  return {
    total: todos.length,
    active: todos.length - done,
    done,
  };
}
