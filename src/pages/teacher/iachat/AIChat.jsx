import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  BookOpen,
  Users,
  Target,
  Calendar,
  Lightbulb,
  MessageSquare,
  Mic,
  Paperclip,
  MoreVertical,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Maximize,
  Minimize,
} from "lucide-react";

const AIChat = () => {
  // Demo AI Chat - Respuestas simuladas sin backend

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "🌟 ¡Hola! Soy tu **Asistente Pedagógico EDA** (Demo).\n\n📚 Esta es una **demostración** de cómo funcionaría el chat con IA.\n\n🎯 **Funcionalidades demo:**\n• Respuestas educativas pregeneradas\n• Simulación de IA pedagógica\n• Consultas rápidas funcionales\n• Interfaz completa operativa\n\n💡 **Prueba haciendo preguntas** o usa las consultas rápidas de abajo.",
      timestamp: new Date(Date.now() - 60000),
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [apiStatus, setApiStatus] = useState("connected"); // Demo: siempre conectado
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef(null);

  // Demo: Respuestas predefinidas para simular IA
  const demoResponses = {
    "ideas para clases":
      '📚 **Ideas Creativas para Clases de Matemáticas - Fracciones (5to Grado)**\n\n**1. 🍕 Pizza Fractionaria**\n• Usa pizzas de cartón divididas en porciones\n• Los estudiantes "ordenan" diferentes fracciones\n• Suman y restan fracciones físicamente\n\n**2. 🎯 Juego de Dardos Fraccionarios**\n• Tablero dividido en secciones fraccionarias\n• Calculan probabilidades y suman puntos\n\n**3. 🏗️ Construcción con Bloques**\n• LEGO o bloques para representar fracciones\n• Construyen edificios usando medidas fraccionarias\n\n**4. 🎨 Arte Fraccionario**\n• Dibujos divididos en partes iguales\n• Colorean fracciones específicas\n\n**5. 🍎 Recetas de Cocina**\n• Ajustar ingredientes usando fracciones\n• Práctica real de suma/resta de fracciones\n\n**Recursos necesarios:** Cartón, colores, bloques, ingredientes básicos\n\n¿Te gustaría que desarrolle alguna de estas ideas más detalladamente?',

    "estrategias enseñanza":
      "🎯 **Estrategias de Enseñanza Efectivas**\n\n**Para Inicial (3-5 años):**\n• 🎭 Aprendizaje a través del juego\n• 🎵 Canciones y rimas educativas\n• 📖 Cuentos interactivos\n• 🖐️ Actividades sensoriales\n\n**Técnicas Generales:**\n• 🔄 Rotación por estaciones\n• 👥 Trabajo colaborativo\n• 🎨 Integración de artes\n• 📱 Tecnología educativa\n• 🏆 Gamificación del aprendizaje\n\n**Tips clave:**\n• Adapta a diferentes estilos de aprendizaje\n• Usa el refuerzo positivo constantemente\n• Incluye movimiento y actividad física\n• Conecta con experiencias previas\n\n¿Qué nivel o materia específica te interesa?",

    "manejo aula":
      "🏫 **Estrategias de Manejo del Aula**\n\n**Disciplina Positiva:**\n• ✅ Establece expectativas claras desde el inicio\n• 🏆 Sistema de recompensas grupales e individuales\n• 📋 Rutinas predecibles y consistentes\n• 🤝 Acuerdos de convivencia co-creados\n\n**Técnicas Efectivas:**\n• 🚦 Semáforo del comportamiento\n• ⏱️ Tiempo fuera reflexivo (no punitivo)\n• 🎵 Canciones para transiciones\n• 👁️ Contacto visual y proximidad física\n\n**Para Problemas Específicos:**\n• 🗣️ Habla privada, no pública corrección\n• 🔄 Redirige comportamientos negativos\n• 💪 Fortalece comportamientos positivos\n• 👨‍👩‍👧‍👦 Involucra a los padres como aliados\n\n**Ambiente físico:**\n• Espacios definidos y organizados\n• Materiales accesibles y rotulados\n• Áreas de calma y reflexión\n\n¿Qué desafío específico estás enfrentando?",

    evaluación:
      "📊 **Estrategias de Evaluación Integral**\n\n**Tipos de Evaluación:**\n• 🔍 **Diagnóstica:** Al inicio del tema\n• 📈 **Formativa:** Durante el proceso (continua)\n• ✅ **Sumativa:** Al final del período\n\n**Herramientas Prácticas:**\n• 📋 Rúbricas detalladas\n• 📁 Portafolios de evidencias\n• 🎯 Listas de cotejo\n• 📝 Autoevaluación estudiantil\n• 👥 Coevaluación entre pares\n\n**Para Inicial:**\n• 📸 Observación y registro fotográfico\n• 🎨 Trabajos artísticos y creativos\n• 🗣️ Evaluación oral individual\n• 🎭 Juegos evaluativos\n\n**Feedback Efectivo:**\n• Específico y actionable\n• Balanceado (fortalezas + áreas de mejora)\n• Oportuno (inmediato cuando sea posible)\n• Enfocado en el proceso, no solo el resultado\n\n¿Qué tipo de evaluación necesitas diseñar?",

    "recursos educativos":
      "🎒 **Recursos Educativos Accesibles**\n\n**Digitales Gratuitos:**\n• 🌐 Khan Academy Kids\n• 📚 Recursos del Ministerio de Educación\n• 🎥 Videos educativos de YouTube\n• 📱 Apps educativas gratuitas\n\n**Materiales Caseros:**\n• 🧮 Contadores con tapas de botellas\n• 📏 Reglas con palitos de helado\n• 🎨 Pintura con témperas caseras\n• 🔤 Letras móviles con cartón\n\n**Reciclables:**\n• 📦 Cajas para construcciones\n• 🥛 Envases para experimentos\n• 📰 Periódicos para lectura y manualidades\n• 🧴 Botellas para juegos sensoriales\n\n**Espacios Alternativos:**\n• 🌳 Aula al aire libre\n• 📚 Rincones temáticos\n• 🎭 Área de dramatización\n• 🔬 Zona de experimentos\n\n¿Qué materia o actividad específica necesitas recursos?",

    default:
      '🤖 **Respuesta Demo de IA Pedagógica**\n\nEsta es una **simulación** de cómo respondería el asistente de IA.\n\n📚 **Temas que puedo ayudarte:**\n• Planificación de clases\n• Estrategias de enseñanza\n• Manejo del aula\n• Recursos educativos\n• Evaluación de aprendizajes\n\n💡 **Prueba preguntando sobre:**\n• "Ideas para clases de [materia]"\n• "Estrategias de enseñanza para [nivel]"\n• "Cómo manejar [situación del aula]"\n• "Recursos para enseñar [tema]"\n\n🎯 ¿Sobre qué tema educativo específico te gustaría que te ayude?',
  };

  // Función para obtener respuesta demo basada en el mensaje
  const getDemoResponse = (message) => {
    const msgLower = message.toLowerCase();

    if (msgLower.includes("idea") && msgLower.includes("clase")) {
      return demoResponses["ideas para clases"];
    } else if (
      msgLower.includes("estrategia") &&
      msgLower.includes("enseñanza")
    ) {
      return demoResponses["estrategias enseñanza"];
    } else if (msgLower.includes("manejo") && msgLower.includes("aula")) {
      return demoResponses["manejo aula"];
    } else if (
      msgLower.includes("evaluación") ||
      msgLower.includes("evaluacion")
    ) {
      return demoResponses["evaluación"];
    } else if (msgLower.includes("recurso")) {
      return demoResponses["recursos educativos"];
    } else {
      return demoResponses["default"];
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    {
      icon: BookOpen,
      title: "Ideas para clases",
      prompt:
        "Dame 5 ideas creativas e innovadoras para una clase de matemáticas sobre fracciones para estudiantes de 5to grado. Incluye actividades prácticas y recursos que pueda conseguir fácilmente.",
    },
    {
      icon: Users,
      title: "Manejo de grupo",
      prompt:
        "Tengo estudiantes muy inquietos en mi aula de 3er grado. ¿Qué estrategias de disciplina positiva y técnicas de manejo del aula me recomiendas para mantener su atención y mejorar el ambiente de aprendizaje?",
    },
    {
      icon: Target,
      title: "Evaluaciones",
      prompt:
        "Ayúdame a crear una rúbrica de evaluación completa para un proyecto de ciencias naturales sobre el sistema solar para estudiantes de 4to grado. Incluye criterios claros y niveles de desempeño.",
    },
    {
      icon: Calendar,
      title: "Planificación",
      prompt:
        "Necesito planificar una semana completa de clases temáticas sobre 'Cuidado del medio ambiente' para 2do grado. Incluye objetivos, actividades diarias, recursos y evaluación.",
    },
    {
      icon: Lightbulb,
      title: "Motivación",
      prompt:
        "Tengo varios estudiantes con bajo rendimiento académico y poca motivación en mi clase de lenguaje de 6to grado. ¿Qué estrategias específicas puedo implementar para motivarlos y mejorar su participación?",
    },
    {
      icon: Sparkles,
      title: "Recursos digitales",
      prompt:
        "Recomiéndame herramientas digitales gratuitas y recursos online específicos para enseñar historia de manera interactiva a estudiantes de primaria. Incluye páginas web, aplicaciones y actividades virtuales.",
    },
  ];

  const simulateAIResponse = async (userMessage) => {
    setIsTyping(true);

    try {
      console.log("🤖 [DEMO AI] Procesando mensaje:", userMessage);

      // Simular delay de procesamiento de IA
      await new Promise((resolve) =>
        setTimeout(resolve, 1500 + Math.random() * 1000)
      );

      // Obtener respuesta demo basada en el contenido del mensaje
      const aiResponseContent = getDemoResponse(userMessage);

      // Agregar respuesta a los mensajes
      const newAiMessage = {
        id: Date.now(),
        type: "ai",
        content: aiResponseContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newAiMessage]);

      // Actualizar historial de conversación (para mantener contexto demo)
      setConversationHistory((prev) => [
        ...prev,
        { role: "user", content: userMessage },
        { role: "assistant", content: aiResponseContent },
      ]);

      console.log("✅ [DEMO AI] Respuesta generada exitosamente");
    } catch (error) {
      console.error("❌ [DEMO AI] Error simulado:", error);

      // Mensaje de error demo
      const errorMessage = {
        id: Date.now(),
        type: "ai",
        content: `🤖 **Demo: Simulando error de IA**\n\nEsta sería la respuesta en caso de error:\n\n📋 **En la versión real:**\n• Se conectaría con OpenAI ChatGPT\n• Procesaría consultas complejas\n• Mantendría contexto de conversación\n• Daría respuestas personalizadas\n\n💡 **Ahora en demo:** Respuestas predefinidas pero funcionales\n\n¿Te gustaría probar otra consulta?`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsTyping(false);
  };

  const handleSendMessage = async (messageContent = newMessage) => {
    if (!messageContent.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    // Obtener respuesta de IA
    await simulateAIResponse(messageContent);
  };

  const handleQuickPrompt = async (prompt) => {
    await handleSendMessage(prompt);
  };

  const clearConversation = () => {
    setMessages([
      {
        id: 1,
        type: "ai",
        content:
          "🔄 **Conversación reiniciada**\n\n🌟 ¡Hola de nuevo! Soy tu **Asistente Pedagógico EDA**.\n\n¿En qué nuevo desafío educativo puedo ayudarte hoy?",
        timestamp: new Date(),
      },
    ]);
    setConversationHistory([]);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`flex flex-col ${
        isFullscreen ? "fixed inset-0 z-50 bg-white" : "h-full"
      }`}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-3 md:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base md:text-lg font-semibold text-gray-900 flex items-center space-x-2 truncate">
                <span>Asistente Pedagógico IA</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hidden sm:inline">
                  ChatGPT
                </span>
              </h1>
              <div className="flex items-center space-x-2">
                {apiStatus === "connected" && (
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-xs md:text-sm text-green-600 truncate">
                      En línea • Listo para ayudar
                    </span>
                  </div>
                )}
                {apiStatus === "error" && (
                  <div className="flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3 text-orange-500" />
                    <span className="text-xs md:text-sm text-orange-600">
                      Configuración pendiente
                    </span>
                  </div>
                )}
                {apiStatus === "checking" && (
                  <span className="text-xs md:text-sm text-gray-500">
                    Verificando conexión...
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1 md:space-x-2 ml-2">
            <button
              onClick={toggleFullscreen}
              className="p-1.5 md:p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              title={
                isFullscreen
                  ? "Salir de pantalla completa"
                  : "Pantalla completa"
              }
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={clearConversation}
              className="p-1.5 md:p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              title="Limpiar conversación"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="p-1.5 md:p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 md:hidden">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>{" "}
      {/* Quick Prompts */}
      {false && (
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Consultas Frecuentes:
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {quickPrompts.map((prompt, index) => {
              const IconComponent = prompt.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                  className="flex items-center space-x-2 p-3 text-left bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all duration-200 text-sm"
                >
                  <IconComponent className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 truncate">{prompt.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex space-x-2 md:space-x-3 max-w-[85%] md:max-w-3xl ${
                message.type === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === "user"
                    ? "bg-green-600 text-white"
                    : "bg-gradient-to-r from-green-500 to-blue-600 text-white"
                }`}
              >
                {message.type === "user" ? (
                  <User className="w-3 h-3 md:w-4 md:h-4" />
                ) : (
                  <Bot className="w-3 h-3 md:w-4 md:h-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl p-3 md:p-4 ${
                  message.type === "user"
                    ? "bg-green-600 text-white"
                    : "bg-white border border-gray-200 text-gray-900"
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {/* Render basic markdown formatting */}
                  {message.content.split("\n").map((line, index) => {
                    // Handle bold text **text**
                    if (line.includes("**")) {
                      const parts = line.split(/(\*\*.*?\*\*)/g);
                      return (
                        <div key={index} className={index > 0 ? "mt-2" : ""}>
                          {parts.map((part, partIndex) => {
                            if (part.startsWith("**") && part.endsWith("**")) {
                              return (
                                <strong
                                  key={partIndex}
                                  className="font-semibold"
                                >
                                  {part.slice(2, -2)}
                                </strong>
                              );
                            }
                            return <span key={partIndex}>{part}</span>;
                          })}
                        </div>
                      );
                    }
                    // Handle bullet points
                    if (line.startsWith("•") || line.startsWith("-")) {
                      return (
                        <div key={index} className="ml-2 mt-1">
                          {line}
                        </div>
                      );
                    }
                    // Handle numbered lists
                    if (/^\d+\./.test(line.trim())) {
                      return (
                        <div key={index} className="ml-2 mt-1">
                          {line}
                        </div>
                      );
                    }
                    // Regular lines
                    return (
                      <div key={index} className={index > 0 ? "mt-2" : ""}>
                        {line || "\u00A0"}
                      </div>
                    );
                  })}
                </div>
                <div
                  className={`text-xs mt-2 ${
                    message.type === "user" ? "text-green-100" : "text-gray-400"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex space-x-2 md:space-x-3 max-w-[85%] md:max-w-3xl">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                <Bot className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-3 md:p-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>{" "}
      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-3 md:p-4">
        <div className="flex items-end space-x-2 md:space-x-3">
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Pregúntame sobre pedagogía, clases, estudiantes..."
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 max-h-32 text-sm md:text-base"
                rows="1"
                style={{ minHeight: "44px" }}
              />
            </div>
          </div>

          <button
            onClick={() => handleSendMessage()}
            disabled={!newMessage.trim() || isTyping}
            className={`p-3 rounded-lg transition-colors flex-shrink-0 ${
              newMessage.trim() && !isTyping
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span className="hidden sm:inline">
            Presiona Enter para enviar, Shift+Enter para nueva línea
          </span>
          <span className="sm:hidden">Enter para enviar</span>
          <div className="flex items-center space-x-2">
            {apiStatus === "connected" && (
              <span className="flex items-center space-x-1 text-green-600">
                <CheckCircle className="w-3 h-3" />
                <span className="hidden sm:inline">ChatGPT Conectado</span>
                <span className="sm:hidden">Conectado</span>
              </span>
            )}
            {apiStatus === "error" && (
              <span className="flex items-center space-x-1 text-orange-600">
                <AlertCircle className="w-3 h-3" />
                <span className="hidden sm:inline">API no configurada</span>
                <span className="sm:hidden">Error</span>
              </span>
            )}
            <span className="hidden md:inline">EDA IA v2.1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
