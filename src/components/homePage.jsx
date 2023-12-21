// HomePage.jsx
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:5000');

const HomePage = () => {
  const [userdata, setUserdata] = useState(null);
  const navigate = useNavigate();
  const [loginuser, setLoginUser] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState({});

  const userdatafetch = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/usersdata');
      setUserdata(response.data.users);
    } catch (error) {
      console.error('Failed to fetch user data:', error.message);
    }
  };

  const navigateToAboutPage = (userId, name) => {
    // Mark messages as read when navigating to a new chat
    setUnreadMessages((prevUnreadMessages) => ({
      ...prevUnreadMessages,
      [userId]: 0, // Mark all messages as read for the selected user
    }));

    socket.emit('set-active-user', userId);
    navigate(`/particularChat/${userId}/${name}`);
  };

  useEffect(() => {
    userdatafetch();

    const storedData = localStorage.getItem('userData');
    const retrievedData = JSON.parse(storedData);
    setLoginUser(retrievedData);

    // Listen for private messages and update unread message count
    socket.on('private-message', (data) => {
      if (data.to === retrievedData.userId) {
        // Increment unread message count for the recipient
        setUnreadMessages((prevUnreadMessages) => ({
          ...prevUnreadMessages,
          [data.from]: (prevUnreadMessages[data.from] || 0) + 1,
        }));
      }
    });

    return () => {
      // Clean up event listener when component unmounts
      socket.off('private-message');
    };
  }, [navigate, setLoginUser]);

  return (
    <>
    {loginuser && (
      <div className="w-full capitalize">
       
        <h2 className="font-bold text-2xl bg-[#fc24c6] text-white p-3 pl-4">{loginuser.username} Chat App</h2>
        
        
        <div className='p-3'>
          {userdata &&
            userdata.map((val) => {
              if (loginuser.userId === val._id) return null;
              return (
                <div
                  key={val._id}
                  className="cursor-pointer border w-[80%] sm:w-[30%] border-gray-200 opacity-65 p-[5px] mb-2 rounded-md flex items-center gap-x-3"
                  onClick={() => navigateToAboutPage(val._id, val.username)}
                >
                  <span className='w-12 h-12 bg-gray-300 rounded-full'></span>
                  <span className="mr-2 text-gray-900 font-semibold">{val.username}</span>
                  {unreadMessages[val._id] > 0 && (
                    <span className="text-red-500">{`(${unreadMessages[val._id]})`}</span>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    )}
  </>
  
  );
};

export default HomePage;
