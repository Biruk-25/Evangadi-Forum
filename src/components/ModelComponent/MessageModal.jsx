
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
  faCheckCircle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

const MessageModal = ({ show, message, type = 'info', onClose, duration = 3000 }) => {
  const [visible, setVisible] = useState(false);

  const config = {
    success: {
      icon: faCheckCircle,
      alertClass: 'alert-success',
    },
    error: {
      icon: faTimesCircle,
      alertClass: 'alert-danger',
    },
    info: {
      icon: faInfoCircle,
      alertClass: 'alert-info',
    },
  };

  const { icon, alertClass } = config[type] || config.info;

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show && !visible) return null;

  return (
    <div
      className={`alert d-flex align-items-center ${alertClass} shadow-sm border rounded p-3 mt-2 position-absolute transition-opacity ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        zIndex: 1000,
        minWidth: '250px',
        right: 0,
        top: 20,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      <FontAwesomeIcon icon={icon} className="me-2" />
      <div className="flex-grow-1">{message}</div>
      <button
        type="button"
        className="btn-close ms-2"
        onClick={() => {
          setVisible(false);
          onClose();
        }}
      ></button>
    </div>
  );
};

export default MessageModal;




