import { ComponentProps } from 'react';
import { isUppercase } from '../../utils/validation.utils';

import styles from './Input.module.scss';

const Input = ({ className, ...otherProps }: ComponentProps<'input'>) => {
  let adjClassName: string = '';
  if (className) {
    adjClassName = isUppercase(className) ? className : styles[className];
  }

  return (
    <input
      className={`${styles['paral-input']} ${adjClassName}`}
      {...otherProps}
    />
  );
};

export default Input;
