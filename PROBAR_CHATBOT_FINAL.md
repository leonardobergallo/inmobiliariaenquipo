# ✅ Todo Configurado - Probar el Chatbot

## ✅ Lo que Ya Tienes:

- ✅ Token generado
- ✅ Número de prueba: `+1 555 151 3807`
- ✅ Tu número agregado: `+54 342 508-9906`
- ✅ Webhook activado
- ✅ Todo listo

---

## 🚀 Cómo Probar:

### Opción 1: Enviar Mensaje desde WhatsApp (Recomendado)

1. **Abre WhatsApp** en tu teléfono
2. **Inicia un chat nuevo** con el número: `+1 555 151 3807`
3. **Envía un mensaje:** `Hola`
4. **Deberías recibir** la respuesta del chatbot

**En la terminal del servidor** deberías ver logs cuando recibes el mensaje.

---

### Opción 2: Usar el Botón "Enviar mensaje" en Meta

**En la sección 6 que estás viendo:**

1. **Genera un token** si no lo tienes (sección 1)
2. **Click en el botón azul "Enviar mensaje"** (al final de la sección 6)
3. **Te llegará un mensaje** de prueba a tu WhatsApp

**Nota:** Este mensaje será una plantilla de prueba, no del chatbot.

---

## 🎯 Prueba Recomendada:

**Usa la Opción 1** (enviar desde WhatsApp):

1. **Abre WhatsApp** en tu teléfono
2. **Nuevo chat** → `+1 555 151 3807`
3. **Envía:** `Hola`
4. **Deberías recibir** el menú del chatbot:

```
👋 Hola, soy el asistente virtual de *Inmobiliaria en Equipo*

¿En qué puedo ayudarte?

[Botones: Alquilar, Comprar, Vender, Tasación, Hablar con asesor]
```

---

## 📊 Verificar que Funciona:

**En la terminal del servidor** (`npm run dev`), cuando envías un mensaje deberías ver:

```
[WhatsApp] Mensaje recibido de: 543425089906
Texto: Hola
[WhatsApp] Enviando a 543425089906:
Texto: 👋 Hola, soy el asistente virtual...
```

---

## 🐛 Si No Funciona:

### No recibo respuesta:
1. Verifica que el servidor esté corriendo
2. Verifica que ngrok esté corriendo
3. Verifica los logs del servidor
4. Verifica que el webhook esté verificado en Meta

### Error en logs:
- Revisa la consola del servidor
- Verifica que el Access Token sea válido
- Verifica que el Phone Number ID sea correcto

---

## ✅ Checklist Final:

- [x] Token generado
- [x] Número agregado
- [x] Webhook activado
- [ ] Mensaje de prueba enviado
- [ ] Respuesta recibida del chatbot

---

## 🚀 Prueba Ahora:

**Envía "Hola" desde WhatsApp al `+1 555 151 3807`**

**¿Qué te aparece?** Dime si recibes la respuesta del chatbot o si hay algún error.


