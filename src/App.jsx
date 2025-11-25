// src/App.jsx

import React, { useState, useEffect } from "react";
import { useAutoScroll } from "./hooks/useAutoScroll";

import LandingPage from "./components/LandingPage";
import GuiadoPage from "./components/GuiadoPage"; // O "./pages/GuiadoPage" según tu carpeta
import ExpertoPage from "./components/ExpertoPage";
import RegistroPage from "./components/RegistroPage";
import LeaderboardPage from './components/LeaderboardPage';

function App() {
  const [mode, setMode] = useState("registro");
  const [startTime, setStartTime] = useState(null);

  // Hook para scroll automático al cambiar de pantalla
  useAutoScroll([mode]);

  // Chequeo de sesión al iniciar
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

  const handleRegistroExitoso = (datos) => {
    setMode("landing");
  };

  const handleBackToMenu = () => {
    setMode("landing");
    setStartTime(null);
  };

  const handleStartGame = (selectedMode) => {
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