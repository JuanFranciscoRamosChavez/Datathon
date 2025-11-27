import React, { useState, useEffect } from 'react';

// Recibe 'startTime' (inicio del juego) y 'stopTime' (fin del juego, opcional)
function Timer({ startTime, stopTime }) {
  const [displayTime, setDisplayTime] = useState("60:00");

  useEffect(() => {
    const updateTimer = () => {
      // Si hay stopTime (juego terminó), usamos esa hora congelada.
      // Si no (juego sigue), usamos la hora actual.
      const currentTime = stopTime || Date.now();
      
      // Calculamos segundos transcurridos
      const elapsed = Math.floor((currentTime - startTime) / 1000);
      
      // Calculamos restante (30 min * 60 seg = 1800 seg)
      const remaining = Math.max(1800 - elapsed, 0);

      // Formateamos a MM:SS
      const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
      const secs = String(remaining % 60).padStart(2, '0');
      
      setDisplayTime(`${mins}:${secs}`);
    };

    // 1. Ejecutar inmediatamente para actualizar la vista sin esperar 1 seg
    updateTimer();

    // 2. Si ya hay un stopTime (juego terminó), NO iniciamos el intervalo
    // Esto detiene el consumo de recursos.
    if (stopTime) return;

    // 3. Si el juego sigue, iniciamos el intervalo
    const interval = setInterval(updateTimer, 1000);

    // Limpieza al desmontar
    return () => clearInterval(interval);
    
  }, [startTime, stopTime]); // Se actualiza si cambia el inicio o si llega la hora de fin

  return (
    <div className="timer">
      {displayTime}
    </div>
  );
}

export default Timer;