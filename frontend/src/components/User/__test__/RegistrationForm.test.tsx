import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '../../../store/store';
import RegistrationForm from '../RegistrationForm';

const MockRegistrationForm = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <RegistrationForm />
      </Provider>
    </BrowserRouter>
  );
};

const typeEmailNamePasswords = (
  email: string | RegExp,
  name: string | RegExp,
  password: string | RegExp,
  rePassword: string | RegExp
) => {
  const emailInput = screen.getByPlaceholderText(
    /email.../i
  ) as HTMLInputElement;
  const nameInput = screen.getByPlaceholderText(/name.../i) as HTMLInputElement;
  const passwordInput = screen.getByPlaceholderText(
    'Password...'
  ) as HTMLInputElement;
  const rePasswordInput = screen.getByPlaceholderText(
    /confirm password.../i
  ) as HTMLInputElement;

  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(nameInput, { target: { value: name } });
  fireEvent.change(passwordInput, { target: { value: password } });
  fireEvent.change(rePasswordInput, { target: { value: rePassword } });

  return [emailInput, nameInput, passwordInput, rePasswordInput];
};

describe('RegistrationForm component', () => {
  describe('Render components', () => {
    test('should render email input element', () => {
      render(<MockRegistrationForm />);

      const input = screen.getByPlaceholderText(/email.../i);
      expect(input).toBeInTheDocument();
    });

    test('should render name input element', () => {
      render(<MockRegistrationForm />);

      const input = screen.getByPlaceholderText(/name.../i);
      expect(input).toBeInTheDocument();
    });

    test('should render password input element', () => {
      render(<MockRegistrationForm />);

      const input = screen.getByPlaceholderText('Password...');
      expect(input).toBeInTheDocument();
    });

    test('should render confirm password input element', () => {
      render(<MockRegistrationForm />);

      const input = screen.getByPlaceholderText(/confirm password.../i);
      expect(input).toBeInTheDocument();
    });

    test('should render terms and conditions checkbox', () => {
      render(<MockRegistrationForm />);

      const termsCheckbox = screen.getByRole('checkbox');
      expect(termsCheckbox).toBeInTheDocument();
    });

    test('should render terms and conditions text', () => {
      render(<MockRegistrationForm />);

      const termsText = screen.getByText(/terms and conditions/i);
      expect(termsText).toBeInTheDocument();
    });

    test('should render Register button', () => {
      render(<MockRegistrationForm />);

      const registerButton = screen.getByRole('button', {
        name: /register/i,
      });
      expect(registerButton).toBeInTheDocument();
    });
  });

  describe('Test actions', () => {
    test.todo('should be able to type into email input');
    test.todo('should be able to type into name input');
    test.todo('should be able to type into password input');
    test.todo('should be able to type into repassword input');
    test.todo('should enable Register button after writing appropriate length data and accept terms and conditions');
    test.todo('should the Register button remain disabled if inappropriate length credentials and terms and conditions are not accepted');
    test.todo("should the Register button change back to disabled after register conditions no longer fulfilled")
  });
});
