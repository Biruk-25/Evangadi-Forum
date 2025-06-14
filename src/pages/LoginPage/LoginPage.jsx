
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../api/axiosConfig';
import MessageModal from '../../components/ModelComponent/MessageModal';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import bg from '../../assets/image/bg.jpg'; 
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  const [showForgotForm, setShowForgotForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Modal state
  const [modal, setModal] = useState({
    show: false,
    message: '',
    type: 'info',
  });

  const showModal = (message, type = 'info') => {
    setModal({ show: true, message, type });
  };

  // Handle login form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle login form submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/users/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      showModal(errorMsg, 'error');

      if (errorMsg.toLowerCase().includes('user not found')) {
        showModal('User not found. Redirecting to create an account...', 'info');
        setTimeout(() => navigate('/signup'), 3000);
      }
    }
  };

  // Handle forgot password form submit
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/users/forgot-password', { email: forgotEmail });
      showModal(res.data.message || 'Password reset link sent to your email.', 'success');
    } catch (err) {
      showModal(err.response?.data?.message || 'Failed to send reset link', 'error');
    }
  };

  return (
    <div className={styles.loginContainer}
    style={{ backgroundImage: `url(${bg})` }}
  >
    
      <MessageModal
        show={modal.show}
        message={modal.message}
        type={modal.type}
        onClose={() => setModal({ ...modal, show: false })}
      />

      <div className={styles.leftBox}>
        <div className={styles.formBox}>
          {!showForgotForm ? (
            <>
              <h3>Login to your account</h3>
           
              {/* Login Form */}
              <form onSubmit={handleLoginSubmit}>
                <input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
               
               {/* Password input with visibility toggle */}
                <div className={styles.passwordInputContainer}>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"} 
                    placeholder="Your Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <span
                  // Toggle state
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword((prev) => !prev)} 
                  >
                    {/* Conditional icon */}
                    {showPassword ? <FaEyeSlash /> : <FaEye />} 
                  </span>
                </div>
                <button type="submit">Login</button>
              </form>

              <button
                type="button"
                className={styles.bottomLink}
                onClick={() => setShowForgotForm(true)}
              >
                Forgot Password?
              </button>
               <p className={styles.signupText}>
                 Don't have an account?
                <Link to="/signup">Create an account</Link>
                </p>

              
            </>
          ) : (
            <>
              <h3>Forgot Password</h3>
              <p>Enter your email to receive a password reset link.</p>

              {/* Forgot Password Form */}
              <form onSubmit={handleForgotSubmit}>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
                <button type="submit">Send Reset Link</button>
              </form>

              <button
                type="button"
                className={styles.bottomLink}
                onClick={() => {
                  setShowForgotForm(false);
                  setForgotEmail('');
                }}
              >
                Back to Login
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.rightBox}>
        <h3>About</h3>
        <h2>Evangadi Networks Q&A</h2>
        <div>
          <p>
          Evangadi Networks Q&A is a vibrant online platform designed to connect individuals through the power of questions and answers. Whether you're a student, professional, or lifelong learner, Evangadi provides a collaborative space where users can ask questions, share knowledge, and grow together-especially in areas like technology, career development, and academic support.
        </p>
        <hr />
        <p>Built with a community-first mindset, Evangadi Q&A encourages users to:</p>
        <ul>
          <li>Ask meaningful questions on technical, academic, or real-world challenges.</li>
          <li>Provide insightful answers to help others learn and solve problems.</li>
          <li>Build a personal brand by contributing value and gaining recognition.</li>
          <li>Network with like-minded individuals on similar career and learning paths.</li>
        </ul>
        <p>
          By combining mentorship, learning, and community support, Evangadi Networks fosters a culture of collaboration that helps members succeed-both in their careers and in their personal development.
        </p>
        </div>
        <button className={styles.howButton}>HOW IT WORKS</button>
      </div>
    </div>
  );
};

export default LoginPage;



