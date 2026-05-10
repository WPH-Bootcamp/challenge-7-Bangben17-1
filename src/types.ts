// ===Mendefinisikan status sebuah To-Do menggunakan union type===
export type TodoStatus = 'ACTIVE' | 'DONE';

// ===Interface utama untuk sebuah To-Do item===
export interface Todo {
  id: string;
  title: string;
  status: TodoStatus;
  createdAt: string; // ISO date string
}

// ===Type untuk payload saat membuat To-Do baru (tanpa id & metadata)===
export type CreateTodoPayload = Pick<Todo, 'title'>;

// ===Type untuk filter tampilan===
export type FilterType = 'ALL' | 'ACTIVE' | 'DONE';
