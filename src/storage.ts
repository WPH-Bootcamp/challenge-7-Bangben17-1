import type { Todo } from './types.js';
import { isTodoArray } from './utils.js';

const STORAGE_KEY = 'todo_app_data';

// ===Membaca semua To-Do dari localStorage===
export function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];

    const parsed: unknown = JSON.parse(raw);

    // Gunakan type guard untuk memastikan data valid
    if (isTodoArray(parsed)) {
      return parsed;
    }

    console.error('Data di localStorage tidak valid, mereset data.');
    return [];
  } catch (error) {
    console.error('Gagal membaca data dari localStorage:', error);
    return [];
  }
}

// ===Menyimpan semua To-Do ke localStorage===
export function saveTodos(todos: Todo[]): void {
  try {
    const serialized = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Gagal menyimpan data ke localStorage:', error);
    throw new Error(
      'Penyimpanan data gagal. Pastikan browser mengizinkan localStorage.'
    );
  }
}

// ===Menghapus semua data dari localStorage===
export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Gagal menghapus data dari localStorage:', error);
  }
}
