# 📞 Guía: Cómo Funciona la Captura de Teléfono

## 🔄 Flujo Completo de Captura de Datos

### 1️⃣ Durante la Conversación

El chatbot pregunta al final de cada flujo:

**Ejemplo en el flujo de Alquilar:**
```
Bot: 📞 ¿Cuál es tu nombre y teléfono? (ej: "Juan, 11-1234-5678")
Usuario: Juan Pérez, 11-1234-5678
```

### 2️⃣ Extracción Automática

El sistema **extrae automáticamente**:
- ✅ **Nombre**: "Juan Pérez"
- ✅ **Teléfono**: "1112345678" (limpia guiones y espacios)
- ✅ **WhatsApp**: Se guarda el mismo número para contacto

### 3️⃣ Almacenamiento en Base de Datos

Los datos se guardan en la tabla `leads` con estos campos:

```sql
- nombre: "Juan Pérez"
- telefono: "1112345678"
- whatsapp: "1112345678"
- interes: "alquilar"
- zona: "Palermo"
- tipo_propiedad: "departamento"
- presupuesto: 150000
- estado: "nuevo" o "calificado"
```

### 4️⃣ Acceso para Asesores

Los asesores pueden ver los leads de 3 formas:

#### Opción A: API REST (Para integración con CRM)
```bash
# Ver todos los leads
GET http://localhost:3000/api/admin/leads

# Ver leads nuevos (sin contactar)
GET http://localhost:3000/api/admin/leads/estado/nuevo

# Ver leads por interés
GET http://localhost:3000/api/admin/leads/interes/alquilar
```

#### Opción B: Consulta Directa a PostgreSQL
```sql
-- Ver todos los leads con teléfono
SELECT nombre, telefono, whatsapp, interes, zona, estado, created_at 
FROM leads 
WHERE telefono IS NOT NULL
ORDER BY created_at DESC;

-- Leads nuevos para contactar
SELECT * FROM leads 
WHERE estado = 'nuevo' 
AND telefono IS NOT NULL;
```

#### Opción C: Dashboard Web (Futuro)
- Lista de leads con botón "Llamar" o "WhatsApp"
- Filtros por estado, interés, fecha
- Exportar a Excel/CSV

## 📋 Formato de Teléfono Aceptado

El sistema acepta estos formatos:
- ✅ `11-1234-5678`
- ✅ `11 1234 5678`
- ✅ `1112345678`
- ✅ `(11) 1234-5678`
- ✅ `+54 11 1234-5678`

**El sistema limpia automáticamente** guiones, espacios y paréntesis.

## 🎯 Estados del Lead

1. **nuevo**: Lead recién captado, necesita contacto
2. **calificado**: Lead con información completa (automático en compras)
3. **en_seguimiento**: Asesor ya lo contactó
4. **derivado**: Lead derivado a asesor humano

## 💡 Ejemplo Práctico

### Conversación:
```
Usuario: Alquilar
Bot: ¿En qué zona?
Usuario: Palermo
Bot: ¿Tipo de propiedad?
Usuario: Departamento
Bot: ¿Presupuesto?
Usuario: 150000
Bot: ¿Dormitorios?
Usuario: 2
Bot: ¿Fecha de ingreso?
Usuario: En 1 mes
Bot: ¿Nombre y teléfono?
Usuario: María González, 11-4567-8901
```

### Resultado en Base de Datos:
```json
{
  "nombre": "María González",
  "telefono": "1145678901",
  "whatsapp": "1145678901",
  "interes": "alquilar",
  "zona": "Palermo",
  "tipo_propiedad": "departamento",
  "presupuesto": 150000,
  "dormitorios": 2,
  "fecha_ingreso": "En 1 mes",
  "estado": "nuevo",
  "created_at": "2025-12-23T12:00:00Z"
}
```

## 🚀 Próximos Pasos Recomendados

1. **Notificaciones**: Alertar a asesores cuando hay un lead nuevo
2. **Integración WhatsApp**: Botón directo para contactar vía WhatsApp
3. **Dashboard Web**: Interfaz visual para gestionar leads
4. **Exportación**: Exportar leads a Excel/CSV
5. **Seguimiento**: Historial de contactos con cada lead


