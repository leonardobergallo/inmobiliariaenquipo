# 🔧 Ejecutar ngrok Correctamente

## ❌ Problema:

Ngrok se abre y se cierra inmediatamente.

---

## ✅ Soluciones:

### Opción 1: Ejecutar en Nueva Ventana (Recomendado)

**En PowerShell, ejecuta:**

```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "ngrok http 3000"
```

**Esto abrirá una nueva ventana** de PowerShell que se quedará abierta con ngrok corriendo.

---

### Opción 2: Ejecutar en Background

**En PowerShell, ejecuta:**

```powershell
Start-Job -ScriptBlock { ngrok http 3000 }
```

**Para ver los logs:**

```powershell
Receive-Job -Id 1
```

---

### Opción 3: Ejecutar Manualmente

1. **Abre una nueva ventana** de PowerShell o CMD
2. **Ejecuta:** `ngrok http 3000`
3. **Deja esa ventana abierta**
4. **Copia la URL** que aparece (ejemplo: `https://xxxx-xxxx-xxxx.ngrok-free.app`)

---

## 🎯 Pasos Rápidos:

1. **Ejecuta este comando:**
   ```powershell
   Start-Process powershell -ArgumentList "-NoExit", "-Command", "ngrok http 3000"
   ```

2. **Se abrirá una nueva ventana** con ngrok corriendo

3. **Copia la URL** que aparece (ejemplo: `https://xxxx-xxxx-xxxx.ngrok-free.app`)

4. **Actualiza el webhook en Meta** con esa URL:
   ```
   https://xxxx-xxxx-xxxx.ngrok-free.app/webhook/whatsapp
   ```

---

## ✅ Verificar que Funciona:

**En la nueva ventana de ngrok deberías ver:**

```
Forwarding  https://xxxx-xxxx-xxxx.ngrok-free.app -> http://localhost:3000
```

**Y debería quedarse abierta** mostrando las peticiones que llegan.

---

## 🚀 Ya Ejecuté el Comando:

**Debería haberse abierto una nueva ventana** con ngrok corriendo.

**¿Ves la nueva ventana?** ¿Qué URL aparece?


