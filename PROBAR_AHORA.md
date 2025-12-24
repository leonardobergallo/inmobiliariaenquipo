# 🚀 Probar el Chatbot - Pasos Finales

## ✅ Checklist Antes de Probar:

- [ ] `.env` configurado con Phone Number ID y Access Token
- [ ] Servidor corriendo (`npm run dev`)
- [ ] ngrok corriendo (`ngrok http 3000`)
- [ ] Webhook configurado en Meta
- [ ] Número agregado en Meta

---

## 📋 PASO 1: Verificar Servidor

**En la terminal de tu proyecto:**

```bash
npm run dev
```

**Deberías ver:**
```
🔄 Inicializando base de datos...
✅ Base de datos inicializada correctamente
🚀 Chatbot inmobiliario iniciado en puerto 3000
```

---

## 📋 PASO 2: Verificar ngrok

**En la terminal de ngrok:**

```bash
ngrok http 3000
```

**Deberías ver:**
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

**Copia la URL HTTPS** (la que empieza con `https://`)

---

## 📋 PASO 3: Verificar Webhook en Meta

1. Ve a **Meta → Configuración → Webhook**
2. Verifica que la **Callback URL** sea: `https://tu-url-ngrok.ngrok.io/webhook/whatsapp`
3. Verifica que el **Verify Token** sea: `chatbot_inmobiliaria_2024`
4. Debe decir **"Verified"** ✅

---

## 📋 PASO 4: Probar

1. **Abre WhatsApp** en tu teléfono
2. **Envía un mensaje** al número: `+1 555 151 3807`
3. **Escribe**: `Hola`
4. **Deberías recibir** la respuesta del chatbot con el menú principal

---

## 🐛 Si No Funciona:

### Error: "No recibo respuesta"
- Verifica que el servidor esté corriendo
- Verifica que ngrok esté corriendo
- Verifica los logs del servidor (debería mostrar los mensajes recibidos)

### Error: "Webhook no verificado"
- Verifica la URL en Meta
- Verifica el Verify Token
- Reinicia ngrok y actualiza la URL

### Error: "Token expirado"
- El token temporal dura 60 minutos
- Genera uno nuevo en Meta → Prueba de API

---

## ✅ ¿Listo?

Dime:
1. ¿El servidor está corriendo?
2. ¿ngrok está corriendo? (¿Cuál es la URL?)
3. ¿El webhook está verificado en Meta?

Luego probamos enviando un mensaje.


