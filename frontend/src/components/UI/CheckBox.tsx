import { ComponentProps, useEffect, useState } from 'react';
import styles from './CheckBox.module.scss';
import Input from './Input';

type CheckBoxProps = ComponentProps<'input'> & {
  id: string;
  baseValue: boolean;
  getValue: (state: boolean) => void;
  uncheckedImageClassName?: string;
  checkedImageClassName?: string;
};

const CheckBox = ({
  id,
  children,
  baseValue,
  getValue,
  uncheckedImageClassName,
  checkedImageClassName,
  ...otherProps
}: CheckBoxProps) => {
  const [checkboxValue, setCheckboxValue] = useState(baseValue);
  
    useEffect(() => {
      getValue(checkboxValue);
    }, [checkboxValue]);

  const uncheckedIconClass = uncheckedImageClassName
    ? `${styles.image} ${styles[uncheckedImageClassName]}`
    : '';
  const checkedIconClass = checkedImageClassName
    ? `${styles.image} ${styles[checkedImageClassName]}`
    : '';
  const emptyTextClass = !children ? styles.empty : '';

  const checkHandler = () => {
    setCheckboxValue((prevState) => !prevState);
  };

  return (
    <div className={styles['container']}>
      <Input
        type="checkbox"
        checked={checkboxValue}
        onChange={checkHandler}
        id={id}
      />
      <label htmlFor={id}>
        {!checkboxValue && (
          <span className={`${emptyTextClass} ${uncheckedIconClass}`}></span>
        )}
        {checkboxValue && (
          <span className={`${emptyTextClass} ${checkedIconClass}`}></span>
        )}
        <span className={styles.text}>{children}</span>
      </label>
    </div>
  );
};

export default CheckBox;
