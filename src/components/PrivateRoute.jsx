// import React, { useContext } from 'react';
// import { Navigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';

// function PrivateRoute({ children }) {
//   const { user, isLoading } = useContext(AuthContext);

//   if (isLoading) {
//     return <div className="text-center mt-10 text-xl">Loading...</div>;
//   }

//   return user ? children : <Navigate to="/login" />;
// }

// export default PrivateRoute;
