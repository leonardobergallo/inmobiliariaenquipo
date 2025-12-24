/**
 * Servicio de búsqueda de propiedades usando IA (OpenAI o Perplexity)
 * Este servicio busca propiedades reales basándose en los criterios del cliente
 * 
 * En TypeScript, a diferencia de JavaScript, definimos interfaces para estructurar
 * los datos que recibimos de la IA, lo que nos ayuda a detectar errores antes
 * de ejecutar el código.
 */

import { Lead } from '../types';

export interface PropertyResult {
  title: string;
  description: string;
  price?: string;
  location?: string;
  bedrooms?: string;
  link?: string;
}

export class PropertySearchService {
  private openaiApiKey: string | undefined;
  private perplexityApiKey: string | undefined;
  private openaiApiUrl = 'https://api.openai.com/v1/chat/completions';
  private perplexityApiUrl = 'https://api.perplexity.ai/chat/completions';
  private useOpenAI: boolean;

  constructor() {
    // Para búsquedas en internet, Perplexity es mejor porque busca en tiempo real
    // Si tenemos Perplexity, usarlo; sino usar OpenAI
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.perplexityApiKey = process.env.PERPLEXITY_API_KEY;
    // Priorizar Perplexity para búsquedas reales en internet
    this.useOpenAI = !this.perplexityApiKey && !!this.openaiApiKey;
  }

