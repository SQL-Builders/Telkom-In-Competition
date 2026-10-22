import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';

const USER_KEY = 'telkom-in-competition:user';
const TOKEN_KEY = 'telkom-in-competition:token';

function AuthHarness() {
  const { user, isLoggedIn, login, logout } = useAuth();

  return (
    <div>
      <span data-testid="login-state">{isLoggedIn ? 'logged-in' : 'logged-out'}</span>
      <span data-testid="user-id">{user?.id_user ?? ''}</span>
      <button onClick={() => login({ id_user: 42, name: 'Felix', email: 'felix@example.com' }, 'access-token')}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('stores the API user ID and access token when logging in', () => {
    render(<AuthProvider><AuthHarness /></AuthProvider>);

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(screen.getByTestId('login-state')).toHaveTextContent('logged-in');
    expect(screen.getByTestId('user-id')).toHaveTextContent('42');
    expect(JSON.parse(localStorage.getItem(USER_KEY) || '{}')).toMatchObject({ id_user: 42 });
    expect(localStorage.getItem(TOKEN_KEY)).toBe('access-token');
  });

  it('clears the stored session when logging out', () => {
    render(<AuthProvider><AuthHarness /></AuthProvider>);

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    expect(screen.getByTestId('login-state')).toHaveTextContent('logged-out');
    expect(localStorage.getItem(USER_KEY)).toBeNull();
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });
});
