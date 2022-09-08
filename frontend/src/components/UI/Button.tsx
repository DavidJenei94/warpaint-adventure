import { ComponentProps } from 'react';
import { isUppercase } from '../../utils/validation.utils';

import styles from './Button.module.scss';

type ButtonProps = ComponentProps<'button'>;

const Button = ({ children, className, ...otherProps }: ButtonProps) => {
  let adjClassName = '';
  if (className) {
    adjClassName = isUppercase(className) ? className : styles[className];
  }

  return (
    <button
      {...otherProps}
      className={`${adjClassName} ${styles['paral-button']}`}
    >
      {children}
    </button>
  );
};

export default Button;
