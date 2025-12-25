# 🔧 Configuración del Backend en Vercel

## El Problema

En Vercel, el backend se despliega como **funciones serverless**. No es un servidor tradicional que corre 24/7, sino que se ejecuta bajo demanda cuando hay una petición.

## ✅ Solución

El proyecto ya está configurado correctamente:

1. **`api/index.js`** - Wrapper que exporta la app de Express como función serverless
2. **`vercel.json`** - Configuración de rutas y build
3. **`src/index.ts`** - Exporta la app para Vercel

## 📋 Pasos para Desplegar el Backend

### 1. Asegúrate de que el código esté en GitHub

```bash
git add .
git commit -m "Fix: Frontend detecta URL automáticamente"
git push origin main
```

### 2. En Vercel Dashboard

1. Ve a tu proyecto en Vercel
2. Ve a **Settings > General**
3. Verifica que:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
   - **Root Directory:** `.` (raíz del proyecto)

### 3. Configurar Variables de Entorno

En **Settings > Environment Variables**, agrega:

**OBLIGATORIA:**
- `DATABASE_URL` = Tu URL de PostgreSQL

**OPCIONALES:**
- `OPENAI_API_KEY`
- `PERPLEXITY_API_KEY`
- `AI_PROVIDER=openai`

### 4. Redesplegar

1. Ve a **Deployments**
2. Haz clic en los 3 puntos del último deployment
3. Selecciona **Redeploy**
4. O simplemente haz un nuevo push a GitHub

## 🔍 Verificar que Funciona

1. Ve a **Functions** en Vercel
2. Deberías ver `api/index.js` listado
3. Haz clic para ver los logs
4. Prueba visitando: `https://tu-proyecto.vercel.app/health`

## ⚠️ Importante

- El backend se compila automáticamente durante el build
- La base de datos se inicializa al primer request
- Si hay errores, revisa los logs en **Functions > api/index.js**

## 🐛 Troubleshooting

### Error: "Cannot find module '../dist/index.js'"
- Verifica que `npm run build` se ejecute correctamente
- Revisa los logs de build en Vercel

### Error: "Database connection failed"
- Verifica que `DATABASE_URL` esté configurada
- Asegúrate de que la base de datos permita conexiones externas

### Error: "Function timeout"
- Las funciones tienen un timeout de 10 segundos (gratis) o 60 segundos (pro)
- Si la inicialización de la DB tarda mucho, puede fallar
- Considera inicializar la DB manualmente antes

