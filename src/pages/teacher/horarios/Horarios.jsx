import React, { useState, useEffect } from "react";
import { Calendar, Plus, CalendarDays, School } from "lucide-react";
import CalendarioHorarios from "./components/CalendarioHorarios";
import ModalDetalleEvento from "./modales/ModalDetalleEvento";
import ModalAgregarActividad from "./modales/ModalAgregarActividad";
import { toast } from "sonner";

const Horarios = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedView, setSelectedView] = useState("week"); // week por defecto para horarios
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Estado para almacenar actividades (modo demo) - ACTIVIDADES FICTICIAS
  const [actividades, setActividades] = useState([
    // Lunes 14 oct
    {
      id: 1,
      title: "Matemática - 3ro A",
      start: new Date(2025, 9, 14, 8, 0),
      end: new Date(2025, 9, 14, 9, 30),
      resource: {
        tipo: "clase",
        descripcion: "Números decimales y fracciones",
        aula: "3ro A",
        materia: "Matemática",
      },
    },
    {
      id: 2,
      title: "Comunicación - 3ro A",
      start: new Date(2025, 9, 14, 10, 0),
      end: new Date(2025, 9, 14, 11, 30),
      resource: {
        tipo: "clase",
        descripcion: "Análisis de textos narrativos",
        aula: "3ro A",
        materia: "Comunicación",
      },
    },
    {
      id: 3,
      title: "Recreo",
      start: new Date(2025, 9, 14, 11, 30),
      end: new Date(2025, 9, 14, 12, 0),
      resource: { tipo: "recreo", descripcion: "Descanso y alimentación" },
    },
    {
      id: 4,
      title: "Ciencia y Tecnología - 3ro A",
      start: new Date(2025, 9, 14, 12, 0),
      end: new Date(2025, 9, 14, 13, 30),
      resource: {
        tipo: "clase",
        descripcion: "El sistema solar",
        aula: "3ro A",
        materia: "Ciencia",
      },
    },
    // Martes 15
    {
      id: 5,
      title: "Arte - 3ro A",
      start: new Date(2025, 9, 15, 8, 0),
      end: new Date(2025, 9, 15, 9, 30),
      resource: {
        tipo: "clase",
        descripcion: "Técnicas de pintura",
        aula: "3ro A",
        materia: "Arte",
      },
    },
    {
      id: 6,
      title: "Educación Física - 3ro A",
      start: new Date(2025, 9, 15, 10, 0),
      end: new Date(2025, 9, 15, 11, 30),
      resource: {
        tipo: "clase",
        descripcion: "Juegos recreativos",
        aula: "Cancha",
        materia: "Educación Física",
      },
    },
    {
      id: 7,
      title: "Recreo",
      start: new Date(2025, 9, 15, 11, 30),
      end: new Date(2025, 9, 15, 12, 0),
      resource: { tipo: "recreo", descripcion: "Descanso y alimentación" },
    },
    {
      id: 8,
      title: "Matemática - 3ro A",
      start: new Date(2025, 9, 15, 12, 0),
      end: new Date(2025, 9, 15, 13, 30),
      resource: {
        tipo: "clase",
        descripcion: "Resolución de problemas",
        aula: "3ro A",
        materia: "Matemática",
      },
    },
    // Miércoles 16
    {
      id: 9,
      title: "Comunicación - 3ro A",
      start: new Date(2025, 9, 16, 8, 0),
      end: new Date(2025, 9, 16, 9, 30),
      resource: {
        tipo: "clase",
        descripcion: "Producción de textos",
        aula: "3ro A",
        materia: "Comunicación",
      },
    },
    {
      id: 10,
      title: "Personal Social - 3ro A",
      start: new Date(2025, 9, 16, 10, 0),
      end: new Date(2025, 9, 16, 11, 30),
      resource: {
        tipo: "clase",
        descripcion: "Historia del Perú",
        aula: "3ro A",
        materia: "Personal Social",
      },
    },
    {
      id: 11,
      title: "Recreo",
      start: new Date(2025, 9, 16, 11, 30),
      end: new Date(2025, 9, 16, 12, 0),
      resource: { tipo: "recreo", descripcion: "Descanso y alimentación" },
    },
    {
      id: 12,
      title: "Inglés - 3ro A",
      start: new Date(2025, 9, 16, 12, 0),
      end: new Date(2025, 9, 16, 13, 30),
      resource: {
        tipo: "clase",
        descripcion: "Vocabulario y conversación",
        aula: "3ro A",
        materia: "Inglés",
      },
    },
    {
      id: 13,
      title: "Reunión de Coordinación",
      start: new Date(2025, 9, 16, 14, 0),
      end: new Date(2025, 9, 16, 15, 0),
      resource: {
        tipo: "reunion",
        descripcion: "Reunión con coordinadores académicos",
        aula: "Sala de Reuniones",
      },
    },
    // Jueves 17
    {
      id: 14,
      title: "Matemática - 3ro A",
      start: new Date(2025, 9, 17, 8, 0),
      end: new Date(2025, 9, 17, 9, 30),
      resource: {
        tipo: "clase",
        descripcion: "Geometría básica",
        aula: "3ro A",
        materia: "Matemática",
      },
    },
    {
      id: 15,
      title: "Ciencia y Tecnología - 3ro A",
      start: new Date(2025, 9, 17, 10, 0),
      end: new Date(2025, 9, 17, 11, 30),
      resource: {
        tipo: "clase",
        descripcion: "Experimentos científicos",
        aula: "Laboratorio",
        materia: "Ciencia",
      },
    },
    {
      id: 16,
      title: "Recreo",
      start: new Date(2025, 9, 17, 11, 30),
      end: new Date(2025, 9, 17, 12, 0),
      resource: { tipo: "recreo", descripcion: "Descanso y alimentación" },
    },
    {
      id: 17,
      title: "Evaluación - Matemática",
      start: new Date(2025, 9, 17, 12, 0),
      end: new Date(2025, 9, 17, 13, 30),
      resource: {
        tipo: "evaluacion",
        descripcion: "Examen bimestral de matemática",
        aula: "3ro A",
        materia: "Matemática",
      },
    },
    // Viernes 18
    {
      id: 18,
      title: "Comunicación - 3ro A",
      start: new Date(2025, 9, 18, 8, 0),
      end: new Date(2025, 9, 18, 9, 30),
      resource: {
        tipo: "clase",
        descripcion: "Comprensión lectora",
        aula: "3ro A",
        materia: "Comunicación",
      },
    },
    {
      id: 19,
      title: "Arte - 3ro A",
      start: new Date(2025, 9, 18, 10, 0),
      end: new Date(2025, 9, 18, 11, 30),
      resource: {
        tipo: "clase",
        descripcion: "Proyecto de escultura",
        aula: "Taller de Arte",
        materia: "Arte",
      },
    },
    {
      id: 20,
      title: "Recreo",
      start: new Date(2025, 9, 18, 11, 30),
      end: new Date(2025, 9, 18, 12, 0),
      resource: { tipo: "recreo", descripcion: "Descanso y alimentación" },
    },
    {
      id: 21,
      title: "Actividad Especial - Día de la Familia",
      start: new Date(2025, 9, 18, 12, 0),
      end: new Date(2025, 9, 18, 14, 0),
      resource: {
        tipo: "actividad_especial",
        descripcion: "Celebración del Día de la Familia con padres",
        aula: "Patio Principal",
      },
    },
  ]);

  // Hook para detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSelectedView("day");
      } else {
        setSelectedView("week");
      }
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Limpiar estado del modal cuando se cierra
  useEffect(() => {
    if (!isDetailModalOpen) {
      setSelectedEvent(null);
    }
  }, [isDetailModalOpen]);

  // Handlers para el calendario
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleSelectSlot = (slotInfo) => {
    setIsAddModalOpen(true);
  };

  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  const handleNavigate = (date) => {
    setCurrentWeek(date);
  };

  // Handler para cerrar el modal
  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedEvent(null);
  };

  // Handler para abrir modal de agregar
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Handler para cerrar modal de agregar
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Handler para guardar nueva actividad
  const handleSaveActivity = (activityData) => {
    try {
      const nuevaActividad = {
        id: Date.now(),
        title: activityData.titulo || activityData.nombre_actividad,
        start: new Date(activityData.fecha_inicio),
        end: new Date(activityData.fecha_fin),
        resource: {
          tipo: activityData.tipo || "clase",
          descripcion: activityData.descripcion || "",
          aula: activityData.aula || "",
          materia: activityData.materia || "",
        },
      };
      setActividades([...actividades, nuevaActividad]);
      toast.success("Actividad creada exitosamente");
      handleCloseAddModal();
    } catch (error) {
      toast.error("Error al crear la actividad");
    }
  };

  // Función para asignar colores según el tipo de actividad
  const getColorPorTipo = (tipo) => {
    const colores = {
      clase: "#3B82F6",
      reunion: "#F59E0B",
      evaluacion: "#EF4444",
      actividad_especial: "#EC4899",
      capacitacion: "#8B5CF6",
      recreo: "#6B7280",
      default: "#6B7280",
    };
    return colores[tipo?.toLowerCase()] || colores.default;
  };

  // Procesar eventos con colores
  const eventosConEstilo = actividades.map((evento) => ({
    ...evento,
    backgroundColor: getColorPorTipo(evento.resource?.tipo),
    borderColor: getColorPorTipo(evento.resource?.tipo),
  }));

  return (
    <div className={`${isMobile ? "h-screen flex flex-col" : "space-y-6"}`}>
      {/* Header */}
      <div
        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 ${
          isMobile ? "px-4 py-3 bg-white border-b flex-shrink-0" : ""
        }`}
      >
        <div className="flex items-center space-x-3">
          <CalendarDays className="w-6 h-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mi Horario</h1>
            <p className="text-sm text-gray-600">
              Gestiona tu cronograma semanal de clases
            </p>
          </div>
        </div>

        {/* Botón para agregar actividad */}
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Actividad
        </button>
      </div>

      {/* Información del docente */}
      <div
        className={`${
          isMobile
            ? "px-4 pb-3 bg-white border-b flex-shrink-0"
            : "bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        }`}
      ></div>

      {/* Vista de Calendario */}
      <div className={`${isMobile ? "flex-1 overflow-hidden" : ""}`}>
        <CalendarioHorarios
          events={eventosConEstilo}
          isLoading={false}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          view={selectedView}
          onView={handleViewChange}
          date={currentWeek}
          onNavigate={handleNavigate}
          isMobile={isMobile}
          readOnly={false}
        />
      </div>

      {/* Modal para mostrar detalles del evento */}
      <ModalDetalleEvento
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        evento={selectedEvent}
      />

      {/* Modal para agregar nueva actividad */}
      <ModalAgregarActividad
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveActivity}
      />
    </div>
  );
};

export default Horarios;
