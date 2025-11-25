// src/components/ModalAcusacion.jsx

import React from 'react';

function ModalAcusacion({ onSubmit, onClose }) {
  
  const handleSubmit = (event) => {
    event.preventDefault();
    
    const data = {
      jugador: event.target.elements['nombre-jugador'].value,
      culpable: event.target.elements['select-culpable'].value,
      herramienta: event.target.elements['select-herramienta'].value,
      lugar: event.target.elements['select-lugar'].value,
    };
    
    onSubmit(data); 
  };

  return (
    <div id="modal-acusacion" className="modal">
      <div className="modal-content">
        
        <button 
          onClick={onClose} 
          style={{ float: 'right', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}
        >
          &times;
        </button>
        
        <h2>ACUSACIÓN FINAL</h2>
        
        <form id="form-acusacion" onSubmit={handleSubmit}>
          <input type="text" placeholder="Tu nombre" id="nombre-jugador" required />
          
          <select id="select-culpable" required>
            <option value="">¿Quién lo hizo?</option>
            <option>Señorita Escarlata</option>
            <option>Coronel Mostaza</option>
            <option>Señor White</option>
            <option>Señor Verdy</option>
            <option>Dr. Black</option>
            <option>Estrella</option> {/* Asegúrate que 'Estrella' esté en la lista */}
          </select>
          
          <select id="select-herramienta" required>
            <option value="">¿Con qué?</option>
            <option>Cuchillo para cortes de carne, de 30 cm</option>
            <option>Cable soga</option>
            <option>Botella de vino blanco</option>
            <option>Alucinógenos</option>
            <option>Cable de fibra óptica</option> {/* La respuesta correcta */}
          </select>
          
          <select id="select-lugar" required>
            <option value="">¿Dónde?</option>
            <option>Vestíbulo</option>
            <option>Salón</option>
            <option>Comedor</option>
            <option>Cocina</option>
            <option>Salón de baile</option>
            <option>Invernadero</option>
            <option>Sala de billar</option>
            <option>Biblioteca</option>
            <option>Estudio</option>
            <option>CPD</option> {/* La respuesta correcta */}
          </select>
          
          <button type="submit" className="submit-btn">¡ACUSAR!</button>
        </form>
      </div>
    </div>
  );
}

export default ModalAcusacion;