
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import searchIcon from '../../assets/image/search.png';
import styles from './HomeContent.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function HomeContent() {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const { data: userData } = await api.get('/users/check');
        setUsername(userData.username);

        const { data: questionsData } = await api.get('/questions');
        setQuestions(questionsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleAskClick = () => navigate('/ask');
  const handleQuestionClick = (id) => navigate(`/question/${id}`);
  const handlePageChange = (pageNum) => setCurrentPage(pageNum);

  const handleDeleteQuestion = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this question?');
    if (!confirm) return;

    try {
      await api.delete(`/questions/${id}`);
      setQuestions((prev) => prev.filter((q) => q.questionid !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete question. Try again.');
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirst, indexOfLast);

  if (loading) return <div className={styles.message}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Welcome, {username}</h2>
        <button onClick={handleAskClick} className={styles.askButton}>
          Ask a Question
        </button>
      </header>

      <div className={styles.searchWrapper}>
        <img src={searchIcon} alt="Search" className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className={styles.searchInput}
        />
      </div>

      <h3 className={styles.heading}>Latest Questions</h3>

      {questions.length === 0 ? (
        <p className={styles.message}>No questions posted yet.</p>
      ) : filteredQuestions.length === 0 ? (
        <p className={styles.message}>No matching questions found.</p>
      ) : (
        <>
          <ul className={styles.list}>
            {currentQuestions.map((q) => (
              <li
                key={q.questionid}
                className={styles.listItem}
                onClick={() => handleQuestionClick(q.questionid)}
              >
                <div className={styles.avatar}>
                  {q.username?.[0]?.toUpperCase() || '?'}
                </div>

                <div className={styles.content}>
                  <h4 className={styles.title}>{q.title}</h4>
                  <p className={styles.author}>Asked by {q.username}</p>
                  <p className={styles.meta}>Answers: {q.answer_count ?? 0}</p>
                </div>

                {username === q.username && (
                  <div className={styles.actionButtons} onClick={(e) => e.stopPropagation()}>
                    <button
                    className={`${styles.iconButton} ${styles.editButton}`}
                    onClick={() => navigate(`/edit-question/${q.questionid}`)}>
                   <i className="fas fa-pen"></i> Edit
                  </button>
                    <button
                   className={`${styles.iconButton} ${styles.deleteButton}`}
                   onClick={() => handleDeleteQuestion(q.questionid)}>
                  <i className="fas fa-trash-alt"></i> Delete
                  </button>
                  </div>
                )}

                <div className={styles.arrow}>&gt;</div>
              </li>
            ))}
          </ul>

          <div className={styles.paginationWrapper}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HomeContent;

