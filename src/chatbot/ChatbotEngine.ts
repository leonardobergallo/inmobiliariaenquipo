import { BotResponse, TipoInteres, Canal, ChatState } from '../types';
import { ChatStateManager } from './ChatStateManager';
import { AlquilarFlow } from './flows/AlquilarFlow';
import { ComprarFlow } from './flows/ComprarFlow';
import { VenderFlow } from './flows/VenderFlow';
import { TasacionFlow } from './flows/TasacionFlow';
import { BaseFlow } from './flows/BaseFlow';
import { LeadStorage } from '../storage/LeadStorage';
import { LeadModel } from '../models/Lead';
import { AIService } from '../services/AIService';
import { PropertySearchService } from '../services/PropertySearchService';

export class ChatbotEngine {
  private flows: Map<TipoInteres, BaseFlow> = new Map();
  private aiService: AIService; // Servicio de IA para mejorar respuestas

  constructor() {
    // Inicializar todos los flujos
    this.flows.set('alquilar', new AlquilarFlow());
    this.flows.set('comprar', new ComprarFlow());
    this.flows.set('vender', new VenderFlow());
    this.flows.set('tasacion', new TasacionFlow());
    
    // Inicializar servicio de IA
    // En TypeScript, a diferencia de JavaScript, podemos tener propiedades
    // privadas con tipado explícito que nos ayuda a detectar errores
    this.aiService = new AIService();
  }

  /**
   * Procesa un mensaje entrante del usuario
   */
  async processMessage(userId: string, message: string, canal: Canal = 'whatsapp'): Promise<BotResponse> {
    try {
      const state = await ChatStateManager.getState(userId);
      const lowerMessage = message.toLowerCase().trim();

      // Si el usuario quiere hablar con un agente después de ver propiedades
      if (state?.completed && (lowerMessage === 'contacto' || 
          lowerMessage === 'si' || 
          lowerMessage === 'sí' ||
          lowerMessage.includes('asesor') ||
          lowerMessage.includes('agente') ||
          lowerMessage.includes('hablar'))) {
        return await this.handleHumanRequest(userId);
      }

      // Si es un nuevo usuario o el flujo está completado, mostrar menú principal
      if (!state || state.completed) {
        return await this.handleMainMenu(userId, message);
      }

      // Si ya está en un flujo, continuar con ese flujo
      if (state.flow) {
        const flow = this.flows.get(state.flow);
        if (flow) {
          return await flow.processMessage(userId, message);
        }
      }

      // Si no hay flujo activo, mostrar menú principal
      return await this.handleMainMenu(userId, message);
    } catch (error) {
      // Log detallado del error
      console.error('❌ [ChatbotEngine] Error procesando mensaje:', error);
      if (error instanceof Error) {
        console.error('❌ [ChatbotEngine] Error message:', error.message);
        console.error('❌ [ChatbotEngine] Error stack:', error.stack);
      }
      return {
        text: '❌ Ocurrió un error. Por favor, intenta nuevamente o contacta con un asesor.',
      };
    }
  }

