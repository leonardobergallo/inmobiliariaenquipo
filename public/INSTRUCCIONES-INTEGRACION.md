# 📱 Cómo Integrar el Chatbot en tu Página Web

## Opción 1: Widget Flotante (Recomendado)

### Paso 1: Agregar el Script

Agrega esta línea antes de `</body>` en tu página HTML:

```html
<script src="http://localhost:3000/chatbot-widget.js"></script>
```

**⚠️ IMPORTANTE:** Cambia `localhost:3000` por la URL de tu servidor cuando lo subas a producción.

### Paso 2: Configurar la URL del Servidor

Si necesitas cambiar la URL del servidor, edita el archivo `chatbot-widget.js` y busca esta línea:

```javascript
const API_BASE = 'http://localhost:3000'; // ⚠️ CAMBIA ESTO
```

Cámbiala por tu URL, por ejemplo:
```javascript
const API_BASE = 'https://tu-servidor.com';
```

### Paso 3: ¡Listo!

El chatbot aparecerá automáticamente como un botón flotante 💬 en la esquina inferior derecha de tu página.

---

## Opción 2: Widget Embebido (Dentro de la página)

Si prefieres que el chatbot aparezca dentro de tu página (no flotante), puedes usar el archivo `widget.html` como referencia y adaptarlo a tu diseño.

---

## Opción 3: Integración Manual con API

Si prefieres crear tu propio diseño, puedes usar directamente la API:

### Crear Sesión
```javascript
POST http://localhost:3000/api/web/chat/session
Response: { sessionId, messages }
```

### Enviar Mensaje
```javascript
POST http://localhost:3000/api/web/chat/message
Body: { sessionId, message }
Response: { response: { text, buttons }, history }
```

### Ejemplo de Código

```javascript
let sessionId = null;

// Inicializar
async function initChat() {
    const response = await fetch('http://localhost:3000/api/web/chat/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    sessionId = data.sessionId;
}

// Enviar mensaje
async function sendMessage(text) {
    const response = await fetch('http://localhost:3000/api/web/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: text })
    });
    const data = await response.json();
    return data.response;
}
```

---

## Ejemplo Completo

Revisa el archivo `ejemplo-integracion.html` para ver un ejemplo completo de cómo se ve integrado.

---

## Personalización

### Cambiar Colores

Edita los colores en `chatbot-widget.js`, busca:
```javascript
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Cambiar Posición

Para cambiar la posición del botón flotante, modifica en los estilos:
```css
.inmobiliaria-chatbot-button {
    bottom: 20px;  /* Cambia esto */
    right: 20px;   /* Cambia esto */
}
```

### Cambiar Tamaño

Modifica el tamaño del widget:
```css
.inmobiliaria-chatbot-widget {
    width: 380px;  /* Cambia esto */
    height: 600px; /* Cambia esto */
}
```

---

## Soporte

Si tienes problemas, verifica:
1. ✅ Que el servidor esté corriendo en el puerto correcto
2. ✅ Que la URL del API_BASE sea correcta
3. ✅ Que no haya errores en la consola del navegador (F12)

