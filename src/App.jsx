// src/App.jsx

import React, { useState, useEffect } from "react";
import { useAutoScroll } from "./hooks/useAutoScroll"; // <--- 1. IMPORTAR EL HOOK

import LandingPage from "./components/LandingPage";
import GuiadoPage from "./components/GuiadoPage";
import ExpertoPage from "./components/ExpertoPage";
import ModalAcusacion from "./components/ModalAcusacion";
import RegistroPage from "./components/RegistroPage";
import LeaderboardPage from './components/LeaderboardPage';

function App() {
  const [mode, setMode] = useState("registro");
  const [startTime, setStartTime] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. USAR EL HOOK DE SCROLL AUTOMÁTICO
  // Esto detecta cuando cambia el 'mode' (la pantalla) y sube el scroll a 0
  useAutoScroll([mode]);

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

  // Nota: Esta función es para el Modo Experto (si aún usa el modal antiguo)
  const handleSubmitAcusacion = (data) => {
    console.log("Acusación recibida:", data);
    // Aquí podrías actualizar la lógica si ExpertoPage también cambia de culpable
    const esCorrecta =
      data.culpable === "Señor Verdy" && 
      data.herramienta === "Alucinógenos" &&
      data.lugar === "Invernadero";
      
    alert(
      esCorrecta
        ? "¡CORRECTO! Has resuelto el caso."
        : "Incorrecto. Sigue investigando."
    );
    setIsModalOpen(false);
  };

  const handleStartGame = (selectedMode) => {
    // Si seleccionan leaderboard, no iniciamos el tiempo
    if (selectedMode === 'leaderboard') {
      setMode('leaderboard');
      return;
    }
    setMode(selectedMode);
    setStartTime(Date.now());
  };

  // Renderizado condicional
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
        // Ya no pasamos onAcusar porque GuiadoPage maneja su propio formulario final ahora
      />
    );
  } else if (mode === "experto") {
    content = (
      <ExpertoPage
        startTime={startTime}
        onAcusar={() => setIsModalOpen(true)} // Experto sigue usando el modal global por ahora
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

      {/* Este modal solo se usa ahora para el Modo Experto */}
      {isModalOpen && (
        <ModalAcusacion
          onSubmit={handleSubmitAcusacion}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;