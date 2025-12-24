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
        question: '📍 ¿En qué zona o barrio te gustaría alquilar?',
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
        question: '📞 ¿Cuál es tu nombre y teléfono? (ej: "Juan, 11-1234-5678" o "342-5089-906")',
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
}


