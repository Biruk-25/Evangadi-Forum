
import React, { useContext, useEffect, createContext } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import SignUpPage from './pages/SignUpPage/SignupPage';
import LoginPage from './pages/LoginPage/LoginPage';
import AskQuestion from './pages/AskPage/AskQuestionPage';
import QuestionDetailPage from './pages/QuestionDetailPage/QuestionDetailPage';
import HomeContent from './pages/HomePage/HomeContent';
import Footer from './components/footerComponent/Footer';
import Header from './components/HeaderComponent/Header';
import { AuthContext } from './context/AuthContext';
import api from './api/axiosConfig';
export const AppState = createContext();

function App() {
  const { user, logout, isLoading, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const publicPaths = ['/', '/login', '/signup', '/how-it-works'];
    const isPublicPath = publicPaths.includes(location.pathname);
    const token = localStorage.getItem('token');

    const checkUserAuth = async () => {
      if (token && !user) {
        try {
          const { data } = await api.get('/users/check', {
            headers: { 'x-auth-token': token },
          });
          setUser(data);
        } catch (err) {
          console.error('Token validation failed:', err.response?.data?.message || err.message);
          logout();
          navigate('/login');
        }
      } else if (!token && !isPublicPath) {
        navigate('/login');
      }
    };

    if (!isLoading && !user && !isPublicPath) {
      navigate('/login');
    }

    if (!isLoading) {
      checkUserAuth();
    }
  }, [user, isLoading, navigate, location.pathname, logout, setUser]);

  // Check if current route is login or signup
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  return (
    <div
      className={`min-h-screen flex flex-col font-inter ${
        isAuthPage
          ? 'bg-[url("/images/auth-bg.jpg")] bg-no-repeat bg-cover bg-center'
          : 'bg-white'
      }`}
    >
      <AppState.Provider value={{}}>
        <Header />
        <main
          className={`flex-grow ${
            isAuthPage ? '' : 'container mx-auto px-4 py-8'
          }`}
        >
          <Routes>
            <Route path="/" element={<HomeContent />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/ask" element={<AskQuestion />} />
            <Route path="/question/:id" element={<QuestionDetailPage />} />
            <Route
              path="/how-it-works"
              element={
                <p className="text-center text-xl mt-20">
                  How It Works page coming soon!
                </p>
              }
            />
            <Route
              path="*"
              element={
                <h1 className="text-center text-3xl font-bold mt-20">
                  404 - Page Not Found
                </h1>
              }
            />
          </Routes>
        </main>
        <Footer />
      </AppState.Provider>
    </div>
  );
}

export default App;


