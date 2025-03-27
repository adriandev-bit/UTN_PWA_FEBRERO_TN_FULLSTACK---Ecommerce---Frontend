import React, { useState } from "react";
import "./css/ContactScreen.css";


const ContactScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Mensaje enviado con éxito");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-container">
      <h2>Contacto</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <label>Nombre</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        
        <label>Mensaje</label>
        <textarea name="message" value={formData.message} onChange={handleChange} required />
        
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default ContactScreen;
