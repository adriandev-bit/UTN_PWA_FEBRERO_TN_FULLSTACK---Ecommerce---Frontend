import React, { useState } from 'react';
import './css/MessageInput.css'; 

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="message-input">
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={message} 
          onChange={handleChange} 
          placeholder="Escribe un mensaje..." 
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default MessageInput;
