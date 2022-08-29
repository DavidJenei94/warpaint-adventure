import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authActions } from '../../store/auth';

import Button from '../UI/Button';
import Input from '../UI/Input';
import styles from './LoginForm.module.scss';
import { useAppDispatch } from '../../hooks/redux-hooks';
import FeedbackBar from '../UI/FeedbackBar';
import { FeedbackBarObj } from '../../models/uiModels';
import useInput from '../../hooks/use-input';
import { validateEmail, validatePassword } from '../../utils/general.utils';

const LoginForm = () => {
  const dispatch = useAppDispatch();
  let navigate = useNavigate();
  
    const [feedback, setFeedback] = useState<FeedbackBarObj>({
      shown: false,
      status: '',
      message: '',
    });

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
  } = useInput((value) => validatePassword(value));

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
    } catch (err) {
      if (err instanceof Error) {
        setFeedback({
          shown: true,
          status: 'error',
          message: err.message,
        });
      } else {
        setFeedback({
          shown: true,
          status: 'error',
          message: `Unexpected error: ${err}`,
        });
      }
    }
  };

  const signUpClickHandler = () => {
    navigate('/registration', { replace: true });
  };

  const emailClass = `${emailHasError ? 'invalid' : ''}`;
  const passwordClass = `${passwordHasError ? 'invalid' : ''}`;
  const signInButtonClass = `${!formIsValid ? 'disabled' : ''}`;

  return (
    <div className={styles['login-container']}>
      {feedback.shown && (
        <FeedbackBar setFeedbackBar={setFeedback} status="error">
          {feedback.message}
        </FeedbackBar>
      )}
      <form onSubmit={loginHandler}>
        <Input
          className={emailClass}
          placeholder="Email..."
          value={email}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
        />
        <Input
          className={passwordClass}
          type="password"
          placeholder="Password..."
          value={password}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
        />
        <Button type="submit" className={signInButtonClass}>Sign In</Button>
      </form>
      <div className={styles['other-actions']}>
        <Button onClick={signUpClickHandler}>Register</Button>
        <Button>Forgot password</Button>
      </div>
    </div>
  );
};

export default LoginForm;
