// src/components/ThemeToggle.jsx
import React from 'react';

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle-btn"
      title="Cambiar Modo de Visión"
    >
      {theme === 'dark' ? '☀ MODO CLARO' : '☾ MODO OSCURO'}
    </button>
  );
}

export default ThemeToggle;