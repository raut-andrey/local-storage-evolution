import { TodoItemType } from './types';

const TODO_LIST_STORAGE_KEY = 'todoList';

const todoList: TodoItemType[] = [];

// Set value
localStorage.setItem(TODO_LIST_STORAGE_KEY, JSON.stringify(todoList));

// Get value
const storedTodoList: TodoItemType[] = JSON.parse(localStorage.getItem(TODO_LIST_STORAGE_KEY) as string) || [];
