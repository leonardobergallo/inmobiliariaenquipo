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
        question: '📍 ¿En qué zona o barrio te gustaría comprar?',
        field: 'zona',
        validation: (value) => {
          if (!value || value.trim().length < 2) {
            return 'Por favor, ingresa una zona válida (mínimo 2 caracteres).';
          }
          return true;
        },
      },
      {
        question: '🏠 ¿Qué tipo de propiedad buscás?',
        field: 'tipoPropiedad',
        options: ['departamento', 'casa', 'local', 'oficina'],
        buttons: [
          { label: '🏢 Departamento', value: 'departamento' },
          { label: '🏡 Casa', value: 'casa' },
          { label: '🏪 Local', value: 'local' },
          { label: '🏢 Oficina', value: 'oficina' },
        ],
        validation: (value) => {
          const validTypes = ['departamento', 'casa', 'local', 'oficina'];
          if (!validTypes.includes(value.toLowerCase())) {
            return 'Por favor, selecciona: departamento, casa, local u oficina.';
          }
          return true;
        },
      },
      {
        question: '💰 ¿En qué moneda es tu presupuesto?',
        field: 'presupuestoMoneda',
        options: ['pesos', 'dolares'],
        buttons: [
          { label: '💵 Pesos ($)', value: 'pesos' },
          { label: '💲 Dólares (USD)', value: 'dolares' },
        ],
        validation: (value) => {
          const lower = value.toLowerCase();
          if (!['pesos', 'dolares', 'peso', 'dolar', 'usd', '$'].includes(lower)) {
            return 'Por favor, selecciona Pesos o Dólares.';
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
        question: '🛏️ ¿Cuántos dormitorios necesitás?',
        field: 'dormitorios',
        options: ['1', '2', '3', '4', '5+'],
        buttons: [
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5+', value: '5' },
        ],
        validation: (value) => {
          const num = parseInt(value.replace(/\D/g, ''), 10);
          if (isNaN(num) || num < 1 || num > 10) {
            return 'Por favor, ingresa un número válido de dormitorios (1-10).';
          }
          return true;
        },
      },
      {
        question: '🏠 ¿Es tu primera vivienda? (Sí/No)',
        field: 'esPrimeraVivienda',
        buttons: [
          { label: 'Sí', value: 'si' },
          { label: 'No', value: 'no' },
        ],
        validation: (value) => {
          const lower = value.toLowerCase();
          if (!['sí', 'si', 's', 'no', 'n'].includes(lower)) {
            return 'Por favor, responde Sí o No.';
          }
          return true;
        },
      },
      {
        question: '💳 ¿Vas a comprar con crédito hipotecario? (Sí/No)',
        field: 'compraConCredito',
        buttons: [
          { label: 'Sí', value: 'si' },
          { label: 'No', value: 'no' },
        ],
        validation: (value) => {
          const lower = value.toLowerCase();
          if (!['sí', 'si', 's', 'no', 'n'].includes(lower)) {
            return 'Por favor, responde Sí o No.';
          }
          return true;
        },
      },
      {
        question: '📞 ¿Cuál es tu nombre y teléfono? (ej: "María, 11-1234-5678" o "342-5089-906")',
        field: 'nombre',
        validation: (value) => {
          if (!value || value.trim().length < 3) {
            return 'Por favor, ingresa tu nombre y teléfono.';
          }
          // Patrón más flexible para teléfonos argentinos
          // Acepta: 11-1234-5678, 342-5089-906, 3425089906, etc.
          const phoneMatch = value.match(/(\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4})/);
          if (phoneMatch) {
            return true;
          }
          // También aceptar solo números si tiene al menos 8 dígitos
          const digitsOnly = value.replace(/\D/g, '');
          if (digitsOnly.length >= 8) {
            return true;
          }
          return 'Por favor, incluye un teléfono válido (ej: 342-5089-906 o 11-1234-5678).';
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

    // Extraer nombre y teléfono del campo nombre
    if (field === 'nombre') {
      // Patrón más flexible para teléfonos
      const phoneMatch = value.match(/(\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4})/);
      if (phoneMatch) {
        updated.telefono = phoneMatch[1].replace(/\D/g, '');
        updated.whatsapp = updated.telefono;
        const namePart = value.substring(0, phoneMatch.index).trim();
        if (namePart) {
          updated.nombre = namePart;
        }
      } else {
        // Si no hay match con guiones, buscar solo números
        const digitsOnly = value.replace(/\D/g, '');
        if (digitsOnly.length >= 8) {
          updated.telefono = digitsOnly;
          updated.whatsapp = digitsOnly;
          // Intentar extraer nombre (todo antes de los números)
          const nameMatch = value.match(/^([^\d]+)/);
          if (nameMatch) {
            updated.nombre = nameMatch[1].trim();
          }
        } else {
          updated.nombre = value;
        }
      }
    }

    return updated;
  }

  protected async handleCompletion(userId: string, state: ChatState): Promise<BotResponse> {
    const lead = LeadModel.create(state.data, 'whatsapp');
    lead.interes = 'comprar';
    lead.estado = 'calificado'; // Compras son leads calificados automáticamente
    
    await LeadStorage.save(lead);

    if (this.shouldSearchProperties(lead)) {
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
  }
}

