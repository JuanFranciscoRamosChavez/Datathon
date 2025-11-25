// src/pages/GuiadoPage.jsx

import React, { useState } from "react";
import Timer from "../components/Timer";
import PistaCard from "../components/PistaCard";
import Cuaderno from "../components/Cuaderno";
import { useAutoScroll } from "../hooks/useAutoScroll"; // <--- 1. IMPORTAR
import { GOOGLE_SCRIPT_URL } from '../constants';

const pistasReales = [
  {
    titulo: "Pista 1: Movimientos Sospechosos",
    briefing:
      "El asesinato ocurrió en una ventana de tiempo específica. Revisa el 'registro_seguridad' del Vestíbulo. ¿Quiénes estaban ahí?",
    conclusion:
      "Registro: La Señorita Escarlata y el Señor White estuvieron simultáneamente en el Vestíbulo durante 15 minutos. Poco después, ella salió con prisa.",
    opciones: [
      { texto: "Revisar logs del Vestíbulo", esCorrecta: true },
      {
        texto: "Interrogar al Coronel Mostaza",
        esCorrecta: false,
        feedback: "Mostaza estaba en la biblioteca. No vio el encuentro en el vestíbulo.",
      },
      {
        texto: "Buscar huellas en la entrada",
        esCorrecta: false,
        feedback: "El tráfico de invitados borró cualquier huella útil.",
      },
    ],
  },
  {
    titulo: "Pista 2: La Herramienta Perdida",
    briefing:
      "El Dr. Black reportó un robo en el 'inventario_herramientas'. ¿Qué objeto falta y de dónde?",
    conclusion:
      "Inventario: Un 'Cable soga' desapareció del Vestíbulo esa misma tarde. Coincide con la ubicación de los sospechosos de la Pista 1.",
    opciones: [
      { texto: "Consultar items desaparecidos", esCorrecta: true },
      {
        texto: "Revisar la caja fuerte",
        esCorrecta: false,
        feedback: "La caja fuerte está intacta. Lo que falta es una herramienta común.",
      },
      {
        texto: "Ver cámaras del Salón",
        esCorrecta: false,
        feedback: "El salón está despejado. El reporte viene del inventario general.",
      },
    ],
  },
  {
    titulo: "Pista 3: El Mensaje Cifrado",
    briefing:
      "Interceptamos el 'chat_interno'. Hay rumores de un reto entre White y Black. Busca mensajes extraños.",
    conclusion:
      "Chat Log: White escribió a Black: '¿Algún día los probará? Tú que eres tan listo ¿cómo lo harías?'. Parece un desafío intelectual... o una amenaza.",
    opciones: [
      { texto: "Leer logs de chat entre White y Black", esCorrecta: true },
      {
        texto: "Buscar emails de la víctima",
        esCorrecta: false,
        feedback: "El correo de la víctima está encriptado. Los chats internos son más accesibles.",
      },
      {
        texto: "Seguir a Escarlata",
        esCorrecta: false,
        feedback: "Escarlata está visible en la fiesta. El rastro digital es más importante.",
      },
    ],
  },
  {
    titulo: "Pista 4: La Coartada de Verdy",
    briefing:
      "El Señor Verdy dice que estuvo en el Salón toda la noche. Crucemos eso con los logs de seguridad.",
    conclusion:
      "Alerta: Verdy entró y salió del Salón dos veces. Su segunda salida coincide exactamente con el momento en que el cuerpo fue movido al Estudio.",
    opciones: [
      { texto: "Auditar entradas/salidas del Salón", esCorrecta: true },
      {
        texto: "Confiar en la palabra de Verdy",
        esCorrecta: false,
        feedback: "Nunca confíes sin verificar. Los datos muestran movimiento inusual.",
      },
      {
        texto: "Revisar el Estudio",
        esCorrecta: false,
        feedback: "El cuerpo apareció ahí, pero necesitamos saber quién tuvo tiempo de moverlo.",
      },
    ],
  },
  {
    titulo: "Pista 5: La Mentira de Escarlata",
    briefing:
      "Declaración de Escarlata: 'Nunca entré a la Cocina'. ¿Es verdad? Revisa el 'registro_seguridad'.",
    conclusion:
      "Contradicción: Los datos muestran que Escarlata entró a la Cocina 5 minutos antes del hallazgo del cuerpo. Ella mintió, pero ¿es la asesina?",
    opciones: [
      { texto: "Verificar accesos a Cocina", esCorrecta: true },
      {
        texto: "Buscar el Cuchillo de carne",
        esCorrecta: false,
        feedback: "El cuchillo es una distracción. Lo importante es que ella mintió sobre su ubicación.",
      },
      {
        texto: "Presionar a White",
        esCorrecta: false,
        feedback: "White es sospechoso, pero la mentira directa viene de Escarlata.",
      },
    ],
  },
  {
    titulo: "Pista 6: El Registro Fantasma",
    briefing:
      "Algo huele mal en el Invernadero... literalmente olor químico. Revisa quién entró y no salió.",
    conclusion:
      "Dato Crítico: Verdy entró al Invernadero a las 23:25. NO hay registro de salida. Sigue ahí o salió sin huella digital.",
    opciones: [
      { texto: "Filtrar logs del Invernadero", esCorrecta: true },
      {
        texto: "Analizar el aire",
        esCorrecta: false,
        feedback: "Detectas olor químico, pero necesitas saber QUIÉN lo causó.",
      },
      {
        texto: "Interrogar al jardinero",
        esCorrecta: false,
        feedback: "No hay jardinero de turno. Solo los invitados tienen acceso.",
      },
    ],
  },
  {
    titulo: "Pista 7: Veneno en el Inventario",
    briefing:
      "Revisa el estado de los químicos peligrosos en 'inventario_herramientas'. Busca cambios recientes.",
    conclusion:
      "Evidencia: Los 'Alucinógenos' están marcados como 'parcialmente usados'. La etiqueta de reporte fue hecha por... ¡Verdy!",
    opciones: [
      { texto: "Revisar estado de químicos", esCorrecta: true },
      {
        texto: "Buscar arma de fuego",
        esCorrecta: false,
        feedback: "No hubo disparos. Busca sustancias silenciosas.",
      },
      {
        texto: "Verificar botiquín",
        esCorrecta: false,
        feedback: "El botiquín está completo. Faltan sustancias tóxicas, no medicinas.",
      },
    ],
  },
  {
    titulo: "Pista 8: El Borrador Oculto",
    briefing:
      "El administrador recuperó metadatos de mensajes NO enviados (Drafts). ¿Qué escribía Verdy?",
    conclusion:
      "Mensaje Recuperado: 'Ella nunca debió reírse de mí… no lo entendería ni con una sobredosis'. Verdy confesó su intención en un borrador.",
    opciones: [
      { texto: "Recuperar borradores (Drafts)", esCorrecta: true },
      {
        texto: "Leer chats públicos",
        esCorrecta: false,
        feedback: "En público actúa normal. La verdad está en lo que no envió.",
      },
      {
        texto: "Hackear teléfono de Escarlata",
        esCorrecta: false,
        feedback: "Escarlata es una pista falsa. El rencor viene de otro lado.",
      },
    ],
  },
  {
    titulo: "Pista 9: Automatización Hackeada",
    briefing:
      "Hubo un apagón en el Invernadero. Revisa 'registro_llamadas' buscando códigos de sistema (*#).",
    conclusion:
      "Sabotaje: Verdy llamó al '*#09' (Sistema de Ventilación) por 7 segundos. Activó la dispersión de gas manualmente.",
    opciones: [
      { texto: "Rastrear llamadas a sistemas (*#)", esCorrecta: true },
      {
        texto: "Revisar caja de fusibles",
        esCorrecta: false,
        feedback: "Los fusibles están bien. Fue un comando remoto.",
      },
      {
        texto: "Llamar a mantenimiento",
        esCorrecta: false,
        feedback: "No hay tiempo. El registro de la llamada ya nos dice quién fue.",
      },
    ],
  },
  {
    titulo: "Pista 10: La Contradicción Final",
    briefing:
      "Cruza la declaración de Verdy ('Soy alérgico al polen, no entré') con la del Coronel Mostaza.",
    conclusion:
      "JAQUE MATE: Mostaza declaró: 'Vi a Verdy saliendo del invernadero tosiendo'. Verdy mintió sobre su alergia y su ubicación.",
    opciones: [
      { texto: "Comparar declaraciones (JOIN)", esCorrecta: true },
      {
        texto: "Creer en la alergia de Verdy",
        esCorrecta: false,
        feedback: "Es una excusa clásica. Los testigos oculares dicen lo contrario.",
      },
      {
        texto: "Interrogar a Pay de Zarza",
        esCorrecta: false,
        feedback: "Lamentablemente, la víctima ya no puede hablar.",
      },
    ],
  },
];

