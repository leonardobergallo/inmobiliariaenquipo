# 🤖 Configuración de Inteligencia Artificial

## ✅ Lo que se ha implementado:

He integrado un **servicio de IA completo** que mejora significativamente las respuestas del chatbot:

### 🎯 Funcionalidades:

1. **Detección Inteligente de Intenciones**
   - Usa IA para entender mejor qué quiere el usuario
   - Soporta lenguaje natural más flexible
   - Detecta intenciones con mayor precisión

2. **Respuestas Mejoradas**
   - Las respuestas del chatbot son más naturales y conversacionales
   - Personalización según el contexto de la conversación
   - Mejor comprensión del lenguaje natural

3. **Soporte Múltiple de Proveedores**
   - ✅ OpenAI (GPT-3.5, GPT-4, etc.)
   - ✅ Perplexity AI
   - ✅ Modo sin IA (funciona sin configuración)

---

## 🔧 Configuración:

### Opción 1: OpenAI (Recomendado)

**Ventajas:**
- Respuestas muy naturales y conversacionales
- Excelente comprensión del contexto
- Muy estable y confiable

**Pasos:**

1. **Obtener API Key de OpenAI:**
   - Ve a: https://platform.openai.com/
   - Crea una cuenta o inicia sesión
   - Ve a "API Keys" en el menú
   - Crea una nueva API key
   - Copia la key (empieza con `sk-`)

2. **Agregar al archivo `.env`:**
   ```env
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-tu_api_key_aqui
   AI_MODEL=gpt-3.5-turbo
   AI_TEMPERATURE=0.7
   ```

3. **Modelos disponibles:**
   - `gpt-3.5-turbo` (más económico, recomendado)
   - `gpt-4` (más potente, más caro)
   - `gpt-4-turbo` (balance entre precio y calidad)

---

### Opción 2: Perplexity AI

**Ventajas:**
- Incluye búsqueda en tiempo real
- Útil para información actualizada
- Bueno para búsqueda de propiedades

**Pasos:**

1. **Obtener API Key de Perplexity:**
   - Ve a: https://www.perplexity.ai/
   - Crea una cuenta o inicia sesión
   - Ve a la sección de API (Settings → API)
   - Genera una API key
   - Copia la key

2. **Agregar al archivo `.env`:**
   ```env
   AI_PROVIDER=perplexity
   PERPLEXITY_API_KEY=tu_api_key_aqui
   AI_MODEL=llama-3.1-sonar-large-128k-online
   AI_TEMPERATURE=0.7
   ```

---

### Opción 3: Sin IA (Modo por Defecto)

**Si no configuras ninguna API key:**
- El chatbot funciona normalmente
- Usa detección básica de palabras clave
- Respuestas predefinidas
- **No requiere configuración adicional**

---

## 📋 Variables de Entorno:

### Variables Requeridas (según proveedor):

**Para OpenAI:**
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-tu_api_key_aqui
```

**Para Perplexity:**
```env
AI_PROVIDER=perplexity
PERPLEXITY_API_KEY=tu_api_key_aqui
```

### Variables Opcionales:

```env
# Modelo a usar (por defecto según proveedor)
AI_MODEL=gpt-3.5-turbo

# Temperatura (0.0 = más determinista, 1.0 = más creativo)
# Recomendado: 0.7 para balance entre naturalidad y consistencia
AI_TEMPERATURE=0.7
```

---

## 🚀 Cómo Funciona:

### 1. Detección de Intenciones Mejorada

**Sin IA:**
```
Usuario: "Quiero alquilar algo"
Bot: Detecta "alquilar" → Inicia flujo de alquiler
```

**Con IA:**
```
Usuario: "Estoy buscando un lugar para vivir en alquiler"
Bot: IA detecta intención "alquilar" con 95% confianza → Inicia flujo
```

### 2. Respuestas Más Naturales

**Sin IA:**
```
Bot: "¿En qué zona buscás?"
```

**Con IA:**
```
Bot: "Perfecto, vamos a buscar la propiedad ideal para vos. 
¿En qué zona te gustaría que esté ubicada?"
```

### 3. Mejor Comprensión del Contexto

La IA entiende mejor:
- Preguntas complejas
- Variaciones en el lenguaje
- Contexto de la conversación
- Intenciones implícitas

---

## 💡 Ejemplos de Uso:

### Ejemplo 1: Usuario con lenguaje natural

**Usuario:** "Hola, estoy pensando en comprar mi primera casa"

**Sin IA:**
- Puede no detectar la intención correctamente
- Respuesta genérica

**Con IA:**
- Detecta: intención "comprar" + "primera vivienda"
- Respuesta personalizada: "¡Qué emoción! Comprar tu primera casa es un paso importante. Te voy a ayudar a encontrar la propiedad perfecta..."

### Ejemplo 2: Pregunta fuera del flujo

**Usuario:** "¿Cuánto cuesta un departamento en Palermo?"

**Sin IA:**
- Muestra menú principal
- No responde la pregunta

**Con IA:**
- Genera respuesta inteligente sobre precios en Palermo
- Ofrece iniciar búsqueda
- Mantiene contexto de la conversación

---

## 🔍 Verificar Configuración:

Para verificar que la IA está configurada correctamente:

1. **Reinicia el servidor:**
   ```bash
   npm run dev
   ```

2. **Busca en los logs:**
   - ✅ Si ves: `🤖 [AIService] Generando respuesta con openai...` → Está funcionando
   - ⚠️ Si ves: `⚠️ [AIService] No hay configuración de IA...` → No está configurada

3. **Prueba el chatbot:**
   - Envía un mensaje natural
   - Observa si las respuestas son más conversacionales
   - Verifica que detecta mejor las intenciones

---

## 💰 Costos Aproximados:

### OpenAI:
- **GPT-3.5-turbo:** ~$0.0015 por 1000 tokens (muy económico)
- **GPT-4:** ~$0.03 por 1000 tokens (más caro)
- Una conversación típica: ~500-1000 tokens = $0.0005 - $0.0015

### Perplexity:
- Consulta su página de precios actualizada
- Generalmente similar a OpenAI

**Recomendación:** Empieza con GPT-3.5-turbo, es muy económico y suficiente para la mayoría de casos.

---

## 🎯 Próximos Pasos:

1. **Elige un proveedor** (OpenAI recomendado)
2. **Obtén tu API key**
3. **Agrega las variables al `.env`**
4. **Reinicia el servidor**
5. **Prueba el chatbot** y observa las mejoras

---

## ✅ Listo para Usar:

Una vez configurado, el chatbot:
- ✅ Entiende mejor el lenguaje natural
- ✅ Genera respuestas más conversacionales
- ✅ Detecta intenciones con mayor precisión
- ✅ Se adapta mejor al contexto

**¿Necesitas ayuda para obtener una API key?** Puedo ayudarte con los pasos específicos.

