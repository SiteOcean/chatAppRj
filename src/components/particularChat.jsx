import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { GetStoreContext } from './useContextFile';
const apiUrl = process.env.NODE_URL;
const socket = io(apiUrl);

const ChatRoom = () => {
  // const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const { userId, name } = useParams();
  const [loginuser, setloginuser] = useState(null)
  const {messages , pushMessage, setFullMessages} = GetStoreContext()
  const messagesContainerRef = useRef(null);
  const [loading, setloading] = useState(false)

  const sendMessage = () => {
    const storedData = localStorage.getItem('userData');
    const retrievedData = JSON.parse(storedData);
    if (messageInput.trim() !== '' && messageInput.length < 500) {
      const data = {
        from: retrievedData.userId,
        to: userId,
        message: messageInput,
        username:retrievedData.username
      };
      socket.emit('private-message', data);
     
      pushMessage(data);
      setMessageInput('');
    }
  };  

  const fetchChatHistory = async (id) => {
    try {
     
      const response = await axios.get(apiUrl+`/api/chat/${id}/${userId}`);
     
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
  return (
    <div className="max-w-[90%] capitalize  sm:max-w-[80%] mt-[30px] sm:mt-[80px] mx-auto p-4 bg-white rounded-md shadow-md">
   {loading ? <>
    <h2 className="text-xl mb-4 capitalize text-gray-500 font-semibold">
      {loginuser && loginuser.username && loginuser.username} Chat to {name}
    </h2>
    <div
      ref={messagesContainerRef}
      className="overflow-y-scroll flex flex-col chatDiv h-[75vh] sm:h-[360px] border border-gray-300 mb-4 p-4 rounded-md"
    >
      {messages && messages.length > 0 ? messages.map((message, index) => (
        <div
          key={index}
          className={`${
            loginuser &&
            loginuser.username &&
            loginuser.username === message.username
              ? 'text-[#383737] bg-slate-100'
              : 'bg-[#f3e2ea] self-end text-[#f33bb6] border'
          } p-6 mb-2 rounded-md w-[60%] sm:w-[55%]`}
        >
          <strong className='font-normal'>
            {loginuser && message && message.username === loginuser.username
              ? 'You'
              : message.username}{' '}
            :
          </strong>{' '}
          {message.message}
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
        className="p-2 bg-blue-500 w-[120px] text-white rounded-r-md hover:bg-blue-600 focus:outline-none"
      >
        Send
      </button>
    </div>
    </> : <div>Loading...</div>}
  </div>
  
  );
};

export default ChatRoom;
