// Something imported from the config file
const isDev = true;

export type EncodingType = {
  key?: boolean;
  value?: boolean;
}

const checkIfEncodingOptionBoolean = (value: boolean | EncodingType): value is boolean => {
  return typeof value === 'boolean';
};

const DEFAULT_ENCODING_KEY_VALUE = false;
const DEFAULT_ENCODING_VALUE_VALUE = false;

const getEncodingOptions = (option: boolean | EncodingType) => {
  const isBoolean = checkIfEncodingOptionBoolean(option);

  let encodingKey: boolean = false;
  let encodingValue: boolean = false;

  if (isDev) {
    return { encodingKey, encodingValue };
  }

  if (isBoolean) {
    encodingKey = option ?? DEFAULT_ENCODING_KEY_VALUE;
    encodingValue = option ?? DEFAULT_ENCODING_VALUE_VALUE;
  } else {
    encodingKey = option.key ?? DEFAULT_ENCODING_KEY_VALUE;
    encodingValue = option.value ?? DEFAULT_ENCODING_VALUE_VALUE;
  }

  return { encodingKey, encodingValue };
};

type EncodeFunction = (rawString: string) => string;
type DecodeFunction = (encodedString: string) => string;

export type BaseGetFuntionType<A extends unknown[]> = (key: string, ...args: A) => string;
export type BaseSetFuntionType<A extends unknown[]> = (key: string, value: string, ...args: A) => void;
export type BaseRemoveFuntionType<A extends unknown[]> = (key: string, ...args: A) => void;

type StoredItemType<D> = {
  version: number;
  expiresAt: number;
  data: D;
}

class CoreStorageItem<D, GA extends unknown[], SA extends unknown[], RA extends unknown[]> {
  private encoder: EncodeFunction;
  private decoder: DecodeFunction;
  private getFunction: BaseGetFuntionType<GA>;
  private setFunction: BaseSetFuntionType<SA>;
  private removeFunction: BaseRemoveFuntionType<RA>;

  private key: string;
  private defaultValue: D;
  private encodingKey: boolean;
  private encodingValue: boolean;
  private expiresIn: number | null;
  private version: number;

  constructor(options: {
    keyPrefix?: string;

    key: string;
    defaultValue: D;
    useKeyPrefix: boolean;
    encoding?: boolean | EncodingType;
    expiresIn?: number;
    version?: number;

    encoder?: EncodeFunction;
    decoder?: DecodeFunction;
    getFunction: BaseGetFuntionType<GA>;
    setFunction: BaseSetFuntionType<SA>;
    removeFunction: BaseRemoveFuntionType<RA>;
  }) {
    this.encoder = options.encoder || ((value: string) => window.btoa(value));
    this.decoder = options.decoder || ((value: string) => window.atob(value));
    this.getFunction = options.getFunction;
    this.setFunction = options.setFunction;
    this.removeFunction = options.removeFunction;

    this.defaultValue = options.defaultValue;

    const { encodingKey, encodingValue } = getEncodingOptions(options.encoding ?? false);
    this.encodingKey = encodingKey;
    this.encodingValue = encodingValue;

    let key = options.key;
    if (options.useKeyPrefix) {
      key = `${options.keyPrefix || ''}${key}`;
    }
    if (this.encodingKey) {
      key = this.encoder(key);
    }
    this.key = key;

    this.expiresIn = options.expiresIn ?? null;
    this.version = options.version ?? 0;
  }

  get = (...args: GA): D => {
    try {
      let stringValue = this.getFunction(this.key, ...args);

      if (this.encodingValue) {
        stringValue = this.decoder(stringValue);
      }

      const storedValue = JSON.parse(stringValue) as StoredItemType<D>;

      if (
        storedValue.version < this.version ||
        (storedValue.expiresAt && storedValue.expiresAt < Date.now())
      ) {
        return this.defaultValue;
      }

      return storedValue.data || this.defaultValue;
    } catch (err) {
      console.error('Error in the get stored item function:', err);
      return this.defaultValue;
    }
  };

  set = (value: D, ...args: SA) => {
    let expiresAt = 0;

    if (this.expiresIn) {
      expiresAt = Date.now() + this.expiresIn;
    }

    const valueToStore: StoredItemType<D> = {
      data: value,
      expiresAt,
      version: this.version,
    };

    let stringValue = JSON.stringify(valueToStore);

    if (this.encodingValue) {
      stringValue = this.encoder(stringValue);
    }

    this.setFunction(this.key, stringValue, ...args);
  };

  remove = (...args: RA) => {
    this.removeFunction(this.key, ...args);
  };
}

export default CoreStorageItem;
