import { setAuthToken, getAuthToken, clearAuthToken } from '../http';

describe('HTTP Token Management', () => {
  beforeEach(() => {
    clearAuthToken();
  });

  test('starts with null token', () => {
    expect(getAuthToken()).toBeNull();
  });

  test('can set and retrieve a valid token', () => {
    const token = 'valid-jwt-token';
    setAuthToken(token);
    expect(getAuthToken()).toBe(token);
  });

  test('can update existing token', () => {
    setAuthToken('old-token');
    expect(getAuthToken()).toBe('old-token');

    setAuthToken('new-token');
    expect(getAuthToken()).toBe('new-token');
  });

  test('can clear token', () => {
    setAuthToken('token-to-clear');
    expect(getAuthToken()).not.toBeNull();

    clearAuthToken();
    expect(getAuthToken()).toBeNull();
  });

  test('handles setting null token explicitly', () => {
    setAuthToken('some-token');
    setAuthToken(null);
    expect(getAuthToken()).toBeNull();
  });
});
