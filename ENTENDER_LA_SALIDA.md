# 📊 Entender la Salida del Script

## ✅ Lo que Estás Viendo:

```
Total de leads: 2
- Juan Pérez, - alquilar - nuevo
- Juan Pérez, - alquilar - nuevo
```

**Esto NO son opciones para elegir.**

**Es el RESULTADO del script de ejemplo** que acabas de ejecutar.

---

## 🔍 Qué Significa:

### El Script de Ejemplo:

1. **Simula una conversación** completa con el chatbot
2. **Crea un lead** (Juan Pérez quiere alquilar)
3. **Guarda el lead** en la base de datos
4. **Muestra los leads** guardados

**La salida que ves es el paso 4:** muestra que hay 2 leads guardados en la base de datos.

---

## 🎯 Qué Puedes Hacer Ahora:

### Opción 1: Ver los Leads en la Base de Datos

**Puedes consultar los leads guardados:**

```bash
# Ver todos los leads
curl http://localhost:3000/api/admin/leads

# Ver leads por estado
curl http://localhost:3000/api/admin/leads/estado/nuevo

# Ver leads por interés
curl http://localhost:3000/api/admin/leads/interes/alquilar
```

---

### Opción 2: Probar el Chatbot Interactivamente

**Puedes probar el chatbot con diferentes mensajes:**

```bash
# Crear una sesión nueva
curl -X POST http://localhost:3000/api/web/chat/session

# Enviar mensajes
curl -X POST http://localhost:3000/api/web/chat/message \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "tu-session-id", "message": "Hola"}'
```

---

### Opción 3: Seguir Desarrollando

**Puedes:**

1. **Mejorar los flujos** del chatbot
2. **Agregar nuevas funcionalidades**
3. **Crear una interfaz web** para probar
4. **Mejorar la base de datos**

---

## 🚀 Siguiente Paso:

**¿Qué te gustaría hacer?**

1. **Ver los leads guardados** en detalle
2. **Probar el chatbot** con diferentes mensajes
3. **Mejorar alguna funcionalidad** del chatbot
4. **Crear una interfaz web** para probar
5. **Algo más**

**Dime qué quieres hacer y te ayudo.**

---

## 💡 Nota:

**Los leads que ves son del script de ejemplo.** 

**Si quieres limpiar la base de datos y empezar de nuevo, puedo ayudarte a hacerlo.**