  /**
   * Maneja el menú principal del chatbot
   * Prioriza detección básica antes de usar IA para evitar errores
   */
  private async handleMainMenu(userId: string, message: string): Promise<BotResponse> {
    const lowerMessage = message.toLowerCase().trim();
    const state = await ChatStateManager.getState(userId);

    // PRIMERO: Detectar selección de opción del menú (método tradicional) - MÁS CONFIABLE
    const selectedFlow = this.detectFlowFromMessage(lowerMessage);
    if (selectedFlow) {
      const flow = this.flows.get(selectedFlow);
      if (flow) {
        await ChatStateManager.resetState(userId);
        await flow.initialize(userId);
        return await flow.processMessage(userId, 'start');
      }
    }

    // SEGUNDO: Detectar si el usuario pregunta directamente por propiedades en una zona
    const directPropertyRequest = this.detectDirectPropertyRequest(lowerMessage);
    if (directPropertyRequest) {
      return await this.handleDirectPropertyRequest(userId, directPropertyRequest);
    }

    // TERCERO: Detectar solicitud de asesor humano
    if (this.isHumanRequest(lowerMessage)) {
      return await this.handleHumanRequest(userId);
    }

    // CUARTO: Usar IA para detectar intención si está disponible (solo si no se detectó nada antes)
    if (this.aiService.isAvailable()) {
      try {
        const intentResult = await this.aiService.detectUserIntent(message, {
          userId,
          message,
          state: state || undefined,
        });

        // Si la IA detecta una intención con alta confianza, usarla
        if (intentResult.confidence > 0.8) {
          const intentFlowMap: Record<string, TipoInteres | null> = {
            alquilar: 'alquilar',
            comprar: 'comprar',
            vender: 'vender',
            tasacion: 'tasacion',
            contacto: null,
          };

          const detectedFlow = intentFlowMap[intentResult.intent];
          
          if (detectedFlow) {
            const flow = this.flows.get(detectedFlow);
            if (flow) {
              await ChatStateManager.resetState(userId);
              await flow.initialize(userId);
              return await flow.processMessage(userId, 'start');
            }
          } else if (intentResult.intent === 'contacto') {
            return await this.handleHumanRequest(userId);
          }
        }
      } catch (error) {
        console.error('❌ [ChatbotEngine] Error usando IA para detectar intención:', error);
      }
    }

    // Si no se detectó un flujo, mostrar menú principal
    return this.getMainMenu();
  }

  /**
   * Detecta qué flujo quiere iniciar el usuario basado en su mensaje
   */
  private detectFlowFromMessage(message: string): TipoInteres | null {
    const alquilarKeywords = ['alquilar', 'alquiler', 'alquilo', 'rentar', 'renta'];
    const comprarKeywords = ['comprar', 'compra', 'compro', 'adquirir'];
    const venderKeywords = ['vender', 'venta', 'vendo', 'vender mi propiedad'];
    const tasacionKeywords = ['tasación', 'tasacion', 'tasar', 'valorar', 'precio', 'cuanto vale'];

    if (alquilarKeywords.some(kw => message.includes(kw))) {
      return 'alquilar';
    }
    if (comprarKeywords.some(kw => message.includes(kw))) {
      return 'comprar';
    }
    if (venderKeywords.some(kw => message.includes(kw))) {
      return 'vender';
    }
    if (tasacionKeywords.some(kw => message.includes(kw))) {
      return 'tasacion';
    }

    // Detectar por números/opciones
    if (message === '1' || message === 'alquilar') return 'alquilar';
    if (message === '2' || message === 'comprar') return 'comprar';
    if (message === '3' || message === 'vender') return 'vender';
    if (message === '4' || message === 'tasacion') return 'tasacion';
    if (message === '5' || message === 'contacto') return 'contacto';

    return null;
  }

  /**
   * Retorna el menú principal del chatbot
   */
  getMainMenu(): BotResponse {
    return {
      text: '👋 Hola, soy el asistente virtual de *Inmobiliaria en Equipo*\n\n¿En qué puedo ayudarte?',
      buttons: [
        { label: '🏠 Alquilar', value: 'alquilar' },
        { label: '🏡 Comprar', value: 'comprar' },
        { label: '💰 Vender mi propiedad', value: 'vender' },
        { label: '📍 Tasación', value: 'tasacion' },
        { label: '📞 Hablar con un asesor', value: 'contacto' },
      ],
      options: ['1', '2', '3', '4', '5'],
    };
  }

  /**
   * Detecta si el usuario quiere hablar con un humano
   */
  private isHumanRequest(message: string): boolean {
    const humanKeywords = [
      'asesor',
      'humano',
      'hablar',
      'persona',
      'contacto humano',
      'agente',
      'representante',
      'ejecutivo',
    ];
    return humanKeywords.some(keyword => message.includes(keyword));
  }

