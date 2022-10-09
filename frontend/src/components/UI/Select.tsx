import { ComponentProps } from 'react';
import { isUppercase } from '../../utils/validation.utils';

import styles from './Select.module.scss';

interface Option {
  value: string;
  text: string;
}

interface SelectProps extends ComponentProps<'select'> {
  optionList: Option[] | null;
}

const Select = ({ optionList, className, ...otherProps }: SelectProps) => {
  let adjClassName: string = '';
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
