# 🔧 Solución: Puerto 3000 Ya en Uso

## ❌ Error:

`Error: listen EADDRINUSE: address already in use ::: 3000`

**Significa:** Ya hay otro proceso usando el puerto 3000.

---

## ✅ Solución Rápida:

### Opción 1: Detener el Proceso Anterior

**En PowerShell:**

```powershell
# Encontrar el proceso
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# Detenerlo (reemplaza PID con el número que aparezca)
Stop-Process -Id PID -Force
```

### Opción 2: Detener Todos los Procesos Node

```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Opción 3: Cambiar el Puerto

Si no puedes detener el proceso, cambia el puerto en `.env`:

```env
PORT=3001
```

Y actualiza ngrok:
```bash
ngrok http 3001
```

---

## 🚀 Pasos Rápidos:

1. **Detén todos los procesos Node:**
   ```powershell
   Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
   ```

2. **Espera 2 segundos**

3. **Inicia el servidor de nuevo:**
   ```bash
   npm run dev
   ```

---

## ✅ Después de Solucionar:

Una vez que el servidor inicie correctamente:

1. **Verifica:** `http://localhost:3000/health`
2. **Verifica ngrok:** Debe estar apuntando al puerto correcto
3. **Prueba el chatbot:** Envía "Hola" desde WhatsApp

---

## 🎯 Ejecuta Esto:

Te voy a detener los procesos automáticamente. Luego reinicia el servidor.


