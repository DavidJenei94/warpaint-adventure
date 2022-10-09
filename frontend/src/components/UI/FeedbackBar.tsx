import ReactDOM from 'react-dom';
import { ChildrenProps } from '../../models/basic.props';

import styles from './FeedbackBar.module.scss';

interface FeedbackBarProps extends ChildrenProps {
  status: string;
};

const FeedbackBar = ({ children, status }: FeedbackBarProps) => {
  let classes: string = `${styles.container} `;
  switch (status) {
    case 'success':
      classes += styles.success;
      break;
    case 'warning':
      classes += styles.warning;
      break;
    case 'error':
    default:
      classes += styles.error;
      break;
  }

  const content = <div className={classes}>{children}</div>;

  const portalElement = document.getElementById('overlays')!;

  return <>{ReactDOM.createPortal(content, portalElement)}</>;
};

export default FeedbackBar;
