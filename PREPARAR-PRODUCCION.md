# 🚀 Preparación para Producción

## ✅ Checklist Pre-Despliegue

- [x] Código compilado (`npm run build`)
- [x] Archivos de configuración creados (Procfile, vercel.json, railway.json)
- [x] Widget actualizado para detectar URL automáticamente
- [x] Variables de entorno documentadas (.env.example)

## 📦 Archivos Creados para Producción

1. **Procfile** - Para Heroku
2. **vercel.json** - Para Vercel
3. **railway.json** - Para Railway
4. **DEPLOY.md** - Guía completa de despliegue
5. **.env.example** - Ejemplo de variables de entorno

## 🔄 Pasos para Subir a Producción

### Opción 1: Railway (Más Fácil - Recomendado)

1. **Sube el código a GitHub:**
   ```bash
   git add .
   git commit -m "Preparado para producción"
   git push origin main
   ```

2. **Ve a Railway:**
   - Visita [railway.app](https://railway.app)
   - Crea cuenta y proyecto nuevo
   - Conecta tu repositorio de GitHub

3. **Configura la Base de Datos:**
   - Agrega un servicio PostgreSQL
   - Railway generará automáticamente `DATABASE_URL`

4. **Configura Variables de Entorno:**
   - En el dashboard de Railway, ve a Variables
   - Agrega:
     - `OPENAI_API_KEY` (si usas IA)
     - `PERPLEXITY_API_KEY` (opcional)
     - `AI_PROVIDER=openai` (opcional)

5. **Despliega:**
   - Railway detectará automáticamente el proyecto
   - Se compilará y desplegará automáticamente
   - Obtendrás una URL como: `tu-proyecto.railway.app`

6. **Inicializa la Base de Datos:**
   - La base de datos se inicializará automáticamente al iniciar
   - O ejecuta manualmente: `npm run init-db` en el terminal de Railway

### Opción 2: Render

1. Ve a [render.com](https://render.com)
2. Crea un nuevo Web Service
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
5. Agrega una base de datos PostgreSQL
6. Configura las variables de entorno
7. Despliega

### Opción 3: Heroku

```bash
# Instalar Heroku CLI
heroku login

# Crear app
heroku create tu-app-name

# Agregar PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Configurar variables
heroku config:set OPENAI_API_KEY=tu-key
heroku config:set PERPLEXITY_API_KEY=tu-key

# Desplegar
git push heroku main
```

## 🔗 Después del Despliegue

1. **Obtén tu URL de producción:**
   - Railway: `https://tu-proyecto.railway.app`
   - Render: `https://tu-app.onrender.com`
   - Heroku: `https://tu-app.herokuapp.com`

2. **Actualiza el widget en tu sitio web:**
   ```html
   <script src="https://tu-url-produccion.com/chatbot-widget.js"></script>
   ```

3. **Prueba los endpoints:**
   - Chatbot: `https://tu-url.com/`
   - Admin: `https://tu-url.com/admin.html`
   - API: `https://tu-url.com/api/web/chat`

## ⚠️ Importante

- **NUNCA** subas el archivo `.env` a GitHub
- **SIEMPRE** configura las variables de entorno en la plataforma
- **VERIFICA** que la base de datos esté accesible desde internet
- **PRUEBA** todos los flujos después del despliegue

## 🐛 Troubleshooting

Si algo no funciona:
1. Revisa los logs en la plataforma de hosting
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que la base de datos esté inicializada
4. Revisa que el puerto esté configurado correctamente

