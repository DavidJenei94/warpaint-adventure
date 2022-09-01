import { useEffect, useState } from 'react';

import useInput from '../../hooks/use-input';
import { FeedbackBarObj } from '../../models/uiModels';
import {
  validateEmail,
  validateName,
  validatePassword,
} from '../../utils/general.utils';

import ALink from '../UI/ALink';
import Button from '../UI/Button';
import CheckBox from '../UI/CheckBox';
import FeedbackBar from '../UI/FeedbackBar';
import Input from '../UI/Input';

import styles from './RegistrationForm.module.scss';

const RegistrationForm = () => {
  const [arePasswordsSame, setArePasswordsSame] = useState(true);

  const [feedback, setFeedback] = useState<FeedbackBarObj>({
    shown: false,
    status: '',
    message: '',
  });
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
      setFeedback({
        shown: true,
        status: 'error',
        message: "Not all fields are valid! (Hover the fields for more information.)",
      });

      return;
    }

    if (await sendRegData()) {
      emailReset();
      nameReset();
      passwordReset();
      rePasswordReset();
      setTermsAccepted(false);
    }
  };

  const sendRegData = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/signup', {
        method: 'POST',
        headers: {
          'content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      return true;
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

  const emailClass = `${emailHasError ? 'invalid' : ''}`;
  const nameClass = `${nameHasError ? 'invalid' : ''}`;
  const passwordClass = `${passwordHasError ? 'invalid' : ''}`;
  const rePasswordClass = `${rePasswordHasError ? 'invalid' : ''}`;
  const registerButtonClass = `${!formIsValid ? 'disabled' : ''}`;
  

  return (
    <div className={styles['reg-container']}>
      {feedback.shown && (
        <FeedbackBar setFeedbackBar={setFeedback} status="error">
          {feedback.message}
        </FeedbackBar>
      )}
      <form onSubmit={regHandler}>
        <Input
          className={emailClass}
          placeholder="Email..."
          type="email"
          title="Enter a valid email address"
          value={email}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
        />
        <Input
          className={nameClass}
          placeholder="Name..."
          title="Firstname Lastname"
          value={name}
          onChange={nameChangeHandler}
          onBlur={nameBlurHandler}
        />
        <Input
          className={passwordClass}
          type="password"
          placeholder="Password..."
          title="Password must be at least 8 character long and must contain at least 1 uppercase character."
          value={password}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
        />
        <Input
          className={rePasswordClass}
          type="password"
          placeholder="Confirm password..."
          title='Passwords must be the same.'
          value={rePassword}
          onChange={rePasswordChangeHandler}
          onBlur={rePasswordBlurHandler}
        />
        <CheckBox
          id="terms"
          baseValue={termAccepted}
          getValue={setTermsAccepted}
        >
          I read and accept the{' '}
          <ALink to="/registration" type="Link">
            terms and conditions
          </ALink>
          .
        </CheckBox>
        <Button type="submit" className={registerButtonClass} disabled={registerButtonDisabled}>
          Register
        </Button>
      </form>
    </div>
  );
};

export default RegistrationForm;
