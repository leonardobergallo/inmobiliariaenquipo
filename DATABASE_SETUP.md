# 🗄️ Configuración de Base de Datos

## PostgreSQL con Neon

El proyecto está configurado para usar **Neon PostgreSQL** (PostgreSQL serverless en la nube).

## Cadena de Conexión

La cadena de conexión está configurada en:
- `src/database/connection.ts` (hardcoded como fallback)
- Variable de entorno `DATABASE_URL` (recomendado)

```env
DATABASE_URL=postgresql://neondb_owner:npg_E4b3LfDnpVAs@ep-patient-dew-a4zwqdrx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## Inicialización

### Opción 1: Automática (Recomendada)

El servidor inicializa la base de datos automáticamente al arrancar:

```bash
npm run dev
# o
npm start
```

### Opción 2: Manual

Ejecutar el script de inicialización:

```bash
npm run init-db
```

## Estructura de Tablas

### `leads`
Almacena todos los leads captados por el chatbot:
- Información de contacto (nombre, teléfono, WhatsApp)
- Interés (alquilar, comprar, vender, tasación)
- Criterios de búsqueda (zona, tipo, presupuesto, etc.)
- Estado del lead (nuevo, calificado, en_seguimiento, derivado)

### `chat_states`
Almacena el estado de conversaciones activas:
- Usuario ID
- Flujo actual
- Paso actual
- Datos recopilados (JSONB)
- Estado de completitud

### `messages`
Historial de mensajes (opcional, para auditoría):
- Mensajes del usuario
- Respuestas del bot
- Timestamps
- Canal (WhatsApp, Web, App)

## Verificar Conexión

Para verificar que la conexión funciona:

```typescript
import { testConnection } from './src/database/connection';

testConnection().then(connected => {
  console.log('Conectado:', connected);
});
```

## Migraciones Futuras

Para agregar nuevas tablas o modificar el schema:

1. Editar `src/database/schema.sql`
2. Ejecutar `npm run init-db` (las tablas existentes no se eliminarán)

## Backup

Neon proporciona backups automáticos. Para hacer un backup manual:

```bash
pg_dump $DATABASE_URL > backup.sql
```

## Troubleshooting

### Error: "connection refused"
- Verificar que la cadena de conexión sea correcta
- Verificar que Neon esté activo
- Verificar firewall/red

### Error: "relation does not exist"
- Ejecutar `npm run init-db` para crear las tablas

### Error: "SSL required"
- Asegurarse de que `sslmode=require` esté en la cadena de conexión


