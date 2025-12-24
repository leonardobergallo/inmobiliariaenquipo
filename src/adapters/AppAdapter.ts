import { ChatbotEngine } from '../chatbot/ChatbotEngine';
import { BotResponse, Canal, Message } from '../types';

/**
 * Adaptador para App móvil
 */
export class AppAdapter {
  private chatbot: ChatbotEngine;
  private sessions: Map<string, Message[]> = new Map();

  constructor(chatbot: ChatbotEngine) {
    this.chatbot = chatbot;
  }

  /**
   * Procesa un mensaje entrante desde la app
   */
  async handleMessage(userId: string, message: string): Promise<BotResponse> {
    try {
      // Guardar mensaje del usuario
      this.addMessage(userId, message, false);

      // Procesar con el chatbot
      const response = await this.chatbot.processMessage(userId, message, 'app');

      // Guardar respuesta del bot
      this.addMessage(userId, response.text, true);

      return response;
    } catch (error) {
      console.error('Error processing app message:', error);
      return {
        text: '❌ Ocurrió un error. Por favor, intenta nuevamente.',
      };
    }
  }

  /**
   * Obtiene el historial de mensajes de un usuario
   */
  getMessageHistory(userId: string): Message[] {
    return this.sessions.get(userId) || [];
  }

  /**
   * Agrega un mensaje al historial
   */
  private addMessage(userId: string, text: string, fromBot: boolean): void {
    if (!this.sessions.has(userId)) {
      this.sessions.set(userId, []);
    }

    const messages = this.sessions.get(userId)!;
    messages.push({
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      text,
      timestamp: new Date().toISOString(),
      fromBot,
    });
  }

  /**
   * Limpia el historial de un usuario
   */
  clearHistory(userId: string): void {
    this.sessions.delete(userId);
    this.chatbot.resetConversation(userId);
  }

  /**
   * Obtiene el menú principal
   */
  getMainMenu(): BotResponse {
    return this.chatbot.getMainMenu();
  }
}

