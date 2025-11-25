// src/components/ExpertoPage.jsx

import React, { useState } from "react";
import { useAutoScroll } from "../hooks/useAutoScroll";
import Timer from "./Timer";
import { supabase } from "../supabaseClient";
import { GOOGLE_SCRIPT_URL } from "../constants";

const SOSPECHOSOS = [
  { nombre: "Señorita Escarlata" },
  { nombre: "Coronel Mostaza" },
  { nombre: "Señor White" },
  { nombre: "Señor Verdy" },
  { nombre: "Dr. Black" },
];

function ExpertoPage({ startTime, onAcusar }) {
  // --- ESTADOS MODO EXPERTO (SQL) ---
  const [query, setQuery] = useState("SELECT * FROM registro_seguridad ;");
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMobileSchema, setShowMobileSchema] = useState(false);
  const [activeTab, setActiveTab] = useState("mision");

  // --- ESTADOS RESOLUCIÓN (FORMULARIO / VIDAS) ---
  const [isSolving, setIsSolving] = useState(false); // Controla si mostramos el formulario
  const [resultadoFinal, setResultadoFinal] = useState(null);
  const [tiempoFinal, setTiempoFinal] = useState(null);
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const MAX_INTENTOS = 2;

  // Hook de Scroll
  useAutoScroll(["inicio", isSolving, resultadoFinal]);

  // --- LÓGICA SQL (SUPABASE) ---
  const ejecutarQuery = async () => {
    setLoading(true);
    setError(null);
    setResultados(null);

    try {
      const q = query.trim().replace(/;\s*$/, ""); // Quitar punto y coma final
      if (!q) throw new Error("La terminal está vacía.");

      // Validaciones básicas de seguridad (Frontend)
      if (!/^select/i.test(q)) {
        throw new Error(
          "PROTOCOL ERROR: Solo se permiten comandos de lectura 'SELECT'."
        );
      }
      const palabrasProhibidas = [
        "drop",
        "delete",
        "update",
        "insert",
        "alter",
        "truncate",
        "grant",
        "revoke",
        "create",
        "replace",
      ];
      if (
        palabrasProhibidas.some((word) =>
          new RegExp(`\\b${word}\\b`, "i").test(q)
        )
      ) {
        throw new Error(
          "⚠️ ALERTA DE SEGURIDAD: Comando bloqueado por firewall."
        );
      }

      // Llamada a Supabase RPC
      const { data, error } = await supabase.rpc("exec_sql", { query: q });

      if (error) {
        const cleanError = error.message.replace("Error SQL:", "").trim();
        throw new Error(cleanError);
      }

      if (!data || data.length === 0) {
        setResultados([]);
      } else {
        setResultados(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const insertTable = (tableName) => {
    setQuery((prev) => {
      return prev.endsWith(" ") ? prev + tableName : prev + " " + tableName;
    });
    if (window.innerWidth < 1024) setShowMobileSchema(false);
  };

  const loadTableTemplate = (tableName, idColumn = "id") => {
    setQuery(`SELECT * FROM ${tableName};`);
    if (window.innerWidth < 1024) setShowMobileSchema(false);
  };

  // ====== COMPONENTE: FORMULARIO DE ACUSACIÓN (REUTILIZADO) ======
  const AcusacionForm = () => {
    const [acusacion, setAcusacion] = useState({
      sospechoso: "",
      arma: "",
      lugar: "",
    });

    const RESPUESTA_CORRECTA = {
      sospechoso: "Señor Verdy",
      arma: "Alucinógenos",
      lugar: "Invernadero",
    };

    const handleConfirmar = () => {
      const esCorrecta =
        acusacion.sospechoso === RESPUESTA_CORRECTA.sospechoso &&
        acusacion.arma === RESPUESTA_CORRECTA.arma &&
        acusacion.lugar === RESPUESTA_CORRECTA.lugar;

      if (esCorrecta) {
        // VICTORIA
        const now = Date.now();
        setTiempoFinal(now);
        setResultadoFinal("victoria");

        // LEADERBOARD LOGIC
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        const mins = String(Math.floor(elapsedSeconds / 60)).padStart(2, "0");
        const secs = String(elapsedSeconds % 60).padStart(2, "0");
        const tiempoBonito = `${mins}:${secs}`;

        const savedUser = localStorage.getItem("datathon_player");
        let usuario = {
          nombres: "Hacker",
          apellidoPaterno: "Anonimo",
          correo: "",
        };
        if (savedUser) {
          try {
            usuario = JSON.parse(savedUser);
          } catch (e) {
            console.error(e);
          }
        }

        const dataToSend = new FormData();
        dataToSend.append(
          "nombreCompleto",
          `${usuario.nombres} ${usuario.apellidoPaterno}`
        );
        dataToSend.append("correo", usuario.correo);
        dataToSend.append("segundos", elapsedSeconds);
        dataToSend.append("tiempo", tiempoBonito);
        dataToSend.append("modo", "Experto");
        dataToSend.append("resultado", "VICTORIA"); // <-- VICTORIA

        fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          body: dataToSend,
          mode: "no-cors",
        }).catch((err) => console.error(err));
      } else {
        // FALLO
        const nuevosIntentos = intentosFallidos + 1;
        setIntentosFallidos(nuevosIntentos);

        if (nuevosIntentos >= MAX_INTENTOS) {
          setResultadoFinal("derrota_final");

          // ENVIAR DERROTA
          const savedUser = localStorage.getItem("datathon_player");
          let usuario = { nombres: "Hacker", apellidoPaterno: "", correo: "" };
          if (savedUser)
            try {
              usuario = JSON.parse(savedUser);
            } catch (e) {}

          const dataDerrota = new FormData();
          dataDerrota.append("correo", usuario.correo);
          dataDerrota.append("modo", "Experto");
          dataDerrota.append("resultado", "DERROTA"); // <-- DERROTA

          fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            body: dataDerrota,
            mode: "no-cors",
          });
        } else {
          setResultadoFinal("advertencia");
        }
      }
    };

    return (
      <div className="acusacion-panel" style={{ marginTop: "2rem" }}>
        <div className="acusacion-fields">
          <div className="field-group">
            <label>¿QUIÉN FUE?</label>
            <select
              value={acusacion.sospechoso}
              onChange={(e) =>
                setAcusacion({ ...acusacion, sospechoso: e.target.value })
              }
            >
              <option value="">Selecciona sospechoso...</option>
              {SOSPECHOSOS.map((s) => (
                <option key={s.nombre} value={s.nombre}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label>¿CON QUÉ ARMA?</label>
            <select
              value={acusacion.arma}
              onChange={(e) =>
                setAcusacion({ ...acusacion, arma: e.target.value })
              }
            >
              <option value="">Selecciona arma...</option>
              <option>Cable soga...</option>
              <option>Cuchillo para cortes de carne</option>
              <option>Botella de vino blanco</option>
              <option>Alucinógenos</option>
            </select>
          </div>
          <div className="field-group">
            <label>¿EN QUÉ LUGAR?</label>
            <select
              value={acusacion.lugar}
              onChange={(e) =>
                setAcusacion({ ...acusacion, lugar: e.target.value })
              }
            >
              <option value="">Selecciona lugar...</option>
              <option>Vestíbulo</option>
              <option>Salón</option>
              <option>Comedor</option>
              <option>Cocina</option>
              <option>Salón de baile</option>
              <option>Invernadero</option>
              <option>Sala de billar</option>
              <option>Biblioteca</option>
              <option>Estudio</option>
            </select>
          </div>
        </div>

        <button
          className="btn-confirmar-acusacion"
          disabled={
            !acusacion.sospechoso || !acusacion.arma || !acusacion.lugar
          }
          onClick={handleConfirmar}
        >
          CONFIRMAR ACUSACIÓN
        </button>

        <p
          style={{
            textAlign: "center",
            color: "#ee8789",
            fontSize: "1.4rem",
            fontWeight: "bold",
            marginTop: "1.5rem",
            fontFamily: "Orbitron",
            letterSpacing: "2px",
            textShadow: "0 0 10px rgba(238, 135, 137, 0.3)",
          }}
        >
          INTENTOS RESTANTES: {MAX_INTENTOS - intentosFallidos}
        </p>
      </div>
    );
  };

  // --- PANTALLAS DE RESULTADO ---
  const PantallaVictoria = () => (
    <div className="resultado-screen victoria">
      <div className="resultado-bg"></div>
      <div className="resultado-content">
        <h1 className="victoria-titulo">¡HACK COMPLETADO!</h1>
        <h2 className="resultado-subtitulo">CASO RESUELTO CON SQL</h2>
        <p className="resultado-texto">
          El Señor Verdy ha sido expuesto gracias a tu análisis de datos.
          <br />
          Has demostrado habilidades de nivel experto en{" "}
          <Timer startTime={startTime} stopTime={tiempoFinal} />
        </p>
        <button
          className="btn-reiniciar"
          onClick={() => window.location.reload()}
        >
          VOLVER AL MENÚ
        </button>
      </div>
    </div>
  );

  const PantallaAdvertencia = () => (
    <div className="resultado-screen advertencia-mode">
      <div className="advertencia-bg"></div>
      <div className="advertencia-content">
        <h1 className="advertencia-titulo">¡ERROR DE CÁLCULO!</h1>
        <div className="advertencia-texto">
          <p>Tu hipótesis no coincide con los registros de la base de datos.</p>
        </div>
        <div className="alerta-critica">⚠ ALERTA: TE QUEDA 1 SOLO INTENTO</div>
        <p
          style={{
            color: "#999",
            marginBottom: "2rem",
            fontSize: "1.5rem",
            fontFamily: "Verdana",
          }}
        >
          Si fallas de nuevo, serás eliminado del sistema permanentemente.
        </p>
        <button
          className="btn-advertencia"
          onClick={() => setResultadoFinal(null)}
        >
          REVISAR CONSULTAS
        </button>
      </div>
    </div>
  );

  const PantallaDerrotaFinal = () => (
    <div className="resultado-screen derrota">
      <div className="resultado-bg"></div>
      <div className="resultado-content">
        <h1 className="derrota-titulo">SISTEMA COMPROMETIDO</h1>
        <h2 className="resultado-subtitulo">GAME OVER</h2>
        <p className="resultado-texto">
          Has agotado tus intentos de consulta.
          <br />
          El culpable ha borrado la base de datos.
        </p>
        <button
          className="btn-reiniciar"
          onClick={() => window.location.reload()}
        >
          REINICIAR SISTEMA
        </button>
      </div>
    </div>
  );

  return (
    <div id="guiado" className="page active experto-theme">
      {/* RENDERIZADO DE RESULTADOS */}
      {resultadoFinal === "victoria" && <PantallaVictoria />}
      {resultadoFinal === "advertencia" && <PantallaAdvertencia />}
      {resultadoFinal === "derrota_final" && <PantallaDerrotaFinal />}

      {/* PANTALLA DE ACUSACIÓN (OVERLAY) */}
      {isSolving && !resultadoFinal && (
        <div className="final-dramatico-screen">
          <div className="final-dramatico-bg"></div>
          <div
            className="final-dramatico-content"
            style={{
              width: "100%",
              maxWidth: "600px",
              overflowY: "auto",
              maxHeight: "90vh",
            }}
          >
            <h1 className="final-title">INFORME FINAL</h1>
            <p className="final-subtitle">
              Ingresa tus conclusiones basadas en los datos.
            </p>
            <button
              onClick={() => setIsSolving(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#aaa",
                textDecoration: "underline",
                cursor: "pointer",
                width: "100%",
                marginBottom: "1rem",
                fontFamily: "Verdana",
                fontSize: "1.8rem",
              }}
            >
              ← Volver a los datos
            </button>
            <AcusacionForm />
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="header experto-header">
        <h2>TERMINAL SQL</h2>
        <div className="header-right-side">
          <Timer startTime={startTime} stopTime={tiempoFinal} />
        </div>
      </div>

      {/* BOTÓN FLOTANTE MÓVIL */}
      <button
        className="btn-toggle-cuaderno"
        onClick={() => setShowMobileSchema(true)}
      >
        📂 DATOS
      </button>

      {/* BACKDROP */}
      <div
        className={`mobile-backdrop ${showMobileSchema ? "visible" : ""}`}
        onClick={() => setShowMobileSchema(false)}
      ></div>

      <div className="guiado-layout">
        {/* === SIDEBAR === */}
        <div className={`cuaderno-sidebar ${showMobileSchema ? "open" : ""}`}>
          <div className="sidebar-mobile-header">
            <span className="sidebar-mobile-title">PANEL DE DATOS</span>
            <button
              className="btn-minimizar"
              onClick={() => setShowMobileSchema(false)}
            >
              ▼ CERRAR
            </button>
          </div>

          <div
            className="cuaderno-container custom-scroll"
            style={{ padding: "0" }}
          >
            <div className="sidebar-tabs">
              <button
                className={`tab-btn ${activeTab === "mision" ? "active" : ""}`}
                onClick={() => setActiveTab("mision")}
              >
                📋 PISTAS
              </button>
              <button
                className={`tab-btn ${activeTab === "schema" ? "active" : ""}`}
                onClick={() => setActiveTab("schema")}
              >
                🗄️ TABLAS
              </button>
            </div>

            <div style={{ padding: "1rem" }}>
              {activeTab === "mision" && (
                <div className="mision-content">
                  <div className="mision-item">
                    <h5>1. MOVIMIENTOS (Vestíbulo)</h5>
                    <p>
                      Revisa <code>registro_seguridad</code> buscando
                      coincidencias de hora entre Escarlata y White.
                    </p>
                  </div>
                  <div className="mision-item">
                    <h5>2. OBJETO PERDIDO</h5>
                    <p>
                      Busca en <code>inventario_herramientas</code> items con
                      estado 'desaparecido'.
                    </p>
                  </div>
                  <div className="mision-item">
                    <h5>3. MENSAJE CIFRADO</h5>
                    <p>
                      Analiza <code>chat_interno</code> entre White y Black.
                    </p>
                  </div>
                  <div className="mision-item">
                    <h5>4. COARTADA FALSA</h5>
                    <p>Verifica entradas/salidas de Verdy en el 'Salón'.</p>
                  </div>
                  <div className="mision-item">
                    <h5>5. INCONSISTENCIA (Cocina)</h5>
                    <p>
                      Compara la declaración de Escarlata con sus logs reales.
                    </p>
                  </div>
                  <div className="mision-item">
                    <h5>6. REGISTRO OCULTO</h5>
                    <p>Busca entradas sin salida en el 'Invernadero'.</p>
                  </div>
                  <div className="mision-item">
                    <h5>7. INVENTARIO ALTERADO</h5>
                    <p>Busca químicos ('Alucinógenos') con uso parcial.</p>
                  </div>
                  <div className="mision-item">
                    <h5>8. BORRADOR ARREPENTIDO</h5>
                    <p>
                      Filtra <code>chat_interno</code> por estado 'DRAFT'.
                    </p>
                  </div>
                  <div className="mision-item">
                    <h5>9. LLAMADA ENCUBIERTA</h5>
                    <p>Busca números de sistema (*#) marcados por Verdy.</p>
                  </div>
                  <div className="mision-item">
                    <h5>10. DECLARACIONES CRUZADAS</h5>
                    <p>Compara declaraciones de Verdy vs Mostaza.</p>
                  </div>
                </div>
              )}

              {activeTab === "schema" && (
                <div className="db-schema-list">
                  <div
                    className="db-table-item"
                    onClick={() =>
                      loadTableTemplate("registro_seguridad", "registro_id")
                    }
                  >
                    <h4>🛡️ registro_seguridad</h4>
                    <p>registro_id , ts , persona_id , sala_id , tipo_acceso</p>
                  </div>
                  <div
                    className="db-table-item"
                    onClick={() =>
                      loadTableTemplate(
                        "inventario_herramientas",
                        "log_inventario_id"
                      )
                    }
                  >
                    <h4>🔧 inventario_herramientas</h4>
                    <p>log_inventario_id , timestamp_reporte , herramienta_id , ubicacion_id , estado  , reportado_por_id</p>
                  </div>
                  <div
                    className="db-table-item"
                    onClick={() =>
                      loadTableTemplate("chat_interno", "mensaje_id")
                    }
                  >
                    <h4>💬 chat_interno</h4>
                    <p>mensaje_id , ts , remitente_id , destinatario_id , mensaje , estado_msg</p>
                  </div>
                  <div
                    className="db-table-item"
                    onClick={() =>
                      loadTableTemplate("registro_llamadas", "llamada_id")
                    }
                  >
                    <h4>📞 registro_llamadas</h4>
                    <p>llamada_id , ts , persona_id_origen , numero_marcado , duracion_segundos</p>
                  </div>
                  <div
                    className="db-table-item"
                    onClick={() =>
                      loadTableTemplate(
                        "declaraciones_sospechosos",
                        "declaracion_id"
                      )
                    }
                  >
                    <h4>📄 declaraciones</h4>
                    <p>declaracion_id , sospechoso_id , ts</p>
                  </div>
                  <div
                    className="db-table-item"
                    onClick={() => loadTableTemplate("personas", "persona_id")}
                  >
                    <h4>👥 personas</h4>
                    <p>persona_id , nombre_completo , rol</p>
                  </div>
                  <div
                    className="db-table-item"
                    onClick={() => loadTableTemplate("salas", "sala_id")}
                  >
                    <h4>📍 salas</h4>
                    <p>sala_id , nombre_sala</p>
                  </div>
                  <div
                    className="db-table-item"
                    onClick={() =>
                      loadTableTemplate("armas_herramientas", "herramienta_id")
                    }
                  >
                    <h4>🔪 armas_herramientas</h4>
                    <p>herramienta_id , nombre_objeto , descripcion</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* === CONTENIDO PRINCIPAL === */}
        <div id="consola-container">
          <div className="sql-card">
            <textarea
              className="sql-textarea"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              spellCheck="false"
              placeholder="-- Escribe tu consulta SQL aquí..."
            />
            <div className="quick-bar">
              <button onClick={() => setQuery("")} className="btn-clear">
                CLR
              </button>
              <button onClick={() => insertTable("SELECT")}>
                SELECT *
              </button>
              <button onClick={() => insertTable("FROM")}>
                FROM
              </button>
              <button onClick={() => insertTable("WHERE")}>WHERE</button>
              <button onClick={() => insertTable("AND")}>AND</button>
              <button onClick={() => insertTable("LIKE")}>LIKE</button>
              <button onClick={() => insertTable("ORDER BY")}>
                ORDER BY
              </button>
              <button onClick={() => insertTable("LIMIT")}>LIMIT</button>
            </div>
            <button
              className="btn-run-cyber"
              onClick={ejecutarQuery}
              disabled={loading}
            >
              {loading ? "PROCESANDO..." : "▶ EJECUTAR QUERY"}
            </button>
          </div>

          {resultados && (
            <div className="results-card">
              <h4>RESULTADOS ({resultados.length})</h4>
              {resultados.length > 0 ? (
                <div style={{ overflowX: "auto" }}>
                  <table className="cyber-table-expert">
                    <thead>
                      <tr>
                        {Object.keys(resultados[0]).map((key) => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {resultados.map((row, i) => (
                        <tr key={i}>
                          {Object.values(row).map((val, j) => (
                            <td key={j}>
                              {typeof val === "object" && val !== null
                                ? JSON.stringify(val)
                                : val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: "2rem", color: "#888" }}>
                  No se encontraron datos.
                </div>
              )}
            </div>
          )}

          {error && <div className="error-msg">&gt; ERROR: {error}</div>}

          {/* BOTÓN FINAL PRINCIPAL (DUPLICADO PARA ACCESO FÁCIL) */}
          <button
            className="btn-acusar-expert"
            onClick={() => setIsSolving(true)}
          >
            🚨 TENGO AL CULPABLE
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpertoPage;