  /**
   * Maneja la solicitud de contacto con un asesor humano
   */
  private async handleHumanRequest(userId: string): Promise<BotResponse> {
    const state = await ChatStateManager.getState(userId);

    // Si hay datos previos, crear lead con esa información
    if (state && Object.keys(state.data).length > 0) {
      const lead = LeadModel.create(state.data, 'whatsapp');
      lead.interes = 'contacto';
      lead.estado = 'derivado';
      await LeadStorage.save(lead);
    } else {
      // Crear lead básico de contacto
      const lead = LeadModel.create({ interes: 'contacto' }, 'whatsapp');
      lead.estado = 'derivado';
      await LeadStorage.save(lead);
    }

    await ChatStateManager.updateState(userId, { completed: true });

    return {
      text: '👤 Perfecto, un asesor se pondrá en contacto contigo a la brevedad.\n\n' +
            'Mientras tanto, ¿hay algo más en lo que pueda ayudarte?',
      buttons: [
        { label: 'Volver al menú', value: 'menu' },
        { label: 'No, gracias', value: 'no' },
      ],
    };
  }

  /**
   * Reinicia la conversación de un usuario
   */
  async resetConversation(userId: string): Promise<void> {
    await ChatStateManager.resetState(userId);
  }

  /**
   * Obtiene el estado actual de la conversación
   */
  async getConversationState(userId: string): Promise<ChatState | null> {
    return await ChatStateManager.getState(userId);
  }

  /**
   * Detecta si el usuario pregunta directamente por propiedades en una zona
   * Ejemplos: "opciones en santa fe", "propiedades en santa fe", "santa fe", "vasaa en santa fe"
   */
  private detectDirectPropertyRequest(message: string): { zona: string; tipo?: 'alquilar' | 'comprar' } | null {
    // Palabras clave que indican búsqueda directa (incluyendo variaciones)
    const searchKeywords = [
      'opciones', 'opcionre', 'opcion', 'propiedades', 'departamentos', 'casas', 
      'busco', 'quiero ver', 'muestrame', 'mostrame', 'vasaa', 'ver', 'listado', 'lista'
    ];
    const locationKeywords = ['en ', 'de ', 'santa fe', 'rosario', 'córdoba', 'buenos aires', 'palermo', 'recoleta'];
    
    // Detectar si menciona una zona/ubicación
    let detectedZona: string | null = null;
    
    // Zonas comunes en Argentina (con variaciones)
    const zonas = [
      { keywords: ['santa fe', 'santafe', 'santa fe capital'], name: 'santa fe' },
      { keywords: ['rosario'], name: 'rosario' },
      { keywords: ['córdoba', 'cordoba'], name: 'córdoba' },
      { keywords: ['buenos aires', 'bs as', 'bsas'], name: 'buenos aires' },
      { keywords: ['palermo'], name: 'palermo' },
      { keywords: ['recoleta'], name: 'recoleta' },
      { keywords: ['belgrano'], name: 'belgrano' },
      { keywords: ['villa crespo'], name: 'villa crespo' },
      { keywords: ['caballito'], name: 'caballito' },
    ];
    
    // Buscar zona mencionada
    for (const zona of zonas) {
      if (zona.keywords.some(kw => message.includes(kw))) {
        detectedZona = zona.name;
        break;
      }
    }

    // Si no detecta zona específica pero tiene palabras de búsqueda, asumir "santa fe" por defecto
    // Esto permite que "opciones" o "vasaa" sin zona específica funcione
    if (!detectedZona && searchKeywords.some(kw => message.includes(kw))) {
      detectedZona = 'santa fe'; // Zona por defecto según el usuario
    }

    if (detectedZona) {
      // Detectar tipo (alquilar o comprar) - PRIORIZAR ALQUILAR si se menciona
      let tipo: 'alquilar' | 'comprar' | undefined = undefined;
      
      // Palabras clave para alquilar (más específicas primero)
      const alquilarKeywords = ['alquilar', 'alquiler', 'alquilo', 'rentar', 'renta', 'alquila'];
      const comprarKeywords = ['comprar', 'compra', 'compro', 'adquirir', 'compra'];
      
      // Verificar alquilar primero
      if (alquilarKeywords.some(kw => message.includes(kw))) {
        tipo = 'alquilar';
      } else if (comprarKeywords.some(kw => message.includes(kw))) {
        tipo = 'comprar';
      }
      // Si no especifica, undefined (se usará el default en handleDirectPropertyRequest)

      return { zona: detectedZona, tipo };
    }

    return null;
  }