  /**
   * Busca propiedades usando IA (OpenAI o Perplexity) basándose en los criterios del lead
   */
  async searchProperties(lead: Lead): Promise<PropertyResult[]> {
    // Si no hay API key configurada, retornar búsqueda simulada
    if (!this.openaiApiKey && !this.perplexityApiKey) {
      console.log('⚠️ [PropertySearch] No hay API key de IA configurada. Usando búsqueda simulada.');
      return this.getSimulatedProperties(lead);
    }

    try {
      // Construir query de búsqueda mejorada
      const searchQuery = this.buildSearchQuery(lead);
      
      console.log(`🔍 [PropertySearch] Buscando con ${this.useOpenAI ? 'OpenAI' : 'Perplexity'}: ${searchQuery}`);

      // Construir el prompt del sistema mejorado para búsqueda real en internet
      const systemPrompt = `Eres un experto en búsqueda de propiedades inmobiliarias en Argentina.
Tu tarea es buscar propiedades REALES en portales inmobiliarios.

CRÍTICO - LEE ESTO:
1. NO INVENTES propiedades. Solo genera propiedades si tienes información REAL de portales inmobiliarios
2. Si no encuentras propiedades reales, retorna un array vacío []
3. Busca en: Zonaprop.com.ar, Argenprop.com, MercadoLibre Inmuebles
4. Incluye propiedades con precios en PESOS ($) Y en DÓLARES (USD)
5. Los precios deben ser REALES del mercado, no inventados
6. Incluye enlaces reales cuando los encuentres

IMPORTANTE SOBRE PRECIOS:
- Precios en pesos: formato "$X.XXX.XXX" (ej: "$150.000" o "$2.500.000")
- Precios en dólares: formato "USD X.XXX" (ej: "USD 50.000" o "USD 120.000")
- Los precios deben ser REALISTAS para el mercado argentino actual

Formato JSON requerido (SOLO si encuentras propiedades REALES):
[
  {
    "title": "Título real de la propiedad",
    "description": "Descripción real (100-150 caracteres)",
    "price": "$X.XXX.XXX" o "USD X.XXX",
    "location": "Ubicación específica real",
    "bedrooms": "Número real",
    "link": "URL real del portal (opcional)"
  }
]

Si NO encuentras propiedades reales, responde: []

Responde SOLO con un JSON array válido, sin texto adicional.`;

      // Llamar a la API correspondiente
      // Perplexity es mejor para búsquedas en internet en tiempo real
      const apiUrl = this.useOpenAI ? this.openaiApiUrl : this.perplexityApiUrl;
      const apiKey = this.useOpenAI ? this.openaiApiKey! : this.perplexityApiKey!;
      // Usar modelo de Perplexity que busca en internet en tiempo real
      const model = this.useOpenAI ? 'gpt-3.5-turbo' : 'llama-3.1-sonar-large-128k-online';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: searchQuery
            }
          ],
          temperature: 0.2, // Bajo para respuestas más precisas
          max_tokens: 2500, // Más tokens para incluir más propiedades
          // Para Perplexity, el modelo ya busca en internet automáticamente
          // No necesitamos parámetros adicionales
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ [PropertySearch] Error en API ${this.useOpenAI ? 'OpenAI' : 'Perplexity'}:`, response.status, errorText);
        return this.getSimulatedProperties(lead);
      }

      // Tipar la respuesta de la API
      const data = await response.json() as {
        choices?: Array<{
          message?: {
            content?: string;
          };
        }>;
      };
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        console.error(`❌ [PropertySearch] No se recibió contenido de ${this.useOpenAI ? 'OpenAI' : 'Perplexity'}`);
        return this.getSimulatedProperties(lead);
      }

      console.log(`📝 [PropertySearch] Respuesta recibida: ${content.substring(0, 200)}...`);

      // Intentar parsear la respuesta como JSON
      try {
        // Limpiar el contenido para extraer solo el JSON
        let jsonContent = content.trim();
        
        // Si está envuelto en markdown code blocks, extraerlo
        const jsonMatch = jsonContent.match(/```(?:json)?\s*(\[{[\s\S]*}\])\s*```/);
        if (jsonMatch) {
          jsonContent = jsonMatch[1];
        }
        
        // Si empieza con texto antes del JSON, intentar extraerlo
        const arrayMatch = jsonContent.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
          jsonContent = arrayMatch[0];
        }

        const properties = JSON.parse(jsonContent);
        
        if (Array.isArray(properties)) {
          if (properties.length === 0) {
            console.log(`⚠️ [PropertySearch] La IA no encontró propiedades reales. Retornando array vacío.`);
            return [];
          }
          console.log(`✅ [PropertySearch] Encontradas ${properties.length} propiedades desde IA`);
          // Validar y limpiar las propiedades
          const cleaned = this.validateAndCleanProperties(properties.slice(0, 5));
          console.log(`✅ [PropertySearch] Propiedades validadas: ${cleaned.length}`);
          return cleaned;
        }
      } catch (parseError) {
        console.error('❌ [PropertySearch] Error parseando JSON:', parseError);
        console.log('📝 Contenido recibido:', content);
        // Intentar extraer información del texto
        return this.parseTextResponse(content, lead);
      }

      return this.getSimulatedProperties(lead);
    } catch (error) {
      console.error('❌ [PropertySearch] Error buscando propiedades:', error);
      return this.getSimulatedProperties(lead);
    }
  }

  /**
   * Valida y limpia las propiedades recibidas de la IA
   */
  private validateAndCleanProperties(properties: any[]): PropertyResult[] {
    return properties
      .filter(prop => prop && typeof prop === 'object')
      .map(prop => ({
        title: prop.title || 'Propiedad',
        description: prop.description || '',
        price: prop.price || undefined,
        location: prop.location || undefined,
        bedrooms: prop.bedrooms?.toString() || undefined,
        link: prop.link || undefined,
      }))
      .filter(prop => prop.title && prop.description);
  }

  /**
   * Construye la query de búsqueda mejorada basándose en los criterios del lead
   * Ahora busca en portales inmobiliarios y acepta precios en dólares
   */
  private buildSearchQuery(lead: Lead): string {
    const parts: string[] = [];

    // Construir query más específica y clara
    if (lead.interes === 'alquilar') {
      parts.push('Busco propiedades en ALQUILER');
    } else if (lead.interes === 'comprar') {
      parts.push('Busco propiedades en VENTA');
    } else {
      parts.push('Busco propiedades');
    }

    if (lead.zona) {
      // Si es Santa Fe, buscar específicamente en portales de Santa Fe
      if (lead.zona.toLowerCase().includes('santa fe')) {
        parts.push(`en Santa Fe, Argentina. Busca en portales inmobiliarios como:`);
        parts.push(`- Zonaprop.com.ar (Santa Fe)`);
        parts.push(`- Argenprop.com (Santa Fe)`);
        parts.push(`- MercadoLibre Inmuebles (Santa Fe)`);
        parts.push(`- Inmobiliarias de Santa Fe`);
        parts.push(`- Clasificados de Santa Fe`);
      } else {
        parts.push(`en la zona de ${lead.zona}, Argentina`);
      }
    } else {
      parts.push('en Argentina');
    }

    if (lead.tipoPropiedad) {
      parts.push(`tipo ${lead.tipoPropiedad}`);
    }

    if (lead.presupuesto) {
      const budget = lead.presupuesto.toLocaleString('es-AR');
      const moneda = lead.presupuestoMoneda || 'pesos';
      
      if (lead.interes === 'alquilar') {
        if (moneda === 'dolares') {
          parts.push(`con presupuesto máximo de USD ${budget} mensuales`);
        } else {
          parts.push(`con presupuesto máximo de $${budget} mensuales (o equivalente en USD)`);
        }
      } else {
        if (moneda === 'dolares') {
          parts.push(`con presupuesto máximo de USD ${budget}`);
        } else {
          parts.push(`con presupuesto máximo de $${budget} (o equivalente en USD)`);
        }
      }
    }

    if (lead.dormitorios) {
      parts.push(`con ${lead.dormitorios} dormitorios`);
    }

    // Instrucciones mejoradas para la IA
    parts.push(`
IMPORTANTE:
1. Busca propiedades REALES en portales inmobiliarios de Santa Fe (Zonaprop, Argenprop, MercadoLibre, etc.)
2. Incluye propiedades con precios en PESOS ($) Y en DÓLARES (USD)
3. Si encuentras propiedades en dólares, inclúyelas también
4. Busca en todas las páginas y portales de Santa Fe disponibles
5. Incluye enlaces reales cuando sea posible

Genera 3-5 propiedades REALES y VARIADAS que cumplan estos criterios.
Cada propiedad debe tener:
- Título descriptivo (ej: "Casa en Candiotti, 3 dormitorios")
- Descripción detallada (100-150 caracteres) con características específicas
- Precio en formato: "$X.XXX.XXX" (pesos) o "USD X.XXX" (dólares) - INCLUYE AMBOS
- Ubicación específica (barrio, calle aproximada, o zona de Santa Fe)
- Cantidad de dormitorios
- Enlace real del portal inmobiliario si está disponible

Responde SOLO con un JSON array válido con este formato:
[
  {
    "title": "Título de la propiedad",
    "description": "Descripción detallada",
    "price": "$X.XXX.XXX" o "USD X.XXX",
    "location": "Ubicación específica en Santa Fe",
    "bedrooms": "Número",
    "link": "URL del portal inmobiliario (si está disponible)"
  }
]`);

    return parts.join(' ');
  }

  /**
   * Parsea una respuesta de texto de Perplexity y extrae información de propiedades
   */
  private parseTextResponse(text: string, lead: Lead): PropertyResult[] {
    const properties: PropertyResult[] = [];
    
    // Buscar patrones de propiedades en el texto
    const propertyPatterns = [
      /(?:departamento|casa|propiedad)[^.]*?(\$\d+(?:\.\d+)?)[^.]*?(\d+\s*dormitorios?)?[^.]*?/gi,
    ];

    // Extraer información básica
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    lines.forEach((line, index) => {
      if (line.toLowerCase().includes('departamento') || 
          line.toLowerCase().includes('casa') || 
          line.toLowerCase().includes('propiedad')) {
        
        const priceMatch = line.match(/\$?(\d+(?:\.\d+)?)/);
        const bedroomMatch = line.match(/(\d+)\s*dormitorios?/i);
        
        properties.push({
          title: `Propiedad ${index + 1}`,
          description: line.substring(0, 200),
          price: priceMatch ? `$${priceMatch[1]}` : undefined,
          bedrooms: bedroomMatch ? bedroomMatch[1] : undefined,
          location: lead.zona || undefined,
        });
      }
    });

    // Si no se encontraron propiedades, crear una respuesta genérica
    if (properties.length === 0) {
      return this.getSimulatedProperties(lead);
    }

    return properties.slice(0, 5);
  }

  /**
   * Retorna propiedades simuladas cuando no hay API key o hay error
   */
  private getSimulatedProperties(lead: Lead): PropertyResult[] {
    const properties: PropertyResult[] = [];

    // Generar 2-3 propiedades simuladas basadas en los criterios
    const numProperties = Math.floor(Math.random() * 2) + 2;

    for (let i = 0; i < numProperties; i++) {
      const basePrice = lead.presupuesto || 100000;
      const priceVariation = basePrice * (0.8 + Math.random() * 0.4); // ±20% variación

      properties.push({
        title: `${lead.tipoPropiedad || 'Propiedad'} en ${lead.zona || 'zona solicitada'}`,
        description: `${lead.tipoPropiedad || 'Propiedad'} con ${lead.dormitorios || '2'} dormitorios, ubicada en ${lead.zona || 'la zona solicitada'}. Excelente ubicación y estado.`,
        price: `$${Math.round(priceVariation).toLocaleString('es-AR')}`,
        location: lead.zona || 'Zona solicitada',
        bedrooms: lead.dormitorios?.toString() || '2',
      });
    }

    return properties;
  }

  /**
   * Formatea las propiedades encontradas para mostrar al cliente
   * Formato mejorado, organizado y con números claros
   */
  formatPropertiesForClient(properties: PropertyResult[]): string {
    if (properties.length === 0) {
      return '\n❌ No se encontraron propiedades disponibles en este momento.\n\n💡 ¿Querés que un *asesor te contacte* para ayudarte a encontrar lo que buscás?';
    }

    // Encabezado claro y organizado
    let message = `\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🏠 *OPCIONES DISPONIBLES*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

