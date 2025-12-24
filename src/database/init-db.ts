/**
 * Script para inicializar la base de datos
 * Ejecutar con: npm run init-db o ts-node src/database/init-db.ts
 */

import { initializeDatabase } from './init';

async function main() {
  console.log('🔄 Inicializando base de datos...');
  const success = await initializeDatabase();
  
  if (success) {
    console.log('✅ Base de datos inicializada correctamente');
    process.exit(0);
  } else {
    console.error('❌ Error inicializando base de datos');
    process.exit(1);
  }
}

main();


