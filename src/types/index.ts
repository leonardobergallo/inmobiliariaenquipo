// Tipos principales del sistema

export type TipoInteres = 'alquilar' | 'comprar' | 'vender' | 'tasacion' | 'contacto';

export type TipoPropiedad = 'departamento' | 'casa' | 'local' | 'oficina';

export type EstadoLead = 'nuevo' | 'calificado' | 'en_seguimiento' | 'derivado';

export type Canal = 'whatsapp' | 'web' | 'app';

export interface Lead {
  id: string;
  nombre?: string;
  telefono?: string;
  whatsapp?: string;
  interes: TipoInteres;
  zona?: string;
  tipoPropiedad?: TipoPropiedad;
  presupuesto?: number;
  presupuestoMax?: number;
  presupuestoMoneda?: 'pesos' | 'dolares'; // Moneda del presupuesto
  dormitorios?: number;
  fechaIngreso?: string;
  esPrimeraVivienda?: boolean;
  compraConCredito?: boolean;
  direccion?: string;
  metrosCuadrados?: number;
  estadoPropiedad?: string;
  estado: EstadoLead;
  canal: Canal;
  createdAt: string;
  updatedAt: string;
  notas?: string;
}

export interface ChatState {
  userId: string;
  currentStep: string;
  flow: TipoInteres | null;
  data: Partial<Lead>;
  waitingFor?: string;
  completed: boolean;
}

export interface Message {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  fromBot: boolean;
}

export interface BotResponse {
  text: string;
  options?: string[];
  buttons?: Array<{ label: string; value: string }>;
  metadata?: Record<string, any>;
}

export interface FlowStep {
  question: string;
  field: keyof Lead;
  validation?: (value: any, state?: ChatState) => boolean | string;
  options?: string[];
  buttons?: Array<{ label: string; value: any }>;
}


