// src/components/PistaCard.jsx

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // <--- 1. IMPORTAR PORTAL

function PistaCard({ pista, index, onCompletar }) { 
  // --- Estados Internos ---
  const [isVisible, setIsVisible] = useState(false);
  const [isEvidenciaModalOpen, setIsEvidenciaModalOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackTexto, setFeedbackTexto] = useState('');
  const [shuffledOpciones, setShuffledOpciones] = useState([]);

  // --- Lógica ---
  useEffect(() => {
    const delay = index * 600; 
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer); 
  }, [index]);

  useEffect(() => {
    const array = [...pista.opciones];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    setShuffledOpciones(array);
  }, [pista.opciones]);

  const handleAccionClick = (opcion) => {
    if (opcion.esCorrecta) {
      setIsEvidenciaModalOpen(true);
      if (!isFlipped) {
        onCompletar();
      }
    } else {
      setFeedbackTexto(opcion.feedback);
      setIsFeedbackModalOpen(true);
    }
  };

  const handleCerrarModalEvidencia = () => {
    setIsEvidenciaModalOpen(false);
    setIsFlipped(true); // Voltea la tarjeta
  };
  
  const handleCerrarModalFeedback = () => {
    setIsFeedbackModalOpen(false);
  };

  // Asigna las clases CSS dinámicamente
  const cardClassName = `pista-card ${isVisible ? 'visible' : ''} ${isFlipped ? 'flipped' : ''}`;

  return (
    <>
      <div className={cardClassName}> 
        <div className="pista-card-inner">
          
          {/* === ANVERSO === */}
          <div className="pista-card-front">
            <div>
              <h3 className="pista-title">{pista.titulo}</h3>
              <p className="pista-briefing">{pista.briefing}</p>
            </div>
            <div className="opciones-container"> 
              {shuffledOpciones.map((op) => (
                <button 
                  key={op.texto}
                  className="btn-opcion-pista" 
                  onClick={() => handleAccionClick(op)}
                >
                  {op.texto}
                </button>
              ))}
            </div>
          </div>
          
          {/* === REVERSO === */}
          <div className="pista-card-back">
            <div>
              <h3 className="pista-title">{pista.titulo}</h3>
              <p className="pista-conclusion">{pista.conclusion}</p>
            </div>
            <p className="pista-completada">¡Pista Analizada!</p>
          </div>
          
        </div>
      </div>
      
      {/* === MODAL EVIDENCIA (CON PORTAL) === */}
      {isEvidenciaModalOpen && createPortal(
        <div className="modal">
          <div className="modal-content" style={{borderColor: 'var(--amber)', boxShadow: '0 0 50px rgba(245, 158, 11, 0.5)'}}>
            <h2 style={{color: 'var(--amber)', textShadow: '0 0 15px var(--amber)'}}>Evidencia Encontrada</h2>
            
            <p style={{color: '#ccc', margin: '-1rem 0 1.5rem 0'}}>Datos extraídos de: {pista.titulo}</p>
            
            <div className="resultado" style={{maxHeight: '40vh', fontSize: '1.1rem', color: '#fff', border: '1px dashed var(--amber-dark)', padding:'1rem'}}>
              {/* Mostramos la conclusión o los datos */}
              {pista.conclusion || JSON.stringify(pista.datos, null, 2)}
            </div>

            <button 
              className="btn-opcion-pista"
              style={{ 
                  marginTop: '2rem', 
                  background: 'var(--amber)', 
                  color: 'black', 
                  textAlign: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
              }}
              onClick={handleCerrarModalEvidencia}
            >
              Analizado, ¡Entendido!
            </button>
          </div>
        </div>,
        document.body // Teletransporta al final del body
      )}
      
      {/* === MODAL FEEDBACK (CON PORTAL) === */}
      {isFeedbackModalOpen && createPortal(
        <div className="modal">
          <div className="modal-content modal-feedback" style={{borderColor: 'var(--red)', boxShadow: '0 0 50px rgba(220, 38, 38, 0.4)'}}>
            <h2 style={{color: 'var(--red)'}}>Pista Falsa</h2>
            <p className="modal-feedback-text" style={{fontSize:'1.3rem'}}>"{feedbackTexto}"</p>
            
            <button 
              className="btn-ejecutar"
              style={{background: 'var(--red)', marginTop:'1rem'}}
              onClick={handleCerrarModalFeedback}
            >
              Volver a intentar
            </button>
          </div>
        </div>,
        document.body // Teletransporta al final del body
      )}
    </>
  );
}

export default PistaCard;