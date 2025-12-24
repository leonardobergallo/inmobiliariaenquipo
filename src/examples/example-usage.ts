/**
 * Ejemplo de uso del chatbot inmobiliario
 * 
 * Este archivo muestra cómo usar el chatbot programáticamente
 */

import { ChatbotEngine } from '../chatbot/ChatbotEngine';
import { LeadStorage } from '../storage/LeadStorage';

async function ejemploUso() {
  // Inicializar el chatbot
  const chatbot = new ChatbotEngine();

  // Simular conversación de un usuario
  const userId = 'usuario_ejemplo_123';

  console.log('=== Ejemplo de conversación ===\n');

  // 1. Usuario inicia conversación
  console.log('Usuario: Hola');
  let response = await chatbot.processMessage(userId, 'Hola');
  console.log('Bot:', response.text);
  console.log('Botones:', response.buttons?.map((b: any) => b.label));
  console.log('');

  // 2. Usuario selecciona "Alquilar"
  console.log('Usuario: Alquilar');
  response = await chatbot.processMessage(userId, 'Alquilar');
  console.log('Bot:', response.text);
  console.log('');

  // 3. Usuario responde las preguntas
  console.log('Usuario: Palermo');
  response = await chatbot.processMessage(userId, 'Palermo');
  console.log('Bot:', response.text);
  console.log('');

  console.log('Usuario: Departamento');
  response = await chatbot.processMessage(userId, 'Departamento');
  console.log('Bot:', response.text);
  console.log('');

  console.log('Usuario: 150000');
  response = await chatbot.processMessage(userId, '150000');
  console.log('Bot:', response.text);
  console.log('');

  console.log('Usuario: 2');
  response = await chatbot.processMessage(userId, '2');
  console.log('Bot:', response.text);
  console.log('');

  console.log('Usuario: En 1 mes');
  response = await chatbot.processMessage(userId, 'En 1 mes');
  console.log('Bot:', response.text);
  console.log('');

  console.log('Usuario: Juan Pérez, 11-1234-5678');
  response = await chatbot.processMessage(userId, 'Juan Pérez, 11-1234-5678');
  console.log('Bot:', response.text);
  console.log('');

  // 4. Ver leads guardados
  console.log('\n=== Leads guardados ===');
  const leads = await LeadStorage.findAll();
  console.log(`Total de leads: ${leads.length}`);
  leads.forEach((lead: any) => {
    console.log(`- ${lead.nombre || 'Sin nombre'} - ${lead.interes} - ${lead.estado}`);
  });
}

// Ejecutar ejemplo
if (require.main === module) {
  ejemploUso().catch(console.error);
}

export { ejemploUso };

