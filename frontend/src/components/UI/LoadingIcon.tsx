import styles from './LoadingIcon.module.scss';

const LoadingIcon = () => {
  return (
    <div className={styles['loading-icon-container']}>

    <div className={styles['loading-icon']}>
      <div className={styles['loading-icon-child']}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    </div>
  );
};

export default LoadingIcon;
