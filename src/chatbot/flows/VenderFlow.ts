import { BaseFlow } from './BaseFlow';
import { FlowStep, Lead } from '../../types';

export class VenderFlow extends BaseFlow {
  getFlowType(): 'vender' {
    return 'vender';
  }

  getWelcomeMessage(): string {
    return '💰 Perfecto, vamos a ayudarte a vender tu propiedad.';
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
        question: '🏠 ¿Qué tipo de propiedad es?\n\n1. 🏢 Departamento\n2. 🏡 Casa\n3. 🏪 Local\n4. 🏢 Oficina',
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
        question: '📐 ¿Cuántos metros cuadrados tiene aproximadamente? (si no sabés, escribí "no sé")',
        field: 'metrosCuadrados',
        validation: (value) => {
          if (value.toLowerCase().includes('no sé') || value.toLowerCase().includes('no se')) {
            return true; // Permitir "no sé"
          }
          const num = parseInt(value.replace(/\D/g, ''), 10);
          if (isNaN(num) || num < 10) {
            return 'Por favor, ingresa un número válido de metros cuadrados (mínimo 10) o escribí "no sé".';
          }
          return true;
        },
      },
      {
        question: '🔧 ¿Cuál es el estado general de la propiedad?\n\n1. ⭐ Excelente\n2. 👍 Muy bueno\n3. ✅ Bueno\n4. 🔨 A refaccionar',
        field: 'estadoPropiedad',
        options: ['1', '2', '3', '4', 'excelente', 'muy bueno', 'bueno', 'a refaccionar'],
        buttons: [
          { label: '1. ⭐ Excelente', value: 'excelente' },
          { label: '2. 👍 Muy bueno', value: 'muy bueno' },
          { label: '3. ✅ Bueno', value: 'bueno' },
          { label: '4. 🔨 A refaccionar', value: 'a refaccionar' },
        ],
        validation: (value) => {
          const lower = value.toLowerCase().trim();
          const numberMap: Record<string, string> = {
            '1': 'excelente',
            '2': 'muy bueno',
            '3': 'bueno',
            '4': 'a refaccionar',
          };
          const mappedValue = numberMap[lower] || lower;
          const validStates = ['excelente', 'muy bueno', 'bueno', 'a refaccionar'];
          if (!validStates.includes(mappedValue)) {
            return 'Por favor, selecciona 1, 2, 3 o 4, o escribe: excelente, muy bueno, bueno o a refaccionar.';
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
    return `✅ Perfecto, registré tu propiedad:\n\n` +
           `📍 Dirección: ${lead.direccion || 'No especificada'}\n` +
           `🏠 Tipo: ${lead.tipoPropiedad || 'No especificado'}\n` +
           `📐 Metros: ${lead.metrosCuadrados ? `${lead.metrosCuadrados} m²` : 'No especificado'}\n` +
           `🔧 Estado: ${lead.estadoPropiedad || 'No especificado'}\n\n` +
           `📊 Un asesor te va a contactar para coordinar la tasación sin cargo.`;
  }

  shouldSearchProperties(lead: Lead): boolean {
    return false; // No buscamos propiedades para venta
  }

  protected saveStepData(data: Partial<Lead>, field: keyof Lead, value: string): Partial<Lead> {
    const updated = super.saveStepData(data, field, value);

    // Mapear números a valores para campos con opciones
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
    
    if (field === 'estadoPropiedad') {
      const numberMap: Record<string, string> = {
        '1': 'excelente',
        '2': 'muy bueno',
        '3': 'bueno',
        '4': 'a refaccionar',
      };
      if (numberMap[value]) {
        updated.estadoPropiedad = numberMap[value] as any;
        return updated;
      }
    }

    // Manejar "no sé" en metros cuadrados
    if (field === 'metrosCuadrados') {
      if (value.toLowerCase().includes('no sé') || value.toLowerCase().includes('no se')) {
        delete updated.metrosCuadrados;
      }
    }

    return updated;
  }
}


