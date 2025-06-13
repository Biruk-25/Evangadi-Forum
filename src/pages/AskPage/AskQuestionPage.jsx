// Ask.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContext';
import MessageModal from '../../components/ModelComponent/MessageModal';
import styles from './AskQuestion.module.css';

const Ask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [modal, setModal] = useState({ show: false, message: '', type: '' });

  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setModal({ show: true, message: 'Title and description are required.', type: 'error' });
      return;
    }

    try {
      const response = await api.post('/questions', {
        //userid: user.id,
        title,
        description,
      });
      setModal({ show: true, message: 'Question posted successfully!', type: 'success' });
      setTitle('');
      setDescription('');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      setModal({ show: true, message: 'Error posting question. Try again.', type: 'error' });
    }
  };

  const closeModal = () => setModal({ show: false, message: '', type: '' });

  if (isLoading || !user) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <MessageModal show={modal.show} message={modal.message} type={modal.type} onClose={closeModal} />

      <h2 className={styles.instructionsTitle}>Steps to write a good question</h2>
      <ul className={styles.instructionsList}>
        <li>Summarize your problem in a one-line title.</li>
        <li>Describe your problem in more detail.</li>
        <li>Describe what you tried and what you expected to happen.</li>
        <li>Review your question and post it to the site.</li>
      </ul>

      <div className={styles.askCard}>
        <h3 className={styles.askTitle}>Ask a public question</h3>
        <p className={styles.link} onClick={() => navigate('/')}>Go to Question page</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
          />
          <textarea
            placeholder="Question Description..."
            rows="6"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
          ></textarea>
          <button type="submit" className={styles.button}>Post Your Question</button>
        </form>
      </div>
    </div>
  );
};

export default Ask;
