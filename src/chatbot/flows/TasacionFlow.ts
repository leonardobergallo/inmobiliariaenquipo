import { BaseFlow } from './BaseFlow';
import { FlowStep, Lead } from '../../types';

export class TasacionFlow extends BaseFlow {
  getFlowType(): 'tasacion' {
    return 'tasacion';
  }

  getWelcomeMessage(): string {
    return '📊 Perfecto, vamos a coordinar una tasación sin cargo para tu propiedad.';
  }

  getFlowSteps(): FlowStep[] {
    return [
      {
        question: '📍 ¿Cuál es la dirección aproximada de la propiedad?',
        field: 'direccion',
        validation: (value) => {
          if (!value || value.trim().length < 5) {
            return 'Por favor, ingresa una dirección válida (mínimo 5 caracteres).';
          }
          return true;
        },
      },
      {
        question: '🏠 ¿Qué tipo de propiedad es?',
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
        question: '📐 ¿Cuántos metros cuadrados tiene aproximadamente? (si no sabés, escribí "no sé")',
        field: 'metrosCuadrados',
        validation: (value) => {
          if (value.toLowerCase().includes('no sé') || value.toLowerCase().includes('no se')) {
            return true;
          }
          const num = parseInt(value.replace(/\D/g, ''), 10);
          if (isNaN(num) || num < 10) {
            return 'Por favor, ingresa un número válido de metros cuadrados (mínimo 10) o escribí "no sé".';
          }
          return true;
        },
      },
      {
        question: '🔧 ¿Cuál es el estado general de la propiedad?',
        field: 'estadoPropiedad',
        options: ['excelente', 'muy bueno', 'bueno', 'a refaccionar'],
        buttons: [
          { label: '⭐ Excelente', value: 'excelente' },
          { label: '👍 Muy bueno', value: 'muy bueno' },
          { label: '✅ Bueno', value: 'bueno' },
          { label: '🔨 A refaccionar', value: 'a refaccionar' },
        ],
        validation: (value) => {
          const validStates = ['excelente', 'muy bueno', 'bueno', 'a refaccionar'];
          if (!validStates.includes(value.toLowerCase())) {
            return 'Por favor, selecciona una de las opciones disponibles.';
          }
          return true;
        },
      },
      {
        question: '📞 ¿Cuál es tu nombre y teléfono? (ej: "Ana, 11-1234-5678")',
        field: 'nombre',
        validation: (value) => {
          if (!value || value.trim().length < 5) {
            return 'Por favor, ingresa tu nombre y teléfono.';
          }
          const phoneMatch = value.match(/(\d{2,4}[-.\s]?\d{4}[-.\s]?\d{4})/);
          if (phoneMatch) {
            return true;
          }
          return 'Por favor, incluye un teléfono válido.';
        },
      },
    ];
  }

  getCompletionMessage(lead: Lead): string {
    return `✅ Perfecto, registré tu solicitud de tasación:\n\n` +
           `📍 Dirección: ${lead.direccion || 'No especificada'}\n` +
           `🏠 Tipo: ${lead.tipoPropiedad || 'No especificado'}\n` +
           `📐 Metros: ${lead.metrosCuadrados ? `${lead.metrosCuadrados} m²` : 'No especificado'}\n` +
           `🔧 Estado: ${lead.estadoPropiedad || 'No especificado'}\n\n` +
           `📊 Un asesor te va a contactar para coordinar la tasación sin cargo.`;
  }

  shouldSearchProperties(lead: Lead): boolean {
    return false; // No buscamos propiedades para tasación
  }

  protected saveStepData(data: Partial<Lead>, field: keyof Lead, value: string): Partial<Lead> {
    const updated = super.saveStepData(data, field, value);

    // Manejar "no sé" en metros cuadrados
    if (field === 'metrosCuadrados') {
      if (value.toLowerCase().includes('no sé') || value.toLowerCase().includes('no se')) {
        delete updated.metrosCuadrados;
      }
    }

    // Extraer nombre y teléfono del campo nombre
    if (field === 'nombre') {
      const phoneMatch = value.match(/(\d{2,4}[-.\s]?\d{4}[-.\s]?\d{4})/);
      if (phoneMatch) {
        updated.telefono = phoneMatch[1].replace(/\D/g, '');
        updated.whatsapp = updated.telefono;
        const namePart = value.substring(0, phoneMatch.index).trim();
        if (namePart) {
          updated.nombre = namePart;
        }
      } else {
        updated.nombre = value;
      }
    }

    return updated;
  }
}


