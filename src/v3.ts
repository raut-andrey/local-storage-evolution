import { TodoItemType, TodoFilterValueENUM } from './types';

class LocalStorageItem<D> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  get = (): D => {
    const storedValue = localStorage.getItem(this.key);

    const parsedValue = JSON.parse(storedValue as string);

    return parsedValue;
  };

  set = (value: D) => {
    const stringifyedValue = JSON.stringify(value);

    localStorage.setItem(this.key, stringifyedValue);
  };

  remove = () => {
    localStorage.removeItem(this.key);
  }
}

const todoListStorage = new LocalStorageItem<TodoItemType[]>('todoList');
const todoFilterStorage = new LocalStorageItem<TodoFilterValueENUM>('todoFilter');

const todoList: TodoItemType[] = [];

// Set value
todoListStorage.set(todoList);
todoFilterStorage.set(TodoFilterValueENUM.active);

// Get value
const storedTodoList = todoListStorage.get() || [];
const storedTodoFilter = todoFilterStorage.get() || TodoFilterValueENUM.all;
