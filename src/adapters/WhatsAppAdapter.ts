import { ChatbotEngine } from '../chatbot/ChatbotEngine';
import { BotResponse, Canal } from '../types';

/**
 * Adaptador para WhatsApp Business API
 * Este adaptador se conecta con la API de WhatsApp Business
 */
export class WhatsAppAdapter {
  private chatbot: ChatbotEngine;

  constructor(chatbot: ChatbotEngine) {
    this.chatbot = chatbot;
  }

  /**
   * Procesa un mensaje entrante de WhatsApp
   */
  async handleIncomingMessage(from: string, message: string): Promise<void> {
    try {
      console.log(`🔄 [WhatsApp] Procesando mensaje de ${from}: "${message}"`);
      const response = await this.chatbot.processMessage(from, message, 'whatsapp');
      console.log(`✅ [WhatsApp] Respuesta generada:`, JSON.stringify(response, null, 2));
      await this.sendMessage(from, response);
    } catch (error) {
      console.error('❌ [WhatsApp] Error processing message:', error);
      await this.sendMessage(from, {
        text: '❌ Ocurrió un error. Por favor, intenta nuevamente o contacta con un asesor.',
      });
    }
  }

  /**
   * Envía un mensaje a través de WhatsApp
   */
  private async sendMessage(to: string, response: BotResponse): Promise<void> {
    const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

    // Si no hay credenciales configuradas, solo loguear (modo desarrollo)
    if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
      console.log(`[WhatsApp] Enviando a ${to}:`);
      console.log(`Texto: ${response.text}`);
      if (response.buttons) {
        console.log(`Botones: ${JSON.stringify(response.buttons)}`);
      }
      console.log('⚠️  Credenciales de WhatsApp no configuradas. Configura WHATSAPP_PHONE_NUMBER_ID y WHATSAPP_ACCESS_TOKEN en .env');
      return;
    }

    try {
      // Si hay botones, usar mensaje interactivo
      if (response.buttons && response.buttons.length > 0) {
        const buttons = response.buttons
          .slice(0, 3) // Máximo 3 botones en WhatsApp
          .map((btn, index) => ({
            type: 'reply',
            reply: {
              id: `btn_${index}`,
              title: btn.label.substring(0, 20) // Máximo 20 caracteres
            }
          }));

        const apiResponse = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: to,
            type: 'interactive',
            interactive: {
              type: 'button',
              body: {
                text: response.text.substring(0, 1024) // Máximo 1024 caracteres
              },
              action: {
                buttons: buttons
              }
            }
          }),
        });

        if (!apiResponse.ok) {
          const error = await apiResponse.json();
          console.error('❌ [WhatsApp] Error enviando mensaje interactivo:', JSON.stringify(error, null, 2));
        } else {
          const result = await apiResponse.json();
          console.log('✅ [WhatsApp] Mensaje interactivo enviado:', JSON.stringify(result, null, 2));
        }
      } else {
        // Mensaje de texto simple
        const apiResponse = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: to,
            type: 'text',
            text: { 
              body: response.text.substring(0, 4096) // Máximo 4096 caracteres
            }
          }),
        });

        if (!apiResponse.ok) {
          const error = await apiResponse.json();
          console.error('❌ [WhatsApp] Error enviando mensaje de texto:', JSON.stringify(error, null, 2));
        } else {
          const result = await apiResponse.json();
          console.log('✅ [WhatsApp] Mensaje de texto enviado:', JSON.stringify(result, null, 2));
        }
      }

      console.log(`✅ [WhatsApp] Mensaje enviado a ${to}`);
    } catch (error) {
      console.error('❌ Error enviando mensaje WhatsApp:', error);
      throw error;
    }
  }

  /**
   * Maneja webhooks de WhatsApp
   */
  async handleWebhook(req: any, res: any): Promise<void> {
    // Verificar que viene de WhatsApp (verificación del webhook)
    if (req.method === 'GET') {
      const mode = req.query['hub.mode'];
      const token = req.query['hub.verify_token'];
      const challenge = req.query['hub.challenge'];

      // TODO: Validar token con tu VERIFY_TOKEN configurado
      if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        res.status(200).send(challenge);
        return;
      }

      res.status(403).send('Forbidden');
      return;
    }

    // Procesar mensajes entrantes
    if (req.method === 'POST') {
      const body = req.body;
      
      // Log completo del webhook para debugging
      console.log('📥 [WhatsApp Webhook] Mensaje recibido:', JSON.stringify(body, null, 2));

      if (body.object === 'whatsapp_business_account') {
        body.entry?.forEach((entry: any) => {
          const changes = entry.changes?.[0];
          console.log('📥 [WhatsApp] Changes:', JSON.stringify(changes, null, 2));
          
          if (changes?.value?.messages) {
            const message = changes.value.messages[0];
            const from = message.from;
            const text = message.text?.body || '';

            console.log(`📥 [WhatsApp] Mensaje recibido de: ${from}`);
            console.log(`📥 [WhatsApp] Texto: ${text}`);

            this.handleIncomingMessage(from, text);
          } else if (changes?.value?.statuses) {
            // Status updates (mensajes enviados)
            console.log('📊 [WhatsApp] Status update:', JSON.stringify(changes.value.statuses, null, 2));
          } else {
            console.log('⚠️ [WhatsApp] Cambio recibido pero no es un mensaje:', JSON.stringify(changes?.value, null, 2));
          }
        });

        res.status(200).send('OK');
      } else {
        console.log('❌ [WhatsApp] Objeto no reconocido:', body.object);
        res.status(404).send('Not Found');
      }
    }
  }
}

