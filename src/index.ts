import type { Todo, FilterType } from './types';
import { formatDate } from './utils';
import {
  addTodo,
  deleteTodo,
  completeTodo,
  uncompleteTodo,
  getFilteredTodos,
  getTodoStats,
} from './todoService';

// ===State===
let currentFilter: FilterType = 'ALL';

// ===DOM Selectors===
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const addBtn = document.getElementById('add-btn') as HTMLButtonElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const emptyState = document.getElementById('empty-state') as HTMLDivElement;
const filterBtns = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
const statTotal = document.getElementById('stat-total') as HTMLSpanElement;
const statActive = document.getElementById('stat-active') as HTMLSpanElement;
const statDone = document.getElementById('stat-done') as HTMLSpanElement;
const errorMsg = document.getElementById('error-msg') as HTMLParagraphElement;

// ===Render Functions===
function renderTodoItem(todo: Todo): HTMLLIElement {
  const li = document.createElement('li');
  li.className = `todo-item ${todo.status === 'DONE' ? 'done' : ''}`;
  li.dataset['id'] = todo.id;

  li.innerHTML = `
    <button class="check-btn" aria-label="Toggle status" data-id="${todo.id}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </button>
    <div class="todo-content">
      <span class="todo-title">${escapeHtml(todo.title)}</span>
      <span class="todo-meta">
        <span class="todo-status-badge">${todo.status === 'DONE' ? '[DONE]' : '[ACTIVE]'}</span>
        ${formatDate(todo.createdAt)}
      </span>
    </div>
    <button class="delete-btn" aria-label="Hapus to-do" data-id="${todo.id}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"></path>
        <path d="M10 11v6M14 11v6"></path>
        <path d="M9 6V4h6v2"></path>
      </svg>
    </button>
  `;

  return li;
}

function renderTodos(): void {
  const todos = getFilteredTodos(currentFilter);
  todoList.innerHTML = '';

  if (todos.length === 0) {
    emptyState.style.display = 'flex';
  } else {
    emptyState.style.display = 'none';
    todos.forEach((todo) => {
      todoList.appendChild(renderTodoItem(todo));
    });
  }

  renderStats();
}

function renderStats(): void {
  const stats = getTodoStats();
  statTotal.textContent = String(stats.total);
  statActive.textContent = String(stats.active);
  statDone.textContent = String(stats.done);
}

//===Event Handlers===
function handleAdd(): void {
  const title = todoInput.value.trim();

  if (title.length === 0) {
    showError('Judul to-do tidak boleh kosong.');
    todoInput.focus();
    return;
  }

  try {
    addTodo({ title });
    todoInput.value = '';
    hideError();
    // Kalau filter bukan ALL/ACTIVE, switch ke ALL agar item baru terlihat
    if (currentFilter === 'DONE') {
      setFilter('ALL');
    } else {
      renderTodos();
    }
    // Animasi bounce pada tombol add
    addBtn.classList.add('animate-pop');
    setTimeout(() => addBtn.classList.remove('animate-pop'), 300);
  } catch (error) {
    showError(error instanceof Error ? error.message : 'Terjadi kesalahan.');
  }
}

function handleToggle(id: string): void {
  try {
    const todos = getFilteredTodos('ALL');
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    if (todo.status === 'ACTIVE') {
      completeTodo(id);
    } else {
      uncompleteTodo(id);
    }

    hideError();
    renderTodos();
  } catch (error) {
    showError(error instanceof Error ? error.message : 'Terjadi kesalahan.');
  }
}

function handleDelete(id: string): void {
  try {
    const li = document.querySelector<HTMLLIElement>(`li[data-id="${id}"]`);
    if (li) {
      li.classList.add('removing');
      setTimeout(() => {
        deleteTodo(id);
        hideError();
        renderTodos();
      }, 250);
    }
  } catch (error) {
    showError(error instanceof Error ? error.message : 'Terjadi kesalahan.');
  }
}

function setFilter(filter: FilterType): void {
  currentFilter = filter;
  filterBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset['filter'] === filter);
  });
  renderTodos();
}

// ===Event Listeners===
addBtn.addEventListener('click', handleAdd);

todoInput.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter') handleAdd();
});

todoInput.addEventListener('input', () => {
  if (todoInput.value.trim().length > 0) hideError();
});

// Event delegation untuk check & delete buttons
todoList.addEventListener('click', (e: MouseEvent) => {
  const target = e.target as HTMLElement;

  const checkBtn = target.closest<HTMLButtonElement>('.check-btn');
  if (checkBtn?.dataset['id']) {
    handleToggle(checkBtn.dataset['id']);
    return;
  }

  const deleteBtn = target.closest<HTMLButtonElement>('.delete-btn');
  if (deleteBtn?.dataset['id']) {
    handleDelete(deleteBtn.dataset['id']);
  }
});

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset['filter'] as FilterType;
    if (filter) setFilter(filter);
  });
});

// ===Utilities===
function showError(message: string): void {
  errorMsg.textContent = message;
  errorMsg.style.display = 'block';
  todoInput.classList.add('input-error');
}

function hideError(): void {
  errorMsg.style.display = 'none';
  todoInput.classList.remove('input-error');
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

// ===Init===
renderTodos();
todoInput.focus();
