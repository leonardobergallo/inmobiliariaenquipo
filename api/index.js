// Wrapper para Vercel - Exporta la app de Express como función serverless
// Vercel ejecutará este archivo como una función serverless

// Importar la app compilada
// Como TypeScript compila a CommonJS, necesitamos importar directamente
const path = require('path');

// Cargar variables de entorno
require('dotenv').config();

// Importar la app desde el archivo compilado
// El archivo dist/index.js exporta la app como default
let app;

try {
  // El código compilado exporta la app como module.exports.default
  const indexModule = require('../dist/index.js');
  
  // La app puede estar en default o directamente exportada
  if (indexModule.default) {
    app = indexModule.default;
  } else if (typeof indexModule === 'function') {
    app = indexModule;
  } else {
    // Si no encontramos la app, crear una básica
    throw new Error('App not found in module');
  }
} catch (error) {
  console.error('❌ Error importing app:', error);
  console.error('Stack:', error.stack);
  
  // Fallback: crear una app básica de Express
  const express = require('express');
  app = express();
  app.use(express.json());
  app.get('*', (req, res) => {
    res.status(500).json({ 
      error: 'Error loading application',
      message: error.message,
      details: 'Check Vercel logs for more information'
    });
  });
}

// Exportar como handler de Vercel
module.exports = app;

