# ✅ Verificación Completa - Paso a Paso

## 📋 Contenido Correcto del .env

Tu archivo `.env` debe tener exactamente esto:

```env
PORT=3000
DATABASE_URL=postgresql://neondb_owner:npg_E4b3LfDnpVAs@ep-patient-dew-a4zwqdrx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# WhatsApp Business API
WHATSAPP_VERIFY_TOKEN=chatbot_inmobiliaria_2024
WHATSAPP_ACCESS_TOKEN=EAAMbMyfQZAGcBQfXZAeyNvvkKjg5Oh4K56NbKkWROYc8jdYbx738za0j3qDrBFCS1wsv9SYZBG5FXLQCNAPHdyBv5HXZCwjEhi03GX0zy8KFEQhD6KfIZB5Ye9x3xIZAag5eYvsMWChnwMZCKeOefmDRy4gpTJjy2bE8r3I4lZB9epUvWT13Me8IlSDUG1GDGOPRFotML6bh9lLpq4zghG8SUZAmUVNAtFyhutXbTQLRmlZCeZCsKaTImwlBxz7h0ZCmaYVfjkseDUevuNdRf372Fy4YXUgZD
WHATSAPP_PHONE_NUMBER_ID=878773181991861
```

**Verifica que:**
- ✅ No haya espacios extra
- ✅ No haya comillas alrededor de los valores
- ✅ Cada variable esté en una línea separada

---

## 🔄 PASO 1: Reiniciar el Servidor

**IMPORTANTE:** El servidor debe reiniciarse para leer el `.env`.

1. **Ve a la terminal donde corre `npm run dev`**
2. **Presiona Ctrl+C** para detenerlo
3. **Espera 2 segundos**
4. **Ejecuta de nuevo:**
   ```bash
   npm run dev
   ```

**Deberías ver:**
```
🔄 Inicializando base de datos...
✅ Base de datos inicializada correctamente
🚀 Chatbot inmobiliario iniciado en puerto 3000
```

**Si ves errores**, avísame.

---

## ✅ PASO 2: Verificar que el Servidor Funciona

**Abre en tu navegador:**
```
http://localhost:3000/health
```

**Deberías ver:**
```json
{"status":"ok","timestamp":"2025-12-23T..."}
```

**Si funciona** → Continúa al paso 3
**Si no funciona** → El servidor no está corriendo correctamente

---

## ✅ PASO 3: Verificar ngrok

**En la terminal de ngrok**, deberías ver:

```
Forwarding  https://48712bbc1a7c.ngrok-free.app -> http://localhost:3000
```

**Si ngrok NO está corriendo:**
1. Abre una terminal nueva
2. Ve a la carpeta de ngrok: `cd C:\Users\leona\Downloads\ngrok-v3-stable-windows-amd64`
3. Ejecuta: `ngrok http 3000`
4. Copia la URL (puede ser diferente a la anterior)

---

## ✅ PASO 4: Probar el Webhook en el Navegador

**Abre en tu navegador** (reemplaza con tu URL de ngrok si es diferente):

```
https://48712bbc1a7c.ngrok-free.app/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=chatbot_inmobiliaria_2024&hub.challenge=test123
```

**Resultados posibles:**

✅ **Si ves `test123`** → El webhook funciona perfectamente, continúa al paso 5

❌ **Si ves "Forbidden"** → 
- Verifica que el servidor esté corriendo
- Verifica que el `.env` tenga el token correcto
- Reinicia el servidor de nuevo

⚠️ **Si ves una página de ngrok** → 
- Click en "Visit Site" o "Continuar"
- Luego prueba de nuevo

---

## ✅ PASO 5: Verificar en Meta

1. **Ve a Meta → Configuración → Webhook**
2. **Verifica la URL:**
   - Debe ser: `https://48712bbc1a7c.ngrok-free.app/webhook/whatsapp`
   - (O tu URL actual de ngrok si cambió)
3. **Verifica el Token:**
   - Debe ser: `chatbot_inmobiliaria_2024`
4. **Click en "Verificar y guardar"** (botón azul)

**Resultados:**

✅ **Si ves un mensaje verde "Verificado"** → ¡Perfecto! Continúa al paso 6

❌ **Si sigue el error rojo** → 
- Verifica que el paso 4 haya funcionado (debe mostrar `test123`)
- Verifica que ngrok y el servidor estén corriendo
- Intenta de nuevo

---

## ✅ PASO 6: Probar el Chatbot

Una vez que el webhook esté verificado:

1. **Abre WhatsApp** en tu teléfono
2. **Envía un mensaje** al número: `+1 555 151 3807`
3. **Escribe**: `Hola`
4. **Deberías recibir** la respuesta del chatbot:

```
👋 Hola, soy el asistente virtual de *Inmobiliaria en Equipo*

¿En qué puedo ayudarte?

[Botones: Alquilar, Comprar, Vender, Tasación, Hablar con asesor]
```

---

## ✅ Checklist Final:

- [ ] `.env` verificado y correcto
- [ ] Servidor reiniciado y corriendo
- [ ] `/health` funciona en el navegador
- [ ] ngrok corriendo
- [ ] Webhook responde `test123` en el navegador
- [ ] Webhook verificado en Meta
- [ ] Mensaje de prueba enviado desde WhatsApp

---

## 🚀 Empieza Ahora:

1. **Reinicia el servidor** (Paso 1)
2. **Prueba `/health`** (Paso 2)
3. **Prueba el webhook** (Paso 4)
4. **Verifica en Meta** (Paso 5)

**¿En qué paso estás?** Dime qué ves y te ayudo a continuar.


