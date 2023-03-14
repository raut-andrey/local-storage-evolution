import { TodoItemType, TodoFilterValueENUM } from './types';

class LocalStorageItem<D> {
  private key: string;

  private defaultValue: D;

  constructor(key: string, defaultValue: D) {
    this.key = window.btoa(key);
    this.defaultValue = defaultValue;
  }

  get = (): D => {
    try {
      const storedValue = localStorage.getItem(this.key);

      const decodedValue = window.atob(storedValue as string)

      const parsedValue = JSON.parse(decodedValue);

      return parsedValue ?? this.defaultValue;
    } catch {
      return this.defaultValue;
    }
  };

  set = (value: D) => {
    const stringifyedValue = JSON.stringify(value);

    const encodedValue = window.btoa(stringifyedValue);

    localStorage.setItem(this.key, encodedValue);
  };

  remove = () => {
    localStorage.removeItem(this.key);
  }
}

const todoListStorage = new LocalStorageItem('todoList', [] as TodoItemType[]);
const todoFilterStorage = new LocalStorageItem('todoFilter', TodoFilterValueENUM.all);

const todoList: TodoItemType[] = [];

// Set value
todoListStorage.set(todoList);
todoFilterStorage.set(TodoFilterValueENUM.active);

// Get value
const storedTodoList = todoListStorage.get();
const storedTodoFilter = todoFilterStorage.get();
