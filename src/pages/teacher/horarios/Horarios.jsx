import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "../../../components/common/Card";
import {
  Loader2,
  Plus,
  Calendar,
  Clock,
  BookOpen,
  Clipboard,
} from "lucide-react";
import { mockData } from "../../../data/mockData";
import ModalAgregarActividad from "./ModalAgregarActividad";

const Horarios = () => {
  // Estados para demo
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cronogramaData, setCronogramaData] = useState(
    mockData.cronograma || []
  );

  // Función para agregar nueva actividad
  const handleAgregarActividad = (nuevaActividad) => {
    const nuevaActividadConId = {
      ...nuevaActividad,
      id: Date.now(), // ID único simple para demo
    };
    setCronogramaData([...cronogramaData, nuevaActividadConId]);
    setMostrarModal(false);
  };

  // Función para asignar colores según el tipo de actividad
  const getColorPorTipo = (tipo) => {
    const colores = {
      clase: "#3B82F6", // Azul
      recreo: "#F59E0B", // Amarillo
      evaluacion: "#EF4444", // Rojo
      actividad_especial: "#EC4899", // Rosa
      capacitacion: "#8B5CF6", // Púrpura
      default: "#6B7280", // Gris
    };

    return colores[tipo?.toLowerCase()] || colores.default;
  };

  // Transformar los datos del cronograma para el calendario
  const transformarCronogramaParaCalendario = (cronograma) => {
    if (!cronograma || !Array.isArray(cronograma)) return [];

    return cronograma.map((actividad, index) => ({
      id: actividad.id || index,
      title: actividad.actividad,
      start: actividad.hora_inicio,
      end: actividad.hora_fin,
      day: actividad.dia_semana,
      type: actividad.tipo,
      description: actividad.description || "",
      backgroundColor: getColorPorTipo(actividad.tipo),
      borderColor: getColorPorTipo(actividad.tipo),
      textColor: "#ffffff",
    }));
  };

  // Datos del cronograma procesados para el calendario
  const eventosCalendario = transformarCronogramaParaCalendario(cronogramaData);

  // Estados de carga simplificados para demo
  const isLoading = false;

  // Slots de tiempo para la grilla
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  // Días de la semana
  const daysOfWeek = [
    { key: "lunes", label: "Lunes" },
    { key: "martes", label: "Martes" },
    { key: "miercoles", label: "Miércoles" },
    { key: "jueves", label: "Jueves" },
    { key: "viernes", label: "Viernes" },
  ];

  // Obtener eventos para un día específico
  const getEventsForDay = (day) => {
    return eventosCalendario.filter((evento) => evento.day === day);
  };

  // Calcular posición de evento en la grilla
  const getEventPosition = (startTime) => {
    const [hour] = startTime.split(":").map(Number);
    return (hour - 8) * 60; // 60px por hora, empezando a las 8:00
  };

  // Calcular altura del evento
  const getEventHeight = (startTime, endTime) => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const totalMinutes = endHour * 60 + endMin - (startHour * 60 + startMin);
    return totalMinutes; // 1px por minuto
  };

  // Obtener icono según tipo de actividad
  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "clase":
        return <BookOpen size={14} />;
      case "recreo":
        return <Clock size={14} />;
      case "evaluacion":
        return <Clipboard size={14} />;
      case "actividad_especial":
        return <Calendar size={14} />;
      default:
        return <BookOpen size={14} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando cronograma...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Cronograma</h1>
          <p className="text-gray-600">
            Gestiona tu horario semanal de actividades
          </p>
        </div>
        <button
          onClick={() => setMostrarModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Nueva Actividad
        </button>
      </div>

      {/* Calendario Semanal */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Cronograma Semanal</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header de días */}
              <div className="grid grid-cols-6 gap-2 mb-4">
                <div className="text-center font-medium text-gray-500 py-2">
                  Hora
                </div>
                {daysOfWeek.map((day) => (
                  <div
                    key={day.key}
                    className="text-center font-medium text-gray-700 py-2 bg-gray-50 rounded"
                  >
                    {day.label}
                  </div>
                ))}
              </div>

              {/* Grilla de horarios */}
              <div className="relative">
                {timeSlots.map((time, index) => (
                  <div
                    key={time}
                    className="grid grid-cols-6 gap-2 border-b border-gray-200"
                  >
                    {/* Columna de hora */}
                    <div className="text-center text-sm text-gray-500 py-4 font-medium">
                      {time}
                    </div>

                    {/* Columnas de días */}
                    {daysOfWeek.map((day) => {
                      const eventos = getEventsForDay(day.key);
                      const eventosEnHora = eventos.filter((evento) => {
                        const [eventoHora] = evento.start
                          .split(":")
                          .map(Number);
                        const [horaActual] = time.split(":").map(Number);
                        return eventoHora === horaActual;
                      });

                      return (
                        <div
                          key={day.key}
                          className="relative min-h-[60px] border border-gray-100 bg-white p-1"
                        >
                          {eventosEnHora.map((evento) => (
                            <div
                              key={evento.id}
                              className="absolute inset-x-1 rounded text-white text-xs p-2 shadow-sm"
                              style={{
                                backgroundColor: evento.backgroundColor,
                                height: `${Math.max(
                                  50,
                                  getEventHeight(evento.start, evento.end) / 2
                                )}px`,
                                top: "2px",
                              }}
                            >
                              <div className="flex items-center gap-1 mb-1">
                                {getTypeIcon(evento.type)}
                                <span className="font-medium truncate">
                                  {evento.title}
                                </span>
                              </div>
                              <div className="text-xs opacity-90">
                                {evento.start} - {evento.end}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Actividades */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Actividades Programadas</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cronogramaData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No hay actividades programadas</p>
                <p className="text-sm">
                  Haz clic en "Nueva Actividad" para agregar una
                </p>
              </div>
            ) : (
              cronogramaData.map((actividad, index) => (
                <div
                  key={actividad.id || index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-4 h-4 rounded"
                      style={{
                        backgroundColor: getColorPorTipo(actividad.tipo),
                      }}
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {actividad.actividad}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {actividad.dia_semana} • {actividad.hora_inicio} -{" "}
                        {actividad.hora_fin}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      {actividad.tipo}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal para agregar actividad */}
      {mostrarModal && (
        <ModalAgregarActividad
          onClose={() => setMostrarModal(false)}
          onSubmit={handleAgregarActividad}
        />
      )}
    </div>
  );
};

export default Horarios;
