# 🔧 Configurar Webhook - Solución del Error

## ❌ Error que Ves:

"No se pudo validar la URL de devolución de llamada o el token de verificación"

**El problema:** La URL `https://tu-url-ngrok.ngrok.io/webhook/whatsapp` es un **placeholder**, no una URL real.

---

## ✅ Solución:

### Paso 1: Obtener URL Real de ngrok

**En la terminal donde ejecutaste ngrok:**

¿Ves algo como esto?
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

**Si no está corriendo:**
1. Abre una terminal
2. Ve a la carpeta donde está ngrok
3. Ejecuta: `ngrok http 3000`
4. **Copia la URL HTTPS** (la que empieza con `https://`)

**Ejemplo de URL real:**
```
https://abc123-def456.ngrok-free.app
```
o
```
https://abc123.ngrok.io
```

---

### Paso 2: Verificar que el Servidor Esté Corriendo

**En otra terminal, en tu proyecto:**

```bash
npm run dev
```

**Deberías ver:**
```
🚀 Chatbot inmobiliario iniciado en puerto 3000
```

**Deja esto corriendo** - Meta necesita que el servidor esté activo para verificar el webhook.

---

### Paso 3: Actualizar la URL en Meta

**En la página de webhook que estás viendo:**

1. **En el campo "URL de devolución de llamada":**
   - **Borra** `https://tu-url-ngrok.ngrok.io/webhook/whatsapp`
   - **Escribe** tu URL real de ngrok + `/webhook/whatsapp`
   - **Ejemplo**: `https://abc123.ngrok.io/webhook/whatsapp`

2. **En el campo "Token de verificación":**
   - Debe ser: `chatbot_inmobiliaria_2024`
   - (Ya está bien configurado)

3. **Click en "Verificar y guardar"** (botón azul)

---

### Paso 4: Si Sigue el Error

**Verifica:**

1. ✅ **ngrok está corriendo** (¿Cuál es tu URL?)
2. ✅ **Servidor está corriendo** (`npm run dev`)
3. ✅ **URL correcta** (debe terminar en `/webhook/whatsapp`)
4. ✅ **Token correcto** (`chatbot_inmobiliaria_2024`)

**Si todo está bien y sigue el error:**
- Espera unos segundos y vuelve a intentar
- Verifica que ngrok no haya cambiado de URL (a veces cambia al reiniciar)

---

## 🎯 Ejemplo Completo:

**Si tu URL de ngrok es:** `https://abc123.ngrok.io`

**Entonces en Meta debes poner:**
```
https://abc123.ngrok.io/webhook/whatsapp
```

**Token:**
```
chatbot_inmobiliaria_2024
```

---

## ✅ Checklist:

- [ ] ngrok corriendo (¿Cuál es tu URL?)
- [ ] Servidor corriendo (`npm run dev`)
- [ ] URL actualizada en Meta (con tu URL real de ngrok)
- [ ] Token correcto (`chatbot_inmobiliaria_2024`)
- [ ] Click en "Verificar y guardar"

---

## 🚀 ¿Tienes ngrok Corriendo?

**Dime:**
1. ¿Tienes ngrok corriendo? (¿Cuál es tu URL?)
2. ¿Tienes el servidor corriendo? (`npm run dev`)

Con esa información te ayudo a configurarlo correctamente.


