import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import ProtectedRoute from './ProtectedRoute'; // Assuming you have created this for authenticated routes
import { getCurrentUser } from './AuthService';
import SignupPage from './SignupPage';
import ErrorPage from './ErrorPage';
function App() {
  return (
    <Router>


      <Routes>
        <Route path="/home" element={<ProtectedRoute>
          <HomePage />
        </ProtectedRoute>} />:

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/*" element={<ErrorPage />} />
      </Routes>




    </Router>
  )



}

export default App;
