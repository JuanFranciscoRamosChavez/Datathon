// src/components/LeaderboardPage.jsx

import React, { useEffect, useState } from 'react';
import { GOOGLE_SCRIPT_URL } from '../constants';

function LeaderboardPage({ onBack }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("Guiado"); // Estado de pestañas

  useEffect(() => {
    fetch(GOOGLE_SCRIPT_URL)
      .then(res => res.json())
      .then(data => {
        setLeaders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando leaderboard", err);
        setLoading(false);
      });
  }, []);

  const formatSeconds = (totalSeconds) => {
    if (!totalSeconds && totalSeconds !== 0) return "--:--";
    const secNum = parseInt(totalSeconds, 10); 
    const minutes = Math.floor(secNum / 60);
    const seconds = secNum % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Filtrado
// FILTRADO A PRUEBA DE ERRORES
  const filteredLeaders = leaders
    .filter(l => (l.modo || "Guiado") === currentTab)
    .sort((a, b) => a.segundos - b.segundos);

  return (
    <div className="leaderboard-screen">
      <div className="leaderboard-bg"></div>
      <div className="leaderboard-container">
        
        {/* Título con tu estilo Glitch/Blue */}
        <h1 className="glitch-red">TOP 10 DETECTIVES</h1>
        
        {/* PESTAÑAS (Estilo Azul Cyber) */}
        <div className="rank-tabs">
            <button 
                className={`rank-tab ${currentTab === 'Guiado' ? 'active' : ''}`}
                onClick={() => setCurrentTab('Guiado')}
            >
                🕵️‍♂️ MODO GUIADO
            </button>
            <button 
                className={`rank-tab ${currentTab === 'Experto' ? 'active' : ''}`}
                onClick={() => setCurrentTab('Experto')}
            >
                💻 MODO EXPERTO
            </button>
        </div>

        {loading ? (
          <div className="loading-text">DESCIFRANDO BASE DE DATOS...</div>
        ) : (
          <div className="table-wrapper">
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>RANK</th>
                  <th>AGENTE</th>
                  <th>TIEMPO</th>
                  <th>FECHA</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaders.length > 0 ? (
                  filteredLeaders.map((l, index) => (
                    <tr key={index} className={index === 0 ? "rank-1" : ""}>
                      <td>{index === 0 ? "👑" : `#${index + 1}`}</td>
                      <td className="name-cell">{l.nombre}</td>
                      <td className="time-cell">{formatSeconds(l.segundos)}</td>
                      <td style={{fontSize:'0.9rem', color:'#87cefa'}}>
                        {l.fecha ? new Date(l.fecha).toLocaleDateString() : new Date().toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{textAlign: 'center', padding: '2rem', color: '#888'}}>
                      No hay registros en modo {currentTab}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <button className="btn-volver" onClick={onBack}>
          VOLVER AL MENÚ
        </button>
      </div>
    </div>
  );
}

export default LeaderboardPage;