import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { current_path } from '../services/serviceConfigs';

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate()
  const handleCreateUser = async () => {
    if(username.length < 3 || password.length < 3) return;
   
    const apiUrl = process.env.REACT_APP_NODE_URL;
    
      try {
      const response = await axios.post(`${apiUrl}/api/users`, {
        username,
        password,
      });
     
      if(response.status === 200 && response.data.message === "User account created successfully"){
      
        alert('User account created successfully')
        navigate('/', { replace: true })
        setMessage(response.data.message);
      }

      setMessage(response.data.message);
      // You can redirect or perform other actions after successful user creation
    } catch (error) {
      console.error('Failed to create user account:', error.response.data.error);
      setMessage('Failed to create user account');
    }
  };

  return (
   <div className='w-full flex justify-center items-center min-h-[100vh]'>
    <div className="w-[90%] sm:w-[50%] mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
  <h2 className="text-2xl font-bold mb-4">Create User Account Chat</h2>
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
    onClick={handleCreateUser}
    className="w-full bg-blue-500  text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
  >
    Create Account
  </button>
  {message && <p className="mt-2 text-green-500">{message}</p>}
  <p className="mt-4 text-center">
    <button
      className="text-blue-500 hover:underline"
      onClick={() => {
        navigate('/', { replace: true })
      }}
    >
      Back to Login
    </button>
  </p>
</div>

   </div>
  );
};

export default CreateUser;
