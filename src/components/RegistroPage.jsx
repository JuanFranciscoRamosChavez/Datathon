// src/components/RegistroPage.jsx
import React, { useState } from "react";
import { GOOGLE_SCRIPT_URL } from '../constants';

function RegistroPage({ onRegistroCompletado }) {
  const [formData, setFormData] = useState({
    correo: "",
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    semestre: "",
    carrera: "",
  });

  const [aceptado, setAceptado] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!aceptado) {
      alert("Debes aceptar el aviso de privacidad para continuar.");
      return;
    }
    setIsSubmitting(true);

    const dataToSend = new FormData();
    Object.keys(formData).forEach((key) =>
      dataToSend.append(key, formData[key])
    );

    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: dataToSend,
      mode: "no-cors",
    })
      .then(() => {
        console.log("Datos enviados");
        localStorage.setItem("datathon_player", JSON.stringify(formData));
        setTimeout(() => onRegistroCompletado(formData), 500);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Guardando localmente.");
        localStorage.setItem("datathon_player", JSON.stringify(formData));
        onRegistroCompletado(formData);
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="registro-screen">
      <div className="registro-panel">
        <h1 className="registro-title font-geneva tracking-widest">
          🕵️‍♂️ ACCESO AL SISTEMA
        </h1>
        <p className="registro-subtitle">
          Identifíquese para iniciar la investigación
        </p>

        {/* Usamos el Grid CSS definido arriba */}
        <form onSubmit={handleSubmit} className="registro-form">
          {/* CORREO: Clase full-width para que ocupe todo en PC */}
          <div className="form-group full-width">
            <label className="font-geneva tracking-wide">
              📧 CORREO INSTITUCIONAL
            </label>
            <input
              type="email"
              name="correo"
              required
              placeholder="alumno@comunidad.unam.mx"
              value={formData.correo}
              onChange={handleChange}
              disabled={isSubmitting}
              className="font-geneva"
            />
          </div>

          {/* NOMBRES: Clase full-width */}
          <div className="form-group full-width">
            <label className="font-geneva tracking-wide">👤 NOMBRES</label>
            <input
              type="text"
              name="nombres"
              required
              value={formData.nombres}
              onChange={handleChange}
              disabled={isSubmitting}
              className="font-geneva uppercase"
            />
          </div>

          {/* APELLIDOS: Sin clase full-width, compartirán fila en PC */}
          <div className="form-group">
            <label className="font-geneva tracking-wide">
              🧬 APELLIDO PATERNO
            </label>
            <input
              type="text"
              name="apellidoPaterno"
              required
              value={formData.apellidoPaterno}
              onChange={handleChange}
              disabled={isSubmitting}
              className="font-geneva uppercase"
            />
          </div>
          <div className="form-group">
            <label className="font-geneva tracking-wide">
              🧬 APELLIDO MATERNO
            </label>
            <input
              type="text"
              name="apellidoMaterno"
              required
              value={formData.apellidoMaterno}
              onChange={handleChange}
              disabled={isSubmitting}
              className="font-geneva uppercase"
            />
          </div>

          {/* SEMESTRE Y CARRERA: Comparten fila en PC */}
          <div className="form-group">
            <label className="font-geneva tracking-wide">🎓 SEMESTRE</label>
            <select
              name="semestre"
              required
              value={formData.semestre}
              onChange={handleChange}
              disabled={isSubmitting}
              className="font-geneva"
            >
              <option value="">Selecciona...</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n}º
                </option>
              ))}
              <option value="graduado">Egresado</option>
            </select>
          </div>

          <div className="form-group">
            <label className="font-geneva tracking-wide">🏫 CARRERA</label>
            <select
              name="carrera"
              required
              value={formData.carrera}
              onChange={handleChange}
              disabled={isSubmitting}
              className="font-geneva"
            >
              <option value="Actuaría">Actuaría</option>

              <option value="Arquitectura">Arquitectura</option>

              <option value="Ciencia de Datos">Ciencia de Datos</option>

              <option value="Ciencias Políticas y Administración Pública">
                Ciencias Políticas y Administración Pública
              </option>

              <option value="Comunicación">Comunicación</option>

              <option value="Derecho">Derecho</option>

              <option value="Diseño Gráfico">Diseño Gráfico</option>

              <option value="Economía">Economía</option>

              <option value="Enseñanza de Alemán como Lengua Extranjera">
                Enseñanza de Alemán como Lengua Extranjera
              </option>

              <option value="Enseñanza de Español como Lengua Extranjera">
                Enseñanza de Español como Lengua Extranjera
              </option>

              <option value="Enseñanza de Francés como Lengua Extranjera">
                Enseñanza de Francés como Lengua Extranjera
              </option>

              <option value="Enseñanza de Inglés como Lengua Extranjera">
                Enseñanza de Inglés como Lengua Extranjera
              </option>

              <option value="Enseñanza de Italiano como Lengua Extranjera">
                Enseñanza de Italiano como Lengua Extranjera
              </option>

              <option value="Filosofía">Filosofía</option>

              <option value="Historia">Historia</option>

              <option value="Ingeniería Civil">Ingeniería Civil</option>

              <option value="Lengua y Literatura Hispánicas">
                Lengua y Literatura Hispánicas
              </option>

              <option value="Matemáticas Aplicadas y Computación">
                Matemáticas Aplicadas y Computación (MAC)
              </option>

              <option value="Pedagogía">Pedagogía</option>

              <option value="Relaciones Internacionales">
                Relaciones Internacionales
              </option>

              <option value="Sociología">Sociología</option>
              <option value="Visitantes">Visitantes</option>
            </select>
          </div>

          <div className="privacidad-container">
            <label
              style={{
                display: "flex",
                alignItems: "start",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                required
                checked={aceptado}
                onChange={(e) => setAceptado(e.target.checked)}
                style={{
                  width: "20px",
                  height: "20px",
                  marginTop: "2px",
                  accentColor: "#f59e0b",
                }}
              />
              <span className="font-geneva text-xs tracking-wide text-gray-400">
                Acepto que mis datos serán utilizados{" "}
                <strong>únicamente</strong> para el registro del juego y fines
                estadísticos del Datathon.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="btn-ingresar font-geneva tracking-widest"
            disabled={isSubmitting || !aceptado}
            style={{ opacity: isSubmitting || !aceptado ? 0.5 : 1 }}
          >
            {isSubmitting ? "ENVIANDO DATOS..." : "INGRESAR AL SISTEMA"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegistroPage;
