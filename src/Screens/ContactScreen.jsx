import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import "./css/ContactScreen.css";

const ContactScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({ show: false, success: false, message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setStatus({ show: true, success: undefined, message: "Enviando mensaje..." });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful submission
      setStatus({ show: true, success: true, message: "¡Mensaje enviado con éxito!" });
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setStatus({ show: false, success: false, message: "" });
      }, 3000);
    } catch (error) {
      setStatus({ show: true, success: false, message: "Error al enviar el mensaje. Por favor, intente nuevamente." });
    }
  };

  return (
    <div className="contact-screen">
      <div className="contact-container">
        <div className="contact-info">
          <h2>Información de Contacto</h2>
          <p>Estamos aquí para ayudarte. No dudes en contactarnos por cualquier consulta.</p>
          
          <div className="contact-details">
            <div className="contact-item">
              <div>
                <h3>Teléfono</h3>
                <p>+54 (11) 1234-5678</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div>
                <h3>Email</h3>
                <p>info@tutienda.com</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div>
                <h3>Dirección</h3>
                <p>Av. Siempreviva 742, Springfield</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>Envíanos un Mensaje</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="text"
                  name="name"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  placeholder="Tu email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="text"
                  name="subject"
                  placeholder="Asunto"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <textarea
                  name="message"
                  placeholder="Tu mensaje"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={status.success === undefined}>
              <FaPaperPlane className="button-icon" />
              <span>Enviar Mensaje</span>
            </button>
          </form>

          {status.show && (
            <div className={`status-message ${status.success === undefined ? 'loading' : status.success ? 'success' : 'error'}`}>
              {status.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactScreen;
