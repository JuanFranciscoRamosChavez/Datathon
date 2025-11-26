// src/components/LandingPage.jsx

import React, { useEffect, useState } from "react";

function LandingPage({ onStartGame, onLogout }) {
  const [playerName, setPlayerName] = useState("");
  
  const [showCredits, setShowCredits] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("datathon_player");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setPlayerName(parsed.nombres || "");
      } catch (e) {
        console.error("Error al leer nombre", e);
      }
    }
  }, []);

  return (
    <div id="landing" className="page active">
      {/* Encabezado */}
      <div className="landing-header">
        <div className="user-info">
          DETECTIVE: <span style={{ color: "var(--amber)" }}>{playerName || "INVITADO"}</span>
        </div>
        <button className="btn-logout" onClick={onLogout}>
          CERRAR SESIÓN [X]
        </button>
      </div>

      {/* Contenedor Principal */}
      <div className="landing-content">
        <h1 className="glitch">DATATHON: MURDER MYSTERY</h1>
        <p className="lema">"Los datos no mienten, pero los sospechosos sí."</p>

        <div className="story-box">
          <p>
            La <strong>Señorita Pay de Zarza</strong>, estudiante destacada, fue asesinada.
            Tienes <span id="timer-landing">60:00</span> minutos para resolverlo.
          </p>
        </div>

        <div className="modes">
          <div className="mode-card guiado" onClick={() => onStartGame("guiado")}>
            <div className="mode-icon">🕵️‍♂️</div>
            <div className="mode-title">MODO GUIADO</div>
            <small>Te guío paso a paso con pistas reales</small>
          </div>

          <div className="mode-card experto" onClick={() => onStartGame("experto")}>
            <div className="mode-icon">👨‍💻</div>
            <div className="mode-title">MODO EXPERTO</div>
            <small>SQL puro. Sin ayuda. Solo datos.</small>
          </div>

          <div className="mode-card leaderboard-card" onClick={() => onStartGame("leaderboard")}>
            <div className="mode-icon">🏆</div>
            <div className="mode-title">TOP 10</div>
            <small>Los mejores detectives</small>
          </div>
        </div>

        {/* === FOOTER DE CRÉDITOS (ARREGLADO) === */}
        <div 
            className="landing-footer" 
            // 1. CAMBIO: Ahora alterna entre true/false
            onClick={() => setShowCredits(!showCredits)} 
            style={{
                // 2. CAMBIO: Si está abierto, lo subimos por encima del fondo negro (z-index alto)
                zIndex: showCredits ? 100000 : 10, 
                position: 'relative', 
                borderColor: showCredits ? 'var(--amber)' : 'rgba(245, 158, 11, 0.3)'
            }}
        >
           <div className="footer-content">
              {/* Cambia el ícono visualmente */}
              <span className="footer-icon">{showCredits ? "✖" : "ℹ️"}</span>
              <div className="footer-text">
                  <span className="footer-title">SISTEMA DESARROLLADO POR EQUIPO DATATHON</span>
                  <span className="footer-subtitle">
                      {showCredits ? "Click para cerrar credenciales" : "Click para ver credenciales de acceso"}
                  </span>
              </div>
              <span className="footer-version">v1.0.5</span>
           </div>
        </div>

      </div>

      {/* === MODAL DE CRÉDITOS === */}
      {showCredits && (
        <div className="modal-credits-backdrop" onClick={() => setShowCredits(false)} style={{zIndex: 99999}}>
          <div className="modal-credits-content" onClick={(e) => e.stopPropagation()}>
            
            <h2 className="credits-title">CRÉDITOS</h2>
            
            <div className="credits-grid">
                {/* TU EQUIPO */}
                <div className="dev-card">
                    <h3>Juárez Clemente Karla Valeria</h3>
                    <p>Desarrolladora Full Stack</p>
                </div>
                <div className="dev-card">
                    <h3>Ramos Chavez Juan Francisco</h3>
                    <p>Desarrollador Full Stack</p>
                </div>
            </div>

            <div className="credits-tech">
                <p>TECNOLOGÍAS:</p>
                <div style={{display:'flex', justifyContent:'center', gap:'1rem', color:'var(--amber)', fontWeight:'bold'}}>
                    <span>REACT</span> • <span>SUPABASE</span> • <span>VITE</span>
                </div>
            </div>
            
            <p className="credits-footer-text">
                Datathon 2025 © FES Acatlán
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

export default LandingPage;