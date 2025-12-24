# 📱 Guía: Implementar Chatbot en WhatsApp

## 🎯 Opciones para Conectar WhatsApp

Tienes **3 opciones principales** para conectar tu chatbot con WhatsApp:

---

## 1️⃣ WhatsApp Cloud API (Meta/Facebook) - RECOMENDADO

### ✅ Ventajas:
- Gratis hasta cierto límite
- Directo desde Meta/Facebook
- Fácil de configurar
- Sin intermediarios

### 📋 Requisitos:
1. **Cuenta de Meta Business** (gratis)
2. **App en Meta for Developers** (gratis)
3. **Número de teléfono** (puede ser el tuyo o uno nuevo)

### 🔧 Pasos de Configuración:

#### Paso 1: Crear App en Meta
1. Ve a https://developers.facebook.com/
2. Crea una cuenta o inicia sesión
3. Crea una nueva App → Tipo: "Business"
4. Agrega el producto "WhatsApp"

#### Paso 2: Obtener Credenciales
1. En tu App, ve a **WhatsApp → API Setup**
2. Copia:
   - **Phone Number ID** (ej: `123456789012345`)
   - **Access Token** (temporal, luego necesitas uno permanente)
   - **Verify Token** (créalo tú, ej: `mi_token_secreto_123`)

#### Paso 3: Configurar Webhook
1. En **WhatsApp → Configuration**
2. **Callback URL**: `https://tu-dominio.com/webhook/whatsapp`
3. **Verify Token**: El que creaste (ej: `mi_token_secreto_123`)
4. Click en **Verify and Save**

#### Paso 4: Configurar Variables de Entorno
Crea/edita `.env`:
```env
WHATSAPP_VERIFY_TOKEN=mi_token_secreto_123
WHATSAPP_ACCESS_TOKEN=tu_access_token_aqui
WHATSAPP_PHONE_NUMBER_ID=123456789012345
```

#### Paso 5: Actualizar Código
El código ya está preparado, solo necesitas descomentar la parte de envío real.

---

## 2️⃣ Twilio WhatsApp API

### ✅ Ventajas:
- Muy confiable
- Buena documentación
- Soporte en español

### ❌ Desventajas:
- Tiene costo (aprox $0.005 por mensaje)
- Necesitas número verificado de Twilio

### 🔧 Configuración:

#### Paso 1: Crear Cuenta Twilio
1. Ve a https://www.twilio.com/
2. Crea cuenta (trial gratuito disponible)
3. Activa WhatsApp Sandbox (gratis para pruebas)

#### Paso 2: Obtener Credenciales
1. En Twilio Console → WhatsApp Sandbox
2. Copia:
   - **Account SID**
   - **Auth Token**
   - **WhatsApp Number** (ej: `whatsapp:+14155238886`)

#### Paso 3: Configurar Variables
```env
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

---

## 3️⃣ WhatsApp Business API (Oficial, vía Proveedores)

### ✅ Ventajas:
- Oficial de Meta
- Sin límites de mensajes
- Número propio

### ❌ Desventajas:
- Más caro
- Requiere aprobación de Meta
- Proceso más largo

### Proveedores Recomendados:
- **360dialog** (https://360dialog.com/)
- **ChatAPI** (https://chatapi.com/)
- **Wati** (https://www.wati.io/)

---

## 🚀 Implementación Rápida: WhatsApp Cloud API

### 1. Actualizar WhatsAppAdapter.ts

El archivo ya tiene la estructura, solo necesitas descomentar y completar:

```typescript
// En src/adapters/WhatsAppAdapter.ts
private async sendMessage(to: string, response: BotResponse): Promise<void> {
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

  try {
    // Si hay botones, usar mensaje interactivo
    if (response.buttons && response.buttons.length > 0) {
      const buttons = response.buttons.map((btn, index) => ({
        type: "reply",
        reply: {
          id: `btn_${index}`,
          title: btn.label.substring(0, 20) // Máximo 20 caracteres
        }
      }));

      await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'interactive',
          interactive: {
            type: 'button',
            body: {
              text: response.text
            },
            action: {
              buttons: buttons.slice(0, 3) // Máximo 3 botones
            }
          }
        }),
      });
    } else {
      // Mensaje de texto simple
      await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: response.text }
        }),
      });
    }
  } catch (error) {
    console.error('Error enviando mensaje WhatsApp:', error);
    throw error;
  }
}
```

### 2. Configurar Webhook en tu Servidor

Tu servidor ya tiene el endpoint:
```
POST /webhook/whatsapp
GET /webhook/whatsapp (para verificación)
```

**IMPORTANTE**: Necesitas exponer tu servidor con HTTPS. Opciones:

#### Opción A: ngrok (Para pruebas)
```bash
# Instalar ngrok
# Descargar de https://ngrok.com/

