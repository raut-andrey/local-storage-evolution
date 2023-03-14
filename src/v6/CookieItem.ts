import Cookie from 'js-cookie';

import CoreStorageItem, { EncodingType } from './CoreStorageItem';

// Something imported from the config file
const COOKIES_KEY_PREFIX = 'my-awesome-app__cookies__';

class CookieItem<D> extends CoreStorageItem<D, never, [options?: Cookie.CookieAttributes], never> {
  constructor(options: {
    key: string;
    defaultValue: D;
    useKeyPrefix: boolean;
    encoding?: boolean | EncodingType;
    expiresIn?: number;
    version?: number;
  }) {
    super({
      keyPrefix: COOKIES_KEY_PREFIX,

      key: options.key,
      defaultValue: options.defaultValue,
      useKeyPrefix: options.useKeyPrefix,
      encoding: options.encoding,
      expiresIn: options.expiresIn,
      version: options.version,

      getFunction: (key: string) => {
        return Cookie.get(key) as string;
      },
      setFunction: (key: string, value: string, attributes?: Cookie.CookieAttributes) => {
        Cookie.set(key, value, attributes);
      },
      removeFunction: (key: string) => {
        Cookie.remove(key);
      },
    });
  }
}

export default CookieItem;
