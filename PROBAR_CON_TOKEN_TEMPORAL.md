# ✅ Probar con Token Temporal

## 🎯 SÍ, puedes probar con el token temporal

El token temporal dura **60 minutos** - suficiente para probar tu chatbot.

---

## 📋 Lo que Necesitas:

1. ✅ **Access Token** - Ya lo tienes (el temporal)
2. ⏳ **Phone Number ID** - Lo necesitas de "Configuración"
3. ⏳ **Verify Token** - Lo creas tú
4. ⏳ **Webhook configurado** - Para recibir mensajes

---

## 🚀 Pasos para Probar:

### Paso 1: Obtener Phone Number ID

1. Ve a **"Configuración"** en el menú lateral
2. Busca **"API Setup"** o **"Configuración de API"**
3. Copia el **"Phone Number ID"** (ej: `123456789012345`)

### Paso 2: Crear Verify Token

Crea cualquier texto, ejemplo:
- `mi_token_123`
- `chatbot_inmobiliaria_2024`
- `test_whatsapp`

**Anótalo bien** - lo necesitarás.

### Paso 3: Configurar .env

Abre/edita el archivo `.env` en tu proyecto:

```env
PORT=3000
DATABASE_URL=postgresql://neondb_owner:npg_E4b3LfDnpVAs@ep-patient-dew-a4zwqdrx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# WhatsApp (con token temporal)
WHATSAPP_VERIFY_TOKEN=mi_token_123
WHATSAPP_ACCESS_TOKEN=EAAMbMyfQZAGcBQZA66jN4zTw2FYoDnKYtVPZBWamuiSYCOiaZAP4JSdKfBx6ZAdCIUUjkz2NbIQZ
WHATSAPP_PHONE_NUMBER_ID=123456789012345
```

**Reemplaza:**
- `mi_token_123` → Tu Verify Token
- `EAAMbMyf...` → Tu Access Token (el que copiaste)
- `123456789012345` → Tu Phone Number ID (de Configuración)

### Paso 4: Exponer tu Servidor con HTTPS

Para que WhatsApp pueda enviarte mensajes, necesitas HTTPS:

#### Opción A: ngrok (Más fácil para pruebas)

1. **Descarga ngrok**: https://ngrok.com/download
2. **Extrae el .exe** en una carpeta
3. **Abre terminal** en esa carpeta
4. **Ejecuta:**
   ```bash
   ngrok http 3000
   ```
5. **Copia la URL HTTPS** que te da (ej: `https://abc123.ngrok.io`)

### Paso 5: Configurar Webhook en Meta

1. Ve a **"Configuración"** en Meta
2. Busca la sección **"Webhook"** o **"Configuration"**
3. **Callback URL**: `https://tu-url-ngrok.ngrok.io/webhook/whatsapp`
4. **Verify Token**: El que creaste (ej: `mi_token_123`)
5. Click en **"Verify and Save"**

### Paso 6: Agregar Número de Prueba

1. En **"Prueba de API"** o **"Configuration"**
2. Busca **"To"** o **"Phone Numbers"**
3. Agrega tu número de WhatsApp (o el de un amigo para probar)
4. Te llegará un código, ingrésalo

### Paso 7: Probar

1. **Inicia tu servidor:**
   ```bash
   npm run dev
   ```

2. **Abre ngrok** (en otra terminal):
   ```bash
   ngrok http 3000
   ```

3. **Envía un mensaje** desde WhatsApp al número de prueba
4. **Deberías recibir respuesta** del chatbot

---

## ⚠️ Importante:

- El token temporal dura **60 minutos**
- Si expira, genera uno nuevo en "Prueba de API"
- Para producción, necesitarás un token permanente

---

## ✅ Checklist Rápido:

- [ ] Phone Number ID copiado
- [ ] Verify Token creado
- [ ] `.env` configurado
- [ ] ngrok corriendo
- [ ] Webhook configurado en Meta
- [ ] Número de prueba agregado
- [ ] Servidor corriendo
- [ ] Mensaje de prueba enviado

---

## 🎯 ¿Listo para Probar?

Sigue los pasos arriba y podrás probar tu chatbot en tiempo real con WhatsApp.


