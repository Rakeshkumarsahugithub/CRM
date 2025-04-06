// components/LogoutButton.js
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from './authSlice';
import { Button, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';


const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

 

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        zIndex: 1000,
      }}
    >

      {/* Logout Button */}
      <Button
        variant="contained"
        color="error"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        sx={{
          padding: '10px',
          borderRadius: '50%',
          boxShadow: 3,
        }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default LogoutButton;
