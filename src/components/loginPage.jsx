import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

import { current_path } from "../services/serviceConfigs";
import { useAuth } from "../userAuth/authContextJs";
import io from 'socket.io-client';
const socket = io(current_path, {
  transports: ['websocket'],
  withCredentials: true, // Include credentials (cookies) in the request
});

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Change from history to navigate
  const [err, setErr] = useState(false);
  const { dispatch } = useAuth();
  
  const handleLogin = async () => {
    try {
      const apiUrl = process.env.REACT_APP_NODE_URL;
     
      const response = await axios.post(`${current_path}/api/login`, {
        username,
        password,
      });

    if (response.status === 200) {
     
    // Storing the object
    const userData = { userId: response.data.userId, username: response.data.username };
    localStorage.setItem('userData', JSON.stringify(userData));
    dispatch({ type: 'LOGIN', payload: { username: response.data.username } });
    
      }
    } catch (error) {
      setErr(true);

      if (error.response) {
        console.error('Login failed with status code:', error.response.status);
        console.error('Error data:', error.response.data);
      } else if (error.request) {
        console.error('No response received from the server');
      } else {
        console.error('Error during request setup:', error.message);
      }
    }
  };

 
  const storedData = localStorage.getItem('userData');
    const retrievedData = JSON.parse(storedData);
 if(retrievedData && retrievedData.userId){
  socket.emit('remove-active-user', { userId: retrievedData.userId });
 }


  
  // localStorage.clear();
  return (
    <div className="w-full flex justify-center items-center min-h-[100vh]">
      <div className="w-[90%] sm:w-[50%] mx-auto mt-10 p-6 bg-white rounded-md shadow-lg shadow-[#d8d8f1]">
    <p className="text-red-500 mb-2">{err ? 'Invalid input!' : null}</p>
    <h2 className="text-2xl font-bold mb-4">Login</h2>
    <div className="mb-4">
      <label className="block text-gray-700">Username:</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700">Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value.toLowerCase().trim())}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
    <button
      onClick={handleLogin}
      className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
    >
      Login
    </button>
    <p className="mt-4 text-center">
      Don't have an account?{' '}
      <Link
        to={'/signup'}
        className="text-blue-500 hover:underline"
      >
        Create Account
      </Link>
    </p>
  </div>
    </div>
  
  );
}
