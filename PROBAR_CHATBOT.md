# ✅ Todo Listo para Probar

## ✅ Estado Actual:

- ✅ **Servidor corriendo** en puerto 3000
- ✅ **Base de datos conectada**
- ✅ **Chatbot listo**

---

## 🚀 Pasos para Probar:

### 1. Verificar ngrok

**En la terminal donde ejecutaste ngrok:**

¿Ves algo como esto?
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

**Si no está corriendo:**
```bash
ngrok http 3000
```

**Copia la URL HTTPS** que aparece (ej: `https://abc123.ngrok.io`)

---

### 2. Verificar Webhook en Meta

1. Ve a **Meta → Configuración → Webhook**
2. **Callback URL** debe ser: `https://tu-url-ngrok.ngrok.io/webhook/whatsapp`
3. **Verify Token**: `chatbot_inmobiliaria_2024`
4. Debe decir **"Verified"** ✅

**Si no está verificado:**
- Actualiza la URL con tu URL de ngrok
- Click en "Verify and Save"

---

### 3. Probar el Chatbot

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

### 4. Probar Flujo Completo

**Envía estos mensajes en orden:**

1. `Hola` → Deberías ver el menú
2. `Alquilar` → Debería empezar el flujo de alquiler
3. `Palermo` → Debería preguntar tipo de propiedad
4. `Departamento` → Debería preguntar presupuesto
5. Y así sucesivamente...

---

## 🐛 Si No Funciona:

### No recibo respuesta:
1. Verifica los logs del servidor (debería mostrar mensajes recibidos)
2. Verifica que ngrok esté corriendo
3. Verifica que el webhook esté verificado en Meta

### Error en logs:
- Revisa la consola del servidor
- Verifica que el `.env` tenga las credenciales correctas

---

## 📊 Ver Logs del Servidor

En la terminal donde corre `npm run dev`, deberías ver:

```
[WhatsApp] Enviando a 5491112345678:
Texto: 👋 Hola, soy el asistente virtual...
```

---

## ✅ ¿Listo para Probar?

1. **Confirma que ngrok está corriendo** (¿Cuál es tu URL?)
2. **Confirma que el webhook está verificado** en Meta
3. **Envía "Hola"** desde WhatsApp al `+1 555 151 3807`

**¿Qué te aparece cuando envías el mensaje?**


