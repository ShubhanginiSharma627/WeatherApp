import React, { useEffect, useState } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { getCurrentUser } from './AuthService';


function ProtectedRoute({ children, ...rest }) {
  
    const [currentUser, setCurrentUser] = useState(null);
    const storedUser = localStorage.getItem('currentUser');
       
    if (storedUser && !currentUser) {
       
        setCurrentUser(JSON.parse(storedUser));
    }
   
   

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }
      return children;
    
  }

export default ProtectedRoute;
