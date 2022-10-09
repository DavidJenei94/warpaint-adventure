import { ComponentProps } from 'react';

import Input from './Input';

import styles from './CheckBox.module.scss';

interface CheckBoxProps extends ComponentProps<'input'> {
  id: string;
  checked: boolean;
  uncheckedImageClassName?: string;
  checkedImageClassName?: string;
}

const CheckBox = ({
  id,
  children,
  checked,
  uncheckedImageClassName,
  checkedImageClassName,
  ...otherProps
}: CheckBoxProps) => {
  const uncheckedIconClass: string = uncheckedImageClassName
    ? `${styles.image} ${styles[uncheckedImageClassName]}`
    : '';
  const checkedIconClass: string = checkedImageClassName
    ? `${styles.image} ${styles[checkedImageClassName]}`
    : '';
  const emptyTextClass: string = !children ? styles.empty : '';

  return (
    <div className={styles['container']}>
      <Input type="checkbox" checked={checked} id={id} {...otherProps} />
      <label htmlFor={id}>
        {!checked && (
          <span className={`${emptyTextClass} ${uncheckedIconClass}`}></span>
        )}
        {checked && (
          <span className={`${emptyTextClass} ${checkedIconClass}`}></span>
        )}
        <span className={styles.text}>{children}</span>
      </label>
    </div>
  );
};

export default CheckBox;
