import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from './authSlice';
import axios from 'axios';
import { Button, TextField, Container, Typography, Box, Grid, Link as MuiLink, FormHelperText, FormControl } from '@mui/material';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const response = await axios.post('https://crm-telecaller.onrender.com/api/auth/login', {
        email,
        password,
      });
      dispatch(loginSuccess(response.data));
      navigate(response.data.user.role === 'admin' ? '/dashboard' : '/telecaller');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Invalid credentials, try again';
      dispatch(loginFailure(errorMsg));
      setErrorMessage('Invalid credentials, try again');  // Show error message near the button
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <FormControl fullWidth error={Boolean(errorMessage)} sx={{ mt: 2 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mb: 1 }}
            >
              Sign In
            </Button>
            {errorMessage && (
              <FormHelperText>{errorMessage}</FormHelperText>
            )}
          </FormControl>

          <Grid container justifyContent="center" sx={{ mt: 2 }}>
            <Grid item xs>
              <MuiLink component={RouterLink} to="/signup" variant="body2">
                Don't have an account? Sign Up
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;

