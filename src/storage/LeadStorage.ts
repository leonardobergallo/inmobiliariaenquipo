import { Lead } from '../types';
import { query } from '../database/connection';

export class LeadStorage {
  /**
   * Guarda o actualiza un lead en la base de datos
   */
  static async save(lead: Lead): Promise<Lead> {
    const sql = `
      INSERT INTO leads (
        id, nombre, telefono, whatsapp, interes, zona, tipo_propiedad,
        presupuesto, presupuesto_max, presupuesto_moneda, dormitorios, fecha_ingreso,
        es_primera_vivienda, compra_con_credito, direccion,
        metros_cuadrados, estado_propiedad, estado, canal, notas,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
      )
      ON CONFLICT (id) DO UPDATE SET
        nombre = EXCLUDED.nombre,
        telefono = EXCLUDED.telefono,
        whatsapp = EXCLUDED.whatsapp,
        interes = EXCLUDED.interes,
        zona = EXCLUDED.zona,
        tipo_propiedad = EXCLUDED.tipo_propiedad,
        presupuesto = EXCLUDED.presupuesto,
        presupuesto_max = EXCLUDED.presupuesto_max,
        presupuesto_moneda = EXCLUDED.presupuesto_moneda,
        dormitorios = EXCLUDED.dormitorios,
        fecha_ingreso = EXCLUDED.fecha_ingreso,
        es_primera_vivienda = EXCLUDED.es_primera_vivienda,
        compra_con_credito = EXCLUDED.compra_con_credito,
        direccion = EXCLUDED.direccion,
        metros_cuadrados = EXCLUDED.metros_cuadrados,
        estado_propiedad = EXCLUDED.estado_propiedad,
        estado = EXCLUDED.estado,
        canal = EXCLUDED.canal,
        notas = EXCLUDED.notas,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const values = [
      lead.id,
      lead.nombre || null,
      lead.telefono || null,
      lead.whatsapp || null,
      lead.interes,
      lead.zona || null,
      lead.tipoPropiedad || null,
      lead.presupuesto || null,
      lead.presupuestoMax || null,
      lead.presupuestoMoneda || null,
      lead.dormitorios || null,
      lead.fechaIngreso || null,
      lead.esPrimeraVivienda || null,
      lead.compraConCredito || null,
      lead.direccion || null,
      lead.metrosCuadrados || null,
      lead.estadoPropiedad || null,
      lead.estado,
      lead.canal,
      lead.notas || null,
      lead.createdAt || new Date().toISOString(),
      lead.updatedAt || new Date().toISOString(),
    ];

    try {
      const result = await query(sql, values);
      return this.mapRowToLead(result.rows[0]);
    } catch (error) {
      console.error('Error saving lead:', error);
      throw error;
    }
  }

  /**
   * Busca un lead por ID
   */
  static async findById(id: string): Promise<Lead | undefined> {
    const sql = 'SELECT * FROM leads WHERE id = $1';
    try {
      const result = await query(sql, [id]);
      if (result.rows.length === 0) {
        return undefined;
      }
      return this.mapRowToLead(result.rows[0]);
    } catch (error) {
      console.error('Error finding lead by id:', error);
      throw error;
    }
  }

  /**
   * Busca un lead por teléfono
   */
  static async findByPhone(phone: string): Promise<Lead | undefined> {
    const sql = 'SELECT * FROM leads WHERE telefono = $1 OR whatsapp = $1 ORDER BY created_at DESC LIMIT 1';
    try {
      const result = await query(sql, [phone]);
      if (result.rows.length === 0) {
        return undefined;
      }
      return this.mapRowToLead(result.rows[0]);
    } catch (error) {
      console.error('Error finding lead by phone:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los leads
   */
  static async findAll(): Promise<Lead[]> {
    const sql = 'SELECT * FROM leads ORDER BY created_at DESC';
    try {
      const result = await query(sql);
      return result.rows.map(row => this.mapRowToLead(row));
    } catch (error) {
      console.error('Error finding all leads:', error);
      throw error;
    }
  }

  /**
   * Busca leads por estado
   */
  static async findByEstado(estado: string): Promise<Lead[]> {
    const sql = 'SELECT * FROM leads WHERE estado = $1 ORDER BY created_at DESC';
    try {
      const result = await query(sql, [estado]);
      return result.rows.map(row => this.mapRowToLead(row));
    } catch (error) {
      console.error('Error finding leads by estado:', error);
      throw error;
    }
  }

  /**
   * Busca leads por interés
   */
  static async findByInteres(interes: string): Promise<Lead[]> {
    const sql = 'SELECT * FROM leads WHERE interes = $1 ORDER BY created_at DESC';
    try {
      const result = await query(sql, [interes]);
      return result.rows.map(row => this.mapRowToLead(row));
    } catch (error) {
      console.error('Error finding leads by interes:', error);
      throw error;
    }
  }

  /**
   * Mapea una fila de la base de datos a un objeto Lead
   */
  private static mapRowToLead(row: any): Lead {
    return {
      id: row.id,
      nombre: row.nombre,
      telefono: row.telefono,
      whatsapp: row.whatsapp,
      interes: row.interes,
      zona: row.zona,
      tipoPropiedad: row.tipo_propiedad,
      presupuesto: row.presupuesto,
      presupuestoMax: row.presupuesto_max,
      presupuestoMoneda: row.presupuesto_moneda as 'pesos' | 'dolares' | undefined,
      dormitorios: row.dormitorios,
      fechaIngreso: row.fecha_ingreso,
      esPrimeraVivienda: row.es_primera_vivienda,
      compraConCredito: row.compra_con_credito,
      direccion: row.direccion,
      metrosCuadrados: row.metros_cuadrados,
      estadoPropiedad: row.estado_propiedad,
      estado: row.estado,
      canal: row.canal,
      notas: row.notas,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    };
  }
}
