import { ComponentProps } from 'react';
import { isUppercase } from '../../utils/validation.utils';

import styles from './Select.module.scss';

type Option = {
  value: string;
  text: string;
};

type SelectProps = ComponentProps<'select'> & {
  optionList: Option[] | null;
};

const Select = ({
  children,
  optionList,
  className,
  ...otherProps
}: SelectProps) => {
  let adjClassName = '';
  if (className) {
    adjClassName = isUppercase(className) ? className : styles[className];
  }

  return (
    <select
      {...otherProps}
      className={`${adjClassName} ${styles['paral-button']}`}
    >
      {optionList &&
        optionList.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
    </select>
  );
};

export default Select;
