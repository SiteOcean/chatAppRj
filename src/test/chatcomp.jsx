import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

const ChatComponent = ({ userId, selectedUserId }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  const sendMessage = () => {
    if (messageInput.trim() !== '' && selectedUserId) {
      const data = {
        from: userId,
        to: selectedUserId,
        message: messageInput,
      };
      socket.emit('private-message', data);
     
      setMessages((prevMessages) => [...prevMessages, data]);
      setMessageInput('');
    }
  };

  useEffect(() => {
    socket.on('private-message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('private-message');
    };
  }, []);

  return (
    <div>
      <h2>Chat with User</h2>
      <div>
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

export default ChatComponent;
