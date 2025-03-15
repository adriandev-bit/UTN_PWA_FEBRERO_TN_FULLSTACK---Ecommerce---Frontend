import React from "react";
import './css/ChatArea.css';

const ChatArea = ({ messages }) => {
  return (
    <div className="chat-area">
      <h3>Chat Area</h3>
      {messages.length > 0 ? (
        messages.map((message) => (
          <div key={message._id} className="message">
            <p>
              <strong>{message.sender?.username || "Usuario desconocido"}:</strong>{" "}
              {message.content}
            </p>
          </div>
        ))
      ) : (
        <p>No hay mensajes en este canal.</p>
      )}
    </div>
  );
};

export default ChatArea;
