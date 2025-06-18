import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Elog from '../../assets/image/Elog.png';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHome, faSignInAlt, faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import styles from "./Header.module.css";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to= "/" className={styles.logo}>
           <img src={Elog} alt="Evangadi Logo" className={styles.logo} />
  
        </Link>
        <nav className={styles.nav}>
          <Link to="/" className={styles.link}>
            <FontAwesomeIcon icon={faHome} className={styles.icon} />
            Home
          </Link>
          <Link to="/how-it-works" className={styles.link}>
            How it Works
          </Link>
          {user ? (
            <button onClick={handleLogout} className={styles.button}>
              <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon} />
              Logout
            </button>
          ) : (
            <Link to="/login" className={styles.button}>
              <FontAwesomeIcon icon={faSignInAlt} className={styles.icon} />
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
