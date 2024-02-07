// SignupPage.js
import React, { useState } from 'react';
import { signUp } from './AuthService'; // Import the signUp function from AuthService
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';
import { getAuth } from 'firebase/auth'; // Import getAuth from Firebase Authentication
import { ref, set } from 'firebase/database'; // Import ref and set from Firebase Realtime Database
import { database } from './firebase'; // Import the Firebase database instance

function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Sign up the user using Firebase Authentication
            const userCredential = await signUp( email, password);
            const user = userCredential.user;
            const currentDate = new Date();
            const formattedDate = `${currentDate.getDate()>9?currentDate.getDate():`0${currentDate.getDate()}`}/${currentDate.getMonth() + 1>9?currentDate.getMonth()+1:`0${currentDate.getMonth()+1}`}/${currentDate.getFullYear()}`;
    
            // Add user data to the Firebase Realtime Database
            const userData = {
                username: name,
                email: email,
                createdDate: formattedDate,
                status: 'online' // You can set the initial status as needed
            };

            const userRef = ref(database, `users/${user.uid}`); // Create a reference to the user's data
            set(userRef, userData); // Set the user's data in the database

            navigate('/home'); // Redirect to the homepage on successful signup
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card variant="outlined" sx={{ paddingY: '3rem' }}>
                <CardContent>
                    <Typography variant="h5" component="div" align="center">
                        Sign Up
                    </Typography>
                    {error && <Typography variant="body2" color="error" align="center">{error}</Typography>}
                    <form onSubmit={handleSignup}>
                        <TextField
                            fullWidth
                            label="Username"
                            type="text"
                            variant="outlined"
                            margin="normal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            variant="outlined"
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Box mt={2} sx={{ display: "flex" }} alignItems={"center"} justifyContent={"center"} mb={1}>
                            <Button type="submit" variant="contained" color="primary" size="large">
                                Sign Up
                            </Button>
                        </Box>
                    </form>
                    <Typography variant="body2" align="center">
                        Already have an account? <Link to="/login">Login</Link>
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}

export default SignupPage;
