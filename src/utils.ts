import type { Todo, TodoStatus } from './types.js';
// ===Type guard: memvalidasi apakah sebuah string adalah TodoStatus yang valid===
export function isTodoStatus(value: unknown): value is TodoStatus {
  return value === 'ACTIVE' || value === 'DONE';
}

// ===Type guard: memvalidasi apakah sebuah objek adalah Todo yang valid===
export function isTodo(value: unknown): value is Todo {
  if (typeof value !== 'object' || value === null) return false;

  const obj = value as Record<string, unknown>;

  return (
    typeof obj['id'] === 'string' &&
    typeof obj['title'] === 'string' &&
    typeof obj['createdAt'] === 'string' &&
    isTodoStatus(obj['status'])
  );
}

// ===Type guard: memvalidasi apakah sebuah nilai adalah array of Todo===
export function isTodoArray(value: unknown): value is Todo[] {
  return Array.isArray(value) && value.every(isTodo);
}

// ===Helper: membuat ID unik berbasis timestamp + random string===
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// ===Helper: memformat tanggal ISO ke format yang mudah dibaca===
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
