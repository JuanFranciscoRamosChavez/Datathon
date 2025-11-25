// src/hooks/useAutoScroll.js
import { useEffect } from 'react';

/**
 * Este hook fuerza el scroll hacia arriba cada vez que algo importante cambia.
 * @param {Array} dependencies - (Opcional) Variables que, al cambiar, disparan el scroll.
 */
export function useAutoScroll(dependencies = []) {
  useEffect(() => {
    // 1. Intentar scrollear la ventana principal (por si acaso)
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 2. Buscar TODOS los contenedores que podrían tener scroll interno
    // Agregamos todas las clases/IDs que hemos usado en tu CSS
    const contenedores = document.querySelectorAll(
      '#guiado, .registro-screen, .leaderboard-screen, .page, .final-dramatico-content, .modal-content'
    );

    // 3. Forzar el scroll a 0 en cada uno de ellos
    contenedores.forEach((contenedor) => {
      if (contenedor) {
        contenedor.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

  }, dependencies); // Se ejecuta cuando cambian las dependencias que le pases
}