  /**
   * Maneja una solicitud directa de propiedades en una zona
   * Muestra opciones inmediatamente y luego ofrece hablar con un agente
   */
  private async handleDirectPropertyRequest(
    userId: string, 
    request: { zona: string; tipo?: 'alquilar' | 'comprar' }
  ): Promise<BotResponse> {
    try {
      // Crear un lead temporal con la información básica
      const leadData: Partial<LeadModel> = {
        zona: request.zona,
        interes: request.tipo || 'alquilar', // Por defecto alquilar si no especifica
        tipoPropiedad: 'departamento', // Por defecto
        presupuesto: 150000, // Presupuesto por defecto para búsqueda
        dormitorios: 2, // Por defecto
      };

      const lead = LeadModel.create(leadData, 'whatsapp');
      
      // Buscar propiedades usando el servicio de búsqueda
      const searchService = new PropertySearchService();
      const properties = await searchService.searchProperties(lead);

      // Formatear mensaje con las propiedades encontradas
      let responseText = `🏠 Te muestro opciones disponibles en *${request.zona}*:\n\n`;

      if (properties && properties.length > 0) {
        // Mostrar las propiedades encontradas con números claros
        properties.forEach((prop, index) => {
          const numero = index + 1;
          responseText += `*${numero}. ${prop.title}*\n`;
          responseText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
          if (prop.price) responseText += `💵 *Precio:* ${prop.price}\n`;
          if (prop.location) responseText += `📍 *Ubicación:* ${prop.location}\n`;
          if (prop.bedrooms) responseText += `🛏️ *Dormitorios:* ${prop.bedrooms}\n`;
          if (prop.description) {
            const cleanDesc = prop.description.trim();
            responseText += `📝 *Descripción:* ${cleanDesc}\n`;
          }
          if (prop.link) responseText += `🔗 *Ver más:* ${prop.link}\n`;
          responseText += '\n';
        });

        responseText += `\n💡 ¿Querés que un *asesor te contacte* para más información o ver estas propiedades?`;
      } else {
        responseText += `\n❌ No encontré propiedades disponibles en este momento en ${request.zona}.\n\n`;
        responseText += `💡 ¿Querés que un *asesor te contacte* para ayudarte a encontrar lo que buscás?`;
      }

      // Guardar el lead
      await LeadStorage.save(lead);

      // Marcar como completado para que en el siguiente mensaje ofrezca hablar con agente
      await ChatStateManager.updateState(userId, {
        completed: true,
        flow: request.tipo || 'alquilar',
        data: leadData,
      });

      return {
        text: responseText,
        buttons: [
          { label: 'Sí, hablame un asesor', value: 'contacto' },
          { label: 'Ver más opciones', value: 'mas_opciones' },
          { label: 'Volver al menú', value: 'menu' },
        ],
      };
    } catch (error) {
      console.error('❌ [ChatbotEngine] Error manejando solicitud directa:', error);
      return {
        text: '❌ Ocurrió un error al buscar propiedades. ¿Querés que un asesor te contacte?',
        buttons: [
          { label: 'Sí, contactame', value: 'contacto' },
          { label: 'Volver al menú', value: 'menu' },
        ],
      };
    }
  }
}

