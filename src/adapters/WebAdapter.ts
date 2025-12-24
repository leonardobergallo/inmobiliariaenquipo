import { ChatbotEngine } from '../chatbot/ChatbotEngine';
import { BotResponse, Canal, Message } from '../types';

/**
 * Adaptador para Web (chat en sitio web)
 */
export class WebAdapter {
  private chatbot: ChatbotEngine;
  private sessions: Map<string, Message[]> = new Map();

  constructor(chatbot: ChatbotEngine) {
    this.chatbot = chatbot;
  }

  /**
   * Procesa un mensaje entrante desde la web
   */
  async handleMessage(sessionId: string, message: string): Promise<BotResponse> {
    try {
      // Guardar mensaje del usuario
      this.addMessage(sessionId, message, false);

      // Procesar con el chatbot
      const response = await this.chatbot.processMessage(sessionId, message, 'web');

      // Guardar respuesta del bot
      this.addMessage(sessionId, response.text, true);

      return response;
    } catch (error) {
      // Log detallado del error para debugging
      console.error('❌ [WebAdapter] Error processing web message:', error);
      if (error instanceof Error) {
        console.error('❌ [WebAdapter] Error stack:', error.stack);
        console.error('❌ [WebAdapter] Error message:', error.message);
      }
      return {
        text: '❌ Ocurrió un error. Por favor, intenta nuevamente.',
      };
    }
  }

  /**
   * Obtiene el historial de mensajes de una sesión
   */
  getMessageHistory(sessionId: string): Message[] {
    return this.sessions.get(sessionId) || [];
  }

  /**
   * Agrega un mensaje al historial
   */
  private addMessage(sessionId: string, text: string, fromBot: boolean): void {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, []);
    }

    const messages = this.sessions.get(sessionId)!;
    messages.push({
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: sessionId,
      text,
      timestamp: new Date().toISOString(),
      fromBot,
    });
  }

  /**
   * Limpia el historial de una sesión
   */
  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
    this.chatbot.resetConversation(sessionId);
  }

  /**
   * Crea una nueva sesión
   */
  createSession(): string {
    const sessionId = `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.sessions.set(sessionId, []);
    
    // Enviar mensaje de bienvenida
    const welcomeResponse = this.chatbot.getMainMenu();
    this.addMessage(sessionId, welcomeResponse.text, true);
    
    return sessionId;
  }
}

