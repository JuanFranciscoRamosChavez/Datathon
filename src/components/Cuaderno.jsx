// src/components/Cuaderno.jsx

import React, { useState } from "react";
import { createPortal } from "react-dom";

const LISTA_PERSONAJES = [
  "Señorita Escarlata",
  "Coronel Mostaza",
  "Señor White",
  "Señor Verdy",
  "Dr Black",
];
const LISTA_ESCENARIOS = [
  "Vestíbulo",
  "Salón",
  "Comedor",
  "Cocina",
  "Salón de baile",
  "Invernadero",
  "Sala de billar",
  "Biblioteca",
  "Estudio",
];
const LISTA_ARMAS = [
  "Cuchillo para cortes de carne...",
  "Cable soga...",
  "Botella de vino blanco",
  "Alucinógenos",
];

function Cuaderno({ sospechosos, mostrarBoton }) {
  const [descartados, setDescartados] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleDescartado = (item) => {
    setDescartados((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  return (
    <>
      {/* CONTENEDOR DEL CUADERNO (SIDEBAR) */}
      <div className="cuaderno-container">
        {/* 2. SOLO MOSTRAMOS EL BOTÓN SI LA INVESTIGACIÓN EMPEZÓ */}
        {mostrarBoton && (
          <button
            className="btn-ver-sospechosos font-geneva tracking-wider"
            style={{
              width: "100%",
              marginBottom: "1.5rem",
              padding: "1rem", // Más área de toque
              fontSize: "1rem", // Texto más grande
              fontWeight: "bold",
              background: "rgba(245, 158, 11, 0.1)", // Fondo sutil
              border: "2px solid var(--amber)",
              color: "var(--amber)",
              borderRadius: "8px",
            }}
            onClick={() => setIsModalOpen(true)}
          >
            📂 VER DOSSIER SOSPECHOSOS
          </button>
        )}

        {/* AQUI: Los títulos de sección en Geneva para que parezcan categorías de base de datos */}
        <h3 className="font-geneva tracking-wide">Personajes</h3>
        <ul>
          {LISTA_PERSONAJES.map((item) => (
            <li
              key={item}
              className={descartados[item] ? "descartado" : ""}
              onClick={() => toggleDescartado(item)}
            >
              {item}
            </li>
          ))}
        </ul>

        <h3 className="font-geneva tracking-wide">Escenarios</h3>
        <ul>
          {LISTA_ESCENARIOS.map((item) => (
            <li
              key={item}
              className={descartados[item] ? "descartado" : ""}
              onClick={() => toggleDescartado(item)}
            >
              {item}
            </li>
          ))}
        </ul>

        <h3 className="font-geneva tracking-wide">Armas</h3>
        <ul>
          {LISTA_ARMAS.map((item) => (
            <li
              key={item}
              className={descartados[item] ? "descartado" : ""}
              onClick={() => toggleDescartado(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* MODAL */}
      {isModalOpen &&
        createPortal(
          <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
            <div
              className="modal-sospechosos"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>

              {/* AQUI: Título del modal en Geneva */}
              <h2 className="modal-title font-geneva tracking-widest">
                DOSSIER DE SOSPECHOSOS
              </h2>

              <div className="modal-sospechosos-grid">
                {(sospechosos || []).map((s) => (
                  <div className="suspect-card-modal" key={s.nombre}>
                    {/* AQUI: El nombre del sospechoso en Geneva (dato técnico) */}
                    <strong className="font-geneva text-amber-400 tracking-wide">
                      {s.nombre}
                    </strong>
                    {/* La biografía se queda en Crimson Text para que sea fácil de leer como una historia */}
                    <p>{s.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default Cuaderno;
