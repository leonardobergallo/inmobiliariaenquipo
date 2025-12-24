import { ChatState, TipoInteres } from '../types';
import { query } from '../database/connection';

export class ChatStateManager {
  /**
   * Obtiene el estado de chat de un usuario
   */
  static async getState(userId: string): Promise<ChatState | null> {
    const sql = 'SELECT * FROM chat_states WHERE user_id = $1';
    try {
      const result = await query(sql, [userId]);
      if (result.rows.length === 0) {
        return null;
      }
      return this.mapRowToState(result.rows[0]);
    } catch (error) {
      console.error('❌ [ChatStateManager] Error getting chat state:', error);
      if (error instanceof Error) {
        console.error('❌ [ChatStateManager] Error message:', error.message);
        console.error('❌ [ChatStateManager] Error stack:', error.stack);
      }
      return null;
    }
  }

  /**
   * Guarda un estado de chat
   */
  static async saveState(state: ChatState): Promise<void> {
    const sql = `
      INSERT INTO chat_states (user_id, current_step, flow, data, waiting_for, completed, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) DO UPDATE SET
        current_step = EXCLUDED.current_step,
        flow = EXCLUDED.flow,
        data = EXCLUDED.data,
        waiting_for = EXCLUDED.waiting_for,
        completed = EXCLUDED.completed,
        updated_at = CURRENT_TIMESTAMP
    `;

    const values = [
      state.userId,
      state.currentStep,
      state.flow,
      JSON.stringify(state.data),
      state.waitingFor || null,
      state.completed,
    ];

    try {
      await query(sql, values);
    } catch (error) {
      console.error('Error saving chat state:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo estado de chat
   */
  static async createState(userId: string, flow: TipoInteres | null = null): Promise<ChatState> {
    const state: ChatState = {
      userId,
      currentStep: 'start',
      flow,
      data: {},
      completed: false,
    };
    await this.saveState(state);
    return state;
  }

  /**
   * Actualiza un estado de chat existente
   */
  static async updateState(userId: string, updates: Partial<ChatState>): Promise<ChatState> {
    try {
      const existingState = await this.getState(userId);
      const state = existingState || await this.createState(userId);
      const updated = { ...state, ...updates };
      await this.saveState(updated);
      return updated;
    } catch (error) {
      console.error('❌ [ChatStateManager] Error updating state:', error);
      if (error instanceof Error) {
        console.error('❌ [ChatStateManager] Error message:', error.message);
      }
      throw error;
    }
  }

  /**
   * Elimina el estado de chat de un usuario
   */
  static async clearState(userId: string): Promise<void> {
    const sql = 'DELETE FROM chat_states WHERE user_id = $1';
    try {
      await query(sql, [userId]);
    } catch (error) {
      console.error('Error clearing chat state:', error);
      throw error;
    }
  }

  /**
   * Reinicia el estado de chat de un usuario
   */
  static async resetState(userId: string): Promise<ChatState> {
    await this.clearState(userId);
    return await this.createState(userId);
  }

  /**
   * Mapea una fila de la base de datos a un objeto ChatState
   */
  private static mapRowToState(row: any): ChatState {
    try {
      let data = {};
      if (row.data) {
        if (typeof row.data === 'string') {
          try {
            data = JSON.parse(row.data);
          } catch (parseError) {
            console.error('❌ [ChatStateManager] Error parseando JSON del estado:', parseError);
            data = {};
          }
        } else {
          data = row.data;
        }
      }

      return {
        userId: row.user_id,
        currentStep: row.current_step || 'start',
        flow: row.flow,
        data: data,
        waitingFor: row.waiting_for,
        completed: row.completed || false,
      };
    } catch (error) {
      console.error('❌ [ChatStateManager] Error mapeando estado:', error);
      // Retornar estado por defecto si hay error
      return {
        userId: row.user_id || '',
        currentStep: 'start',
        flow: null,
        data: {},
        completed: false,
      };
    }
  }
}
