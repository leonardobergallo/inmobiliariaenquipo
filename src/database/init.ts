import { readFileSync } from 'fs';
import { join } from 'path';
import { query, testConnection } from './connection';

/**
 * Inicializa la base de datos creando las tablas necesarias
 */
export async function initializeDatabase(): Promise<boolean> {
  try {
    // Probar conexión
    const connected = await testConnection();
    if (!connected) {
      return false;
    }

    // Ejecutar statements en orden
    const statements = [
      // Tabla de leads
      `CREATE TABLE IF NOT EXISTS leads (
        id VARCHAR(255) PRIMARY KEY,
        nombre VARCHAR(255),
        telefono VARCHAR(50),
        whatsapp VARCHAR(50),
        interes VARCHAR(50) NOT NULL,
        zona VARCHAR(255),
        tipo_propiedad VARCHAR(50),
        presupuesto INTEGER,
        presupuesto_max INTEGER,
        presupuesto_moneda VARCHAR(20),
        dormitorios INTEGER,
        fecha_ingreso VARCHAR(255),
        es_primera_vivienda BOOLEAN,
        compra_con_credito BOOLEAN,
        direccion VARCHAR(500),
        metros_cuadrados INTEGER,
        estado_propiedad VARCHAR(100),
        estado VARCHAR(50) NOT NULL DEFAULT 'nuevo',
        canal VARCHAR(50) NOT NULL DEFAULT 'whatsapp',
        notas TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,

      // Tabla de chat_states
      `CREATE TABLE IF NOT EXISTS chat_states (
        user_id VARCHAR(255) PRIMARY KEY,
        current_step VARCHAR(255) NOT NULL DEFAULT 'start',
        flow VARCHAR(50),
        data JSONB DEFAULT '{}',
        waiting_for VARCHAR(255),
        completed BOOLEAN NOT NULL DEFAULT FALSE,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,

      // Tabla de messages
      `CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        from_bot BOOLEAN NOT NULL DEFAULT FALSE,
        channel VARCHAR(50) NOT NULL DEFAULT 'whatsapp'
      )`,

      // Índices
      `CREATE INDEX IF NOT EXISTS idx_leads_estado ON leads(estado)`,
      `CREATE INDEX IF NOT EXISTS idx_leads_interes ON leads(interes)`,
      `CREATE INDEX IF NOT EXISTS idx_leads_telefono ON leads(telefono)`,
      `CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at)`,
      `CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp)`,

      // Función para actualizar updated_at
      `CREATE OR REPLACE FUNCTION update_updated_at_column()
       RETURNS TRIGGER AS $$
       BEGIN
         NEW.updated_at = CURRENT_TIMESTAMP;
         RETURN NEW;
       END;
       $$ language 'plpgsql'`,

      // Triggers
      `DROP TRIGGER IF EXISTS update_leads_updated_at ON leads`,
      `CREATE TRIGGER update_leads_updated_at
       BEFORE UPDATE ON leads
       FOR EACH ROW
       EXECUTE FUNCTION update_updated_at_column()`,

      `DROP TRIGGER IF EXISTS update_chat_states_updated_at ON chat_states`,
      `CREATE TRIGGER update_chat_states_updated_at
       BEFORE UPDATE ON chat_states
       FOR EACH ROW
       EXECUTE FUNCTION update_updated_at_column()`,
    ];

    // Ejecutar cada statement
    for (const statement of statements) {
      try {
        await query(statement);
      } catch (error: any) {
        // Ignorar errores de "already exists" pero mostrar otros
        const errorMsg = error.message || '';
        if (
          !errorMsg.includes('already exists') && 
          !errorMsg.includes('duplicate') &&
          !errorMsg.includes('does not exist')
        ) {
          console.warn('Warning executing statement:', errorMsg.substring(0, 150));
        }
      }
    }

    console.log('✅ Base de datos inicializada correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    return false;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initializeDatabase()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}
