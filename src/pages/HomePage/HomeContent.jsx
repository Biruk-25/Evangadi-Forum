
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import styles from './HomeContent.module.css';

function HomeContent() {
  const [questions, setQuestions] = useState([]);
  const [username, setUsername] = useState('Guest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Verify token and get user info
        const { data: userData } = await api.get('/users/check');
        setUsername(userData.username);

        // Get questions
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

      <h3 className={styles.heading}>Latest Questions</h3>

      {questions.length === 0 ? (
        <p className={styles.message}>No questions posted yet.</p>
      ) : (
        <ul className={styles.list}>
          {questions.map((q) => (
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
              <div className={styles.arrow}>&gt;</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HomeContent;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../../api/axiosConfig';
// import styles from "./HomeContent.module.css";


// function HomeContent() {
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [username, setUsername] = useState('Guest');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       try {
//         // Fetch logged-in user info
//         const { data: userData } = await api.get('/users/check');
//         setUsername(userData.username);

//         // Fetch all questions
//         const { data: questionsData } = await api.get('/questions');
//          console.log("Questions data:", questionsData)
//         setQuestions(questionsData);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError('Failed to load content. Please log in again.');
//         localStorage.removeItem('token');
//         navigate('/login');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [navigate]);

//   const handleAskClick = () => navigate('/ask');
//   const handleQuestionClick = (id) => navigate(`/question/${id}`);

//   if (loading) {
//     return <div className={styles.message}>Loading questions...</div>;
//   }

//   if (error) {
//     return <div className={styles.error}>{error}</div>;
//   }

//   return (
//     <div className={styles.container}>
//       <header className={styles.header}>
//         <h2>Welcome, {username} </h2>
//         <button onClick={handleAskClick} className={styles.askButton}>
//           Ask a Question
//         </button>
//       </header>

//       <h3 className={styles.heading}>Latest Questions</h3>

//       {questions.length === 0 ? (
//         <p className={styles.message}>No questions posted yet.</p>
//       ) : (
//         <ul className={styles.list}>
//           {questions.map((q) => (
//             <li
//               key={q.questionid}
//               className={styles.listItem}
//               onClick={() => handleQuestionClick(q.questionid)}
//             >
//               <div className={styles.avatar}>
//                 {q.username?.[0]?.toUpperCase() || '?'}
//               </div>
//               <div className={styles.content}>
//                 <h4 className={styles.title}>{q.title}</h4>
//                 <p className={styles.author}>Asked by {q.username}</p>
//                 <p className={styles.meta}>Answers: {q.answer_count ?? 0}</p>
//               </div>
//               <div className={styles.arrow}>&gt;</div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default HomeContent;
