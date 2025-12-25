import { BaseFlow } from './BaseFlow';
import { FlowStep, Lead, ChatState, BotResponse } from '../../types';
import { LeadStorage } from '../../storage/LeadStorage';
import { LeadModel } from '../../models/Lead';
import { ChatStateManager } from '../ChatStateManager';

export class ComprarFlow extends BaseFlow {
  getFlowType(): 'comprar' {
    return 'comprar';
  }

  getWelcomeMessage(): string {
    return '🏡 Excelente, vamos a encontrar la propiedad ideal para tu compra.';
  }

  getFlowSteps(): FlowStep[] {
    return [
      {
        question: '📍 ¿En qué zona o barrio te gustaría comprar?\n\n1. Centro\n2. Candiotti\n3. Barranquitas\n4. San Martín\n5. Villa María Selva\n6. Barrio Sur\n7. Barrio Norte\n8. Otra zona (escribir)',
        field: 'zona',
        options: ['1', '2', '3', '4', '5', '6', '7', '8'],
        buttons: [
          { label: '1. Centro', value: 'Centro' },
          { label: '2. Candiotti', value: 'Candiotti' },
          { label: '3. Barranquitas', value: 'Barranquitas' },
          { label: '4. San Martín', value: 'San Martín' },
          { label: '5. Villa María Selva', value: 'Villa María Selva' },
          { label: '6. Barrio Sur', value: 'Barrio Sur' },
          { label: '7. Barrio Norte', value: 'Barrio Norte' },
          { label: '8. Otra zona', value: 'otra' },
        ],
        validation: (value) => {
          const lower = value.toLowerCase().trim();
          const numberMap: Record<string, string> = {
            '1': 'Centro',
            '2': 'Candiotti',
            '3': 'Barranquitas',
            '4': 'San Martín',
            '5': 'Villa María Selva',
            '6': 'Barrio Sur',
            '7': 'Barrio Norte',
          };
          // Si es un número válido o es "otra", aceptar
          if (numberMap[lower] || lower === 'otra' || lower === '8') {
            return true;
          }
          // Si no es un número, validar que tenga al menos 2 caracteres
          if (!value || value.trim().length < 2) {
            return 'Por favor, selecciona 1-8 o escribe una zona válida (mínimo 2 caracteres).';
          }
          return true;
        },
      },
      {
        question: '🏠 ¿Qué tipo de propiedad buscás?\n\n1. 🏢 Departamento\n2. 🏡 Casa\n3. 🏪 Local\n4. 🏢 Oficina',
        field: 'tipoPropiedad',
        options: ['1', '2', '3', '4', 'departamento', 'casa', 'local', 'oficina'],
        buttons: [
          { label: '1. 🏢 Departamento', value: 'departamento' },
          { label: '2. 🏡 Casa', value: 'casa' },
          { label: '3. 🏪 Local', value: 'local' },
          { label: '4. 🏢 Oficina', value: 'oficina' },
        ],
        validation: (value) => {
          const lower = value.toLowerCase().trim();
          const numberMap: Record<string, string> = {
            '1': 'departamento',
            '2': 'casa',
            '3': 'local',
            '4': 'oficina',
          };
          const mappedValue = numberMap[lower] || lower;
          const validTypes = ['departamento', 'casa', 'local', 'oficina'];
          if (!validTypes.includes(mappedValue)) {
            return 'Por favor, selecciona 1, 2, 3 o 4, o escribe: departamento, casa, local u oficina.';
          }
          return true;
        },
      },
      {
        question: '💰 ¿En qué moneda es tu presupuesto?\n\n1. 💵 Pesos ($)\n2. 💲 Dólares (USD)',
        field: 'presupuestoMoneda',
        options: ['1', '2', 'pesos', 'dolares'],
        buttons: [
          { label: '1. 💵 Pesos ($)', value: 'pesos' },
          { label: '2. 💲 Dólares (USD)', value: 'dolares' },
        ],
        validation: (value) => {
          const lower = value.toLowerCase().trim();
          const numberMap: Record<string, string> = {
            '1': 'pesos',
            '2': 'dolares',
          };
          const mappedValue = numberMap[lower] || lower;
          if (!['pesos', 'dolares', 'peso', 'dolar', 'usd', '$'].includes(mappedValue)) {
            return 'Por favor, selecciona 1 (Pesos) o 2 (Dólares).';
          }
          return true;
        },
      },
      {
        question: '💰 ¿Cuál es tu rango de inversión?',
        field: 'presupuesto',
        validation: (value: string, state?: ChatState) => {
          const num = parseInt(value.replace(/\D/g, ''), 10);
          if (isNaN(num)) {
            return 'Por favor, ingresa un número válido.';
          }
          
          // Validar según la moneda seleccionada
          const moneda = state?.data?.presupuestoMoneda || 'pesos';
          if (moneda === 'dolares') {
            if (num < 10000) {
              return 'Por favor, ingresa un presupuesto válido (mínimo USD 10,000).';
            }
          } else {
            if (num < 100000) {
              return 'Por favor, ingresa un presupuesto válido (mínimo $100,000).';
            }
          }
          return true;
        },
      },
      {
        question: '🛏️ ¿Cuántos dormitorios necesitás?\n\n1. 1 dormitorio\n2. 2 dormitorios\n3. 3 dormitorios\n4. 4 dormitorios\n5. 5 o más',
        field: 'dormitorios',
        options: ['1', '2', '3', '4', '5'],
        buttons: [
          { label: '1. 1 dormitorio', value: '1' },
          { label: '2. 2 dormitorios', value: '2' },
          { label: '3. 3 dormitorios', value: '3' },
          { label: '4. 4 dormitorios', value: '4' },
          { label: '5. 5 o más', value: '5' },
        ],
        validation: (value) => {
          const num = parseInt(value.replace(/\D/g, ''), 10);
          if (isNaN(num) || num < 1 || num > 10) {
            return 'Por favor, selecciona 1, 2, 3, 4 o 5, o escribe un número de dormitorios (1-10).';
          }
          return true;
        },
      },
      {
        question: '🏠 ¿Es tu primera vivienda?\n\n1. Sí\n2. No',
        field: 'esPrimeraVivienda',
        options: ['1', '2', 'si', 'no', 'sí', 's', 'n'],
        buttons: [
          { label: '1. Sí', value: 'si' },
          { label: '2. No', value: 'no' },
        ],
        validation: (value) => {
          const lower = value.toLowerCase().trim();
          const numberMap: Record<string, string> = {
            '1': 'si',
            '2': 'no',
          };
          const mappedValue = numberMap[lower] || lower;
          if (!['sí', 'si', 's', 'no', 'n'].includes(mappedValue)) {
            return 'Por favor, selecciona 1 (Sí) o 2 (No).';
          }
          return true;
        },
      },
      {
        question: '💳 ¿Vas a comprar con crédito hipotecario?\n\n1. Sí\n2. No',
        field: 'compraConCredito',
        options: ['1', '2', 'si', 'no', 'sí', 's', 'n'],
        buttons: [
          { label: '1. Sí', value: 'si' },
          { label: '2. No', value: 'no' },
        ],
        validation: (value) => {
          const lower = value.toLowerCase().trim();
          const numberMap: Record<string, string> = {
            '1': 'si',
            '2': 'no',
          };
          const mappedValue = numberMap[lower] || lower;
          if (!['sí', 'si', 's', 'no', 'n'].includes(mappedValue)) {
            return 'Por favor, selecciona 1 (Sí) o 2 (No).';
          }
          return true;
        },
      },
      {
        question: '👤 ¿Cuál es tu nombre?',
        field: 'nombre',
        validation: (value) => {
          if (!value || value.trim().length < 2) {
            return 'Por favor, ingresa tu nombre (mínimo 2 caracteres).';
          }
          return true;
        },
      },
      {
        question: '📞 ¿Cuál es tu teléfono?',
        field: 'telefono',
        validation: (value) => {
          // Aceptar cualquier valor
          return true;
        },
      },
    ];
  }

