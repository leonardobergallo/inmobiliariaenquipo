# 🚀 Comando para Ejecutar ngrok

## ✅ Comando Correcto:

En la terminal donde estás (la de ngrok), ejecuta:

```bash
ngrok http 3000
```

O si estás en Windows y necesitas el .exe:

```bash
ngrok.exe http 3000
```

---

## 📋 Pasos:

1. **En la terminal de ngrok** (donde estás ahora)
2. **Escribe**: `ngrok http 3000`
3. **Presiona Enter**
4. **Verás algo como esto:**

```
ngrok

Session Status                online
Account                       tu-email@ejemplo.com
Version                       3.x.x
Region                        United States (us)
Latency                       45ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

---

## 🎯 Lo Importante:

**Copia la URL que dice "Forwarding":**

```
https://abc123.ngrok.io
```

**Esta es la URL que necesitas para el webhook en Meta.**

---

## ✅ Después:

1. **Copia esa URL** (ej: `https://abc123.ngrok.io`)
2. **Ve a Meta → Configuración → Webhook**
3. **En "URL de devolución de llamada"** pon: `https://abc123.ngrok.io/webhook/whatsapp`
4. **Click en "Verificar y guardar"**

---

## 🚀 Ejecuta Ahora:

En la terminal, escribe:

```bash
ngrok http 3000
```

**¿Qué URL te aparece?**


