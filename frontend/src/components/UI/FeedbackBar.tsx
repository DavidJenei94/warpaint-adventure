import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ChildrenProps } from '../../models/basicProps';
import { FeedbackBarObj } from '../../models/uiModels';
import styles from './FeedbackBar.module.scss';

type FeedbackBarProps = ChildrenProps & {
  // setFeedbackBar: (cb: (value: FeedbackBarObj) => FeedbackBarObj) => void;
  setFeedbackBar: Dispatch<SetStateAction<FeedbackBarObj>>;
  status: string;
  disappearTime?: number;
};

const FeedbackBar = ({
  children,
  setFeedbackBar,
  status,
  disappearTime = 2.5,
}: FeedbackBarProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setFeedbackBar((prevState: FeedbackBarObj) => {
        return { ...prevState, shown: false };
      });
    }, disappearTime * 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  let classes = `${styles.container} `;
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
