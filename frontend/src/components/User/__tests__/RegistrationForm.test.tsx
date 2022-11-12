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
  email?: string | RegExp,
  name?: string | RegExp,
  password?: string | RegExp,
  rePassword?: string | RegExp
) => {
  const emailInput: HTMLInputElement = screen.getByPlaceholderText(/email.../i);
  const nameInput: HTMLInputElement = screen.getByPlaceholderText(/name.../i);
  const passwordInput: HTMLInputElement =
    screen.getByPlaceholderText('Password...');
  const rePasswordInput: HTMLInputElement =
    screen.getByPlaceholderText(/confirm password.../i);

  email && fireEvent.change(emailInput, { target: { value: email } });
  name && fireEvent.change(nameInput, { target: { value: name } });
  password && fireEvent.change(passwordInput, { target: { value: password } });
  rePassword &&
    fireEvent.change(rePasswordInput, { target: { value: rePassword } });

  return [emailInput, nameInput, passwordInput, rePasswordInput];
};

const fillRegistrationForm = (
  email?: string | RegExp,
  name?: string | RegExp,
  password?: string | RegExp,
  rePassword?: string | RegExp,
  termsClicked?: boolean
) => {
  const [emailInput, nameInput, passwordInput, rePasswordInput] =
    typeEmailNamePasswords(email, name, password, rePassword);

  const termsCheckbox = screen.getByRole('checkbox');
  const registerButton = screen.getByRole('button', {
    name: /register/i,
  });

  termsClicked && fireEvent.click(termsCheckbox);

  return [
    registerButton,
    termsCheckbox,
    emailInput,
    nameInput,
    passwordInput,
    rePasswordInput,
  ];
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
    test('should be able to type into email input', () => {
      render(<MockRegistrationForm />);

      const email: string = 'email@email.com';
      const [emailInput] = typeEmailNamePasswords(email);

      expect(emailInput.value).toBe(email);
    });

    test('should be able to type into name input', () => {
      render(<MockRegistrationForm />);

      const name: string = 'FirstName LastName';
      const [, nameInput] = typeEmailNamePasswords(undefined, name);

      expect(nameInput.value).toBe(name);
    });

    test('should be able to type into password input', () => {
      render(<MockRegistrationForm />);

      const password: string = '12345678';
      const [, , passwordInput] = typeEmailNamePasswords(
        undefined,
        undefined,
        password
      );

      expect(passwordInput.value).toBe(password);
    });

    test('should be able to type into repassword input', () => {
      render(<MockRegistrationForm />);

      const rePassword: string = '12345678';
      const [, , , rePasswordInput] = typeEmailNamePasswords(
        undefined,
        undefined,
        undefined,
        rePassword
      );

      expect(rePasswordInput.value).toBe(rePassword);
    });

    test('should enable Register button after correct format data and accepted terms and conditions', () => {
      render(<MockRegistrationForm />);

      const [registerButton] = fillRegistrationForm(
        'email@email.com',
        'FirstName LastName',
        'Abcd1234',
        'Abcd1234',
        true
      );

      expect(registerButton).not.toBeDisabled();
    });

    test('should the Register button remain disabled if no @ in email', () => {
      render(<MockRegistrationForm />);

      const [registerButton] = fillRegistrationForm(
        'email.email.com',
        'FirstName LastName',
        'Abcd1234',
        'Abcd1234',
        true
      );

      expect(registerButton).toBeDisabled();
    });

    test('should the Register button remain disabled if inappropriate ending of email', () => {
      render(<MockRegistrationForm />);

      const [registerButton] = fillRegistrationForm(
        'email@email.',
        'FirstName LastName',
        'Abcd1234',
        'Abcd1234',
        true
      );

      expect(registerButton).toBeDisabled();
    });

    test('should the Register button remain disabled if inappropriate starting of email', () => {
      render(<MockRegistrationForm />);

      const [registerButton] = fillRegistrationForm(
        '@email.com',
        'FirstName LastName',
        'Abcd1234',
        'Abcd1234',
        true
      );

      expect(registerButton).toBeDisabled();
    });

    test('should the Register button remain disabled if name is empty (or trimmed empty)', () => {
      render(<MockRegistrationForm />);

      const [registerButton] = fillRegistrationForm(
        'email@email.com',
        ' ',
        'Abcd1234',
        'Abcd1234',
        true
      );

      expect(registerButton).toBeDisabled();
    });

    test('should the Register button remain disabled if passwords are not the same', () => {
      render(<MockRegistrationForm />);

      const [registerButton] = fillRegistrationForm(
        'email@email.com',
        'FirstName LastName',
        'Abcd1234',
        'Abcd1235',
        true
      );

      expect(registerButton).toBeDisabled();
    });

    test('should the Register button remain disabled if passwords do not include uppercase character', () => {
      render(<MockRegistrationForm />);

      const [registerButton] = fillRegistrationForm(
        'email@email.com',
        'FirstName LastName',
        'abcd1234',
        'abcd1235',
        true
      );

      expect(registerButton).toBeDisabled();
    });

    test('should the Register button remain disabled if passwords do not include number', () => {
      render(<MockRegistrationForm />);

      const [registerButton] = fillRegistrationForm(
        'email@email.com',
        'FirstName LastName',
        'Abcdefgh',
        'Abcdefgh',
        true
      );

      expect(registerButton).toBeDisabled();
    });

    test('should the Register button remain disabled if passwords are too short', () => {
      render(<MockRegistrationForm />);

      const [registerButton] = fillRegistrationForm(
        'email@email.com',
        'FirstName LastName',
        'Abcd123',
        'Abcd123',
        true
      );

      expect(registerButton).toBeDisabled();
    });

    test('should the Register button remain disabled if terms and conditions are not accepted', () => {
      render(<MockRegistrationForm />);

      const [registerButton] = fillRegistrationForm(
        'email@email.com',
        'FirstName LastName',
        'Abcd1234',
        'Abcd1234',
        false
      );

      expect(registerButton).toBeDisabled();
    });

    test('should the Register button change back to disabled after terms and conditions are unclicked', () => {
      render(<MockRegistrationForm />);

      fillRegistrationForm(
        'email@email.com',
        'FirstName LastName',
        'Abcd1234',
        'Abcd1234',
        true
      );

      const [registerButton] = fillRegistrationForm(
        undefined,
        undefined,
        undefined,
        undefined,
        true
      );

      expect(registerButton).toBeDisabled();
    });
  });
});