const SOSPECHOSOS = [
  {
    nombre: "Señorita Escarlata",
    bio: "Su mejor amiga, su amistad empezó después de que la Señorita Escarlata arruinará parte de su tesis, sin que ella lo supiera, y posterior fingiera amabilidad con ella.",
  },
  {
    nombre: "Coronel Mostaza",
    bio: "Arquitecto y mentor de la señorita Pay de Zarza quienes estuvieron animando la fiesta desde su llegada, sobre todo por el llamativo vestuario de Mostaza, lleno de lirios.",
  },
  {
    nombre: "Señor White",
    bio: "Walter White, amigo cercano de Pay de Zarza, le suministraba “sustancias” a aquel que lo solicitaba, hacía tratos con allegados de Pay de Zarza sin llegar a comerciar con la víctima, por lo que tenía varios contactos.",
  },
  {
    nombre: "Señor Verdy",
    bio: "Se ha mantenido cerca de los círculos de la señorita Pay de Zarza, siempre al pendiente y tratando de estar cerca de ella, un admirado que incluso, ha robado su información personal, buscando que su presencia sea notoria para ella ha tomado decisiones desesperadas. ",
  },
  {
    nombre: "Dr. Black",
    bio: "El doctor Jacobo “Jack” Black ha asistido a 3 graduaciones con anterioridad. Su alto desempeño escolar lo ha llevado a titularse dos veces y obtener un doctorado. Quizá por su inteligencia ideó un plan para entrar en el círculo social de Pay de Zarza para sabotearla y que nadie más supere su promedio.",
  },
];
function GuiadoPage({ startTime, onBackToMenu }) {
  const [pistasCompletadas, setPistasCompletadas] = useState(0);
  const [investigacionIniciada, setInvestigacionIniciada] = useState(false);
  const [sospechosoActual, setSospechosoActual] = useState(-1);
  const [resultadoFinal, setResultadoFinal] = useState(null);
  
  const [showMobileNotebook, setShowMobileNotebook] = useState(false);
  const [tiempoFinal, setTiempoFinal] = useState(null);

  // --- NUEVA LÓGICA DE VIDAS ---
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const MAX_INTENTOS = 2;

  const handlePistaCompletada = () => setPistasCompletadas((prev) => prev + 1);

      useAutoScroll([
    investigacionIniciada, // Cuando pasas de sospechosos a pistas
    resultadoFinal,        // Cuando ganas o pierdes
    "siempre"              // Truco: para que también lo haga al montar el componente
  ]);


  // ====== FORMULARIO DE ACUSACIÓN ======
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
        // VICTORIA DIRECTA
        const now = Date.now();
        setTiempoFinal(now);
        setResultadoFinal("victoria");

        // Enviar Leaderboard
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        const mins = String(Math.floor(elapsedSeconds / 60)).padStart(2, "0");
        const secs = String(elapsedSeconds % 60).padStart(2, "0");
        const tiempoBonito = `${mins}:${secs}`;

        const savedUser = localStorage.getItem("datathon_player");
        let usuario = { nombres: "Anonimo", apellidoPaterno: "", correo: "" };
        if (savedUser) {
          try { usuario = JSON.parse(savedUser); } catch (e) { console.error(e); }
        }

        const dataToSend = new FormData();
        dataToSend.append("nombreCompleto", `${usuario.nombres} ${usuario.apellidoPaterno}`);
        dataToSend.append("correo", usuario.correo);
        dataToSend.append("segundos", elapsedSeconds);
        dataToSend.append("tiempo", tiempoBonito);

        fetch(GOOGLE_SCRIPT_URL, {
          method: "POST", body: dataToSend, mode: "no-cors",
        }).catch((err) => console.error(err));

      } else {
        // --- LÓGICA DE FALLO ---
        const nuevosIntentos = intentosFallidos + 1;
        setIntentosFallidos(nuevosIntentos);

        if (nuevosIntentos >= MAX_INTENTOS) {
          // YA NO QUEDAN VIDAS -> GAME OVER FINAL (Morado)
          setResultadoFinal("derrota_final");
        } else {
          // PRIMER FALLO -> ADVERTENCIA (Ámbar/Rojo)
          setResultadoFinal("advertencia");
        }
      }
    };

    return (
      <div className="acusacion-panel" style={{marginTop: '2rem'}}>
        {/* ... (TU FORMULARIO DE SIEMPRE - SIN CAMBIOS) ... */}
        <div className="acusacion-fields">
          <div className="field-group">
            <label>¿QUIÉN FUE?</label>
            <select value={acusacion.sospechoso} onChange={(e) => setAcusacion({ ...acusacion, sospechoso: e.target.value })}>
              <option value="">Selecciona sospechoso...</option>
              {SOSPECHOSOS.map((s) => (<option key={s.nombre} value={s.nombre}>{s.nombre}</option>))}
            </select>
          </div>
          <div className="field-group">
            <label>¿CON QUÉ ARMA?</label>
            <select value={acusacion.arma} onChange={(e) => setAcusacion({ ...acusacion, arma: e.target.value })}>
              <option value="">Selecciona arma...</option>
              <option>Cable soga...</option>
              <option>Cuchillo para cortes de carne</option>
              <option>Botella de vino blanco</option>
              <option>Alucinógenos</option>
            </select>
          </div>
          <div className="field-group">
            <label>¿EN QUÉ LUGAR?</label>
            <select value={acusacion.lugar} onChange={(e) => setAcusacion({ ...acusacion, lugar: e.target.value })}>
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
          disabled={!acusacion.sospechoso || !acusacion.arma || !acusacion.lugar}
          onClick={handleConfirmar}
        >
          CONFIRMAR ACUSACIÓN
        </button>
        
        {/* Mostrador de intentos restantes discreto */}
        <p style={{textAlign:'center', color:'gray', fontSize:'2rem', marginTop:'1rem', fontFamily: "Verdana, Geneva, Tahoma, sans-serif"}}>
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
        <h1 className="victoria-titulo">¡VICTORIA!</h1>
        <h2 className="resultado-subtitulo">HAS RESUELTO EL CASO</h2>
        <p className="resultado-texto">
          <br />
          Has completado 10/10 pistas en <Timer startTime={startTime} stopTime={tiempoFinal} />
        </p>
        <button className="btn-reiniciar" onClick={onBackToMenu}>
          VOLVER AL MENÚ
        </button>
      </div>
    </div>
  );

  // PANTALLA DE PRIMER ERROR (ADVERTENCIA)
  // PANTALLA DE PRIMER ERROR (ADVERTENCIA MEJORADA)
  const PantallaAdvertencia = () => (
    <div className="resultado-screen advertencia-mode">
      <div className="advertencia-bg"></div>
      
      <div className="advertencia-content">
        <h1 className="advertencia-titulo">¡ERROR DE CÁLCULO!</h1>
        
        <div className="advertencia-texto">
          <p>Tus deducciones son incorrectas.</p>
          <p>El sospechoso ha notado actividad inusual en la red.</p>
        </div>

        <div className="alerta-critica">
          ⚠ ALERTA: TE QUEDA 1 SOLO INTENTO
        </div>
        
        <p style={{color: '#999', marginBottom: '2rem',fontSize:'1.5rem', fontFamily: "Verdana, Geneva, Tahoma, sans-serif"}}>
          Si fallas de nuevo, serás eliminado del sistema permanentemente.
        </p>
        
        <button
          className="btn-advertencia"
          onClick={() => setResultadoFinal(null)}
        >
          USAR ÚLTIMA OPORTUNIDAD
        </button>
      </div>
    </div>
  );

  // PANTALLA DE DERROTA FINAL (GAME OVER)
  const PantallaDerrotaFinal = () => (
    <div className="resultado-screen derrota">
      <div className="resultado-bg"></div>
      <div className="resultado-content">
        <h1 className="derrota-titulo">SISTEMA BLOQUEADO</h1>
        <h2 className="resultado-subtitulo">GAME OVER</h2>
        <p className="resultado-texto">
          Has agotado tus 2 intentos.
          <br />
          El asesino ha borrado sus huellas y escapado.
        </p>
        <button
          className="btn-reiniciar"
          onClick={() => {
            // Reinicio TOTAL del juego
            setResultadoFinal(null);
            setPistasCompletadas(0);
            setInvestigacionIniciada(false);
            setSospechosoActual(-1);
            setIntentosFallidos(0); // Reseteamos vidas
            setTiempoFinal(null);
          }}
        >
          REINICIAR SISTEMA
        </button>
      </div>
    </div>
  );

  return (
    <div id="guiado" className="page active">
      {/* RENDERIZADO CONDICIONAL DE PANTALLAS */}
      {resultadoFinal === "victoria" && <PantallaVictoria />}
      {resultadoFinal === "advertencia" && <PantallaAdvertencia />}
      {resultadoFinal === "derrota_final" && <PantallaDerrotaFinal />}

      {/* PANTALLA PRINCIPAL DEL FORMULARIO */}
      {pistasCompletadas === pistasReales.length && !resultadoFinal && (
        <div className="final-dramatico-screen">
          <div className="final-dramatico-bg"></div>
          <div className="final-dramatico-content" style={{width: '100%', maxWidth:'600px', overflowY:'auto', maxHeight:'90vh'}}>
            <h1 className="final-title glitch-red">CASO RESUELTO</h1>
            <p className="final-subtitle">
              Es hora de señalar al culpable.
            </p>
            <AcusacionForm />
          </div>
        </div>
      )}

      {/* MODO NORMAL DE JUEGO (PISTAS) */}
      {pistasCompletadas < pistasReales.length && (
        <>
          {/* ... (TU CÓDIGO DE PISTAS Y HEADER SIGUE IGUAL AQUÍ) ... */}
          {investigacionIniciada && (
            <div className="header">
              <h2>Modo Guiado</h2>
              <div className="header-right-side">
                <Timer startTime={startTime} stopTime={tiempoFinal} />
              </div>
            </div>
          )}

          {investigacionIniciada && (
            <button 
              className="btn-toggle-cuaderno"
              onClick={() => setShowMobileNotebook(true)}
            >
              📒 NOTAS
            </button>
          )}

          {investigacionIniciada && (
            <div 
              className={`mobile-backdrop ${showMobileNotebook ? 'visible' : ''}`}
              onClick={() => setShowMobileNotebook(false)}
            ></div>
          )}

          <div className="guiado-layout">
            <div className={`cuaderno-sidebar ${showMobileNotebook ? 'open' : ''}`}>
              <div className="sidebar-mobile-header">
                  <span className="sidebar-mobile-title">📒 NOTAS DEL CASO</span>
                  <button className="btn-minimizar" onClick={() => setShowMobileNotebook(false)}>
                    <span>▼</span> CERRAR
                  </button>
               </div>
              <Cuaderno sospechosos={SOSPECHOSOS} mostrarBoton={investigacionIniciada} />
            </div>

            <div id="pistas-container">
              {!investigacionIniciada ? (
                <div className="briefing-suspects">
                  <h1>ARCHIVOS DESCLASIFICADOS</h1>
                  <p>Accede a los expedientes uno por uno...</p>
                  
                  {/* ... (LISTA DE SOSPECHOSOS IGUAL QUE ANTES) ... */}
                  <div className="suspects-list-container">
                    {SOSPECHOSOS.map((s, index) => {
                        /* ... Tu lógica de botones de expediente ... */
                        let btnClass = "btn-expediente";
                        let label = "";
                        if (index <= sospechosoActual) { btnClass += " unlocked"; label = "ACCESS GRANTED: "; } 
                        else if (index === sospechosoActual + 1) { btnClass += " next"; label = "LOCKED: "; } 
                        else { btnClass += " locked"; label = "LOCKED: "; }

                        return (
                        <div key={s.nombre}>
                            <button
                            className={btnClass}
                            onClick={() => index === sospechosoActual + 1 && setSospechosoActual((prev) => prev + 1)}
                            disabled={index > sospechosoActual + 1}
                            >
                            {label} {s.nombre}
                            </button>
                            {index <= sospechosoActual && (
                            <div className="suspect-detail-card">
                                <strong><span className="animate-blink" style={{ color: "var(--amber)" }}>SCAN</span></strong>
                                <p>{s.bio}</p>
                            </div>
                            )}
                        </div>
                        );
                    })}
                  </div>

                  {sospechosoActual === SOSPECHOSOS.length - 1 && (
                    <button className="btn-iniciar-investigacion-final" onClick={() => setInvestigacionIniciada(true)}>
                      INICIAR INVESTIGACIÓN
                    </button>
                  )}
                </div>
              ) : (
                pistasReales.slice(0, pistasCompletadas + 1).map((pista, i) => (
                    <PistaCard key={i} pista={pista} index={i} onCompletar={handlePistaCompletada} />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default GuiadoPage;