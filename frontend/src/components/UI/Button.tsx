import { ComponentProps } from 'react';

import styles from './Button.module.scss';

const Button = ({ children, className, ...otherProps }: ComponentProps<'button'>) => {
  return (
    <button
      {...otherProps}
      className={`${className} ${styles['paral-button']}`}
    >
      {children}
    </button>
  );
};

export default Button;
