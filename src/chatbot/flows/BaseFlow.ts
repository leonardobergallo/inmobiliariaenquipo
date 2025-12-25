import { BotResponse, FlowStep, Lead, ChatState } from '../../types';
import { LeadStorage } from '../../storage/LeadStorage';
import { LeadModel } from '../../models/Lead';
import { PropertySearchService, PropertyResult } from '../../services/PropertySearchService';
import { ChatStateManager } from '../ChatStateManager';
import { AIService } from '../../services/AIService';

export abstract class BaseFlow {
  protected steps: FlowStep[] = [];
  protected currentStepIndex: number = 0;
  protected aiService: AIService; // Servicio de IA para mejorar respuestas

  constructor() {
    // Inicializar servicio de IA
    // En TypeScript, las clases abstractas pueden tener constructores
    // que las clases hijas pueden llamar con super()
    this.aiService = new AIService();
  }

  abstract getFlowSteps(): FlowStep[];
  abstract getWelcomeMessage(): string;
  abstract getCompletionMessage(lead: Lead): string;
  abstract shouldSearchProperties(lead: Lead): boolean;

  async initialize(userId: string): Promise<ChatState> {
    this.steps = this.getFlowSteps();
    this.currentStepIndex = 0;
    
    const state = await ChatStateManager.createState(userId, this.getFlowType());
    return await ChatStateManager.updateState(userId, {
      currentStep: 'start',
      waitingFor: this.steps[0]?.field,
    });
  }

  abstract getFlowType(): 'alquilar' | 'comprar' | 'vender' | 'tasacion';

  async processMessage(userId: string, message: string): Promise<BotResponse> {
    const state = await ChatStateManager.getState(userId);
    if (!state || !state.flow) {
      return { text: 'Error: Estado no encontrado. Por favor, inicia una nueva conversación.' };
    }

    // Detectar solicitud de asesor humano
    if (this.isHumanRequest(message)) {
      return await this.handleHumanRequest(userId, state);
    }

    // Si está en el paso inicial
    if (state.currentStep === 'start') {
      return await this.handleStart(userId);
    }

    // Procesar respuesta del usuario
    const step = this.getCurrentStep(state);
    if (!step) {
      console.log('⚠️ [BaseFlow] No se encontró el paso actual, completando flujo...');
      return await this.handleCompletion(userId, state);
    }

    // Validar y guardar respuesta (validación simple como antes)
    const validation = this.validateInput(message, step, state);
    if (validation !== true) {
      return {
        text: typeof validation === 'string' ? validation : 'Por favor, ingresa una respuesta válida.',
        options: step.options,
        buttons: step.buttons,
      };
    }

    try {
      // Guardar dato
      console.log(`📝 [BaseFlow] Guardando campo: ${step.field}, valor: ${message}`);
      console.log(`📝 [BaseFlow] Índice actual: ${this.currentStepIndex}, Total pasos: ${this.steps.length}`);
      
      const updatedData = this.saveStepData(state.data, step.field, message);
      console.log(`✅ [BaseFlow] Datos actualizados:`, JSON.stringify(updatedData, null, 2));
      
      const updatedState = await ChatStateManager.updateState(userId, {
        data: updatedData,
        currentStep: step.field,
      });
      console.log(`✅ [BaseFlow] Estado actualizado correctamente`);

      // Avanzar al siguiente paso
      return await this.moveToNextStep(userId, updatedState);
    } catch (error) {
      console.error('❌ [BaseFlow] Error guardando dato o avanzando paso:', error);
      if (error instanceof Error) {
        console.error('❌ [BaseFlow] Error message:', error.message);
        console.error('❌ [BaseFlow] Error stack:', error.stack);
      }
      return {
        text: '❌ Ocurrió un error al procesar tu respuesta. Por favor, intenta nuevamente.',
        options: step.options,
        buttons: step.buttons,
      };
    }
  }

  protected async handleStart(userId: string): Promise<BotResponse> {
    this.steps = this.getFlowSteps();
    this.currentStepIndex = 0;
    
    const step = this.steps[0];
    if (!step) {
      return { text: 'Error: No hay pasos configurados.' };
    }

    await ChatStateManager.updateState(userId, {
      currentStep: step.field,
      waitingFor: step.field,
    });

    // Construir respuesta base
    const baseText = this.getWelcomeMessage() + '\n\n' + step.question;
    
    // Mejorar respuesta con IA si está disponible
    let finalText = baseText;
    if (this.aiService.isAvailable()) {
      try {
        const state = await ChatStateManager.getState(userId);
        const enhanced = await this.aiService.enhanceResponse(baseText, {
          userId,
          message: 'start',
          state: state || undefined,
          flowType: this.getFlowType(),
        });
        finalText = enhanced;
      } catch (error) {
        console.error('❌ [BaseFlow] Error mejorando respuesta con IA:', error);
        // Usar respuesta base si falla
      }
    }

    return {
      text: finalText,
      options: step.options,
      buttons: step.buttons,
    };
  }

