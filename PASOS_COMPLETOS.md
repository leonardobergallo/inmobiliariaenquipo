# 🚀 Pasos Completos para Configurar WhatsApp

## ✅ Ya configurado:

1. ✅ Token de acceso copiado
2. ✅ `.env` creado con tu token
3. ✅ Verify Token creado: `chatbot_inmobiliaria_2024`

---

## 📋 PASO 1: Obtener Phone Number ID (5 min)

**En Meta:**

1. Ve a **"Configuración"** (en el menú lateral)
2. Busca la sección **"API Setup"** o **"Configuración de API"**
3. Busca **"Phone Number ID"** (es un número largo, ej: `123456789012345`)
4. **Cópialo**

**Luego:**
- Abre el archivo `.env` en tu proyecto
- Reemplaza `REEMPLAZA_CON_TU_PHONE_NUMBER_ID` con el número que copiaste
- Guarda el archivo

---

## 📋 PASO 2: Instalar ngrok (2 min)

1. **Descarga ngrok:**
   - Ve a: https://ngrok.com/download
   - Descarga para Windows
   - Extrae el `.exe` en una carpeta (ej: `C:\ngrok\`)

2. **Abre PowerShell** en esa carpeta

---

## 📋 PASO 3: Iniciar Servidor (1 min)

**En tu proyecto:**

```bash
npm run dev
```

Deja esto corriendo.

---

## 📋 PASO 4: Exponer con ngrok (1 min)

**En otra terminal (donde está ngrok):**

```bash
ngrok http 3000
```

**Copia la URL HTTPS** que aparece (ej: `https://abc123.ngrok.io`)

---

## 📋 PASO 5: Configurar Webhook en Meta (3 min)

**En Meta → Configuración:**

1. Busca la sección **"Webhook"** o **"Configuration"**
2. **Callback URL**: `https://tu-url-ngrok.ngrok.io/webhook/whatsapp`
   (Reemplaza con tu URL de ngrok)
3. **Verify Token**: `chatbot_inmobiliaria_2024`
4. Click en **"Verify and Save"**
5. Si dice "Verified" ✅ → ¡Listo!

---

## 📋 PASO 6: Agregar Número de Prueba (2 min)

**En Meta → Prueba de API o Configuration:**

1. Busca **"To"** o **"Phone Numbers"**
2. Click en **"Agregar número"** o **"Add phone number"**
3. Ingresa tu número de WhatsApp (o el de un amigo para probar)
4. Te llegará un código por WhatsApp
5. Ingresa el código

---

## 📋 PASO 7: Probar (1 min)

1. **Abre WhatsApp** en tu teléfono
2. **Envía un mensaje** al número de prueba (el que agregaste)
3. **Escribe**: `Hola`
4. **Deberías recibir** la respuesta del chatbot con el menú

---

## ✅ Checklist Final:

- [ ] Phone Number ID copiado y agregado al `.env`
- [ ] ngrok descargado
- [ ] Servidor corriendo (`npm run dev`)
- [ ] ngrok corriendo (`ngrok http 3000`)
- [ ] Webhook configurado en Meta
- [ ] Número de prueba agregado
- [ ] Mensaje de prueba enviado

---

## 🎯 PRIMERO: Obtén el Phone Number ID

Ve a **Meta → Configuración → API Setup** y cópiame el **Phone Number ID**.

¿Qué número ves?


