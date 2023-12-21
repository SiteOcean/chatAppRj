import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Change from history to navigate
  const [err, setErr] = useState(false);

  const handleLogin = async () => {
    try {
      const apiUrl = process.env.NODE_URL;
      const response = await axios.post('https://chatnode-ma15.onrender.com/api/login', {
        username,
        password,
      });

      if (response.status === 200) {
        console.log(response.data.userId);
        
// Storing the object
const userData = { userId: response.data.userId, username: response.data.username };
localStorage.setItem('userData', JSON.stringify(userData));

// Retrieving the object
        navigate('/home'); 
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
