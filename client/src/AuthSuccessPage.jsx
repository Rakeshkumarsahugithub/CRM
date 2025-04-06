import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { loginSuccess } from './authSlice';

const AuthSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Decode token to get user info (in a real app, you might want to verify the token)
      const decoded = JSON.parse(atob(token.split('.')[1]));
      dispatch(loginSuccess({ token, user: decoded }));
      navigate(decoded.role === 'admin' ? '/dashboard' : '/telecaller');
    }
  }, [searchParams, dispatch, navigate]);

  return <div>Authenticating...</div>;
};

export default AuthSuccessPage;