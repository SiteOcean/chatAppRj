import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const { userId } = useParams();

  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      const data = {
        from: localStorage.getItem('userId'),
        to: userId,
        message: messageInput,
      };
      socket.emit('private-message', data);
      setMessages((prevMessages) => [...prevMessages, data]);
      setMessageInput('');
    }
  };

  useEffect(() => {
    const userId1 = localStorage.getItem('userId');
    socket.emit('set-active-user', userId1);

    socket.on('private-message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Chat Room</h2>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', marginBottom: '10px' }}>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.from}:</strong> {message.message}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
