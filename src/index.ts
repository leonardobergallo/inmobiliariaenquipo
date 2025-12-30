import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ChatbotEngine } from './chatbot/ChatbotEngine';
import { WhatsAppAdapter } from './adapters/WhatsAppAdapter';
import { WebAdapter } from './adapters/WebAdapter';
import { AppAdapter } from './adapters/AppAdapter';
import { LeadStorage } from './storage/LeadStorage';
import { initializeDatabase } from './database/init';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware CORS
app.use((req: Request, res: Response, next) => {
  // Permitir todos los orígenes (puedes restringir esto en producción)
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'https://inmobiliariaenquipo.vercel.app',
    // Agrega aquí otros orígenes permitidos
  ];
  
  // Si el origen está en la lista o es undefined (mismo origen), permitirlo
  // En desarrollo, permitir todos los orígenes
  if (process.env.NODE_ENV === 'development' || !origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

// Inicializar chatbot y adaptadores
const chatbot = new ChatbotEngine();
const whatsappAdapter = new WhatsAppAdapter(chatbot);
const webAdapter = new WebAdapter(chatbot);
const appAdapter = new AppAdapter(chatbot);

// ============================================
// RUTAS PARA WHATSAPP
// ============================================

app.get('/webhook/whatsapp', async (req: Request, res: Response) => {
  await whatsappAdapter.handleWebhook(req, res);
});

app.post('/webhook/whatsapp', async (req: Request, res: Response) => {
  await whatsappAdapter.handleWebhook(req, res);
});

// ============================================
// RUTAS PARA WEB
// ============================================

// Crear nueva sesión
app.post('/api/web/chat/session', (req: Request, res: Response) => {
  try {
    const sessionId = webAdapter.createSession();
    const history = webAdapter.getMessageHistory(sessionId);
    res.json({ sessionId, messages: history });
  } catch (error) {
    res.status(500).json({ error: 'Error creating session' });
  }
});

// Handler OPTIONS para preflight
app.options('/api/web/chat/session', (req: Request, res: Response) => {
  res.status(200).end();
});

// Enviar mensaje
app.post('/api/web/chat/message', async (req: Request, res: Response) => {
  try {
    const { sessionId, message } = req.body;
    
    if (!sessionId || !message) {
      return res.status(400).json({ error: 'sessionId and message are required' });
    }

    const response = await webAdapter.handleMessage(sessionId, message);
    const history = webAdapter.getMessageHistory(sessionId);

    res.json({ response, history });
  } catch (error) {
    // Log detallado del error
    console.error('❌ [API] Error processing web message:', error);
    if (error instanceof Error) {
      console.error('❌ [API] Error message:', error.message);
      console.error('❌ [API] Error stack:', error.stack);
    }
    res.status(500).json({ 
      error: 'Error processing message',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Handler OPTIONS para preflight
app.options('/api/web/chat/message', (req: Request, res: Response) => {
  res.status(200).end();
});

// Obtener historial
app.get('/api/web/chat/history/:sessionId', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const history = webAdapter.getMessageHistory(sessionId);
    res.json({ history });
  } catch (error) {
    res.status(500).json({ error: 'Error getting history' });
  }
});

// Handler OPTIONS para preflight
app.options('/api/web/chat/history/:sessionId', (req: Request, res: Response) => {
  res.status(200).end();
});

// Limpiar sesión
app.delete('/api/web/chat/session/:sessionId', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    webAdapter.clearSession(sessionId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error clearing session' });
  }
});

// Handler OPTIONS para preflight
app.options('/api/web/chat/session/:sessionId', (req: Request, res: Response) => {
  res.status(200).end();
});

// ============================================
// RUTAS PARA APP
// ============================================

// Enviar mensaje desde app
app.post('/api/app/chat/message', async (req: Request, res: Response) => {
  try {
    const { userId, message } = req.body;
    
    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }

    const response = await appAdapter.handleMessage(userId, message);
    const history = appAdapter.getMessageHistory(userId);

    res.json({ response, history });
  } catch (error) {
    res.status(500).json({ error: 'Error processing message' });
  }
});

// Obtener historial de app
app.get('/api/app/chat/history/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const history = appAdapter.getMessageHistory(userId);
    res.json({ history });
  } catch (error) {
    res.status(500).json({ error: 'Error getting history' });
  }
});

// Obtener menú principal
app.get('/api/app/chat/menu', (req: Request, res: Response) => {
  try {
    const menu = appAdapter.getMainMenu();
    res.json({ menu });
  } catch (error) {
    res.status(500).json({ error: 'Error getting menu' });
  }
});

// ============================================
// RUTAS PARA ADMIN / CRM
// ============================================

// Obtener todos los leads
app.get('/api/admin/leads', async (req: Request, res: Response) => {
  try {
    const leads = await LeadStorage.findAll();
    res.json({ leads });
  } catch (error) {
    res.status(500).json({ error: 'Error getting leads' });
  }
});

// Obtener leads por estado
app.get('/api/admin/leads/estado/:estado', async (req: Request, res: Response) => {
  try {
    const { estado } = req.params;
    const leads = await LeadStorage.findByEstado(estado);
    res.json({ leads });
  } catch (error) {
    res.status(500).json({ error: 'Error getting leads by estado' });
  }
});

// Obtener leads por interés
app.get('/api/admin/leads/interes/:interes', async (req: Request, res: Response) => {
  try {
    const { interes } = req.params;
    const leads = await LeadStorage.findByInteres(interes);
    res.json({ leads });
  } catch (error) {
    res.status(500).json({ error: 'Error getting leads by interes' });
  }
});

// Obtener un lead específico
app.get('/api/admin/leads/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lead = await LeadStorage.findById(id);
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    res.json({ lead });
  } catch (error) {
    console.error('❌ [Admin] Error getting lead:', error);
    res.status(500).json({ error: 'Error getting lead' });
  }
});

