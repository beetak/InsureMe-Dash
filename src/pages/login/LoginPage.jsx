import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { loginInsurerUser, loginUser } from '../../store/user-store';
import { navActions } from '../../store/nav-store';
import { decodeToken } from './tokenUtils';
import useAuth from '../../hooks/useAuth';
import axiosInstance from '../../components/api/AuthApi';

const AnimatedToast = ({ message, isVisible, type }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className={`absolute top-2 p-4 rounded-md shadow-md w-80 justify-center items-center flex ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function LoginPage(props) {
  const { setUser } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("success");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isEmail = (value) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(value);
  };

  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (domain === "" && password === "") {
      showToastMessage("Please fill in all fields", "error");
      return;
    } else if (domain === "") {
      showToastMessage("Please provide the domain name", "error");
      return;
    } else if (password === "") {
      showToastMessage("Please provide the password", "error");
      return;
    }

    setLoading(true);
    try {
      if (!isEmail(domain)) {
        const response = await axiosInstance.post(`/auth/authenticate`, { email: domain, password })
        if (response && response.data.code === "CREATED") {
          const { access_token, refresh_token, role, id, firstName, lastName } = response.data.data;
          localStorage.setItem("refresh_token", refresh_token);
          localStorage.setItem("userNum", id);
          setUser({ accessToken: access_token, user: true, role, userId: id, firstname: firstName, surname: lastName });
          
          showToastMessage("Login successful", "success");
          
          if (role === 'SUPER_ADMINISTRATOR' || role === 'ADMIN') {
            navigate('/dashboard');
          } else if (role === 'SALES_AGENT') {
            navigate('/sales');
          } else if (role === 'SHOP_SUPERVISOR') {
            navigate('/entities');
          } else {
            navigate('/login');
          }
        } else if (response.data.code === "UNAUTHORIZED") {
          showToastMessage("Incorrect Email or Password", "error");
        } else {
          showToastMessage("An error occurred. Please try again.", "error");
        }
      } else {
        const response = await axiosInstance.post(`/insurer-users/login`, { email: domain, password })
        if (response&&response.data.code === "OK") {
          const accessToken = response.data.data;
          let decodedToken;
          try {
            decodedToken = decodeToken(accessToken);
            if (decodedToken.active) {
              const { role, userId, firstName, lastName, companyId, companyName } = decodedToken;
              setUser({ accessToken, user: true, role, userId, firstname: firstName, surname: lastName, companyId, companyName });
              
              showToastMessage("Login successful", "success");
              
              if (role === 'INSURER_ADMIN') {
                navigate('/dashboard');
              } else if (role === 'SALES_AGENT') {
                navigate('/sales');
              } else {
                navigate('/login');
              }
            }
          } catch (error) {
            console.error("Error decoding token:", error);
            showToastMessage("An error occurred. Please try again.", "error");
          }
        } else if (response.data.code === "UNAUTHORIZED") {
          showToastMessage("Incorrect Email or Password", "error");
        } else {
          showToastMessage("An error occurred. Please try again.", "error");
        }
      }
    } catch (error) {
      console.log(error)
      showToastMessage("An error occurred. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = (value) => {
    setShowPassword(value);
  };

  const passwordInputType = showPassword ? 'text' : 'password';

  return (
    <div className='lg:flex block w-full h-screen'>
      <div className='w-full lg:w-1/2 flex flex-col justify-center items-center lg:h-screen'>
        <div className='flex flex-col w-1/2'>
          <img src="images/icon.png" alt="Logo" className="w-20 mb-7"/>
          <h2 className='text-xl font-bold'>Welcome</h2>
          <p className='text-sm mb-7'>Happy to see you!</p>
          
          <div className='space-y-4 w-full'>
            <div className="sm:col-span-3 items-center">
              <label htmlFor="domain" className="block text-xs font-medium leading-6 text-gray-900">
                Name
              </label>
              <div className="mt-2 w-full flex items-center p-0 overflow-hidden ring-1 ring-inset ring-gray-300 focus:ring-indigo-200 shadow-sm focus:ring-1 focus:ring-inset h-12">
                <span className="fas fa-user w-5 px-5" />
                <input
                  type="text"
                  name="domain"
                  id="domain"
                  autoComplete="username"
                  placeholder="Username"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="flex-1 rounded-xs py-1.5 px-3 bg-transparent focus:outline-none"
                />
              </div>
            </div>
            <div className="sm:col-span-3 items-center">
              <label htmlFor="password" className="block text-xs font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="mt-2 w-full flex items-center p-0 overflow-hidden ring-1 ring-inset ring-gray-300 focus:ring-indigo-200 shadow-sm focus:ring-1 focus:ring-inset h-12">
                <span className="fas fa-lock w-5 px-5" />
                <input
                  type={passwordInputType}
                  name="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 rounded-xs py-1.5 px-3 bg-transparent focus:outline-none"
                />
                <span 
                  onMouseDown={() => handleTogglePassword(true)}
                  onMouseUp={() => handleTogglePassword(false)}
                  onTouchStart={() => handleTogglePassword(true)}
                  onTouchEnd={() => handleTogglePassword(false)} 
                  className="fas fa-eye px-4 cursor-pointer" 
                />
              </div>
            </div>
            <label htmlFor="forgot-password" className="block text-xs font-medium text-gray-900 mt-6 cursor-pointer">
              Forgot Password?
            </label>
            <button
              onClick={handleLogin}
              disabled={loading}
              className={`border border-gray-300 rounded-sm py-2 w-full bg-blue-500 text-gray-100 hover:bg-blue-600 h-12 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Logging in...' : 'LOGIN'}
            </button>
          </div>
            <div className="relative w-full justify-center flex">
                <AnimatedToast
                    message={toastMessage}
                    isVisible={showToast}
                    type={toastType}
                />
            </div>
        </div>
      </div>
      <div className='w-full lg:w-1/2 flex justify-center items-end lg:h-screen bg-cover bg-center' style={{backgroundImage: 'url(images/auth/login-bg.jpg)'}}>
        <p className="text-white mb-5">Copyright © {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </div>
  );
}

