import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { getCurrentUser } from './AuthService'; // Import the getCurrentUser function from AuthService

function ErrorPage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
    }, []);

    const handleGoBack = () => {
        if (user) {
            // User is logged in, navigate to the home page
            navigate('/home');
        } else {
            // User is not logged in, navigate to the login page
            navigate('/login');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <Typography variant="h5" component="div" align="center" style={{ marginBottom: '1rem' }}>
                Oops! Something went wrong.
            </Typography>
            <Typography variant="body2" align="center">
                <Button onClick={handleGoBack} variant="text">
                    Go back to {user ? 'Home' : 'Login'}
                </Button>
            </Typography>
        </div>
    );
}

export default ErrorPage;
