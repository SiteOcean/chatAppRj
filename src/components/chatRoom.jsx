import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { GetStoreContext } from './useContextFile';
import { current_path } from '../services/serviceConfigs';
import { MdOutlineArrowBack, MdRefresh } from 'react-icons/md';
import { LiaCheckDoubleSolid } from "react-icons/lia";
import { FaCheck } from "react-icons/fa6";
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
   
    const storedData = localStorage.getItem('userData');
    const retrievedData = JSON.parse(storedData);
    if (messageInput.trim() !== '' && messageInput.length < 500) {
      const data = {
        from: retrievedData.userId,
        to: userId,
        message: messageInput.toString(),
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

  // const makeChatsAssReaded = async () => {
  //   try {
  //     await axios.get(`${current_path}/api/makeChatAsRead/${loginuser.userId}/${userId}`);
  //   } catch (error) {
  //     console.error('Failed to mark messages as read:', error.message);
  //   }
  // };


  
  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    const retrievedData = JSON.parse(storedData);
  
    setloginuser(retrievedData);
    socket.emit('set-active-user', retrievedData.userId);
  
    const handlePrivateMessage = (data) => {
      console.log("Received message:", data);
  
      // Only update state if the message is from the other user
      if (data.from === userId) {
        pushMessage(data);
        // Emit a message-read event when the recipient reads the message
        socket.emit('message-read', { from: userId, to: data.from });
      }
    };
  
    const handleReadAcknowledgment = (acknowledgment) => {
      console.log('Received read acknowledgment for the last message:', acknowledgment);
      // Handle the read acknowledgment, e.g., update the UI to indicate the message is read
    };
  
    socket.on('private-message', handlePrivateMessage);
    socket.on('message-read-acknowledgment', handleReadAcknowledgment);
    fetchChatHistory(retrievedData.userId);
  
    // Cleanup event listeners on component unmount
    return () => {
      socket.off('private-message', handlePrivateMessage);
      socket.off('message-read-acknowledgment', handleReadAcknowledgment);
      setFullMessages([]);
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
    <div className='flex justify-between pl-2 pr-6 py-2'>

    <h2 className="text-xl flex items-center gap-x-3 pb-2 capitalize text-[gray] font-semibold">
      {/* {loginuser && loginuser.username && loginuser.username} */}
      <MdOutlineArrowBack className='b'/>{" "} Chatting to {name}...
    </h2>
    
    {/* <MdRefresh onClick={loginuser ? () => fetchChatHistory(loginuser.userId) : null} /> */}
    <MdRefresh className='text-[#ff55be] text-[28px]' onClick={loginuser ? ()=>window.location.reload() : null} />

    </div>
    <div
      ref={messagesContainerRef}
      className="overflow-y-scroll flex flex-col chatDiv max-h-[70vh] sm:h-[360px] border border-gray-200 mb-2 p-3 rounded-md gap-y-2"
    >
      {messages && messages.length > 0 ? messages.map((message, index) => (

        <div key={index} className={`${loginuser && loginuser.username && loginuser.username === message.username ? 'text-[#383737] bg-slate-100' : 'bg-[#fcf6f9] self-end text-[#f33bb6]'
          } px-[5px] py-[21px] sm:p-6 mb-2 rounded-md w-[70%] sm:w-[55%] flex flex-wrap shadow-md relative`}
          style={{ wordWrap: 'break-word' }} >

          <strong className='text-[9px] sm:text-[10px] absolute opacity-55 top-1 left-1 font-mono font-normal'>
            {loginuser && message && message.username === loginuser.username
              ? 'You'
              : message.username}
            
          </strong>
          <div className='break-all text-[14px] opacity-75'>{message.message}</div>
          <div className='absolute bottom-1 right-2 opacity-55 flex gap-x-2 text-[10px]'>
          <p className='flex gap-1 items-center'> { message.username === loginuser.username ? <>{ message.read ? <LiaCheckDoubleSolid className='text-[15px] text-[blue]'/> :  <FaCheck className='text-[14px] text-[gray]'/>} </> : null}{formatTime(message.timestamp)}</p>
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
