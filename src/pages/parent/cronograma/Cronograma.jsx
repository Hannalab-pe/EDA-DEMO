import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Eye,
  CalendarDays,
  RefreshCw,
  AlertCircle,
  User,
} from "lucide-react";
import CalendarioHorarios from "../../teacher/horarios/components/CalendarioHorarios";
import { toast } from "sonner";

const Cronograma = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedView, setSelectedView] = useState("month"); // month por defecto en desktop
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cronograma, setCronograma] = useState([]);

  // Datos ficticios del estudiante y aula
  const aulaInfo = {
    grado: "4to Grado",
    seccion: "A",
    cantidadEstudiantes: 25,
  };

  // Generar cronograma ficticio
  const generarCronogramaFicticio = () => {
    const hoy = new Date();
    const actividades = [];

    // Actividades de la semana
    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
    const materias = [
      { nombre: "Matemáticas", profesor: "Ana Martínez", tipo: "clase" },
      { nombre: "Comunicación", profesor: "Carlos Rodríguez", tipo: "clase" },
      {
        nombre: "Ciencias Naturales",
        profesor: "Luis Fernández",
        tipo: "clase",
      },
      { nombre: "Personal Social", profesor: "Patricia Torres", tipo: "clase" },
      {
        nombre: "Educación Física",
        profesor: "Roberto Sánchez",
        tipo: "clase",
      },
      { nombre: "Arte", profesor: "María González", tipo: "clase" },
      { nombre: "Inglés", profesor: "Jorge Ramírez", tipo: "clase" },
    ];

    // Generar horario semanal
    for (let dia = 0; dia < 5; dia++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() - hoy.getDay() + dia + 1); // Lunes a Viernes

      // 4-5 clases por día
      const clasesDelDia = Math.floor(Math.random() * 2) + 4; // 4 o 5 clases

      for (let clase = 0; clase < clasesDelDia; clase++) {
        const materia = materias[Math.floor(Math.random() * materias.length)];
        const horaInicio = 8 + clase; // Comienza a las 8 AM

        const fechaInicio = new Date(fecha);
        fechaInicio.setHours(horaInicio, 0, 0, 0);

        const fechaFin = new Date(fecha);
        fechaFin.setHours(horaInicio + 1, 0, 0, 0);

        actividades.push({
          id_cronograma: `actividad-${dia}-${clase}`,
          nombre_actividad: materia.nombre,
          descripcion: `Clase de ${materia.nombre} con el profesor ${materia.profesor}`,
          tipo: materia.tipo,
          fecha_inicio: fechaInicio.toISOString(),
          fecha_fin: fechaFin.toISOString(),
          seccion: "A",
          grado: "4to Grado",
          nombre_trabajador: materia.profesor.split(" ")[0],
          apellido_trabajador: materia.profesor.split(" ")[1],
          estado: "activo",
        });
      }
    }

    // Agregar algunas actividades especiales
    // Reunión de padres (próxima semana)
    const fechaReunion = new Date(hoy);
    fechaReunion.setDate(hoy.getDate() + 7);
    fechaReunion.setHours(18, 0, 0, 0);
    const fechaReunionFin = new Date(fechaReunion);
    fechaReunionFin.setHours(20, 0, 0, 0);

    actividades.push({
      id_cronograma: "reunion-padres",
      nombre_actividad: "Reunión de Padres de Familia",
      descripcion:
        "Reunión informativa sobre el progreso académico del segundo bimestre",
      tipo: "reunion",
      fecha_inicio: fechaReunion.toISOString(),
      fecha_fin: fechaReunionFin.toISOString(),
      seccion: "A",
      grado: "4to Grado",
      nombre_trabajador: "María",
      apellido_trabajador: "González",
      estado: "activo",
    });

    // Evaluación (esta semana)
    const fechaEvaluacion = new Date(hoy);
    fechaEvaluacion.setDate(hoy.getDate() - hoy.getDay() + 4); // Jueves
    fechaEvaluacion.setHours(10, 0, 0, 0);
    const fechaEvaluacionFin = new Date(fechaEvaluacion);
    fechaEvaluacionFin.setHours(12, 0, 0, 0);

    actividades.push({
      id_cronograma: "evaluacion-mate",
      nombre_actividad: "Evaluación de Matemáticas",
      descripcion:
        "Examen del segundo bimestre - Temas: Multiplicación y División",
      tipo: "evaluacion",
      fecha_inicio: fechaEvaluacion.toISOString(),
      fecha_fin: fechaEvaluacionFin.toISOString(),
      seccion: "A",
      grado: "4to Grado",
      nombre_trabajador: "Ana",
      apellido_trabajador: "Martínez",
      estado: "activo",
    });

    // Actividad deportiva (próximo viernes)
    const fechaDeporte = new Date(hoy);
    fechaDeporte.setDate(hoy.getDate() - hoy.getDay() + 12); // Viernes próximo
    fechaDeporte.setHours(14, 0, 0, 0);
    const fechaDeporteFin = new Date(fechaDeporte);
    fechaDeporteFin.setHours(16, 0, 0, 0);

    actividades.push({
      id_cronograma: "deporte-inter",
      nombre_actividad: "Campeonato Interaulas",
      descripcion:
        "Competencia deportiva de fútbol entre las secciones del 4to grado",
      tipo: "actividad",
      fecha_inicio: fechaDeporte.toISOString(),
      fecha_fin: fechaDeporteFin.toISOString(),
      seccion: "A",
      grado: "4to Grado",
      nombre_trabajador: "Roberto",
      apellido_trabajador: "Sánchez",
      estado: "activo",
    });

    return actividades;
  };

  // Cargar cronograma al montar
  useEffect(() => {
    const cargarCronograma = async () => {
      setIsLoading(true);
      console.log("🔍 [DEMO] Cargando cronograma ficticio...");

      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const cronogramaFicticio = generarCronogramaFicticio();
      setCronograma(cronogramaFicticio);

      console.log(
        "✅ [DEMO] Cronograma cargado:",
        cronogramaFicticio.length,
        "actividades"
      );

      setIsLoading(false);
      toast.success(`${cronogramaFicticio.length} actividades cargadas`);
    };

    cargarCronograma();
  }, []);

  // Hook para detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // En móvil, cambiar a vista de día para mejor experiencia
      if (mobile) {
        setSelectedView("day");
      } else {
        // En desktop, mantener vista de mes como predeterminada
        if (selectedView === "day" && !mobile) {
          setSelectedView("month");
        }
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, [selectedView]);

  // Handlers para el calendario
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    console.log("Evento seleccionado:", event);
  };

  const handleSelectSlot = (slotInfo) => {
    console.log("Slot seleccionado:", slotInfo);
    // Los padres no pueden crear nuevas actividades
  };

  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  const handleNavigate = (date) => {
    setCurrentWeek(date);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    console.log("🔄 [DEMO] Actualizando cronograma...");

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800));

    const cronogramaFicticio = generarCronogramaFicticio();
    setCronograma(cronogramaFicticio);

    console.log("✅ [DEMO] Cronograma actualizado");

    setIsLoading(false);
    toast.success("Cronograma actualizado");
  };

  // Función para transformar datos del cronograma al formato del calendario
  const transformarCronogramaParaCalendario = (cronogramaDatos) => {
    if (!Array.isArray(cronogramaDatos)) {
      console.log("⚠️ cronogramaDatos no es un array:", cronogramaDatos);
      return [];
    }

    console.log("🔄 Transformando cronograma:", cronogramaDatos);

    return cronogramaDatos.map((actividad, index) => {
      console.log("📝 Procesando actividad:", actividad);

      // Los datos del backend usan nombres con guiones bajos
      let fechaInicio = new Date(actividad.fecha_inicio);
      let fechaFin = new Date(actividad.fecha_fin);

      // Si las fechas son iguales o la fecha fin es inválida, agregar duración de 2 horas
      if (
        fechaInicio.getTime() === fechaFin.getTime() ||
        isNaN(fechaFin.getTime())
      ) {
        fechaFin = new Date(fechaInicio.getTime() + 2 * 60 * 60 * 1000); // +2 horas
      }

      // Si las fechas no tienen hora específica (son medianoche), agregar horas por defecto
      if (fechaInicio.getHours() === 0 && fechaInicio.getMinutes() === 0) {
        fechaInicio.setHours(9, 0); // 9:00 AM por defecto
        fechaFin.setHours(11, 0); // 11:00 AM por defecto
      }

      const eventoTransformado = {
        id: actividad.id_cronograma || `actividad-${index}`,
        title: actividad.nombre_actividad || "Actividad sin nombre",
        start: fechaInicio,
        end: fechaFin,
        resource: {
          tipo: actividad.tipo || "actividad",
          descripcion: actividad.descripcion || "",
          idCronograma: actividad.id_cronograma,
          seccion: actividad.seccion,
          grado: actividad.grado,
          nombreTrabajador: actividad.nombre_trabajador,
          apellidoTrabajador: actividad.apellido_trabajador,
          estado: actividad.estado || "activo",
        },
        // Colores según tipo de actividad
        backgroundColor: getColorPorTipo(actividad.tipo || "actividad"),
        borderColor: getColorPorTipo(actividad.tipo || "actividad"),
      };

      console.log("✅ Evento transformado:", eventoTransformado);
      return eventoTransformado;
    });
  };

  // Función para asignar colores según el tipo de actividad
  const getColorPorTipo = (tipo) => {
    const colores = {
      clase: "#3B82F6", // Azul
      reunion: "#F59E0B", // Amarillo
      evaluacion: "#EF4444", // Rojo
      actividad: "#10B981", // Verde
      capacitacion: "#8B5CF6", // Púrpura
      default: "#6B7280", // Gris
    };

    return colores[tipo?.toLowerCase()] || colores.default;
  };

  // Datos del cronograma procesados para el calendario
  const eventosCalendario = transformarCronogramaParaCalendario(cronograma);

  console.log("🎯 FINAL - Datos para el calendario:", {
    cronogramaDatos: cronograma,
    eventosTransformados: eventosCalendario,
    cantidadEventos: eventosCalendario.length,
  });

  return (
    <div
      className={`${isMobile ? "h-screen flex flex-col" : "space-y-6"} ${
        isMobile ? "" : ""
      }`}
    >
      {/* Header */}
      <div
        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 ${
          isMobile ? "px-4 py-3 bg-white border-b flex-shrink-0" : ""
        }`}
      >
        {/* Información del estudiante y aula */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Cronograma
              </h1>
              {aulaInfo?.grado && aulaInfo?.seccion && (
                <p className="text-sm text-gray-600">
                  {aulaInfo.grado} - Sección {aulaInfo.seccion}
                  {aulaInfo.cantidadEstudiantes &&
                    ` • ${aulaInfo.cantidadEstudiantes} estudiantes`}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className={`flex items-center space-x-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 ${
              isMobile ? "px-3 py-2 text-sm" : "px-4 py-2"
            }`}
          >
            <RefreshCw
              className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} ${
                isLoading ? "animate-spin" : ""
              }`}
            />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Información del estudiante en card */}

      {/* Estados de carga y error */}
      {isLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Cargando cronograma...
            </h3>
            <p className="text-gray-600">
              Obteniendo actividades programadas...
            </p>
          </div>
        </div>
      )}

      {/* Vista de Calendario */}
      {!isLoading && (
        <div className={`${isMobile ? "flex-1 overflow-hidden" : ""}`}>
          <CalendarioHorarios
            events={eventosCalendario}
            isLoading={isLoading}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            view={selectedView}
            onView={handleViewChange}
            date={currentWeek}
            onNavigate={handleNavigate}
            isMobile={isMobile}
            readOnly={true} // Los padres solo pueden ver, no editar
          />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && eventosCalendario.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="text-center">
            <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay actividades programadas
            </h3>
            <p className="text-gray-600">
              No se encontraron actividades en el cronograma del aula de tu
              hijo.
            </p>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {!isLoading && eventosCalendario.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
      )}
    </div>
  );
};

export default Cronograma;
