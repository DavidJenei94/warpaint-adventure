import { useNavigate } from 'react-router-dom';
import { authActions } from '../../store/auth';

import Button from '../UI/Button';
import Input from '../UI/Input';
import styles from './LoginForm.module.scss';
import { useAppDispatch } from '../../hooks/redux-hooks';
import useInput from '../../hooks/use-input';
import { validateEmail } from '../../utils/validation.utils';
import { errorHandlingFetch } from '../../utils/errorHanling';

const LoginForm = () => {
  const dispatch = useAppDispatch();
  let navigate = useNavigate();

  const {
    value: email,
    isValid: emailIsValid,
    hasError: emailHasError,
    changeHandler: emailChangeHandler,
    blurHandler: emailBlurHandler,
    reset: emailReset,
  } = useInput((value) => validateEmail(value));

  const {
    value: password,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    changeHandler: passwordChangeHandler,
    blurHandler: passwordBlurHandler,
    reset: passwordReset,
  } = useInput((value) => value.trim() !== '');

  const formIsValid = emailIsValid && passwordIsValid;

  const loginHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    const user = await sendLoginData();

    if (user) {
      dispatch(
        authActions.login({ token: user.token, expiresIn: user.expiresIn })
      );

      // navigate('/profile', { replace: true });
      // check if history -1 is wpa page
      navigate(-1);
    }
  };

  const sendLoginData = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      return data.user;
    } catch (err: any) {
      errorHandlingFetch(err);
    }
  };

  const signUpClickHandler = () => {
    navigate('/registration', { replace: true });
  };

  const emailClass = `${emailHasError ? 'invalid' : ''}`;
  const passwordClass = `${passwordHasError ? 'invalid' : ''}`;
  const signInButtonClass = `${!formIsValid ? 'disabled' : ''}`;
  const signInButtonDisabled = !formIsValid ? true : false;

  return (
    <div className={styles['login-container']}>
      <form onSubmit={loginHandler}>
        <Input
          className={emailClass}
          type="email"
          placeholder="Email..."
          required
          value={email}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
        />
        <Input
          className={passwordClass}
          type="password"
          placeholder="Password..."
          required
          value={password}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
        />
        <Button
          type="submit"
          className={signInButtonClass}
          disabled={signInButtonDisabled}
        >
          <p>Sign In</p>
        </Button>
      </form>
      <div className={styles['other-actions']}>
        <Button onClick={signUpClickHandler}>
          <p>Register</p>
        </Button>
        <Button>
          <p>Forgot password</p>
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
