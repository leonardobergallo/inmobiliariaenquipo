import { Lead, EstadoLead, TipoInteres, Canal } from '../types';

export class LeadModel {
  private static generateId(): string {
    return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static create(data: Partial<Lead>, canal: Canal): Lead {
    const now = new Date().toISOString();
    
    return {
      id: this.generateId(),
      interes: data.interes || 'contacto',
      estado: 'nuevo',
      canal,
      createdAt: now,
      updatedAt: now,
      ...data,
    };
  }

  static update(lead: Lead, updates: Partial<Lead>): Lead {
    return {
      ...lead,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }

  static markAsCalificado(lead: Lead): Lead {
    return this.update(lead, { estado: 'calificado' });
  }

  static markAsDerivado(lead: Lead): Lead {
    return this.update(lead, { estado: 'derivado' });
  }

  static markAsEnSeguimiento(lead: Lead): Lead {
    return this.update(lead, { estado: 'en_seguimiento' });
  }
}


