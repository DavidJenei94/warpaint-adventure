import styles from './Backdrop.module.scss';

interface BackdropProps {
  onClose: () => void;
}

const Backdrop = ({ onClose }: BackdropProps) => {
  return <div className={styles.backdrop} onClick={onClose}></div>;
};

export default Backdrop;
