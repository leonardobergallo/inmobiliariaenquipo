# ✅ Configuración Completa - Paso a Paso

## 🎯 Lo que Ya Tienes:

1. ✅ **Token temporal**: Ya lo copiaste
2. ✅ **Phone Number ID**: `878773181991861`
3. ✅ **Número de prueba "Desde"**: `+1 555 151 3807`

---

## 📋 PASO 1: Agregar Tu Número (Paso 3)

**En el paso 3: "Agrega un número de teléfono del destinatario"**

1. **Click en el dropdown** "Selecciona un número de destinatario"
2. Si está vacío, busca un botón **"Agregar número"** o **"+"**
3. O busca un campo de texto donde puedas ingresar tu número
4. **Ingresa tu número** (formato: código país + número, ej: `5491112345678` para Argentina)
5. Te llegará un código por WhatsApp
6. **Ingresa el código**

**Si no ves cómo agregar:**
- Scroll hacia abajo en esa sección
- Busca un botón "Agregar" o "Add"
- O click derecho en el dropdown

---

## 📋 PASO 2: Activar Webhook (Paso 4)

**En el paso 4: "Activa la escucha del webhook"**

1. **Activa el toggle** (cambia de "Desactivada" a "Activada")
2. Esto activa la escucha local (para pruebas)

**PERO** también necesitas configurar el webhook real en "Configuración" (más abajo).

---

## 📋 PASO 3: Actualizar .env

Abre el archivo `.env` y asegúrate de tener:

```env
PORT=3000
DATABASE_URL=postgresql://neondb_owner:npg_E4b3LfDnpVAs@ep-patient-dew-a4zwqdrx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# WhatsApp Business API
WHATSAPP_VERIFY_TOKEN=chatbot_inmobiliaria_2024
WHATSAPP_ACCESS_TOKEN=EAAMbMyfQZAGcBQfXZAeyNvvkKjg5Oh4K56NbKkWROYc8jdYbx738za0j3qDrBFCS1wsv9SYZBG5FXLQCNAPHdyBv5HXZCwjEhi03GX0zy8KFEQhD6KfIZB5Ye9x3xIZAag5eYvsMWChnwMZCKeOefmDRy4gpTJjy2bE8r3I4lZB9epUvWT13Me8IlSDUG1GDGOPRFotML6bh9lLpq4zghG8SUZAmUVNAtFyhutXbTQLRmlZCeZCsKaTImwlBxz7h0ZCmaYVfjkseDUevuNdRf372Fy4YXUgZD
WHATSAPP_PHONE_NUMBER_ID=878773181991861
```

---

## 📋 PASO 4: Instalar y Configurar ngrok

1. **Descarga ngrok**: https://ngrok.com/download
2. **Extrae el .exe** en una carpeta (ej: `C:\ngrok\`)
3. **Abre PowerShell** en esa carpeta

---

## 📋 PASO 5: Iniciar Servidor

**En tu proyecto:**

```bash
npm run dev
```

**Deja esto corriendo** en una terminal.

---

## 📋 PASO 6: Exponer con ngrok

**En otra terminal (donde está ngrok):**

```bash
ngrok http 3000
```

**Copia la URL HTTPS** que aparece (ej: `https://abc123.ngrok.io`)

---

## 📋 PASO 7: Configurar Webhook en Meta

**Ve a Meta → "Configuración" (en el menú lateral):**

1. Busca la sección **"Webhook"** o **"Configuration"**
2. **Callback URL**: `https://tu-url-ngrok.ngrok.io/webhook/whatsapp`
   (Reemplaza con tu URL de ngrok)
3. **Verify Token**: `chatbot_inmobiliaria_2024`
4. Click en **"Verify and Save"**
5. Si dice "Verified" ✅ → ¡Listo!

---

## 📋 PASO 8: Probar

1. **Abre WhatsApp** en tu teléfono
2. **Envía un mensaje** al número `+1 555 151 3807`
3. **Escribe**: `Hola`
4. **Deberías recibir** la respuesta del chatbot con el menú

---

## ✅ Checklist:

- [ ] Número agregado en paso 3
- [ ] Webhook activado en paso 4 (toggle)
- [ ] `.env` actualizado con Phone Number ID
- [ ] ngrok descargado
- [ ] Servidor corriendo (`npm run dev`)
- [ ] ngrok corriendo (`ngrok http 3000`)
- [ ] Webhook configurado en Meta → Configuración
- [ ] Mensaje de prueba enviado

---

## 🎯 PRIMERO: Agregar Tu Número

**En el paso 3**, busca cómo agregar tu número. ¿Ves algún botón o campo?


