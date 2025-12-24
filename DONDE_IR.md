# 🎯 ¿Adónde Ir Ahora?

## ✅ Sigue Estos Pasos:

### 1. Ve al Dashboard de Meta for Developers

**URL directa:** https://developers.facebook.com/apps/

O desde donde estás:
- Click en el logo **"Meta"** (arriba a la izquierda)
- O ve directamente a: https://developers.facebook.com/

### 2. Crear o Seleccionar App

#### Si NO tienes una App:
1. Click en **"Crear App"** o **"Create App"** (botón verde/azul)
2. Tipo: **"Business"**
3. Completa:
   - Nombre: "Chatbot Inmobiliaria" (o el que quieras)
   - Email de contacto
4. Click en **"Crear App"**

#### Si YA tienes una App:
1. Selecciona tu App de la lista
2. Te llevará al dashboard de la App

### 3. Agregar WhatsApp a tu App

En el dashboard de tu App:

1. Busca en el menú lateral izquierdo: **"WhatsApp"**
2. O busca en "Agregar producto" / "Add Product"
3. Click en **"WhatsApp"** → **"Set up"** o **"Configurar"**

### 4. Obtener Credenciales

Una vez en la sección de WhatsApp, verás:

**"API Setup"** (arriba):
- **Phone Number ID** - Cópialo
- **Temporary Access Token** - Click en "Generate token" y cópialo
- **Verify Token** - TÚ lo creas (ej: `mi_token_123`)

**"Configuration"** (más abajo):
- Aquí configurarás el webhook después

---

## 🚀 Ruta Rápida:

1. **Ve a:** https://developers.facebook.com/apps/
2. **Crea/Selecciona App** → Tipo "Business"
3. **Agrega WhatsApp** como producto
4. **Ve a "API Setup"** → Copia credenciales
5. **Configura `.env`** con esas credenciales

---

## 📍 Ubicación Exacta de las Credenciales:

```
Meta for Developers
  └── Tu App
      └── WhatsApp (en el menú lateral)
          └── API Setup (pestaña)
              ├── Phone Number ID
              ├── Temporary Access Token
              └── Verify Token (tú lo creas)
```

---

## ⚠️ No te quedes en la documentación

La documentación es útil para leer después, pero **ahora necesitas**:
- ✅ Ir al dashboard
- ✅ Crear/seleccionar App
- ✅ Obtener credenciales

**La documentación la puedes leer después** cuando ya tengas todo configurado.


