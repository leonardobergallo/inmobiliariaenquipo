# 🔄 Reiniciar Todo - Paso a Paso

## 📋 Pasos para Reiniciar Todo:

---

## ✅ PASO 1: Detener Todo

1. **Terminal del Servidor:**
   - Presiona **Ctrl+C** para detener `npm run dev`
   - Espera a que se detenga completamente

2. **Terminal de ngrok:**
   - Presiona **Ctrl+C** para detener ngrok
   - Espera a que se detenga

---

## ✅ PASO 2: Verificar .env

**Abre el archivo `.env` en la raíz del proyecto** y verifica que tenga:

```env
PORT=3000
DATABASE_URL=postgresql://neondb_owner:npg_E4b3LfDnpVAs@ep-patient-dew-a4zwqdrx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# WhatsApp Business API
WHATSAPP_VERIFY_TOKEN=chatbot_inmobiliaria_2024
WHATSAPP_ACCESS_TOKEN=EAAMbMyfQZAGcBQfXZAeyNvvkKjg5Oh4K56NbKkWROYc8jdYbx738za0j3qDrBFCS1wsv9SYZBG5FXLQCNAPHdyBv5HXZCwjEhi03GX0zy8KFEQhD6KfIZB5Ye9x3xIZAag5eYvsMWChnwMZCKeOefmDRy4gpTJjy2bE8r3I4lZB9epUvWT13Me8IlSDUG1GDGOPRFotML6bh9lLpq4zghG8SUZAmUVNAtFyhutXbTQLRmlZCeZCsKaTImwlBxz7h0ZCmaYVfjkseDUevuNdRf372Fy4YXUgZD
WHATSAPP_PHONE_NUMBER_ID=878773181991861
```

---

## ✅ PASO 3: Iniciar el Servidor

**En una terminal nueva o la misma:**

1. **Ve a tu proyecto:**
   ```bash
   cd C:\Users\leona\Desktop\Inmobiliariaenequipo
   ```

2. **Inicia el servidor:**
   ```bash
   npm run dev
   ```

**Deberías ver:**
```
🔄 Inicializando base de datos...
✅ Base de datos inicializada correctamente
🚀 Chatbot inmobiliario iniciado en puerto 3000
📱 WhatsApp webhook: http://localhost:3000/webhook/whatsapp
```

**DEJA ESTO CORRIENDO** - No lo cierres

---

## ✅ PASO 4: Iniciar ngrok

**En OTRA terminal nueva:**

1. **Ve a la carpeta de ngrok:**
   ```bash
   cd C:\Users\leona\Downloads\ngrok-v3-stable-windows-amd64
   ```

2. **Inicia ngrok:**
   ```bash
   ngrok http 3000
   ```

**Deberías ver:**
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

**IMPORTANTE:** Copia la URL HTTPS que aparece (puede ser diferente a la anterior)

**DEJA ESTO CORRIENDO** - No lo cierres

---

## ✅ PASO 5: Verificar el Servidor

**Abre en tu navegador:**
```
http://localhost:3000/health
```

**Deberías ver:**
```json
{"status":"ok","timestamp":"2025-12-23T..."}
```

**Si funciona** → Continúa
**Si no funciona** → El servidor no está corriendo, revisa el paso 3

---

## ✅ PASO 6: Verificar ngrok

**Abre en tu navegador** (usa TU URL de ngrok):
```
https://tu-url-ngrok.ngrok.io/health
```

**Deberías ver:**
```json
{"status":"ok","timestamp":"2025-12-23T..."}
```

**Si ves página de ngrok:**
- Click en "Visit Site" o "Continuar"
- Luego prueba de nuevo

---

## ✅ PASO 7: Probar el Webhook

**Abre en tu navegador** (usa TU URL de ngrok):
```
https://tu-url-ngrok.ngrok.io/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=chatbot_inmobiliaria_2024&hub.challenge=test123
```

**Deberías ver:** `test123`

**Si ves "Forbidden":**
- Verifica que el servidor esté corriendo
- Verifica que el `.env` tenga el token correcto
- Reinicia el servidor

---

## ✅ PASO 8: Configurar Webhook en Meta

1. **Ve a Meta → Configuración → Webhook**

2. **URL de devolución de llamada:**
   - Usa TU URL de ngrok: `https://tu-url-ngrok.ngrok.io/webhook/whatsapp`

3. **Token de verificación:**
   - `chatbot_inmobiliaria_2024`

4. **Click en "Verificar y guardar"**

**Deberías ver:** Mensaje verde "Verificado" ✅

---

## ✅ PASO 9: Probar el Chatbot

1. **Abre WhatsApp** en tu teléfono
2. **Envía un mensaje** al número: `+1 555 151 3807`
3. **Escribe**: `Hola`
4. **Deberías recibir** la respuesta del chatbot

**En la terminal del servidor** deberías ver logs cuando recibes el mensaje.

---

## ✅ Checklist Final:

- [ ] Servidor corriendo (`npm run dev`)
- [ ] ngrok corriendo (`ngrok http 3000`)
- [ ] `/health` funciona en localhost
- [ ] `/health` funciona en ngrok
- [ ] Webhook responde `test123`
- [ ] Webhook verificado en Meta
- [ ] Mensaje de prueba enviado

---

## 🚀 Empieza Ahora:

1. **Detén todo** (Ctrl+C en ambas terminales)
2. **Inicia el servidor** (Paso 3)
3. **Inicia ngrok** (Paso 4)
4. **Sigue los pasos** en orden

**¿Listo para empezar?** Dime cuando hayas iniciado el servidor y ngrok.


