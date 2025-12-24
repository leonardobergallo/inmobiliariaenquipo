import { Pool, PoolConfig } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

// Configuración de conexión a PostgreSQL (Neon)
const connectionString = process.env.DATABASE_URL || 
  'postgresql://neondb_owner:npg_E4b3LfDnpVAs@ep-patient-dew-a4zwqdrx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const poolConfig: PoolConfig = {
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Requerido para Neon
  },
  max: 20, // Máximo de conexiones en el pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Crear pool de conexiones
export const pool = new Pool(poolConfig);

// Manejar errores del pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Función para probar la conexión
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Conexión a PostgreSQL exitosa:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error);
    return false;
  }
}

// Función para ejecutar queries
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error', { text, error });
    throw error;
  }
}

// Función para obtener un cliente del pool
export async function getClient() {
  return await pool.connect();
}


