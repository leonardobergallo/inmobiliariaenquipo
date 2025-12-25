# 🚀 Guía de Despliegue a Producción

## Opciones de Hosting

### 1. Railway (Recomendado para Node.js + PostgreSQL)

1. Ve a [railway.app](https://railway.app)
2. Crea una cuenta y un nuevo proyecto
3. Conecta tu repositorio de GitHub
4. Agrega una base de datos PostgreSQL
5. Configura las variables de entorno:
   - `DATABASE_URL` (se genera automáticamente)
   - `PORT` (opcional, Railway lo asigna)
   - `OPENAI_API_KEY` (si usas IA)
   - `PERPLEXITY_API_KEY` (si usas búsqueda de propiedades)
6. Railway detectará automáticamente el `railway.json` y desplegará

**URL del proyecto:** Se generará automáticamente (ej: `tu-proyecto.railway.app`)

---

### 2. Heroku

1. Instala Heroku CLI
2. Login: `heroku login`
3. Crea la app: `heroku create tu-app-name`
4. Agrega PostgreSQL: `heroku addons:create heroku-postgresql:hobby-dev`
5. Configura variables:
   ```bash
   heroku config:set OPENAI_API_KEY=tu-key
   heroku config:set PERPLEXITY_API_KEY=tu-key
   ```
6. Despliega: `git push heroku main`

---

### 3. Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu repositorio
3. Configura:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Agrega variables de entorno en el dashboard
5. **Nota:** Vercel requiere una base de datos externa (Neon, Supabase, etc.)

---

### 4. Render

1. Ve a [render.com](https://render.com)
2. Crea un nuevo Web Service
3. Conecta tu repositorio
4. Configura:
   - Build Command: `npm run build`
   - Start Command: `npm start`
5. Agrega una base de datos PostgreSQL
6. Configura las variables de entorno

---

## Variables de Entorno Necesarias

```env
# Base de datos (OBLIGATORIO)
DATABASE_URL=postgresql://usuario:password@host:5432/database

# Puerto (opcional, la plataforma lo asigna)
PORT=3000

# IA (opcional)
OPENAI_API_KEY=sk-proj-...
PERPLEXITY_API_KEY=pplx-...
AI_PROVIDER=openai
AI_MODEL=gpt-3.5-turbo

# WhatsApp (opcional)
WHATSAPP_VERIFY_TOKEN=...
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
```

---

## Pasos Previos al Despliegue

1. ✅ Compilar el proyecto: `npm run build`
2. ✅ Verificar que `dist/` tenga todos los archivos
3. ✅ Configurar variables de entorno en la plataforma
4. ✅ Actualizar URLs en `chatbot-widget.js` si es necesario

---

## Después del Despliegue

1. **Inicializar la base de datos:**
   - Ejecuta: `npm run init-db` en el servidor
   - O la base de datos se inicializará automáticamente al iniciar

2. **Actualizar URLs en tu sitio web:**
   - Cambia `localhost:3000` por tu URL de producción
   - Ejemplo: `https://tu-app.railway.app`

3. **Probar el chatbot:**
   - Visita: `https://tu-url.com`
   - Visita: `https://tu-url.com/admin.html`

---

## URLs Importantes

- **Chatbot Web:** `https://tu-url.com/`
- **Panel Admin:** `https://tu-url.com/admin.html`
- **Widget JS:** `https://tu-url.com/chatbot-widget.js`
- **API Base:** `https://tu-url.com/api/`

---

## Troubleshooting

### Error: "Cannot find module"
- Verifica que `npm install` se ejecutó en producción
- Asegúrate de que `package.json` tenga todas las dependencias

### Error: "Database connection failed"
- Verifica que `DATABASE_URL` esté configurada correctamente
- Asegúrate de que la base de datos esté accesible desde internet

### Error: "Port already in use"
- No configures `PORT` manualmente, déjalo que la plataforma lo asigne

