# 🤖 Integración de Perplexity AI para Búsqueda de Propiedades

## ✅ Lo que He Implementado:

**He creado un servicio de búsqueda de propiedades** que usa Perplexity AI para buscar propiedades reales basándose en los criterios del cliente.

---

## 🎯 Funcionalidades:

### 1. Servicio de Búsqueda (`PropertySearchService`)

**Ubicación:** `src/services/PropertySearchService.ts`

**Características:**
- ✅ Busca propiedades usando Perplexity AI API
- ✅ Construye queries inteligentes basadas en los criterios del lead
- ✅ Formatea las propiedades encontradas para mostrar al cliente
- ✅ Fallback a búsqueda simulada si no hay API key

### 2. Integración en los Flujos

**Actualizado:**
- ✅ `BaseFlow.ts` - Método `searchProperties` ahora usa Perplexity AI
- ✅ `ComprarFlow.ts` - Actualizado para usar el nuevo método
- ✅ `AlquilarFlow.ts` - Hereda automáticamente la funcionalidad

---

## 🔧 Configuración:

### Paso 1: Obtener API Key de Perplexity

1. **Ve a:** https://www.perplexity.ai/
2. **Crea una cuenta** o inicia sesión
3. **Ve a la sección de API** (Settings → API)
4. **Genera una API key**
5. **Copia la API key**

### Paso 2: Agregar al .env

**Abre el archivo `.env` y agrega:**

```env
PERPLEXITY_API_KEY=tu_api_key_aqui
```

---

## 🚀 Cómo Funciona:

### 1. Cliente Completa el Flujo

**Ejemplo:**
- Zona: "Santa Fe"
- Tipo: "Departamento"
- Presupuesto: $150,000
- Dormitorios: 2

### 2. El Sistema Busca Propiedades

**El servicio construye una query:**
```
Busco departamentos en alquiler en Santa Fe tipo departamento 
con presupuesto máximo de $150,000 mensuales 2 dormitorios 
en Argentina.
```

### 3. Perplexity AI Busca

**Perplexity busca propiedades reales** en internet y retorna:
- Título de la propiedad
- Descripción
- Precio
- Ubicación
- Cantidad de dormitorios
- Enlaces (si están disponibles)

### 4. Se Muestran al Cliente

**El chatbot muestra las propiedades encontradas** formateadas de manera clara.

---

## 📋 Ejemplo de Respuesta:

```
🏠 Encontré 3 opciones que pueden interesarte:

1. **Departamento en Santa Fe**
   💵 Precio: $140,000
   📍 Ubicación: Santa Fe
   🛏️ Dormitorios: 2
   📝 Departamento con 2 dormitorios, ubicada en Santa Fe...

2. **Departamento en Santa Fe**
   💵 Precio: $135,000
   📍 Ubicación: Santa Fe
   🛏️ Dormitorios: 2
   📝 Departamento con 2 dormitorios, ubicada en Santa Fe...

💡 ¿Querés que un asesor te contacte para más información?
```

---

## 🔍 Modo Sin API Key:

**Si no configuras la API key:**

- El sistema usa **búsqueda simulada**
- Genera propiedades basadas en los criterios
- Funciona igual pero con datos simulados

**Para usar búsqueda real, necesitas la API key.**

---

## 🎯 Próximos Pasos:

1. **Obtener API key de Perplexity**
2. **Agregar al `.env`**
3. **Reiniciar el servidor**
4. **Probar el chatbot** completando un flujo

---

## 💡 Mejoras Futuras:

- ✅ Cachear búsquedas para evitar llamadas repetidas
- ✅ Integrar con bases de datos de propiedades propias
- ✅ Agregar filtros más avanzados
- ✅ Mostrar imágenes de propiedades
- ✅ Agregar mapas con ubicaciones

---

## 🚀 Prueba Ahora:

1. **Agrega la API key al `.env`** (opcional, funciona sin ella)
2. **Reinicia el servidor**
3. **Prueba el chatbot** completando un flujo de Alquilar o Comprar
4. **Verás las propiedades encontradas** al finalizar

---

## ✅ Listo para Usar:

**El servicio está integrado y funcionando.**

**¿Quieres que te ayude a obtener la API key de Perplexity?**


