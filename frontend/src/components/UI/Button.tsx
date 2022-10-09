import { ComponentProps } from 'react';
import { isUppercase } from '../../utils/validation.utils';

import styles from './Button.module.scss';

const Button = ({
  children,
  className,
  ...otherProps
}: ComponentProps<'button'>) => {
  let adjClassName: string = '';
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
