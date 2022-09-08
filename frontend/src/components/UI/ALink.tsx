import { FC } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { ClassNameChildrenProps } from '../../models/basic.props';

import styles from './ALink.module.scss';

type ALinkProps = ClassNameChildrenProps & {
  to: string;
  type: string;
};

const ALink = ({ children, className = '', to, type }: ALinkProps) => {
  const baseClasses = `${styles.link} ${className}`;

  let jsxLink: JSX.Element;

  switch (type) {
    case 'NavLink':
      jsxLink = (
        <NavLink
          to={to}
          className={({ isActive }) =>
            isActive ? `${baseClasses} ${styles.active}` : `${baseClasses}`
          }
        >
          {children}
        </NavLink>
      );
      break;
    case 'Link':
      jsxLink = (
        <Link to={to} className={`${baseClasses}`}>
          {children}
        </Link>
      );
      break;
    case 'a':
    default:
      jsxLink = (
        <a href={to} className={`${baseClasses}`}>
          {children}
        </a>
      );
      break;
  }

  return jsxLink;
};

export default ALink;
