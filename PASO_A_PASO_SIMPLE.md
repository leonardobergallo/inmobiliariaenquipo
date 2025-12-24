# 🎯 Configuración Paso a Paso - MUY SIMPLE

## 📋 Lo que Necesitas Hacer (En Orden):

---

## ✅ PASO 1: Abrir 3 Terminales

Necesitas **3 terminales abiertas al mismo tiempo**:

1. **Terminal 1**: Para el servidor del chatbot
2. **Terminal 2**: Para ngrok
3. **Terminal 3**: (Opcional) Para ver logs

---

## ✅ PASO 2: Terminal 1 - Iniciar el Servidor

**En la terminal de tu proyecto** (donde está el código):

```bash
cd C:\Users\leona\Desktop\Inmobiliariaenequipo
npm run dev
```

**Deja esto corriendo** - NO lo cierres.

**Deberías ver:**
```
🚀 Chatbot inmobiliario iniciado en puerto 3000
```

---

## ✅ PASO 3: Terminal 2 - Iniciar ngrok

**Abre una NUEVA terminal** (otra ventana):

1. **Ve a la carpeta de ngrok:**
   ```bash
   cd C:\Users\leona\Downloads\ngrok-v3-stable-windows-amd64
   ```

2. **Ejecuta ngrok:**
   ```bash
   ngrok http 3000
   ```

**Deja esto corriendo** - NO lo cierres.

**Verás algo como:**
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

**IMPORTANTE:** Copia la URL que aparece (ej: `https://abc123.ngrok.io`)

---

## ✅ PASO 4: Configurar Webhook en Meta

**En la página de Meta que estás viendo:**

1. **En el campo "URL de devolución de llamada":**
   - **Borra todo** lo que hay
   - **Escribe**: `https://abc123.ngrok.io/webhook/whatsapp`
   - (Reemplaza `abc123.ngrok.io` con TU URL de ngrok)

2. **En el campo "Token de verificación":**
   - Debe decir: `chatbot_inmobiliaria_2024`
   - (Ya está bien, no lo cambies)

3. **Click en el botón azul "Verificar y guardar"**

---

## ✅ PASO 5: Verificar que Funcione

**Si todo está bien:**
- El error rojo desaparecerá
- Verás un mensaje verde de "Verificado" ✅

**Si sigue el error:**
- Verifica que el servidor esté corriendo (Paso 2)
- Verifica que ngrok esté corriendo (Paso 3)
- Verifica que la URL sea correcta (debe terminar en `/webhook/whatsapp`)

---

## 🎯 Resumen Visual:

```
Terminal 1: npm run dev          → Servidor corriendo ✅
Terminal 2: ngrok http 3000      → URL: https://abc123.ngrok.io ✅
Meta: URL = https://abc123.ngrok.io/webhook/whatsapp ✅
```

---

## ❓ ¿En Qué Paso Estás?

Dime:
1. ¿Tienes el servidor corriendo? (`npm run dev`)
2. ¿Tienes ngrok corriendo? (`ngrok http 3000`)
3. ¿Cuál es la URL que te da ngrok?

Con eso te ayudo a completar el paso 4.


