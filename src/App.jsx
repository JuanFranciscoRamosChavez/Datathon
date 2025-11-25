// src/App.jsx

import React, { useState, useEffect } from "react";
import { useAutoScroll } from "./hooks/useAutoScroll";

import LandingPage from "./components/LandingPage";
import GuiadoPage from "./components/GuiadoPage"; // Ajusta la ruta si está en components o pages
import ExpertoPage from "./components/ExpertoPage";
import RegistroPage from "./components/RegistroPage";
import LeaderboardPage from './components/LeaderboardPage';

function App() {
  const [mode, setMode] = useState("registro");
  const [startTime, setStartTime] = useState(null);

  // 1. Scroll automático al cambiar de pantalla
  useAutoScroll([mode]);

  // 2. GESTIÓN DEL BOTÓN "ATRÁS" (NUEVO)
  useEffect(() => {
    // Esta función se dispara cuando el usuario da "Atrás" en el navegador/celular
    const handleBackButton = (event) => {
      // Si está jugando o viendo el ranking, volver al menú
      if (mode !== 'landing' && mode !== 'registro') {
        setMode('landing');
        setStartTime(null);
      }
    };

    // Escuchar el evento
    window.addEventListener('popstate', handleBackButton);

    // Limpieza al desmontar
    return () => window.removeEventListener('popstate', handleBackButton);
  }, [mode]);

  // 3. Chequeo de sesión al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem("datathon_player");
    if (savedUser) {
      try {
        JSON.parse(savedUser);
        setMode("landing");
      } catch (e) {
        localStorage.removeItem("datathon_player");
      }
    }
  }, []);

  const handleRegistroExitoso = () => {
    setMode("landing");
  };

  const handleBackToMenu = () => {
    setMode("landing");
    setStartTime(null);
    // Opcional: Si quieres limpiar la URL visualmente, podrías usar history.replaceState aquí
  };

  const handleStartGame = (selectedMode) => {
    // === TRUCO: EMPUJAR HISTORIAL ===
    // Agregamos una entrada al historial para que el botón "Atrás" tenga a donde volver
    window.history.pushState({ page: selectedMode }, "", "");

    if (selectedMode === 'leaderboard') {
      setMode('leaderboard');
      return;
    }
    setMode(selectedMode);
    setStartTime(Date.now());
  };

  // Renderizado condicional de páginas
  let content;
  
  if (mode === "registro") {
    content = <RegistroPage onRegistroCompletado={handleRegistroExitoso} />;
  } else if (mode === "landing") {
    content = (
      <LandingPage
        onStartGame={handleStartGame}
        onLogout={() => {
          localStorage.removeItem("datathon_player");
          setMode("registro");
        }}
      />
    );
  } else if (mode === "guiado") {
    content = (
      <GuiadoPage
        startTime={startTime}
        onBackToMenu={handleBackToMenu}
      />
    );
  } else if (mode === "experto") {
    content = (
      <ExpertoPage
        startTime={startTime}
        onBackToMenu={handleBackToMenu}
      />
    );
  } else if (mode === "leaderboard") {
    content = <LeaderboardPage onBack={handleBackToMenu} />;
  } else {
    content = (
      <div style={{ color: "white", textAlign: "center", marginTop: "20%" }}>
        <h1>Error de Navegación</h1>
        <p>Estado actual: {mode}</p>
      </div>
    );
  }

  return (
    <div className="App">
      {content}
    </div>
  );
}

export default App;