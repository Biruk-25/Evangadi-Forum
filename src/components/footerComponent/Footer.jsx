import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import Elog from '../../assets/image/Elog.png'
import styles from "./Footer.module.css";
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Company Info */}
        <div className={styles.section}>
          <h3 className={styles.logo}><img src={Elog} alt="Evangadi log" /></h3>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialIcon}>
              <FontAwesomeIcon icon={faFacebook} size="lg" />
            </a>
            <a href="#" className={styles.socialIcon}>
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>
            <a href="#" className={styles.socialIcon}>
              <FontAwesomeIcon icon={faYoutube} size="lg" />
            </a>
          </div>
        </div>

        {/* Useful Links */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Useful Links</h4>
          <ul className={styles.linkList}>
            <li><a href="#">How it Works</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Contact Info</h4>
          <address className={styles.address}>
            <p>Evangadi Networks</p>
            <p>Email: <a href="mailto:support@evangadi.com">support@evangadi.com</a></p>
            <p>Phone: +1-202-386-2702</p>
          </address>
        </div>
      </div>
      <div className={styles.copyright}>
        &copy; {new Date().getFullYear()} Evangadi Networks. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
