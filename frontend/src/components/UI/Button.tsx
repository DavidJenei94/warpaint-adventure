import { ComponentProps } from 'react';
import { isUppercase } from '../../utils/general.utils';

import styles from './Button.module.scss';

const Button = ({
  children,
  className,
  ...otherProps
}: ComponentProps<'button'>) => {
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
