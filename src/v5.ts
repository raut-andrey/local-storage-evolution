import { TodoItemType, TodoFilterValueENUM } from './types';

// Something imported from the config file
const isDev = true;

class LocalStorageItem<D, J extends boolean> {
  private key: string;

  private defaultValue: D;

  private encoding: boolean;

  private jsonify: boolean;

  constructor(options: {
    key: string;
    defaultValue: D;
    encoding?: J extends false ? (D extends string ? boolean : false) : boolean;
    jsonify?: J;
  }) {
    this.encoding = isDev ? false : (options.encoding ?? false);
    const key = `my-awesome-app__${options.key}`;
    this.key = this.encoding ? window.btoa(key) : key;
    this.defaultValue = options.defaultValue;
    this.jsonify = options.jsonify ?? true;
  }

  get = (): D => {
    try {
      let value = localStorage.getItem(this.key) as string;

      if (this.encoding) {
        value = window.atob(value)
      }

      if (this.jsonify) {
        value = JSON.parse(value);
      }

      return value as D ?? this.defaultValue;
    } catch {
      return this.defaultValue;
    }
  };

  set = (value: D) => {
    let preparedValue = value as string;

    if (this.jsonify) {
      preparedValue = JSON.stringify(preparedValue);
    }

    if (this.encoding) {
      preparedValue = window.btoa(preparedValue);
    }

    localStorage.setItem(this.key, preparedValue);
  };

  remove = () => {
    localStorage.removeItem(this.key);
  }
}

const todoListStorage = new LocalStorageItem({
  key: 'todoList',
  defaultValue: [] as TodoItemType[],
  jsonify: false,
  encoding: false,
});
const todoFilterStorage = new LocalStorageItem({
  key: 'todoFilter',
  defaultValue: TodoFilterValueENUM.all,
  jsonify: false,
});

const todoList: TodoItemType[] = [];

// Set value
todoListStorage.set(todoList);
todoFilterStorage.set(TodoFilterValueENUM.active);

// Get value
const storedTodoList = todoListStorage.get();
const storedTodoFilter = todoFilterStorage.get();
