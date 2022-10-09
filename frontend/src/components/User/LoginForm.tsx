import { useNavigate } from 'react-router-dom';
import { authActions } from '../../store/auth';
import { useAppDispatch } from '../../hooks/redux-hooks';
import { validateEmail } from '../../utils/validation.utils';
import useInput from '../../hooks/use-input';
import useHttp from '../../hooks/http-hook';
import { loginUser } from '../../lib/user-api';
import useFetchDataEffect from '../../hooks/fetch-data-effect-hook';

import Button from '../UI/Button';
import Input from '../UI/Input';

import styles from './LoginForm.module.scss';

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    sendRequest: sendLoginRequest,
    status: loginStatus,
    error: loginError,
    data: loginData,
  } = useHttp(loginUser, false);

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

  const formIsValid: boolean = emailIsValid && passwordIsValid;

  const loginHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    sendLoginRequest({ email, password });
  };

  useFetchDataEffect(() => {
    const user = loginData.user;

    if (user) {
      dispatch(
        authActions.login({ token: user.token, expiresIn: user.expiresIn })
      );

      // navigate('/profile', { replace: true });
      // check if history -1 is wpa page
      navigate(-1);
    }
  }, [loginStatus, loginError, loginData]);

  const signUpClickHandler = () => {
    navigate('/registration', { replace: true });
  };

  const emailClass: string = `${emailHasError ? 'invalid' : ''}`;
  const passwordClass: string = `${passwordHasError ? 'invalid' : ''}`;
  const signInButtonClass: string = `${!formIsValid ? 'disabled' : ''}`;
  const signInButtonDisabled: boolean = !formIsValid ? true : false;

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
