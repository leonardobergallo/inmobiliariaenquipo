# 🚀 Guía Rápida de Inicio

## Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Compilar TypeScript
npm run build

# 3. Iniciar servidor
npm run dev
```

## Probar el Chatbot

### Opción 1: Usar el script de prueba
```bash
npm run build
node test-chatbot.js
```

### Opción 2: Usar la API REST

#### Crear sesión web
```bash
curl -X POST http://localhost:3000/api/web/chat/session
```

#### Enviar mensaje
```bash
curl -X POST http://localhost:3000/api/web/chat/message \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "tu_session_id", "message": "Hola"}'
```

### Opción 3: Probar programáticamente

```typescript
import { ChatbotEngine } from './src/chatbot/ChatbotEngine';

const chatbot = new ChatbotEngine();
const response = chatbot.processMessage('user123', 'Hola');
console.log(response.text);
```

## Flujos Disponibles

1. **Alquilar** - Búsqueda de propiedades en alquiler
2. **Comprar** - Búsqueda de propiedades para compra
3. **Vender** - Solicitud para vender propiedad
4. **Tasación** - Solicitud de tasación gratuita

## Endpoints Principales

- `GET /health` - Estado del servidor
- `POST /api/web/chat/session` - Crear sesión web
- `POST /api/web/chat/message` - Enviar mensaje (web)
- `POST /api/app/chat/message` - Enviar mensaje (app)
- `GET /api/admin/leads` - Ver todos los leads

## Próximos Pasos

1. Configurar `.env` con tus credenciales de WhatsApp
2. Integrar con base de datos real (PostgreSQL/MongoDB)
3. Conectar con sistema de propiedades
4. Configurar notificaciones para asesores

---

**¡Listo para usar!** 🎉


