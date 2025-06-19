import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import styles from './EditQuestion.module.css'; // optional

const EditQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await api.get(`/questions/${id}`);
        setTitle(res.data.title || '');
        setDescription(res.data.description || '');
      } catch (err) {
        setError('Could not load question', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      return setError('Title and description cannot be empty');
    }

    try {
      await api.put(`/questions/${id}`, { title, description });
      navigate('/');
    } catch (err) {
      setError('Update failed. You might not be the owner of the question.');
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.editContainer}>
      <h2>Edit Question</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleUpdate} className={styles.form}>
        <input
          type="text"
          value={title}
          placeholder="Enter title"
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />
        <textarea
          value={description}
          placeholder="Enter description"
          onChange={(e) => setDescription(e.target.value)}
          rows="6"
          className={styles.textarea}
        />
        <button type="submit" className={styles.button}>Update</button>
      </form>
    </div>
  );
};

export default EditQuestion;