// Actualizar estado de un lead
app.put('/api/admin/leads/:id/estado', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    if (!estado) {
      return res.status(400).json({ error: 'estado is required' });
    }

    const lead = await LeadStorage.findById(id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Actualizar estado
    lead.estado = estado as any;
    const updated = await LeadStorage.save(lead);
    
    res.json({ lead: updated });
  } catch (error) {
    console.error('❌ [Admin] Error updating lead estado:', error);
    res.status(500).json({ error: 'Error updating lead estado' });
  }
});

// Agregar notas a un lead
app.put('/api/admin/leads/:id/notas', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { notas } = req.body;
    
    const lead = await LeadStorage.findById(id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    lead.notas = notas || '';
    const updated = await LeadStorage.save(lead);
    
    res.json({ lead: updated });
  } catch (error) {
    console.error('❌ [Admin] Error updating lead notas:', error);
    res.status(500).json({ error: 'Error updating lead notas' });
  }
});

// ============================================
// RUTA DE SALUD
// ============================================

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// INICIALIZACIÓN DE BASE DE DATOS
// ============================================

// Inicializar base de datos al cargar el módulo
let dbInitialized = false;
(async () => {
  console.log('🔄 Inicializando base de datos...');
  dbInitialized = await initializeDatabase();
  
  if (!dbInitialized) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Base de datos no disponible. El servidor continuará pero algunas funcionalidades pueden no estar disponibles.');
      console.warn('⚠️ Para habilitar la base de datos, configura DATABASE_URL en tu archivo .env');
    } else {
      console.error('❌ Error inicializando base de datos. El servidor puede no funcionar correctamente.');
    }
  } else {
    console.log('✅ Base de datos inicializada correctamente');
  }
})().catch(console.error);

// ============================================
// INICIAR SERVIDOR (solo si no es Vercel)
// ============================================

// Solo iniciar servidor si no estamos en Vercel (serverless)
if (process.env.VERCEL !== '1' && require.main === module) {
  async function startServer() {
    // Esperar un máximo de 5 segundos para la inicialización de BD
    const maxWaitTime = 5000;
    const startTime = Date.now();
    
    while (!dbInitialized && (Date.now() - startTime) < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Iniciar servidor incluso si la BD no está lista (especialmente en desarrollo)
    app.listen(PORT, () => {
      console.log(`🚀 Chatbot inmobiliario iniciado en puerto ${PORT}`);
      console.log(`📱 WhatsApp webhook: http://localhost:${PORT}/webhook/whatsapp`);
      console.log(`🌐 Web API: http://localhost:${PORT}/api/web/chat`);
      console.log(`📲 App API: http://localhost:${PORT}/api/app/chat`);
      console.log(`👨‍💼 Admin API: http://localhost:${PORT}/api/admin/leads`);
      console.log(`🖥️  Panel Admin: http://localhost:${PORT}/admin.html`);
      
      if (!dbInitialized) {
        console.warn('⚠️ Servidor iniciado sin base de datos. Algunas funcionalidades pueden no estar disponibles.');
      }
    });
  }

  startServer().catch(console.error);
}

// Exportar la app para Vercel
export default app;

