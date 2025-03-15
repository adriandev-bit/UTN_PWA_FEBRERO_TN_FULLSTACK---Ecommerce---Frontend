import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import MessageInput from './MessageInput';
import './css/HomeScreen.css';

const HomeScreen = () => {
  const [messages, setMessages] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("general");

  const fetchMessages = async () => {
    try {
      const token = sessionStorage.getItem("authorization_token");
      const response = await fetch(
        `http://localhost:3000/api/channels/${selectedChannel}/messages`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      if (!response.ok) throw new Error('Error al obtener los mensajes');

      const data = await response.json();
      setMessages(data.data?.messages || []);
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
    }
  };

  // Llamado cuando se selecciona un canal
  useEffect(() => {
    fetchMessages();
  }, [selectedChannel]);

  const handleNewMessage = async (newMessageContent) => {
    if (!selectedChannel) {
      console.error('No se ha seleccionado ningún canal');
      return;
    }

    const token = sessionStorage.getItem("authorization_token");

    try {
      // Enviar mensaje al backend
      const response = await fetch(`http://localhost:3000/api/channels/${selectedChannel}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessageContent }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar el mensaje');
      }

      // Agregar el mensaje a la lista de mensajes en el frontend
      setMessages([...messages, data.data.new_message]);

    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };

  return (
    <div className="home-screen">
      <Sidebar setSelectedChannel={setSelectedChannel} />
      <div className="chat-container">
        <ChatArea messages={messages} />
        <MessageInput onSendMessage={handleNewMessage} />
      </div>
    </div>
  );
};

export default HomeScreen;
