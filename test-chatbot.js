/**
 * Script simple para probar el chatbot
 * Ejecutar con: node test-chatbot.js
 */

const { ChatbotEngine } = require('./dist/chatbot/ChatbotEngine');
const { LeadStorage } = require('./dist/storage/LeadStorage');

async function testChatbot() {
  console.log('🧪 Probando Chatbot Inmobiliario\n');
  console.log('='.repeat(50));
  
  const chatbot = new ChatbotEngine();
  const userId = 'test_user_' + Date.now();

  // Test 1: Menú principal
  console.log('\n📋 Test 1: Menú Principal');
  console.log('-'.repeat(50));
  let response = chatbot.getMainMenu();
  console.log('Bot:', response.text);
  console.log('Botones:', response.buttons?.map(b => b.label).join(', '));

  // Test 2: Iniciar flujo de alquiler
  console.log('\n🏠 Test 2: Flujo de Alquiler');
  console.log('-'.repeat(50));
  
  response = chatbot.processMessage(userId, 'Alquilar');
  console.log('Usuario: Alquilar');
  console.log('Bot:', response.text);

  response = chatbot.processMessage(userId, 'Palermo');
  console.log('\nUsuario: Palermo');
  console.log('Bot:', response.text);

  response = chatbot.processMessage(userId, 'Departamento');
  console.log('\nUsuario: Departamento');
  console.log('Bot:', response.text);

  response = chatbot.processMessage(userId, '150000');
  console.log('\nUsuario: 150000');
  console.log('Bot:', response.text);

  response = chatbot.processMessage(userId, '2');
  console.log('\nUsuario: 2');
  console.log('Bot:', response.text);

  response = chatbot.processMessage(userId, 'En 1 mes');
  console.log('\nUsuario: En 1 mes');
  console.log('Bot:', response.text);

  response = chatbot.processMessage(userId, 'Juan Pérez, 11-1234-5678');
  console.log('\nUsuario: Juan Pérez, 11-1234-5678');
  console.log('Bot:', response.text);

  // Test 3: Ver leads guardados
  console.log('\n📊 Test 3: Leads Guardados');
  console.log('-'.repeat(50));
  const leads = LeadStorage.findAll();
  console.log(`Total de leads: ${leads.length}`);
  leads.forEach((lead, index) => {
    console.log(`\nLead ${index + 1}:`);
    console.log(`  - ID: ${lead.id}`);
    console.log(`  - Nombre: ${lead.nombre || 'N/A'}`);
    console.log(`  - Teléfono: ${lead.telefono || 'N/A'}`);
    console.log(`  - Interés: ${lead.interes}`);
    console.log(`  - Zona: ${lead.zona || 'N/A'}`);
    console.log(`  - Estado: ${lead.estado}`);
  });

  console.log('\n✅ Tests completados');
  console.log('='.repeat(50));
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testChatbot().catch(console.error);
}

module.exports = { testChatbot };


