// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/loginPage';
import HomePage from './components/homePage';
import ChatRoom from './components/chatRoom';
import CreateUser from './components/createUser';
import PrivateRoute from './userAuth/privateRoute'; // Update the path accordingly
import { MyStoreProvider } from './components/useContextFile';
import ToastCard from './components/toastCard';

const App = () => {
  const [showToast, setShowToast] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const handleShowToast = () => {
    setShowToast(true);

    // Show the toast immediately
    const newIntervalId = setInterval(() => {
      // Hide the toast after 5 seconds (5000 milliseconds)
      setShowToast(false);
      clearInterval(newIntervalId);
    }, 5000);

    setIntervalId(newIntervalId);
  };

  const handleCloseToast = () => {
    setShowToast(false);
   
      clearInterval(intervalId);
   
  };

  return (
    <div className=''>
      <MyStoreProvider>
        {/* <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleShowToast}
        >
          Show Toast
        </button>
        {showToast && (
          <ToastCard
            message="This is a toast message"
            initialDuration={5000}
            onClose={handleCloseToast}
          />
        )} */}
        <Router>
          <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>}/>  
            <Route path='/chatroom/:userId/:name' element={<PrivateRoute><ChatRoom /></PrivateRoute>} />
            <Route path='/signup' element={<CreateUser />} />
          </Routes>
        </Router>
      </MyStoreProvider>
    </div>
  );
};

export default App;
