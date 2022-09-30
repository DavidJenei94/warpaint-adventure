import { useEffect, useState } from 'react';
import useFetchDataEffect from '../../hooks/fetch-data-effect-hook';
import useHttp from '../../hooks/http-hook';
import { useAppDispatch } from '../../hooks/redux-hooks';

import useInput from '../../hooks/use-input';
import { signupUser } from '../../lib/user-api';
import { Status, toggleFeedback } from '../../store/feedback';
import { errorHandlingFetch } from '../../utils/errorHanling';
import {
  validateEmail,
  validateName,
  validatePassword,
} from '../../utils/validation.utils';

import ALink from '../UI/ALink';
import Button from '../UI/Button';
import CheckBox from '../UI/CheckBox';
import Input from '../UI/Input';

import styles from './RegistrationForm.module.scss';

const RegistrationForm = () => {
  const dispatch = useAppDispatch();

  const {
    sendRequest: sendSignupRequest,
    status: signupStatus,
    error: signupError,
    data: signupData,
  } = useHttp(signupUser);

  const [arePasswordsSame, setArePasswordsSame] = useState(true);
  const [termAccepted, setTermsAccepted] = useState(false);

  const {
    value: email,
    isValid: emailIsValid,
    hasError: emailHasError,
    changeHandler: emailChangeHandler,
    blurHandler: emailBlurHandler,
    reset: emailReset,
  } = useInput((value) => validateEmail(value));

  const {
    value: name,
    isValid: nameIsValid,
    hasError: nameHasError,
    changeHandler: nameChangeHandler,
    blurHandler: nameBlurHandler,
    reset: nameReset,
  } = useInput((value) => validateName(value));

  const {
    value: password,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    changeHandler: passwordChangeHandler,
    blurHandler: passwordBlurHandler,
    reset: passwordReset,
  } = useInput((value) => validatePassword(value));

  const {
    value: rePassword,
    isValid: rePasswordIsValid,
    hasError: rePasswordHasError,
    changeHandler: rePasswordChangeHandler,
    blurHandler: rePasswordBlurHandler,
    reset: rePasswordReset,
  } = useInput((value) => validatePassword(value), password);

  useEffect(() => {
    setArePasswordsSame(password === rePassword);
  }, [password, rePassword]);

  const formIsValid =
    termAccepted &&
    emailIsValid &&
    nameIsValid &&
    passwordIsValid &&
    rePasswordIsValid &&
    arePasswordsSame;

  let registerButtonDisabled = !formIsValid ? true : false;

  const regHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    registerButtonDisabled = true;

    if (!formIsValid) {
      dispatch(
        toggleFeedback({
          status: Status.ERROR,
          message:
            'Not all fields are valid! (Hover the fields for more information.)',
        })
      );

      return;
    }

    sendSignupRequest({ email, password, name });
  };

  useFetchDataEffect(() => {
    emailReset();
    nameReset();
    passwordReset();
    rePasswordReset();
    setTermsAccepted(false);
  }, [signupStatus, signupError, signupData]);

  const termsCheckHandler = () => {
    setTermsAccepted((prevState) => !prevState);
  };

  const emailClass = `${emailHasError ? 'invalid' : ''}`;
  const nameClass = `${nameHasError ? 'invalid' : ''}`;
  const passwordClass = `${passwordHasError ? 'invalid' : ''}`;
  const rePasswordClass = `${rePasswordHasError ? 'invalid' : ''}`;
  const registerButtonClass = `${!formIsValid ? 'disabled' : ''}`;

  return (
    <div className={styles['reg-container']}>
      <form onSubmit={regHandler}>
        <Input
          className={emailClass}
          placeholder="Email..."
          type="email"
          required
          value={email}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
        />
        <Input
          className={nameClass}
          placeholder="Name..."
          title="Firstname Lastname"
          required
          value={name}
          onChange={nameChangeHandler}
          onBlur={nameBlurHandler}
        />
        <Input
          className={passwordClass}
          type="password"
          placeholder="Password..."
          title="Password must be at least 8 characters long and must contain at least one letter and one number."
          required
          value={password}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
        />
        <Input
          className={rePasswordClass}
          type="password"
          placeholder="Confirm password..."
          title="Passwords must be the same."
          required
          value={rePassword}
          onChange={rePasswordChangeHandler}
          onBlur={rePasswordBlurHandler}
        />
        <CheckBox
          id="terms"
          checked={termAccepted}
          onChange={termsCheckHandler}
        >
          I read and accept the{' '}
          <ALink to="/registration" type="Link">
            terms and conditions
          </ALink>
          .
        </CheckBox>
        <Button
          type="submit"
          className={registerButtonClass}
          disabled={registerButtonDisabled}
        >
          <p>Register</p>
        </Button>
      </form>
    </div>
  );
};

export default RegistrationForm;
