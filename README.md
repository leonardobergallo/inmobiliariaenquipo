# 🤖 Chatbot Inmobiliario

Sistema de chatbot inteligente para inmobiliarias, diseñado para automatizar la atención inicial, filtrar consultas, captar leads y derivar solo lo importante a asesores humanos.

## 🚀 Características

- ✅ **Multi-canal**: WhatsApp, Web y App móvil
- ✅ **4 flujos principales**: Alquilar, Comprar, Vender, Tasación
- ✅ **Captación de leads**: Sistema completo de CRM integrado
- ✅ **Derivación inteligente**: Detección automática de solicitudes de asesor humano
- ✅ **Validaciones**: Sistema robusto de validación de datos
- ✅ **Escalable**: Preparado para crecer y adaptarse a nuevas necesidades

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn
- TypeScript 5+

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Compilar TypeScript
npm run build

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar en producción
npm start
```

## 🔧 Configuración

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
DATABASE_URL=postgresql://neondb_owner:npg_E4b3LfDnpVAs@ep-patient-dew-a4zwqdrx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
WHATSAPP_VERIFY_TOKEN=tu_token_secreto
WHATSAPP_ACCESS_TOKEN=tu_access_token
WHATSAPP_PHONE_NUMBER_ID=tu_phone_number_id
```

### Inicializar Base de Datos

Antes de iniciar el servidor, asegúrate de inicializar la base de datos:

```bash
npm run init-db
```

O el servidor la inicializará automáticamente al arrancar.

## 📱 Uso

### WhatsApp

El chatbot está listo para integrarse con WhatsApp Business API. Configura el webhook en:

```
POST /webhook/whatsapp
GET /webhook/whatsapp (verificación)
```

### Web

API REST para integrar en tu sitio web:

```javascript
// Crear sesión
POST /api/web/chat/session
Response: { sessionId, messages }

// Enviar mensaje
POST /api/web/chat/message
Body: { sessionId, message }
Response: { response, history }

// Obtener historial
GET /api/web/chat/history/:sessionId

// Limpiar sesión
DELETE /api/web/chat/session/:sessionId
```

### App Móvil

API para aplicaciones móviles:

```javascript
// Enviar mensaje
POST /api/app/chat/message
Body: { userId, message }
Response: { response, history }

// Obtener historial
GET /api/app/chat/history/:userId

// Obtener menú principal
GET /api/app/chat/menu
```

### Admin / CRM

Endpoints para gestionar leads:

```javascript
// Todos los leads
GET /api/admin/leads

// Leads por estado
GET /api/admin/leads/estado/:estado

// Leads por interés
GET /api/admin/leads/interes/:interes

// Lead específico
GET /api/admin/leads/:id
```

## 🔄 Flujos del Chatbot

### 1. Alquilar
- Zona/barrio
- Tipo de propiedad
- Presupuesto máximo
- Cantidad de dormitorios
- Fecha de ingreso
- Nombre y teléfono

### 2. Comprar
- Zona/barrio
- Tipo de propiedad
- Rango de inversión
- Cantidad de dormitorios
- ¿Primera vivienda?
- ¿Compra con crédito?
- Nombre y teléfono

### 3. Vender
- Dirección aproximada
- Tipo de propiedad
- Metros cuadrados
- Estado general
- Nombre y teléfono

### 4. Tasación
- Dirección aproximada
- Tipo de propiedad
- Metros cuadrados
- Estado general
- Nombre y teléfono

## 📊 Estructura del Proyecto

```
src/
├── types/              # Tipos TypeScript
├── models/            # Modelos de datos
├── storage/           # Almacenamiento (JSON, preparado para DB)
├── chatbot/           # Motor del chatbot
│   ├── flows/         # Flujos específicos
│   └── ChatbotEngine.ts
├── adapters/          # Adaptadores por canal
│   ├── WhatsAppAdapter.ts
│   ├── WebAdapter.ts
│   └── AppAdapter.ts
├── examples/          # Ejemplos de uso
└── index.ts           # Servidor principal
```

## 🗂️ Datos Capturados

El sistema guarda automáticamente:

- Nombre
- Teléfono / WhatsApp
- Interés (alquilar / comprar / vender / tasación)
- Zona
- Presupuesto
- Tipo de propiedad
- Dormitorios
- Fecha de ingreso
- Estado del lead (nuevo / calificado / en seguimiento / derivado)

## 🔐 Estados de Leads

- **nuevo**: Lead recién captado
- **calificado**: Lead con información completa (automático en compras)
- **en_seguimiento**: Lead en proceso de seguimiento
- **derivado**: Lead derivado a asesor humano

## 🗄️ Base de Datos

El sistema usa **PostgreSQL con Neon** para almacenar:
- **Leads**: Todos los clientes potenciales captados
- **Chat States**: Estados de conversaciones activas
- **Messages**: Historial de mensajes (opcional)

Las tablas se crean automáticamente al iniciar el servidor o ejecutar `npm run init-db`.

## 🚀 Próximos Pasos

1. ✅ **Base de datos**: Integrado con PostgreSQL/Neon
2. **Conectar con WhatsApp Business API**: Implementar envío real de mensajes
3. **Sistema de búsqueda de propiedades**: Integrar con base de datos de propiedades
4. **Notificaciones**: Alertar a asesores cuando se deriva un lead
5. **Analytics**: Dashboard con estadísticas de conversaciones y leads

## 📝 Ejemplo de Uso Programático

```typescript
import { ChatbotEngine } from './chatbot/ChatbotEngine';

const chatbot = new ChatbotEngine();

// Procesar mensaje
const response = chatbot.processMessage('user123', 'Hola');
console.log(response.text);
console.log(response.buttons);

// Iniciar flujo
const response2 = chatbot.processMessage('user123', 'Alquilar');
```

## 🤝 Contribuir

Este es un proyecto base diseñado para crecer. Puedes:

- Agregar nuevos flujos
- Mejorar validaciones
- Integrar con más canales
- Agregar funcionalidades de IA/NLP

## 📄 Licencia

MIT

---

**Desarrollado para automatizar y mejorar la atención en inmobiliarias** 🏠

