import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '../../../store/store';

import LoginForm from '../LoginForm';

const MockLoginForm = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <LoginForm />
      </Provider>
    </BrowserRouter>
  );
};

const typeEmailPassword = (
  email: string | RegExp,
  password: string | RegExp
) => {
  const emailInput = screen.getByPlaceholderText(
    /email.../i
  ) as HTMLInputElement;
  const passwordInput = screen.getByPlaceholderText(
    /password.../i
  ) as HTMLInputElement;

  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(passwordInput, { target: { value: password } });

  return [emailInput, passwordInput];
};

describe('LoginForm component', () => {
  describe('Render components', () => {
    test('should render Email input element', () => {
      render(<MockLoginForm />);

      const input = screen.getByPlaceholderText(/email.../i);
      expect(input).toBeInTheDocument();
    });

    test('should render Password input element', () => {
      render(<MockLoginForm />);

      const input = screen.getByPlaceholderText(/password.../i);
      expect(input).toBeInTheDocument();
    });

    test('should render Sign In button', () => {
      render(<MockLoginForm />);

      const submitButton = screen.getByRole('button', {
        name: /sign in/i,
      });
      expect(submitButton).toBeInTheDocument();
    });

    test('should render Register button', () => {
      render(<MockLoginForm />);

      const registerButton = screen.getByRole('button', {
        name: /register/i,
      });
      expect(registerButton).toBeInTheDocument();
    });

    test('should render Forgot password button', () => {
      render(<MockLoginForm />);

      const forgotPwdButton = screen.getByRole('button', {
        name: /forgot password/i,
      });
      expect(forgotPwdButton).toBeInTheDocument();
    });
  });

  describe('Test actions', () => {
    test('should be able to type into email input', () => {
      render(<MockLoginForm />);

      const [emailInput] = typeEmailPassword('test@test.com', '');
      expect(emailInput.value).toBe('test@test.com');
    });

    test('should be able to type into password input', () => {
      render(<MockLoginForm />);

      const [, passwordInput] = typeEmailPassword('', '12345678');
      expect(passwordInput.value).toBe('12345678');
    });

    test('should enable Sign In button after writing appropriate length credentials', () => {
      render(<MockLoginForm />);

      typeEmailPassword('test@test.com', '12345678');

      const submitButton = screen.getByRole('button', {
        name: /sign in/i,
      });
      expect(submitButton).not.toBeDisabled();
    });

    test('should the Sign In button remain disabled if inappropriate length credentials (pwd length 0)', () => {
      render(<MockLoginForm />);

      typeEmailPassword('test@test.com', '');

      const submitButton = screen.getByRole('button', {
        name: /sign in/i,
      });
      expect(submitButton).toBeDisabled();
    });

    test('should the Sign In button change back to disabled after login conditions no longer fulfilled', () => {
      render(<MockLoginForm />);

      typeEmailPassword('test@test.com', '12345678');

      typeEmailPassword('', '');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      expect(submitButton).toBeDisabled();
    });
  });
});
