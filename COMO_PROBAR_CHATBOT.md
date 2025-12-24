# 🧪 Cómo Probar el Chatbot de WhatsApp

## ❌ Problema:

El número `+1 555 151 3807` es un **número de prueba de Meta**, no un número real de WhatsApp.

**WhatsApp te dice:** "Este número de teléfono no está en WhatsApp"

---

## ✅ Solución: Dos Formas de Probar

### Opción 1: Usar el Botón "Enviar mensaje" en Meta (Más Fácil)

**Esta es la forma más fácil para probar:**

1. **Ve a Meta for Developers:**
   ```
   https://developers.facebook.com/apps/874331455382631/whatsapp-business/cloud-api/get-started
   ```

2. **Baja hasta la Sección 6:** "Enviar mensajes con la API"

3. **Genera un token** si no lo tienes (Sección 1)

4. **Haz click en el botón azul "Enviar mensaje"** (al final de la sección 6)

5. **Te llegará un mensaje de prueba** a tu WhatsApp (`+54 342 508-9906`)

**Nota:** Este mensaje será una plantilla de prueba de Meta, no del chatbot. Pero verifica que el webhook funcione.

---

### Opción 2: Enviar Mensaje desde WhatsApp (Requiere Configuración)

**Para que funcione, necesitas:**

1. **Tu número debe estar agregado** en Meta (Sección 3) ✅ (Ya lo tienes)

2. **El número debe estar verificado** con el código ✅ (Ya lo tienes)

3. **Envía el mensaje DESDE tu WhatsApp** (`+54 342 508-9906`) **AL número de prueba** (`+1 555 151 3807`)

**Pero hay un problema:** El número de prueba no puede recibir mensajes directamente desde WhatsApp normal.

---

## 🎯 La Mejor Forma de Probar:

### Usa el Botón "Enviar mensaje" en Meta:

1. **Abre este link:**
   ```
   https://developers.facebook.com/apps/874331455382631/whatsapp-business/cloud-api/get-started
   ```

2. **Scroll hasta la Sección 6**

3. **Genera un token** (Sección 1) si expiró

4. **Click en "Enviar mensaje"**

5. **Mira la terminal del servidor** - deberías ver logs cuando Meta envía el mensaje

---

## 🔍 Verificar que Funciona:

**Después de hacer click en "Enviar mensaje":**

1. **Mira la terminal del servidor** - deberías ver:
   ```
   📥 [WhatsApp Webhook] Mensaje recibido: {...}
   ```

2. **Si ves los logs:** El webhook está funcionando ✅

3. **Si NO ves logs:** El webhook no está recibiendo mensajes ❌

---

## 🚀 Prueba Ahora:

**Ve a Meta y haz click en "Enviar mensaje" en la Sección 6.**

**Luego mira la terminal del servidor y dime qué logs ves.**

---

## 💡 Nota Importante:

**Para producción (cuando quieras que clientes reales usen el chatbot):**

- Necesitarás un **número de WhatsApp Business real**
- No puedes usar el número de prueba `+1 555 151 3807`
- Debes solicitar un número de WhatsApp Business en Meta

**Pero para pruebas y desarrollo, el botón "Enviar mensaje" en Meta es suficiente.**


