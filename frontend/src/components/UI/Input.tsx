import { ComponentProps } from 'react';
import { isUppercase } from '../../utils/general.utils';

import styles from './Input.module.scss';

const Input = ({ className, ...otherProps }: ComponentProps<'input'>) => {
  let adjClassName = '';
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
