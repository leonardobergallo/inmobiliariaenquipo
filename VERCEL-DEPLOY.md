# 🚀 Despliegue en Vercel

## Pasos para Desplegar

### 1. Preparar el Proyecto

El proyecto ya está configurado para Vercel. Solo necesitas:

1. **Asegurarte de que el código esté en GitHub:**
   ```bash
   git add .
   git commit -m "Configurado para Vercel"
   git push origin main
   ```

### 2. Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) y crea una cuenta (o inicia sesión)
2. Haz clic en **"Add New Project"**
3. Conecta tu repositorio de GitHub (`leonardobergallo/inmobiliariaenquipo`)
4. Vercel detectará automáticamente la configuración

### 3. Configurar Variables de Entorno

En el dashboard de Vercel, ve a **Settings > Environment Variables** y agrega:

**OBLIGATORIAS:**
- `DATABASE_URL` - URL de tu base de datos PostgreSQL
  - Ejemplo: `postgresql://usuario:password@host:5432/database?sslmode=require`

**OPCIONALES (para IA):**
- `OPENAI_API_KEY` - Tu clave de API de OpenAI
- `PERPLEXITY_API_KEY` - Tu clave de API de Perplexity
- `AI_PROVIDER` - `openai` o `perplexity`
- `AI_MODEL` - `gpt-3.5-turbo` (por defecto)
- `AI_TEMPERATURE` - `0.7` (por defecto)

**OPCIONALES (para WhatsApp):**
- `WHATSAPP_VERIFY_TOKEN`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`

### 4. Configurar Build Settings

Vercel debería detectar automáticamente:
- **Framework Preset:** Other
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

Si no lo detecta, configúralo manualmente.

### 5. Desplegar

1. Haz clic en **"Deploy"**
2. Vercel compilará y desplegará tu proyecto
3. Obtendrás una URL como: `tu-proyecto.vercel.app`

### 6. Inicializar Base de Datos

La base de datos se inicializará automáticamente al primer request. Si necesitas inicializarla manualmente:

1. Ve a la pestaña **Functions** en Vercel
2. Abre la consola de la función
3. Ejecuta: `npm run init-db`

O simplemente visita cualquier endpoint y la base de datos se inicializará automáticamente.

## 📝 Notas Importantes

### Base de Datos

- **Vercel NO proporciona bases de datos PostgreSQL**
- Necesitas una base de datos externa:
  - [Neon](https://neon.tech) - Gratis, PostgreSQL serverless
  - [Supabase](https://supabase.com) - Gratis, PostgreSQL con extras
  - [Railway](https://railway.app) - PostgreSQL fácil
  - [Heroku Postgres](https://www.heroku.com/postgres) - Pago

### Límites de Vercel

- **Funciones Serverless:** 10 segundos de timeout (plan gratuito)
- **Tamaño máximo:** 50MB (plan gratuito)
- **Ancho de banda:** 100GB/mes (plan gratuito)

### URLs después del Despliegue

- **Chatbot:** `https://tu-proyecto.vercel.app/`
- **Panel Admin:** `https://tu-proyecto.vercel.app/admin.html`
- **API:** `https://tu-proyecto.vercel.app/api/web/chat`
- **Health Check:** `https://tu-proyecto.vercel.app/health`

## 🔧 Troubleshooting

### Error: "Cannot find module"
- Verifica que `npm run build` se ejecutó correctamente
- Revisa los logs de build en Vercel

### Error: "Database connection failed"
- Verifica que `DATABASE_URL` esté configurada correctamente
- Asegúrate de que la base de datos permita conexiones externas
- Verifica que el SSL esté configurado (`sslmode=require`)

### Error: "Function timeout"
- Las funciones serverless tienen un timeout de 10 segundos
- Si la inicialización de la base de datos tarda mucho, considera inicializarla manualmente

### Error: "Module not found"
- Asegúrate de que todas las dependencias estén en `dependencies` (no `devDependencies`)
- Verifica que `package.json` tenga todas las dependencias necesarias

## 🎯 Próximos Pasos

1. Configura un dominio personalizado (opcional)
2. Configura webhooks de WhatsApp con tu URL de Vercel
3. Actualiza el widget en tu sitio web con la nueva URL
4. Prueba todos los flujos del chatbot

