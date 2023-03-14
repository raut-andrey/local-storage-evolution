import { TodoItemType } from './types';

const todoListStorage = {
  key: 'todoList',
  get(): TodoItemType[] {
    const storedValue = localStorage.getItem(this.key);

    return JSON.parse(storedValue as string) || [];
  },
  set(value: TodoItemType[]) {
    const stringifyedValue = JSON.stringify(value);

    localStorage.setItem(this.key, stringifyedValue);
  },
};

const todoList: TodoItemType[] = [];

// Set value
todoListStorage.set(todoList);

// Get value
const storedTodoList = todoListStorage.get();
