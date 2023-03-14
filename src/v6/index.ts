import LocalStorageItem from './LocalStorageItem';
import CookieItem from './CookieItem';

enum ThemeENUM {
  light = 'light',
  dark = 'dark',
}

const SECOND = 1000;
const MINUTE = SECOND * 60;

const ACCESS_TOKEN_EXPIRES_IN = MINUTE * 3;

const storage = {
  selectedTheme: new LocalStorageItem({
    key: 'selectedTheme',
    defaultValue: ThemeENUM.light,
    useKeyPrefix: true,
    encoding: { value: true },
    version: 1,
  }),
  accessToken: new CookieItem<string | null>({
    key: 'accessToken',
    useKeyPrefix: false,
    defaultValue: null,
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    version: 1,
  }),
};

// Set value
storage.selectedTheme.set(ThemeENUM.dark);
storage.accessToken.set('SOME_TOKEN_WITHOUT_ATTRIBUTES');
storage.accessToken.set('SOME_TOKEN_WITH_ATTRIBUTES', {
  domain: '.domain.com',
  path: '/',
  sameSite: 'strict',
  secure: true,
  expires: ACCESS_TOKEN_EXPIRES_IN,
});

// Get value
const storedTheme = storage.selectedTheme.get();
const storedAccessTone = storage.accessToken.get();

export default storage;
