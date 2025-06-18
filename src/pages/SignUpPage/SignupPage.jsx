import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../api/axiosConfig';
import bg from '../../assets/image/bg.jpg';
import MessageModal from '../../components/ModelComponent/MessageModal';
import styles from "./SignupPage.module.css";

const SignupPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    firstname: '',
    lastname: '',
    username: '',
    password: '',
  });

  const [modal, setModal] = useState({
    show: false,
    message: '',
    type: 'info',
  });

  const showModal = (message, type = 'info') => {
    setModal({ show: true, message, type });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
     useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/", { replace: true });
    }
  }, []);

  const validateForm = () => {
    if (!form.email.includes('@')) {
      showModal('Please enter a valid email address', 'error');
      return false;
    }
    if (form.password.length < 6) {
      showModal('Password must be at least 6 characters long', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await axios.post('/users/register', form);
      showModal('Registration successful! Logging you in...', 'success');

      const loginRes = await axios.post('/users/login', {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem('token', loginRes.data.token);
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      showModal(errorMsg, 'error');
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
          <h2>Join the network</h2>

          <form onSubmit={handleSubmit}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <div className={styles.nameRow}>
              <input
                name="firstname"
                placeholder="First Name"
                value={form.firstname}
                onChange={handleChange}
                required
              />
              <input
                name="lastname"
                placeholder="Last Name"
                value={form.lastname}
                onChange={handleChange}
                required
              />
            </div>

            <input
              name="username"
              placeholder="User Name"
              value={form.username}
              onChange={handleChange}
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button type="submit">Agree and Join</button>
          </form>

          <small>
            I agree to the <a href="#">privacy policy</a> and{' '}
            <a href="#">terms of service</a>.
          </small>

          <p className={styles.bottomLogin}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

      <div className={styles.rightBox}>
        <h3>About</h3>
        <h2>Evangadi Networks Q&A</h2>
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
        <button className={styles.howButton}>HOW IT WORKS</button>
      </div>
    </div>
  );
};

export default SignupPage;