  protected getCurrentStep(state: ChatState): FlowStep | null {
    this.steps = this.getFlowSteps();
    const currentField = state.waitingFor;
    
    if (!currentField) {
      return null;
    }

    const stepIndex = this.steps.findIndex(s => s.field === currentField);
    if (stepIndex === -1) {
      return null;
    }

    this.currentStepIndex = stepIndex;
    return this.steps[stepIndex];
  }

  protected async moveToNextStep(userId: string, state: ChatState): Promise<BotResponse> {
    try {
      this.steps = this.getFlowSteps();
      const nextIndex = this.currentStepIndex + 1;

      console.log(`➡️ [BaseFlow] Moviendo al siguiente paso. Índice actual: ${this.currentStepIndex}, Siguiente: ${nextIndex}, Total pasos: ${this.steps.length}`);

      if (nextIndex >= this.steps.length) {
        console.log('✅ [BaseFlow] No hay más pasos, completando flujo...');
        return await this.handleCompletion(userId, state);
      }

      const nextStep = this.steps[nextIndex];
      if (!nextStep) {
        console.error('❌ [BaseFlow] No hay siguiente paso disponible');
        return await this.handleCompletion(userId, state);
      }

      this.currentStepIndex = nextIndex;
      await ChatStateManager.updateState(userId, {
        currentStep: nextStep.field,
        waitingFor: nextStep.field,
      });
      
      console.log(`✅ [BaseFlow] Avanzado al paso: ${nextStep.field}`);

      // Mejorar pregunta con IA si está disponible
      let questionText = nextStep.question;
      if (this.aiService.isAvailable()) {
        try {
          const enhanced = await this.aiService.enhanceResponse(questionText, {
            userId,
            message: `Siguiente pregunta: ${questionText}`,
            state,
            flowType: this.getFlowType(),
          });
          questionText = enhanced;
        } catch (error) {
          console.error('❌ [BaseFlow] Error mejorando pregunta con IA:', error);
          // Usar pregunta original si falla
        }
      }

      return {
        text: questionText,
        options: nextStep.options,
        buttons: nextStep.buttons,
      };
    } catch (error) {
      console.error('❌ [BaseFlow] Error en moveToNextStep:', error);
      if (error instanceof Error) {
        console.error('❌ [BaseFlow] Error message:', error.message);
        console.error('❌ [BaseFlow] Error stack:', error.stack);
      }
      // Si hay error, intentar completar el flujo
      try {
        return await this.handleCompletion(userId, state);
      } catch (completionError) {
        console.error('❌ [BaseFlow] Error en handleCompletion:', completionError);
        return {
          text: '❌ Ocurrió un error. Por favor, intenta nuevamente o contacta con un asesor.',
        };
      }
    }
  }

  protected async handleCompletion(userId: string, state: ChatState): Promise<BotResponse> {
    try {
      console.log('🔄 [BaseFlow] Iniciando handleCompletion');
      console.log('📊 [BaseFlow] Datos del estado:', JSON.stringify(state.data, null, 2));
      
      const lead = LeadModel.create(state.data, 'whatsapp'); // TODO: pasar canal real
      lead.interes = this.getFlowType();
      
      console.log('✅ [BaseFlow] Lead creado:', JSON.stringify(lead, null, 2));
      console.log('💾 [BaseFlow] Guardando lead en base de datos...');
      
      await LeadStorage.save(lead);
      
      console.log('✅ [BaseFlow] Lead guardado correctamente');

      // Buscar propiedades si aplica
      if (this.shouldSearchProperties(lead)) {
        const properties = await this.searchProperties(lead);
        
        if (properties && properties.length > 0) {
          const searchService = new PropertySearchService();
          const propertiesMessage = searchService.formatPropertiesForClient(properties);
          
          await ChatStateManager.updateState(userId, { completed: true });
          return {
            text: this.getCompletionMessage(lead) + propertiesMessage,
            buttons: [
              { label: 'Sí, hablame un asesor', value: 'contacto' },
              { label: 'Ver más opciones', value: 'mas_opciones' },
              { label: 'No, gracias', value: 'no_contacto' },
            ],
          };
        } else {
          await ChatStateManager.updateState(userId, { completed: true });
          return {
            text: this.getCompletionMessage(lead) + 
                  `❌ No encontré propiedades disponibles en este momento.\n\n` +
                  `💡 ¿Querés que un *asesor te contacte* para ayudarte a encontrar lo que buscás?`,
            buttons: [
              { label: 'Sí, contactame', value: 'contacto' },
              { label: 'No, gracias', value: 'no_contacto' },
            ],
          };
        }
      }

      await ChatStateManager.updateState(userId, { completed: true });
      return {
        text: this.getCompletionMessage(lead),
      };
    } catch (error) {
      console.error('❌ [BaseFlow] Error en handleCompletion:', error);
      if (error instanceof Error) {
        console.error('❌ [BaseFlow] Error message:', error.message);
        console.error('❌ [BaseFlow] Error stack:', error.stack);
      }
      return {
        text: '❌ Ocurrió un error al completar tu solicitud. Por favor, intenta nuevamente o contacta con un asesor.',
      };
    }
  }

