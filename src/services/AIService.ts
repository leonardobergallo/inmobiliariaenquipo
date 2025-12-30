/**
 * Servicio de Inteligencia Artificial para mejorar las respuestas del chatbot
 * Soporta OpenAI y Perplexity AI para generar respuestas más naturales e inteligentes
 * 
 * En TypeScript, a diferencia de JavaScript, tenemos tipado estático que nos ayuda
 * a detectar errores antes de ejecutar el código. Esto es especialmente útil
 * cuando trabajamos con APIs externas.
 */

import { BotResponse, ChatState } from '../types';

// Interfaz para las opciones de configuración del servicio de IA
// En TypeScript definimos interfaces para estructurar nuestros datos
interface AIServiceConfig {
  provider: 'openai' | 'perplexity' | 'none';
  apiKey?: string;
  model?: string;
  temperature?: number;
}

// Interfaz para el contexto de la conversación
interface ConversationContext {
  userId: string;
  message: string;
  state?: ChatState | null;
  flowType?: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export class AIService {
  private config: AIServiceConfig;
  private openaiApiUrl = 'https://api.openai.com/v1/chat/completions';
  private perplexityApiUrl = 'https://api.perplexity.ai/chat/completions';

  constructor() {
    // Leer configuración desde variables de entorno
    // En JavaScript usaríamos process.env directamente, pero TypeScript
    // nos ayuda a manejar valores undefined de forma más segura
    const provider = (process.env.AI_PROVIDER || 'none') as 'openai' | 'perplexity' | 'none';
    const apiKey = process.env.OPENAI_API_KEY || process.env.PERPLEXITY_API_KEY;
    
    this.config = {
      provider: provider === 'openai' || provider === 'perplexity' ? provider : 'none',
      apiKey: apiKey,
      model: process.env.AI_MODEL || (provider === 'openai' ? 'gpt-3.5-turbo' : 'llama-3.1-sonar-large-128k-online'),
      temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
    };

    // Si hay API key pero no provider específico, intentar detectar automáticamente
    if (!this.config.apiKey && process.env.OPENAI_API_KEY) {
      this.config.provider = 'openai';
      this.config.apiKey = process.env.OPENAI_API_KEY;
    } else if (!this.config.apiKey && process.env.PERPLEXITY_API_KEY) {
      this.config.provider = 'perplexity';
      this.config.apiKey = process.env.PERPLEXITY_API_KEY;
    }
  }

  /**
   * Genera una respuesta inteligente basada en el contexto de la conversación
   * Este método usa IA para mejorar las respuestas del chatbot
   */
  async generateIntelligentResponse(context: ConversationContext): Promise<string | null> {
    // Si no hay configuración de IA, retornar null para usar respuestas por defecto
    if (this.config.provider === 'none' || !this.config.apiKey) {
      console.log('⚠️ [AIService] No hay configuración de IA. Usando respuestas por defecto.');
      return null;
    }

    try {
      // Construir el prompt del sistema según el contexto
      const systemPrompt = this.buildSystemPrompt(context);
      
      // Construir el historial de mensajes
      const messages = this.buildMessages(systemPrompt, context);

      console.log(`🤖 [AIService] Generando respuesta con ${this.config.provider}...`);

      // Llamar a la API correspondiente
      const response = await this.callAIAPI(messages);

      if (response) {
        console.log(`✅ [AIService] Respuesta generada exitosamente`);
        return response;
      }

      return null;
    } catch (error) {
      console.error('❌ [AIService] Error generando respuesta:', error);
      return null; // Fallback a respuestas por defecto
    }
  }

  /**
   * Mejora una respuesta existente usando IA
   * Útil para hacer las respuestas más naturales y personalizadas
   */
  async enhanceResponse(originalResponse: string, context: ConversationContext): Promise<string> {
    const enhanced = await this.generateIntelligentResponse({
      ...context,
      message: `Mejora esta respuesta del chatbot haciéndola más natural y amigable: "${originalResponse}"`,
    });

    // Si la IA no puede mejorar, usar la respuesta original
    return enhanced || originalResponse;
  }

  /**
   * Detecta la intención del usuario de forma más inteligente
   * Usa IA para entender mejor qué quiere el usuario
   */
  async detectUserIntent(message: string, context?: ConversationContext): Promise<{
    intent: string;
    confidence: number;
    entities?: Record<string, any>;
  }> {
    if (this.config.provider === 'none' || !this.config.apiKey) {
      // Fallback a detección básica
      return this.basicIntentDetection(message);
    }

    try {
      const systemPrompt = `Eres un asistente especializado en detectar intenciones en conversaciones de inmobiliaria.
Analiza el mensaje del usuario y determina:
1. La intención principal (alquilar, comprar, vender, tasacion, contacto, pregunta_general, otro)
2. El nivel de confianza (0-1)
3. Entidades mencionadas (zona, tipo_propiedad, presupuesto, etc.)

Responde SOLO con un JSON válido en este formato:
{
  "intent": "intención_detectada",
  "confidence": 0.95,
  "entities": {
    "zona": "valor si existe",
    "tipo_propiedad": "valor si existe",
    "presupuesto": "valor si existe"
  }
}`;

      const messages = [
        { role: 'system' as const, content: systemPrompt },
        { role: 'user' as const, content: message },
      ];

      const response = await this.callAIAPI(messages);
      
      if (response) {
        try {
          const parsed = JSON.parse(response);
          return {
            intent: parsed.intent || 'otro',
            confidence: parsed.confidence || 0.5,
            entities: parsed.entities || {},
          };
        } catch (parseError) {
          console.error('❌ [AIService] Error parseando respuesta de intención:', parseError);
        }
      }
    } catch (error) {
      console.error('❌ [AIService] Error detectando intención:', error);
    }

    // Fallback a detección básica
    return this.basicIntentDetection(message);
  }

  /**
   * Construye el prompt del sistema según el contexto
   */
  private buildSystemPrompt(context: ConversationContext): string {
    const basePrompt = `Eres un asistente virtual amigable y profesional de una inmobiliaria en Argentina.
Tu objetivo es ayudar a los clientes de manera clara, concisa y amigable.
Responde siempre en español argentino, usando "vos" en lugar de "tú".
Sé empático, profesional y útil.`;

    // Agregar contexto del flujo si existe
    if (context.flowType) {
      const flowContexts: Record<string, string> = {
        alquilar: 'El cliente está buscando propiedades en alquiler.',
        comprar: 'El cliente está buscando comprar una propiedad.',
        vender: 'El cliente quiere vender su propiedad.',
        tasacion: 'El cliente quiere tasar su propiedad.',
      };

      return `${basePrompt}\n\n${flowContexts[context.flowType] || ''}`;
    }

    return basePrompt;
  }

  /**
   * Construye el array de mensajes para la API
   */
  private buildMessages(systemPrompt: string, context: ConversationContext): Array<{ role: 'user' | 'assistant' | 'system'; content: string }> {
    const messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ];

    // Agregar historial de conversación si existe
    if (context.conversationHistory && context.conversationHistory.length > 0) {
      // Incluir solo los últimos 5 mensajes para no exceder límites
      const recentHistory = context.conversationHistory.slice(-5);
      recentHistory.forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      });
    }

    // Agregar el mensaje actual
    messages.push({
      role: 'user',
      content: context.message,
    });

    return messages;
  }

  /**
   * Llama a la API de IA correspondiente
   */
  private async callAIAPI(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>): Promise<string | null> {
    const apiUrl = this.config.provider === 'openai' ? this.openaiApiUrl : this.perplexityApiUrl;
    const apiKey = this.config.apiKey!;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: messages,
          temperature: this.config.temperature,
          max_tokens: 500, // Limitar tokens para respuestas concisas
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData: any = {};
        try {
          errorData = JSON.parse(errorText);
        } catch {
          // Si no se puede parsear, usar el texto como está
        }
        
        // Detectar error de cuota insuficiente
        if (response.status === 429 && errorData.error?.code === 'insufficient_quota') {
          console.error(`⚠️ [AIService] Cuota de OpenAI agotada. El servicio usará respuestas por defecto.`);
          console.error(`💡 [AIService] Sugerencia: Configura PERPLEXITY_API_KEY como alternativa o actualiza tu plan de OpenAI.`);
          
          // Si hay Perplexity configurado, intentar usarlo como fallback
          if (this.config.provider === 'openai' && process.env.PERPLEXITY_API_KEY) {
            console.log(`🔄 [AIService] Intentando usar Perplexity como fallback...`);
            this.config.provider = 'perplexity';
            this.config.apiKey = process.env.PERPLEXITY_API_KEY;
            this.config.model = 'llama-3.1-sonar-large-128k-online';
            // Intentar nuevamente con Perplexity
            return this.callAIAPI(messages);
          }
        } else {
          console.error(`❌ [AIService] Error en API ${this.config.provider}:`, response.status, errorText);
        }
        return null;
      }

      // En TypeScript, necesitamos tipar la respuesta de la API
      // A diferencia de JavaScript donde podríamos acceder directamente,
      // aquí definimos la estructura esperada
      const data = await response.json() as {
        choices?: Array<{
          message?: {
            content?: string;
          };
        }>;
      };
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        console.error(`❌ [AIService] No se recibió contenido de ${this.config.provider}`);
        return null;
      }

      return content.trim();
    } catch (error) {
      console.error(`❌ [AIService] Error llamando a ${this.config.provider}:`, error);
      return null;
    }
  }

  /**
   * Detección básica de intención sin IA (fallback)
   */
  private basicIntentDetection(message: string): {
    intent: string;
    confidence: number;
    entities?: Record<string, any>;
  } {
    const lowerMessage = message.toLowerCase();
    
    // Detectar intenciones básicas
    if (lowerMessage.includes('alquilar') || lowerMessage.includes('alquiler')) {
      return { intent: 'alquilar', confidence: 0.8 };
    }
    if (lowerMessage.includes('comprar') || lowerMessage.includes('compra')) {
      return { intent: 'comprar', confidence: 0.8 };
    }
    if (lowerMessage.includes('vender') || lowerMessage.includes('venta')) {
      return { intent: 'vender', confidence: 0.8 };
    }
    if (lowerMessage.includes('tasacion') || lowerMessage.includes('tasar') || lowerMessage.includes('valorar')) {
      return { intent: 'tasacion', confidence: 0.8 };
    }
    if (lowerMessage.includes('asesor') || lowerMessage.includes('humano') || lowerMessage.includes('contacto')) {
      return { intent: 'contacto', confidence: 0.8 };
    }

    return { intent: 'otro', confidence: 0.5 };
  }

  /**
   * Verifica si el servicio de IA está configurado y disponible
   */
  isAvailable(): boolean {
    return this.config.provider !== 'none' && !!this.config.apiKey;
  }

  /**
   * Obtiene información sobre la configuración actual
   */
  getConfig(): AIServiceConfig {
    return { ...this.config }; // Retornar copia para no exponer el objeto interno
  }
}

