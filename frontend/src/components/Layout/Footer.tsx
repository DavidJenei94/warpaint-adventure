import ALink from '../UI/ALink';

import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles['footer-about']}>
        <ALink to="/" type="Link">
          About
        </ALink>
        <ALink to="/" type="Link">
          Privacy Policy
        </ALink>
        <ALink to="/" type="Link">
          Terms
        </ALink>
        <ALink to="/" type="Link">
          Contact Us
        </ALink>
        <ALink to="/" type="Link">
          Cookie Settings
        </ALink>
      </div>
      <div className={styles['footer-rights-reserved']}>
        <p>
          © {new Date().getFullYear()} WarpaintVision - All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