# Exponer tu servidor
ngrok http 3000

# Copiar la URL (ej: https://abc123.ngrok.io)
# Usar esa URL en el webhook de Meta
```

#### Opción B: Deploy en VPS/Cloud
- **Vercel** (gratis): https://vercel.com
- **Railway** (gratis): https://railway.app
- **Render** (gratis): https://render.com
- **DigitalOcean** (pago): https://www.digitalocean.com

### 3. Probar la Conexión

```bash
# 1. Iniciar servidor
npm run dev

# 2. Exponer con ngrok (en otra terminal)
ngrok http 3000

# 3. Configurar webhook en Meta con la URL de ngrok
# 4. Enviar mensaje de prueba a tu número de WhatsApp Business
```

---

## 📝 Ejemplo Completo de Configuración

### Archivo `.env`:
```env
PORT=3000
DATABASE_URL=postgresql://neondb_owner:npg_E4b3LfDnpVAs@ep-patient-dew-a4zwqdrx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# WhatsApp Cloud API
WHATSAPP_VERIFY_TOKEN=mi_token_secreto_123
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
```

### Flujo Completo:

1. **Usuario envía mensaje** → WhatsApp recibe
2. **WhatsApp envía a tu webhook** → `POST /webhook/whatsapp`
3. **Tu servidor procesa** → Chatbot responde
4. **Tu servidor envía respuesta** → WhatsApp Cloud API
5. **Usuario recibe respuesta** → En su WhatsApp

---

## 🔍 Verificar que Funciona

### 1. Verificar Webhook (Meta lo hace automáticamente)
Cuando configuras el webhook, Meta envía un GET para verificar.

### 2. Probar Envío de Mensaje
```bash
# Enviar mensaje de prueba desde tu código
curl -X POST https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages \
  -H "Authorization: Bearer {ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "5491112345678",
    "type": "text",
    "text": { "body": "Hola, esto es una prueba" }
  }'
```

### 3. Ver Logs
Tu servidor mostrará en consola:
```
[WhatsApp] Enviando a 5491112345678:
Texto: Hola, esto es una prueba
```

---

## 💡 Tips Importantes

1. **Número de WhatsApp Business**:
   - Puede ser tu número personal (en modo Sandbox)
   - Para producción, necesitas número verificado de Meta
   - Formato: `5491112345678` (código país + número sin + ni espacios)

2. **Límites**:
   - **Sandbox**: Solo puedes chatear con números agregados manualmente
   - **Producción**: Sin límites (después de aprobación)

3. **Plantillas de Mensajes**:
   - Para iniciar conversación, necesitas plantilla aprobada
   - O el usuario debe escribirte primero

4. **HTTPS Obligatorio**:
   - WhatsApp requiere HTTPS para webhooks
   - Usa ngrok para pruebas o deploy en cloud

---

## 🚀 Próximos Pasos

1. ✅ Elegir proveedor (recomiendo WhatsApp Cloud API)
2. ✅ Crear cuenta y obtener credenciales
3. ✅ Configurar `.env` con tus tokens
4. ✅ Actualizar código de envío (descomentar)
5. ✅ Exponer servidor con HTTPS (ngrok o deploy)
6. ✅ Configurar webhook en Meta
7. ✅ Probar enviando mensaje

¿Quieres que te ayude a implementar alguna de estas opciones específicamente?


