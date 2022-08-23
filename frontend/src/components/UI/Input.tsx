import { ComponentProps } from 'react';

import styles from './Input.module.scss';


const Input = ({ ...otherProps }: ComponentProps<"input">) => {
  return <input className={styles['paral-input']} {...otherProps}/>;
};

export default Input;
