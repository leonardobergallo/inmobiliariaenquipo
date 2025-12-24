# 📱 Pasos para Conectar WhatsApp - Guía Rápida

## 🎯 Resumen Rápido

Para conectar tu chatbot a WhatsApp necesitas:
1. **Número de WhatsApp Business** (puede ser el tuyo)
2. **Cuenta en Meta for Developers** (gratis)
3. **Configurar webhook** (URL donde WhatsApp enviará mensajes)
4. **Credenciales** (tokens de acceso)

---

## 📋 Paso a Paso (15 minutos)

### Paso 1: Crear App en Meta (5 min)

1. Ve a: https://developers.facebook.com/
2. Click en **"My Apps"** → **"Create App"**
3. Selecciona tipo: **"Business"**
4. Completa nombre y email
5. Click en **"Create App"**

### Paso 2: Agregar WhatsApp (2 min)

1. En el dashboard de tu App, busca **"WhatsApp"**
2. Click en **"Set up"**
3. Te llevará a la configuración de WhatsApp

### Paso 3: Obtener Credenciales (3 min)

En la sección **"API Setup"** verás:

1. **Phone Number ID**: 
   - Ejemplo: `123456789012345`
   - Cópialo

2. **Temporary Access Token**:
   - Click en **"Generate token"**
   - Cópialo (solo dura 24 horas, luego necesitas uno permanente)

3. **Verify Token**:
   - **TÚ lo creas** (puede ser cualquier texto)
   - Ejemplo: `mi_token_secreto_123`
   - **Anótalo bien**, lo necesitarás

### Paso 4: Configurar .env (2 min)

Crea/edita el archivo `.env` en la raíz del proyecto:

```env
PORT=3000
DATABASE_URL=postgresql://neondb_owner:npg_E4b3LfDnpVAs@ep-patient-dew-a4zwqdrx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# WhatsApp Cloud API
WHATSAPP_VERIFY_TOKEN=mi_token_secreto_123
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
```

**Reemplaza**:
- `mi_token_secreto_123` → El verify token que creaste
- `EAAxxxx...` → Tu Access Token
- `123456789012345` → Tu Phone Number ID

### Paso 5: Exponer tu Servidor (3 min)

WhatsApp necesita una URL HTTPS. Para pruebas usa **ngrok**:

#### Instalar ngrok:
1. Descarga: https://ngrok.com/download
2. Extrae el .exe
3. Agrega a PATH o úsalo desde la carpeta

#### Exponer servidor:
```bash
# En una terminal nueva (deja el servidor corriendo)
ngrok http 3000
```

Verás algo como:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

**Copia la URL HTTPS** (ej: `https://abc123.ngrok.io`)

### Paso 6: Configurar Webhook en Meta (2 min)

1. En Meta Developers → Tu App → WhatsApp → Configuration
2. En **"Webhook"**:
   - **Callback URL**: `https://abc123.ngrok.io/webhook/whatsapp`
   - **Verify Token**: `mi_token_secreto_123` (el que creaste)
3. Click en **"Verify and Save"**
4. Si dice "Verified" ✅ → ¡Listo!

### Paso 7: Agregar Número de Prueba

1. En **"To"** (dentro de WhatsApp setup)
2. Agrega tu número de WhatsApp (el que quieres usar para probar)
3. Te llegará un código, ingrésalo
4. ✅ Tu número queda agregado

### Paso 8: Probar

1. **Inicia tu servidor**:
   ```bash
   npm run dev
   ```

2. **Abre ngrok** (en otra terminal):
   ```bash
   ngrok http 3000
   ```

3. **Envía un mensaje** desde tu WhatsApp al número de prueba
4. **Deberías recibir respuesta** del chatbot

---

## 🔧 Solución de Problemas

### ❌ "Webhook verification failed"
- Verifica que el Verify Token sea exactamente el mismo
- Verifica que la URL sea HTTPS
- Verifica que ngrok esté corriendo

### ❌ "Access token expired"
- El token temporal dura 24 horas
- Genera uno nuevo en Meta Developers
- O configura un token permanente (más complejo)

### ❌ "No recibo mensajes"
- Verifica que ngrok esté corriendo
- Verifica que el servidor esté corriendo
- Verifica los logs del servidor
- Verifica que el número esté agregado en Meta

### ❌ "Error 403"
- Verifica que el Access Token sea válido
- Verifica que el Phone Number ID sea correcto

---

## 🚀 Para Producción

Cuando estés listo para producción:

1. **Token Permanente**: Configura un token de larga duración
2. **Deploy en Cloud**: 
   - Vercel (gratis): https://vercel.com
   - Railway (gratis): https://railway.app
   - Render (gratis): https://render.com
3. **Dominio propio**: Usa tu dominio con HTTPS
4. **Actualizar webhook**: Cambia la URL en Meta

---

## 📞 Formato de Número

WhatsApp usa este formato:
- **Argentina**: `5491112345678` (54 = código país, 9 = móvil, 11 = área, resto = número)
- **Sin espacios, sin guiones, sin +**

Ejemplo:
- Tu número: `+54 9 11 1234-5678`
- Para WhatsApp: `5491112345678`

---

## ✅ Checklist Final

- [ ] App creada en Meta for Developers
- [ ] WhatsApp agregado a la App
- [ ] Credenciales copiadas (Phone Number ID, Access Token)
- [ ] Verify Token creado y anotado
- [ ] `.env` configurado con todas las credenciales
- [ ] Servidor corriendo (`npm run dev`)
- [ ] ngrok corriendo y URL copiada
- [ ] Webhook configurado en Meta
- [ ] Número de prueba agregado
- [ ] Mensaje de prueba enviado y recibido

---

¿Necesitas ayuda con algún paso específico?

