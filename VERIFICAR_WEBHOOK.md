# ✅ Verificar el Webhook - Solución

## 🔍 Problema Detectado:

El webhook devuelve "Forbidden" porque:
- El `.env` puede estar en `src/.env` en lugar de la raíz
- O el servidor no está leyendo las variables correctamente

---

## ✅ Solución:

### Paso 1: Verificar Ubicación del .env

El `.env` debe estar en la **raíz del proyecto**, no en `src/`.

**Ubicación correcta:**
```
C:\Users\leona\Desktop\Inmobiliariaenequipo\.env
```

**NO debe estar en:**
```
C:\Users\leona\Desktop\Inmobiliariaenequipo\src\.env
```

---

### Paso 2: Crear/Verificar .env en la Raíz

**Crea un archivo `.env` en la raíz** con esto:

```env
PORT=3000
DATABASE_URL=postgresql://neondb_owner:npg_E4b3LfDnpVAs@ep-patient-dew-a4zwqdrx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# WhatsApp Business API
WHATSAPP_VERIFY_TOKEN=chatbot_inmobiliaria_2024
WHATSAPP_ACCESS_TOKEN=EAAMbMyfQZAGcBQfXZAeyNvvkKjg5Oh4K56NbKkWROYc8jdYbx738za0j3qDrBFCS1wsv9SYZBG5FXLQCNAPHdyBv5HXZCwjEhi03GX0zy8KFEQhD6KfIZB5Ye9x3xIZAag5eYvsMWChnwMZCKeOefmDRy4gpTJjy2bE8r3I4lZB9epUvWT13Me8IlSDUG1GDGOPRFotML6bh9lLpq4zghG8SUZAmUVNAtFyhutXbTQLRmlZCeZCsKaTImwlBxz7h0ZCmaYVfjkseDUevuNdRf372Fy4YXUgZD
WHATSAPP_PHONE_NUMBER_ID=878773181991861
```

---

### Paso 3: Reiniciar el Servidor

**IMPORTANTE:** Después de crear/actualizar el `.env`:

1. **Detén el servidor** (Ctrl+C en la terminal donde corre `npm run dev`)
2. **Reinícialo:**
   ```bash
   npm run dev
   ```

**Esto es necesario** para que el servidor lea el `.env` actualizado.

---

### Paso 4: Probar el Webhook de Nuevo

**Abre en el navegador:**
```
https://48712bbc1a7c.ngrok-free.app/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=chatbot_inmobiliaria_2024&hub.challenge=test123
```

**Ahora deberías ver:** `test123` (en lugar de "Forbidden")

---

### Paso 5: Verificar en Meta

1. **Ve a Meta → Configuración → Webhook**
2. **Click en "Verificar y guardar"** (botón azul)
3. **Debería funcionar** ✅

---

## ✅ Checklist:

- [ ] `.env` está en la raíz del proyecto (no en `src/`)
- [ ] `.env` tiene `WHATSAPP_VERIFY_TOKEN=chatbot_inmobiliaria_2024`
- [ ] Servidor reiniciado después de crear/actualizar `.env`
- [ ] Webhook responde `test123` en el navegador
- [ ] Webhook verificado en Meta

---

## 🚀 Siguiente:

1. **Crea/verifica el `.env` en la raíz**
2. **Reinicia el servidor**
3. **Prueba el webhook en el navegador**
4. **Verifica en Meta**

¿Ya creaste el `.env` en la raíz? ¿Reiniciaste el servidor?


