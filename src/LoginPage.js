import React, { useEffect, useState } from 'react';
import { signIn } from './AuthService';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await signIn(email, password);
            navigate('/home');
        } catch (error) {
            setError("Incorrect Email Address and Password !");
        }
    };
    useEffect(()=>{
        console.log("error")
    },[error])

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card variant="outlined" sx={{paddingY:"3rem"}}>
                <CardContent>
                    <Typography variant="h5" component="div" align="center">
                        Login
                    </Typography>
                    {error && <Typography variant="body2" color="error" align="center">{error}</Typography>}
                    <form onSubmit={handleLogin} >
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
                       <Box sx={{display:"flex"}} alignItems={"center"} justifyContent={"center"} mt={2} mb={1}>
                            <Button type="submit" variant="contained" color="primary" size="large">
                                Login
                            </Button>
                        </Box>
                    </form>
                    <Typography variant="body2" align="center">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}

export default LoginPage;