  getCompletionMessage(lead: Lead): string {
    // Formatear presupuesto según la moneda
    let presupuestoTexto = 'No especificado';
    if (lead.presupuesto) {
      const moneda = lead.presupuestoMoneda || 'pesos';
      if (moneda === 'dolares') {
        presupuestoTexto = `USD ${lead.presupuesto.toLocaleString('es-AR')}`;
      } else {
        presupuestoTexto = `$${lead.presupuesto.toLocaleString('es-AR')}`;
      }
    }
    
    // Mensaje más limpio y organizado
    return `✅ *Búsqueda registrada:*\n\n` +
           `📍 Zona: ${lead.zona || 'No especificada'}\n` +
           `🏠 Tipo: ${lead.tipoPropiedad || 'No especificado'}\n` +
           `💰 Presupuesto: ${presupuestoTexto}\n` +
           `🛏️ Dormitorios: ${lead.dormitorios || 'No especificado'}\n` +
           `🏠 Primera vivienda: ${lead.esPrimeraVivienda ? 'Sí' : 'No'}\n` +
           `💳 Con crédito: ${lead.compraConCredito ? 'Sí' : 'No'}\n\n` +
           `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  }

  shouldSearchProperties(lead: Lead): boolean {
    return !!(lead.zona && lead.tipoPropiedad && lead.presupuesto);
  }

  protected saveStepData(data: Partial<Lead>, field: keyof Lead, value: string): Partial<Lead> {
    const updated = super.saveStepData(data, field, value);

    // Mapear números a valores para campos con opciones
    if (field === 'zona') {
      const numberMap: Record<string, string> = {
        '1': 'Centro',
        '2': 'Candiotti',
        '3': 'Barranquitas',
        '4': 'San Martín',
        '5': 'Villa María Selva',
        '6': 'Barrio Sur',
        '7': 'Barrio Norte',
      };
      if (numberMap[value]) {
        updated.zona = numberMap[value];
        return updated;
      }
      // Si es "otra" o "8", no hacer nada, dejar que el usuario escriba
      if (value.toLowerCase() === 'otra' || value === '8') {
        // No actualizar, esperar siguiente mensaje
        return updated;
      }
    }
    
    if (field === 'tipoPropiedad') {
      const numberMap: Record<string, string> = {
        '1': 'departamento',
        '2': 'casa',
        '3': 'local',
        '4': 'oficina',
      };
      if (numberMap[value]) {
        updated.tipoPropiedad = numberMap[value] as any;
        return updated;
      }
    }
    
    if (field === 'presupuestoMoneda') {
      const numberMap: Record<string, string> = {
        '1': 'pesos',
        '2': 'dolares',
      };
      if (numberMap[value]) {
        updated.presupuestoMoneda = numberMap[value] as any;
        return updated;
      }
    }
    
    if (field === 'esPrimeraVivienda' || field === 'compraConCredito') {
      const numberMap: Record<string, boolean> = {
        '1': true,
        '2': false,
      };
      if (numberMap[value] !== undefined) {
        updated[field] = numberMap[value] as any;
        return updated;
      }
    }

    return updated;
  }

  protected async handleCompletion(userId: string, state: ChatState): Promise<BotResponse> {
    try {
      console.log('🔄 [ComprarFlow] Iniciando handleCompletion');
      console.log('📊 [ComprarFlow] Datos del estado:', JSON.stringify(state.data, null, 2));
      
      const lead = LeadModel.create(state.data, 'whatsapp');
      lead.interes = 'comprar';
      lead.estado = 'calificado'; // Compras son leads calificados automáticamente
      
      console.log('✅ [ComprarFlow] Lead creado:', JSON.stringify(lead, null, 2));
      console.log('💾 [ComprarFlow] Guardando lead en base de datos...');
      
      await LeadStorage.save(lead);
      
      console.log('✅ [ComprarFlow] Lead guardado correctamente');

      if (this.shouldSearchProperties(lead)) {
        console.log('🔍 [ComprarFlow] Buscando propiedades...');
        const properties = await this.searchProperties(lead);
        
        if (properties && properties.length > 0) {
          const { PropertySearchService } = require('../../services/PropertySearchService');
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
        text: this.getCompletionMessage(lead) + 
              '\n\n👤 Un asesor se pondrá en contacto contigo pronto.',
      };
    } catch (error) {
      console.error('❌ [ComprarFlow] Error en handleCompletion:', error);
      if (error instanceof Error) {
        console.error('❌ [ComprarFlow] Error message:', error.message);
        console.error('❌ [ComprarFlow] Error stack:', error.stack);
      }
      return {
        text: '❌ Ocurrió un error al completar tu solicitud. Por favor, intenta nuevamente o contacta con un asesor.',
      };
    }
  }
}