      // Listar cada propiedad de forma clara y organizada con números
      properties.forEach((prop, index) => {
        const numero = index + 1;
        
        // Número y título destacado
        message += `*${numero}. ${prop.title}*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        
        // Información organizada - Precio destacado con moneda clara
        if (prop.price) {
          // Detectar si el precio está en dólares o pesos
          const priceUpper = prop.price.toUpperCase();
          if (priceUpper.includes('USD') || priceUpper.includes('DOLAR')) {
            message += `💲 *Precio:* ${prop.price}\n`;
          } else {
            message += `💵 *Precio:* ${prop.price}\n`;
          }
        }
      
      if (prop.location) {
        message += `📍 *Ubicación:* ${prop.location}\n`;
      }
      
      if (prop.bedrooms) {
        message += `🛏️ *Dormitorios:* ${prop.bedrooms}\n`;
      }
      
      if (prop.description) {
        const cleanDesc = prop.description.trim();
        // Limitar descripción a 120 caracteres para mejor legibilidad
        const shortDesc = cleanDesc.length > 120 ? cleanDesc.substring(0, 120) + '...' : cleanDesc;
        message += `📝 *Descripción:* ${shortDesc}\n`;
      }
      
      if (prop.link) {
        message += `🔗 *Ver más:* ${prop.link}\n`;
      }
      
      message += `\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `💡 ¿Querés que un *asesor te contacte* para más información o coordinar una visita?`;

    return message;
  }
}


