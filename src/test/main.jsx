import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import {  useNavigate } from 'react-router-dom';

const socket = io('http://localhost:5000');

const HomePage = () => {
  const [userdata, setUserdata] = useState([]);
  const history = useNavigate();
 

  const userdatafetch = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/usersdata');
      const data = await response.json();
      setUserdata(data.users);
    } catch (error) {
      console.error('Failed to fetch user data:', error.message);
    }
  };

  const joinChatParticularUser = (userId, name) => {
    
    socket.emit('set-active-user', userId);
    history(`/chat/${userId}/${name}`);
  };

  useEffect(() => {
    userdatafetch();
  }, []);

  return (
    <div>
      <h2>Chat App</h2>
      <div>
        {userdata.map((user) => (
          <div key={user._id} onClick={() => joinChatParticularUser(user._id, user.username)}>
            {user.username}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
