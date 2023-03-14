import CoreStorageItem, { EncodingType } from './CoreStorageItem';

// Something imported from the config file
const LOCAL_STORAGE_KEY_PREFIX = 'my-awesome-app__local-storage__';

class LocalStorageItem<D> extends CoreStorageItem<D, never, never, never> {
  constructor(options: {
    key: string;
    defaultValue: D;
    useKeyPrefix: boolean;
    encoding?: boolean | EncodingType;
    expiresIn?: number;
    version?: number;
  }) {
    super({
      keyPrefix: LOCAL_STORAGE_KEY_PREFIX,

      key: options.key,
      defaultValue: options.defaultValue,
      useKeyPrefix: options.useKeyPrefix,
      encoding: options.encoding,
      expiresIn: options.expiresIn,
      version: options.version,

      encoder: (str: string) => {
        return window.btoa(window.btoa(str));
      },
      decoder: (str: string) => {
        return window.atob(window.atob(str));
      },

      getFunction: (key: string) => {
        return localStorage.getItem(key) as string;
      },
      setFunction: (key: string, value: string) => {
        localStorage.setItem(key, value);
      },
      removeFunction: (key: string) => {
        localStorage.removeItem(key);
      },
    });
  }
}

export default LocalStorageItem;
