/**
 * Widget del Chatbot para Inmobiliaria en Equipo
 * 
 * Para usar este widget en tu página web:
 * 
 * 1. Agrega este script antes de </body>:
 *    <script src="http://localhost:3000/chatbot-widget.js"></script>
 * 
 * 2. O copia este código directamente en tu página
 * 
 * 3. El widget aparecerá automáticamente como un botón flotante
 */

(function() {
    'use strict';

    // Detectar automáticamente la URL del servidor
    // Si el script se carga desde el mismo servidor, usa esa URL
    // Si no, intenta detectar desde window.location
    const scriptSrc = document.currentScript?.src || '';
    let API_BASE = '';
    
    // Prioridad 1: Configuración manual
    if (window.INMOBILIARIA_CHATBOT_API) {
        API_BASE = window.INMOBILIARIA_CHATBOT_API;
    }
    // Prioridad 2: Detectar desde el script
    else if (scriptSrc) {
        try {
            const url = new URL(scriptSrc);
            API_BASE = `${url.protocol}//${url.host}`;
        } catch (e) {
            // Si falla, continuar
        }
    }
    // Prioridad 3: Detectar desde window.location (producción)
    if (!API_BASE && window.location) {
        API_BASE = `${window.location.protocol}//${window.location.host}`;
    }
    // Fallback: localhost para desarrollo
    if (!API_BASE) {
        API_BASE = 'http://localhost:3000';
    }
    let sessionId = null;

    // Crear estilos del widget
    const styles = `
        .inmobiliaria-chatbot-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 380px;
            height: 600px;
            max-width: calc(100vw - 40px);
            max-height: calc(100vh - 40px);
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            display: none;
            flex-direction: column;
            z-index: 99999;
            overflow: hidden;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .inmobiliaria-chatbot-widget.open {
            display: flex;
        }

        .inmobiliaria-chatbot-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            color: white;
            transition: all 0.3s;
        }

        .inmobiliaria-chatbot-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
        }

        .inmobiliaria-chatbot-button.close {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            background: #f0f0f0;
            color: #333;
            font-size: 20px;
            border-radius: 50%;
        }

        .inmobiliaria-chatbot-button.close:hover {
            background: #e0e0e0;
        }

        .inmobiliaria-chatbot-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
            position: relative;
        }

        .inmobiliaria-chatbot-header h3 {
            margin: 0;
            font-size: 18px;
        }

        .inmobiliaria-chatbot-header p {
            margin: 5px 0 0 0;
            font-size: 12px;
            opacity: 0.9;
        }

        .inmobiliaria-chatbot-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #f5f5f5;
        }

        .inmobiliaria-message {
            margin-bottom: 15px;
            display: flex;
            align-items: flex-start;
        }

        .inmobiliaria-message.user {
            justify-content: flex-end;
        }

        .inmobiliaria-message-bubble {
            max-width: 70%;
            padding: 12px 16px;
            border-radius: 18px;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.4;
        }

        .inmobiliaria-message.bot .inmobiliaria-message-bubble {
            background: white;
            color: #333;
            border-bottom-left-radius: 4px;
        }

        .inmobiliaria-message.user .inmobiliaria-message-bubble {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-bottom-right-radius: 4px;
        }

        .inmobiliaria-buttons-container {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
        }

        .inmobiliaria-button-option {
            background: #667eea;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.3s;
        }

        .inmobiliaria-button-option:hover {
            background: #764ba2;
            transform: translateY(-2px);
        }

        .inmobiliaria-chatbot-input-container {
            padding: 15px;
            background: white;
            border-top: 1px solid #e0e0e0;
            display: flex;
            gap: 10px;
        }

        .inmobiliaria-chatbot-input {
            flex: 1;
            padding: 10px 15px;
            border: 2px solid #e0e0e0;
            border-radius: 25px;
            font-size: 14px;
            outline: none;
        }

        .inmobiliaria-chatbot-input:focus {
            border-color: #667eea;
        }

        .inmobiliaria-chatbot-send {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
        }

        .inmobiliaria-chatbot-send:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .inmobiliaria-loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,.3);
            border-radius: 50%;
            border-top-color: white;
            animation: inmobiliaria-spin 1s ease-in-out infinite;
        }

        @keyframes inmobiliaria-spin {
            to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
            .inmobiliaria-chatbot-widget {
                width: 100%;
                height: 100%;
                max-width: 100vw;
                max-height: 100vh;
                bottom: 0;
                right: 0;
                border-radius: 0;
            }
        }
    `;

    // Inyectar estilos
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Crear HTML del widget
    function createWidget() {
        const widget = document.createElement('div');
        widget.className = 'inmobiliaria-chatbot-widget';
        widget.id = 'inmobiliariaChatbotWidget';
        widget.innerHTML = `
            <div class="inmobiliaria-chatbot-header">
                <button class="inmobiliaria-chatbot-button close" onclick="window.InmobiliariaChatbot.toggle()">✕</button>
                <h3>🏠 Inmobiliaria en Equipo</h3>
                <p>Asistente virtual</p>
            </div>
            <div class="inmobiliaria-chatbot-messages" id="inmobiliariaChatbotMessages"></div>
            <div class="inmobiliaria-chatbot-input-container">
                <input 
                    type="text" 
                    id="inmobiliariaChatbotInput" 
                    class="inmobiliaria-chatbot-input" 
                    placeholder="Escribe tu mensaje..."
                    autocomplete="off"
                />
                <button id="inmobiliariaChatbotSend" class="inmobiliaria-chatbot-send" onclick="window.InmobiliariaChatbot.send()">Enviar</button>
            </div>
        `;

        const button = document.createElement('button');
        button.className = 'inmobiliaria-chatbot-button';
        button.id = 'inmobiliariaChatbotToggle';
        button.innerHTML = '💬';
        button.onclick = () => window.InmobiliariaChatbot.toggle();

        document.body.appendChild(widget);
        document.body.appendChild(button);

        // Event listener para Enter
        document.getElementById('inmobiliariaChatbotInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                window.InmobiliariaChatbot.send();
            }
        });
    }

    // Funciones del widget
    const InmobiliariaChatbot = {
        toggle: function() {
            const widget = document.getElementById('inmobiliariaChatbotWidget');
            widget.classList.toggle('open');
            
            if (widget.classList.contains('open') && !sessionId) {
                this.initSession();
            }
        },

        initSession: async function() {
            try {
                const response = await fetch(`${API_BASE}/api/web/chat/session`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                sessionId = data.sessionId;
                
                if (data.messages && data.messages.length > 0) {
                    data.messages.forEach(msg => {
                        this.addMessage(msg.message, msg.sender === 'bot');
                    });
                } else {
                    this.send('Hola');
                }
            } catch (error) {
                console.error('Error inicializando sesión:', error);
                this.addMessage('❌ Error al conectar con el servidor.', false, true);
            }
        },

        send: async function(text = null) {
            const input = document.getElementById('inmobiliariaChatbotInput');
            const sendBtn = document.getElementById('inmobiliariaChatbotSend');
            const messageText = text || input.value.trim();
            
            if (!messageText) return;
            
            if (!sessionId) {
                await this.initSession();
                return;
            }

            this.addMessage(messageText, false);
            input.value = '';
            input.disabled = true;
            sendBtn.disabled = true;
            sendBtn.innerHTML = '<div class="inmobiliaria-loading"></div>';

            try {
                const response = await fetch(`${API_BASE}/api/web/chat/message`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sessionId: sessionId,
                        message: messageText
                    })
                });

                const data = await response.json();
                this.addMessage(data.response.text, true, false, data.response.buttons);
            } catch (error) {
                console.error('Error enviando mensaje:', error);
                this.addMessage('❌ Error al enviar el mensaje. Intenta nuevamente.', false, true);
            } finally {
                input.disabled = false;
                sendBtn.disabled = false;
                sendBtn.innerHTML = 'Enviar';
                input.focus();
            }
        },

        addMessage: function(text, isBot = false, isError = false, buttons = null) {
            const messagesContainer = document.getElementById('inmobiliariaChatbotMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `inmobiliaria-message ${isBot ? 'bot' : 'user'}`;
            
            const bubble = document.createElement('div');
            bubble.className = 'inmobiliaria-message-bubble';
            bubble.textContent = text;
            
            if (isError) {
                bubble.style.background = '#ff4444';
                bubble.style.color = 'white';
            }
            
            messageDiv.appendChild(bubble);
            
            if (buttons && buttons.length > 0) {
                const buttonsContainer = document.createElement('div');
                buttonsContainer.className = 'inmobiliaria-buttons-container';
                
                buttons.forEach((button) => {
                    const btn = document.createElement('button');
                    btn.className = 'inmobiliaria-button-option';
                    btn.textContent = button.label;
                    const valueToSend = button.value !== undefined ? button.value : button.label;
                    btn.onclick = () => this.send(valueToSend);
                    buttonsContainer.appendChild(btn);
                });
                
                messageDiv.appendChild(buttonsContainer);
            }
            
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    };

    // Exponer globalmente
    window.InmobiliariaChatbot = InmobiliariaChatbot;

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createWidget);
    } else {
        createWidget();
    }
})();

