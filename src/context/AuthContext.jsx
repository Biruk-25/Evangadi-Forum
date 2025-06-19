// AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
   

    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
       console.warn("No token found — skipping protected request");
      return;
    }

    // Validate token
    api.get('/users/check', {
      headers: { 'x-auth-token': token },
    })
      .then((res) => {

        setUser({
         id: res.data.userid,
       username: res.data.username,
        email: res.data.email,
         });


        // setUser(res.data, token);
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, setIsLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};




