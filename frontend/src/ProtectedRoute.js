import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Login} from './Components/Login';

export const ProtectedRoute = ({children}) => {
  const navigate = useNavigate();
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const loginStatus = sessionStorage.getItem('Login');

    if (loginStatus) {
      console.log("Login Success")
      setLogin(true);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return login ? children : <Login/>;
};
