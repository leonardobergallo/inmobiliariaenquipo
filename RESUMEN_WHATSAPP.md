# 📱 Resumen: Cómo Conectar WhatsApp

## ✅ Lo que ya está listo:

1. ✅ **Código implementado** - El chatbot ya puede enviar mensajes reales
2. ✅ **Webhook configurado** - El servidor recibe mensajes de WhatsApp
3. ✅ **Base de datos** - Los leads se guardan automáticamente

## 🎯 Lo que TÚ necesitas hacer:

### 1. Crear cuenta en Meta (5 minutos)
- Ve a: https://developers.facebook.com/
- Crea una App tipo "Business"
- Agrega el producto "WhatsApp"

### 2. Obtener 3 cosas:
- **Phone Number ID** (ej: `123456789012345`)
- **Access Token** (ej: `EAAxxxx...`)
- **Verify Token** (tú lo creas, ej: `mi_token_123`)

### 3. Configurar `.env`:
```env
WHATSAPP_VERIFY_TOKEN=mi_token_123
WHATSAPP_ACCESS_TOKEN=EAAxxxx...
WHATSAPP_PHONE_NUMBER_ID=123456789012345
```

### 4. Exponer servidor con HTTPS:
```bash
# Instalar ngrok: https://ngrok.com/download
ngrok http 3000
# Copiar la URL HTTPS que te da
```

### 5. Configurar webhook en Meta:
- URL: `https://tu-url-ngrok.ngrok.io/webhook/whatsapp`
- Verify Token: `mi_token_123` (el que creaste)

## 📞 Tu Número de WhatsApp

**Puedes usar tu número personal** para pruebas:
- En Meta → WhatsApp → "To" → Agrega tu número
- Te llegará un código, ingrésalo
- ✅ Listo para probar

## 🚀 Flujo Completo:

```
Usuario envía mensaje por WhatsApp
    ↓
WhatsApp lo envía a tu webhook
    ↓
Tu servidor procesa con el chatbot
    ↓
Chatbot responde
    ↓
Tu servidor envía respuesta a WhatsApp Cloud API
    ↓
Usuario recibe respuesta en WhatsApp
```

## 📋 Archivos Importantes:

- **`PASOS_WHATSAPP.md`** - Guía paso a paso detallada
- **`GUIA_WHATSAPP.md`** - Explicación completa de opciones
- **`src/adapters/WhatsAppAdapter.ts`** - Código que envía mensajes

## ⚡ Inicio Rápido:

1. Lee **`PASOS_WHATSAPP.md`** (15 minutos)
2. Sigue los pasos
3. Prueba enviando un mensaje
4. ¡Listo! 🎉

---

**¿Dudas?** Revisa `PASOS_WHATSAPP.md` para la guía completa.


