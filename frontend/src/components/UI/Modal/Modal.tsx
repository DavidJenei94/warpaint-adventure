import ReactDOM from 'react-dom';
import { ChildrenProps } from '../../../models/basic.props';

import Button from '../Button';
import Backdrop from './Backdrop';

import styles from './Modal.module.scss';

type ModalProps = ChildrenProps & {
  onClose: () => void;
  onConfirm: () => void;
  type?: string;
};

const portalElement = document.getElementById('overlays')!;

const Modal = ({
  children,
  onClose,
  onConfirm,
  type = 'YesNo',
}: ModalProps) => {
  const confirmHandler = () => {
    onConfirm();

    onClose();
  };

  return (
    <>
      {ReactDOM.createPortal(
        <>
          <Backdrop onClose={onClose} />
          <div className={styles.modal}>
            <Button onClick={onClose} className={styles['x-button']}>
              <p>X</p>
            </Button>
            <div className={styles.content}>{children} </div>
            {type === 'YesNo' && (
              <div className={styles['action-buttons']}>
                <Button onClick={confirmHandler}>
                  <p>Yes</p>
                </Button>
                <Button onClick={onClose}>
                  <p>No</p>
                </Button>
              </div>
            )}
          </div>
        </>,
        portalElement
      )}
    </>
  );
};

export default Modal;
