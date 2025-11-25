// src/components/LandingPage.jsx

import React, { useEffect, useState } from "react";

function LandingPage({ onStartGame, onLogout }) {
  const [playerName, setPlayerName] = useState("");

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
      {/* Encabezado con Info de Usuario y Logout */}
      <div className="landing-header">
        <div className="user-info">
          DETECTIVE:{" "}
          <span style={{ color: "var(--amber)" }}>
            {playerName || "INVITADO"}
          </span>
        </div>
        <button className="btn-logout" onClick={onLogout}>
          CERRAR SESIÓN [X]
        </button>
      </div>

      {/* Contenedor Principal Centrado */}
      <div className="landing-content">
        <h1 className="glitch">DATATHON: MURDER MYSTERY</h1>
        <p className="lema">"Los datos no mienten, pero los sospechosos sí."</p>

        <div className="story-box">
          <p>
            La <strong>Señorita Pay de Zarza</strong>, estudiante destacada y multifacética, fue asesinada durante la graduación generacional en una casa de estilo barroco, específicamente en el salón de baile principal, donde estaban varios de sus amigos. 
          </p>
          <p className="timer-big">
            Tienes <span id="timer-landing">60:00</span> minutos antes de que llegue la
            policía.
          </p>
        </div>

        <div className="modes">
          <div
            className="mode-card guiado"
            onClick={() => onStartGame("guiado")}
          >
            <div className="mode-icon">🕵️‍♂️</div>{" "}
            <div className="mode-title">MODO GUIADO</div>
            <small>Te guío paso a paso con pistas reales</small>
          </div>

          <div
            className="mode-card experto"
            onClick={() => onStartGame("experto")}
          >
            <div className="mode-icon">👨‍💻</div>{" "}
            <div className="mode-title">MODO EXPERTO</div>
            <small>SQL puro. Sin ayuda. Solo datos.</small>
          </div>

          <div
            className="mode-card leaderboard-card"
            onClick={() => onStartGame("leaderboard")}
          >
            <div className="mode-icon">🏆</div>
            <div className="mode-title">TOP 10</div>
            <small>Los mejores detectives</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
