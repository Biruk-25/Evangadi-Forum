import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faCopy } from '@fortawesome/free-solid-svg-icons';
import MessageModal from '../../components/ModelComponent/MessageModal';
import styles from "./QuestionDetailPage.module.css";

const QuestionDetailPage = () => {
  const { id: questionId } = useParams();
  const navigate = useNavigate();
  const { user, isLoading } = useContext(AuthContext);

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState('');
  const [modal, setModal] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const { data: allQuestions } = await api.get('/questions');
        const found = allQuestions.find(q => q.questionid === parseInt(questionId));
        if (!found) throw new Error('Question not found');
        setQuestion(found);

        const { data: answersData } = await api.get(`/answers/${questionId}`);
        setAnswers(answersData);

        // Increment view count per answer
        await Promise.all(
          answersData.map(ans =>
            api.patch(`/answers/views/${ans.answerid}`).catch(() => null)
          )
        );
      } catch (err) {
        setModal({ show: true, message: err.message || 'Error loading data', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [questionId, user, isLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) {
      setModal({ show: true, message: 'Answer cannot be empty.', type: 'error' });
      return;
    }

    try {
      await api.post(
        `/answers/${questionId}`,
        { answer: answerText },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      const { data: updatedAnswers } = await api.get(`/answers/${questionId}`);
      setAnswers(updatedAnswers);
      setAnswerText('');
      setModal({ show: true, message: '✅ Answer posted successfully!', type: 'success' });
    } catch (err) {
      setModal({
        show: true,
        message: err.response?.data?.message || 'Failed to post answer.',
        type: 'error',
      });
    }
  };

  const handleVote = async (answerid, voteType) => {
    const endpoint = voteType === 'like'
      ? `/answers/like/${answerid}`
      : `/answers/dislike/${answerid}`;

    try {
      await api.patch(endpoint, {}, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      const { data } = await api.get(`/answers/${questionId}`);
      setAnswers(data);
    } catch (err) {
      setModal({
        show: true,
        message: err.response?.data?.message || 'Error voting on answer.',
        type: 'error',
      });
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setModal({ show: true, message: 'Copied to clipboard!', type: 'success' });
  };

  if (isLoading || loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className={styles.container}>
      <MessageModal
        show={modal.show}
        message={modal.message}
        type={modal.type}
        onClose={() => setModal({ show: false, message: '', type: '' })}
      />

      <div className={styles.card}>
        <h2 className={styles.title}>Question</h2>
        <p className={styles.subtitle}>{question?.title}</p>
        {question?.description && (
        <p className={styles.description}>{question.description}</p>
         )}
        <h2 className={styles.title}>Answers From The Community</h2>
        {answers.length === 0 ? (
          <p className={styles.meta}>No answers yet. Be the first to answer!</p>
        ) : (
          <div className={styles.answerList}>
            {answers.map((ans) => (
              <div key={ans.answerid} className={styles.answerBox}>
                <p style={{ color: 'black' }}>{ans.answer}</p>
                <div className={styles.meta}>
                  <span>Answered by <strong>{ans.userName}</strong></span>
                  <span>{new Date(ans.created_at).toLocaleString()}</span>
                </div>
                <div className={styles.interactions}>
                  <button onClick={() => handleVote(ans.answerid, 'like')}>
                    <FontAwesomeIcon icon={faThumbsUp} /> {ans.likes}
                  </button>
                  <button onClick={() => handleVote(ans.answerid, 'dislike')}>
                    <FontAwesomeIcon icon={faThumbsDown} /> {ans.dislikes}
                  </button>
                  <span>👁️ {ans.views}</span>
                  <button onClick={() => handleCopy(ans.answer)}>
                    <FontAwesomeIcon icon={faCopy} /> Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className={styles.title}>Answer The Top Question</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            rows="6"
            placeholder="Your Answer..."
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            className={styles.textarea}
            required
          />
          <button type="submit" className={styles.button}>Post Your Answer</button>
        </form>
      </div>
    </div>
  );
};

export default QuestionDetailPage;

