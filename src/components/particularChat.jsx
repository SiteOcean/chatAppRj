import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { GetStoreContext } from './useContextFile';
import { current_path } from '../services/serviceConfigs';
const apiUrl = process.env.REACT_APP_NODE_URL;
const socket = io(current_path, {
  transports: ['websocket'],
  withCredentials: true, // Include credentials (cookies) in the request
});



const ChatRoom = () => {
  
  const [messageInput, setMessageInput] = useState('');
  const { userId, name } = useParams();
  const [loginuser, setloginuser] = useState(null)

  const {messages , pushMessage, setFullMessages} = GetStoreContext()
  const messagesContainerRef = useRef(null);
  const [loading, setloading] = useState(false)

  const sendMessage = () => {
    console.log(new Date().toISOString(),)
    const storedData = localStorage.getItem('userData');
    const retrievedData = JSON.parse(storedData);
    if (messageInput.trim() !== '' && messageInput.length < 500) {
      const data = {
        from: retrievedData.userId,
        to: userId,
        message: messageInput,
        username:retrievedData.username,
        timestamp: new Date().toISOString(),
      };
      socket.emit('private-message', data);
     
      pushMessage(data);
      setMessageInput('');
    }
  };  

  const fetchChatHistory = async (id) => {
    try {
      const response = await axios.get(`${current_path}/api/chat/${id}/${userId}`);
     
      setFullMessages(response.data.messages);
      setloading(true)
    } catch (error) {
      console.error('Failed to fetch chat history:', error.message);
    }
  };

  
  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    const retrievedData = JSON.parse(storedData);
  
    setloginuser(retrievedData)
    socket.emit('set-active-user', retrievedData.userId);
  
    const handlePrivateMessage = (data) => {
      console.log("Received message:", data);
      
      // Only update state if the message is from the other user
      if (data.from === userId) {
        pushMessage(data);
      }
    };
  
    socket.on('private-message', handlePrivateMessage);
    fetchChatHistory(retrievedData.userId);
  
    // Cleanup event listener on component unmount
    return () => {
      socket.off('private-message', handlePrivateMessage);
      setFullMessages([])
    };
  }, [userId]);
  
  useEffect(() => {
    // Scroll to the end when messages change
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const formatDate = (timestamp) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(timestamp).toLocaleDateString(undefined, options);
  };
  
  const formatTime = (timestamp) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(timestamp).toLocaleTimeString(undefined, options);
  };


  return (
   <div className='w-full'>
     <div className="w-[95%] capitalize sm:max-w-[80%] mt-[23px] sm:mt-[80px] mx-auto p-1 sm:p-4 bg-white rounded-md shadow-lg">
   {loading ? <>
    <h2 className="text-xl mb-4 capitalize text-gray-500 font-semibold">
      {loginuser && loginuser.username && loginuser.username} Chat to {name}
    </h2>
    <div
      ref={messagesContainerRef}
      className="overflow-y-scroll flex flex-col chatDiv h-[70vh] sm:h-[360px] border border-gray-200 mb-2 p-3 rounded-md gap-y-2"
    >
      {messages && messages.length > 0 ? messages.map((message, index) => (

        <div key={index} className={`${loginuser && loginuser.username && loginuser.username === message.username ? 'text-[#383737] bg-slate-100' : 'bg-[#fcf6f9] self-end text-[#f33bb6]'
          } px-4 py-4 sm:p-6 mb-2 rounded-md w-[60%] sm:w-[55%] flex flex-wrap shadow-md relative`}>

          <strong className='text-[9px] sm:text-[10px] absolute opacity-55 top-1 left-1 font-mono font-normal'>
            {loginuser && message && message.username === loginuser.username
              ? 'You'
              : message.username}
            
          </strong>
          <span className=''>{message.message}</span>
          <div className='absolute bottom-1 right-2 opacity-55 flex gap-x-2 text-[10px]'>
          <p>{formatTime(message.timestamp)}</p>
          <p>{formatDate(message.timestamp)}</p>
          
          </div>
        </div>
      )) : <div>No Chats Available...</div>}
    </div>
    <div className="flex">
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Type your message"
        className="flex-1 p-2 border rounded-l-md focus:outline-none"
      />
      <button
        onClick={sendMessage}
        className="p-2 bg-[#fc24c6] w-[120px] text-white rounded-r-md hover:bg-pink-600 focus:outline-none"
      >
        Send
      </button>
    </div>
    </> : <div>Loading...</div>}
  </div>
   </div>
  
  );
};

export default ChatRoom;
