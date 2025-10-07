import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../../store";
import { Bell, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const Notificaciones = () => {
  const { user } = useAuthStore();

  // Demo: Notificaciones ficticias
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      titulo: "Nueva tarea creada",
      mensaje:
        'Se ha creado una nueva tarea para el aula Amarilla: "Matemáticas - Fracciones"',
      tipo: "tarea",
      leido: false,
      fechaCreacion: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      entidadRelacionada: "Aula Amarilla",
    },
    {
      id: "2",
      titulo: "Asistencia pendiente",
      mensaje: "Recuerda marcar la asistencia de hoy para el aula Verde",
      tipo: "asistencia",
      leido: false,
      fechaCreacion: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
      entidadRelacionada: "Aula Verde",
    },
    {
      id: "3",
      titulo: "Evaluación completada",
      mensaje:
        "Todos los estudiantes del aula Azul han completado la evaluación de lenguaje",
      tipo: "evaluacion",
      leido: true,
      fechaCreacion: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 día atrás
      entidadRelacionada: "Aula Azul",
    },
    {
      id: "4",
      titulo: "Reunión de padres",
      mensaje:
        "Se ha programado una reunión con los padres de familia para el próximo viernes",
      tipo: "reunion",
      leido: true,
      fechaCreacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
      entidadRelacionada: "Padres de familia",
    },
    {
      id: "5",
      titulo: "Material didáctico disponible",
      mensaje:
        "Nuevos recursos educativos disponibles en la biblioteca digital",
      tipo: "recursos",
      leido: false,
      fechaCreacion: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
      entidadRelacionada: "Biblioteca Digital",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // Demo: Simular marcado como leído
  const markAsRead = async (notificationId) => {
    setIsLoading(true);

    try {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Actualizar estado local
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, leido: true } : notif
        )
      );

      toast.success("Notificación marcada como leída (demo)");
      console.log("📬 [DEMO] Notificación marcada como leída:", notificationId);
    } catch (error) {
      console.error("❌ [DEMO] Error simulado:", error);
      toast.error("Error al marcar la notificación como leída");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = (notificationId) => {
    if (!notificationId) {
      toast.error("ID de notificación no válido");
      return;
    }
    markAsRead(notificationId);
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Notificaciones
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Gestiona todas tus notificaciones del sistema
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sm:p-8 text-center">
          <Bell className="w-12 sm:w-16 h-12 sm:h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            Sin notificaciones
          </h3>
          <p className="text-gray-500 text-sm sm:text-base">
            No tienes notificaciones pendientes por revisar.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 ${
                notification.leido ? "opacity-60" : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0">
                    <Bell className="w-6 h-6 text-green-500 mt-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 gap-1 sm:gap-2 mb-2">
                      <h3 className="text-sm font-medium text-gray-900">
                        {notification.titulo || "Notificación"}
                      </h3>
                      {notification.fecha && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          <span className="hidden sm:inline">
                            {new Date(notification.fecha).toLocaleDateString(
                              "es-ES",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                          <span className="sm:hidden">
                            {new Date(notification.fecha).toLocaleDateString(
                              "es-ES",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      {notification.descripcion ||
                        notification.mensaje ||
                        "Sin descripción disponible"}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 sm:ml-4 w-full sm:w-auto">
                  {notification.leido ? (
                    <div className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 text-sm font-medium rounded-md w-full sm:w-auto justify-center">
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Leído
                    </div>
                  ) : (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={isLoading}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-1.5"></div>
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-1.5" />
                      )}
                      {isLoading ? "Marcando..." : "Marcar como leído"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {notifications.length > 0 && (
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Mostrando {notifications.length} notificación
            {notifications.length !== 1 ? "es" : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default Notificaciones;
