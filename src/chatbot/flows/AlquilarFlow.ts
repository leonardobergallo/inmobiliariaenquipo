import { BaseFlow } from './BaseFlow';
import { FlowStep, Lead } from '../../types';

export class AlquilarFlow extends BaseFlow {
  getFlowType(): 'alquilar' {
    return 'alquilar';
  }

  getWelcomeMessage(): string {
    return '🏠 Perfecto, vamos a buscar el alquiler ideal para vos.';
  }

  getFlowSteps(): FlowStep[] {
    return [
      {
        question: '📍 ¿En qué zona o barrio te gustaría alquilar?\n\n1. Centro\n2. Candiotti\n3. Barranquitas\n4. San Martín\n5. Villa María Selva\n6. Barrio Sur\n7. Barrio Norte\n8. Otra zona (escribir)',
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
          if (numberMap[lower] || lower === 'otra' || lower === '8') {
            return true;
          }
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
          // Mapear números a valores
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
        question: '💵 ¿Cuál es tu presupuesto máximo mensual? (en pesos)',
        field: 'presupuesto',
        validation: (value) => {
          const num = parseInt(value.replace(/\D/g, ''), 10);
          if (isNaN(num) || num < 10000) {
            return 'Por favor, ingresa un presupuesto válido (mínimo $10,000).';
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
        question: '📅 ¿Cuándo necesitás ingresar aproximadamente? (ej: "en 1 mes", "en 2 semanas")',
        field: 'fechaIngreso',
        validation: (value) => {
          if (!value || value.trim().length < 3) {
            return 'Por favor, ingresa una fecha aproximada.';
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
    // Mensaje más limpio y organizado
    return `✅ *Búsqueda registrada:*\n\n` +
           `📍 Zona: ${lead.zona || 'No especificada'}\n` +
           `🏠 Tipo: ${lead.tipoPropiedad || 'No especificado'}\n` +
           `💵 Presupuesto: $${lead.presupuesto?.toLocaleString('es-AR') || 'No especificado'}\n` +
           `🛏️ Dormitorios: ${lead.dormitorios || 'No especificado'}\n` +
           `📅 Ingreso: ${lead.fechaIngreso || 'No especificado'}\n\n` +
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
      if (value.toLowerCase() === 'otra' || value === '8') {
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

    return updated;
  }
}