  protected async searchProperties(lead: Lead): Promise<PropertyResult[]> {
    const searchService = new PropertySearchService();
    return await searchService.searchProperties(lead);
  }

  protected validateInput(value: string, step: FlowStep, state?: ChatState): boolean | string {
    if (step.validation) {
      // Si la validación acepta un segundo parámetro (state), pasarlo
      if (step.validation.length > 1) {
        return (step.validation as any)(value, state);
      }
      return step.validation(value);
    }

    // Validaciones básicas
    if (step.options && !step.options.includes(value)) {
      return `Por favor, selecciona una de las opciones: ${step.options.join(', ')}`;
    }

    return true;
  }

  protected saveStepData(data: Partial<Lead>, field: keyof Lead, value: string): Partial<Lead> {
    // Conversiones de tipo según el campo
    let processedValue: any = value;

    // Mapear números a valores para campos con opciones (se hace en cada flow específico)
    // Aquí solo procesamos valores directos

    if (field === 'presupuesto' || field === 'presupuestoMax' || field === 'metrosCuadrados' || field === 'dormitorios') {
      processedValue = parseInt(value.replace(/\D/g, ''), 10);
      if (isNaN(processedValue)) {
        processedValue = value; // Mantener original si no se puede convertir
      }
    }

    if (field === 'presupuestoMoneda') {
      // Normalizar la moneda
      const lower = value.toLowerCase();
      if (lower.includes('dolar') || lower.includes('usd') || lower === 'd' || lower === '2') {
        processedValue = 'dolares';
      } else if (lower.includes('peso') || lower === 'p' || lower === '$' || lower === '1') {
        processedValue = 'pesos';
      } else {
        processedValue = value;
      }
    }

    if (field === 'esPrimeraVivienda' || field === 'compraConCredito') {
      const lower = value.toLowerCase().trim();
      if (lower === '1' || lower === 'si' || lower === 'sí' || lower === 's') {
        processedValue = true;
      } else if (lower === '2' || lower === 'no' || lower === 'n') {
        processedValue = false;
      } else {
        processedValue = value.toLowerCase().includes('sí') || value.toLowerCase().includes('si') || value.toLowerCase() === 's';
      }
    }

    // Para teléfono, guardar tal cual y también en whatsapp - VERSIÓN ULTRA SIMPLE
    if (field === 'telefono') {
      const result = {
        ...data,
        telefono: String(value).trim(),
        whatsapp: String(value).trim(),
      };
      console.log(`📞 [BaseFlow] Guardando teléfono:`, result);
      return result;
    }

    return {
      ...data,
      [field]: processedValue,
    };
  }

  protected isHumanRequest(message: string): boolean {
    const humanKeywords = ['asesor', 'humano', 'hablar', 'persona', 'contacto humano', 'agente'];
    const lowerMessage = message.toLowerCase();
    return humanKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  protected async handleHumanRequest(userId: string, state: ChatState): Promise<BotResponse> {
    const lead = LeadModel.create(state.data, 'whatsapp');
    lead.interes = this.getFlowType();
    lead.estado = 'derivado';
    
    await LeadStorage.save(lead);

    await ChatStateManager.updateState(userId, { completed: true });

    return {
      text: '👤 Un asesor se pondrá en contacto contigo a la brevedad.\n\n' +
            'Resumen de tu consulta:\n' +
            this.formatLeadSummary(lead),
    };
  }

  protected formatLeadSummary(lead: Lead): string {
    const parts: string[] = [];
    if (lead.nombre) parts.push(`Nombre: ${lead.nombre}`);
    if (lead.telefono) parts.push(`Teléfono: ${lead.telefono}`);
    if (lead.zona) parts.push(`Zona: ${lead.zona}`);
    if (lead.tipoPropiedad) parts.push(`Tipo: ${lead.tipoPropiedad}`);
    if (lead.presupuesto) parts.push(`Presupuesto: $${lead.presupuesto.toLocaleString()}`);
    return parts.join('\n');
  }
}

