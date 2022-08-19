import { ChildrenProps, ClassNameChildrenProps } from '../../models/basicProps';

import styles from './Button.module.scss';

type ButtonProps = ClassNameChildrenProps & {
  onClick: () => any;
};

const Button = ({ children, className, onClick }: ButtonProps) => {
  return (
    <button
      className={`${className} ${styles['paral-button']}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
