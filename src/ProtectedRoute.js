import React, { useEffect, useState } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { getCurrentUser } from './AuthService';


function ProtectedRoute({ children, ...rest }) {
  
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Check if there's a current user in localStorage
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    // Function to update the currentUser state and localStorage
    const updateUser = (user) => {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
    };

    if (!currentUser && !getCurrentUser()) {
        return <Navigate to="/login" replace />;
    }
      return children;
    
  }

export default ProtectedRoute;
