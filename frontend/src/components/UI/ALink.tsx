import { ClassNameChildrenProps } from '../../models/basicProps';

import styles from './ALink.module.scss';

const ALink = ({ children, className = '' }: ClassNameChildrenProps) => {
  return (
      <a className={`${styles.link} ${className}`}>{children}</a>
  );
};

export default ALink;
