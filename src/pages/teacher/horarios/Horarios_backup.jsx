import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2,
  MapPin,
  Users,
  BookOpen,
  Bell,
  Filter,
  Download,
  Share2,
  MoreVertical,
  Eye,
  CalendarDays
} from 'lucide-react';
import moment from 'moment';
import 'moment/locale/es';
import CalendarioHorarios from './components/CalendarioHorarios';
import ModalAgregarActividad from './modales/ModalAgregarActividad';
import { mockData } from '../../../data/mockData';
import { toast } from 'sonner';

// Configurar moment en español
moment.locale('es');

const Horarios = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedView, setSelectedView] = useState('month'); // month por defecto en desktop
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(true); // Para alternar entre vista calendario y tabla
  const [selectedEvent, setSelectedEvent] = useState(null); // Evento seleccionado
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal de nueva actividad
  const [isMobile, setIsMobile] = useState(false);
  const [cronogramaData, setCronogramaData] = useState(mockData.cronograma);
  const [aulasTrabajador, setAulasTrabajador] = useState(mockData.aulas);

  // Simular carga inicial
  useEffect(() => {
    console.log('📅 Cronograma demo cargado:', cronogramaData);
    console.log('🏫 Aulas demo:', aulasTrabajador);
  }, []);

  // Función para agregar nueva actividad
  const handleAgregarActividad = (nuevaActividad) => {
    const actividadCompleta = {
      ...nuevaActividad,
      id: Date.now().toString(),
      estado: 'PROGRAMADO',
      color: '#3B82F6'
    };
    
    setCronogramaData(prev => [...prev, actividadCompleta]);
    toast.success('Actividad agregada correctamente (Demo)');
    setIsModalOpen(false);
  };

  // Función para eliminar actividad
  const handleEliminarActividad = (actividadId) => {
    setCronogramaData(prev => prev.filter(act => act.id !== actividadId));
    toast.success('Actividad eliminada correctamente (Demo)');
  };

  // Hook para detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // En móvil, cambiar a vista de día para mejor experiencia
      if (mobile) {
        setSelectedView('day');
      } else {
        // En desktop, mantener vista de mes como predeterminada
        if (selectedView === 'day' && !mobile) {
          setSelectedView('month');
        }
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [selectedView]);

  // Handlers para el calendario
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    console.log('Evento seleccionado:', event);
  };

  const handleSelectSlot = (slotInfo) => {
    console.log('Slot seleccionado:', slotInfo);
    // Aquí puedes abrir un modal para crear nueva clase
  };

  const handleEventCreated = (newEvent) => {
    console.log('Nueva actividad creada (DEMO):', newEvent);
    handleAgregarActividad(newEvent);
  };

  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  const handleNavigate = (date) => {
    setCurrentWeek(date);
  };

  // Función para transformar datos del cronograma demo al formato del calendario
  const transformarCronogramaParaCalendario = (cronogramaDatos) => {
    if (!Array.isArray(cronogramaDatos)) {
      return [];
    }

    return cronogramaDatos.map((actividad, index) => {
      // Crear fechas para el demo usando fecha y horas
      const fechaActividad = moment(actividad.fecha).toDate();
      const [horaInicio, minutoInicio] = actividad.horaInicio.split(':').map(Number);
      const [horaFin, minutoFin] = actividad.horaFin.split(':').map(Number);
      
      const fechaInicio = new Date(fechaActividad);
      fechaInicio.setHours(horaInicio, minutoInicio, 0, 0);
      
      const fechaFin = new Date(fechaActividad);
      fechaFin.setHours(horaFin, minutoFin, 0, 0);
      
      return {
        id: actividad.id,
        title: actividad.titulo,
        start: fechaInicio,
        end: fechaFin,
        resource: {
          tipo: actividad.tipo?.toLowerCase(),
          descripcion: actividad.descripcion,
          idCronograma: actividad.id,
          materia: actividad.materia,
          aulaId: actividad.aulaId,
          docenteId: actividad.docenteId,
          recursos: actividad.recursos,
          estado: actividad.estado
        },
        backgroundColor: actividad.color || getColorPorTipo(actividad.tipo?.toLowerCase()),
        borderColor: actividad.color || getColorPorTipo(actividad.tipo?.toLowerCase()),
      };
    });
  };
      }
      
      return {
        id: actividad.id_cronograma || index,
        title: actividad.nombre_actividad || actividad.title || 'Actividad sin nombre',
        start: fechaInicio,
        end: fechaFin,
        resource: {
          tipo: actividad.tipo || 'actividad',
          descripcion: actividad.descripcion || '',
          idCronograma: actividad.id_cronograma,
          seccion: actividad.seccion,
          grado: actividad.grado,
          nombreTrabajador: actividad.nombre_trabajador,
          apellidoTrabajador: actividad.apellido_trabajador,
          estado: actividad.estado || 'activo'
        },
        // Colores según tipo de actividad
        backgroundColor: getColorPorTipo(actividad.tipo || 'actividad'),
        borderColor: getColorPorTipo(actividad.tipo || 'actividad'),
  // Función para asignar colores según el tipo de actividad
  const getColorPorTipo = (tipo) => {
    const colores = {
      clase: '#3B82F6',      // Azul
      recreo: '#F59E0B',     // Amarillo
      evaluacion: '#EF4444', // Rojo
      actividad_especial: '#EC4899', // Rosa
      capacitacion: '#8B5CF6', // Púrpura
      default: '#6B7280'     // Gris
    };
    
    return colores[tipo?.toLowerCase()] || colores.default;
  };

  // Datos del cronograma procesados para el calendario
  const eventosCalendario = transformarCronogramaParaCalendario(cronogramaData);

  // Estados de carga simplificados para demo
  const isLoading = false;

  // Datos fake del cronograma (mantener como fallback)
  const HorariosDataFallback = [
    {
      id: 1,
      title: "Matemáticas - 5to A",
      subject: "Matemáticas",
      grade: "5to A",
      startTime: "08:00",
      endTime: "09:30",
      day: "monday",
      classroom: "Aula 201",
      students: 25,
      color: "#3B82F6",
      type: "class"
    },
    {
      id: 2,
      title: "Ciencias Naturales - 5to A",
      subject: "Ciencias",
      grade: "5to A",
      startTime: "09:45",
      endTime: "11:15",
      day: "monday",
      classroom: "Lab. Ciencias",
      students: 25,
      color: "#10B981",
      type: "class"
    },
    {
      id: 3,
      title: "Reunión de Padres",
      subject: "Reunión",
      startTime: "14:00",
      endTime: "16:00",
      day: "monday",
      classroom: "Aula 201",
      participants: "Padres 5to A",
      color: "#F59E0B",
      type: "meeting"
    }
  ];

  const timeSlots = [
    "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
  ];

  const daysOfWeek = [
    { key: 'monday', label: 'Lunes', short: 'L' },
    { key: 'tuesday', label: 'Martes', short: 'M' },
    { key: 'wednesday', label: 'Miércoles', short: 'X' },
    { key: 'thursday', label: 'Jueves', short: 'J' },
    { key: 'friday', label: 'Viernes', short: 'V' }
  ];

  const getEventsForDay = (day) => {
    return HorariosData.filter(event => event.day === day);
  };

  const getEventPosition = (startTime) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const startMinutes = 7 * 60; // 7:00 AM
    return ((totalMinutes - startMinutes) / 30) * 60; // 60px por cada 30 minutos
  };

  const getEventHeight = (startTime, endTime) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const startTotal = startHours * 60 + startMinutes;
    const endTotal = endHours * 60 + endMinutes;
    const duration = endTotal - startTotal;
    return (duration / 30) * 60; // 60px por cada 30 minutos
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'class':
        return BookOpen;
      case 'meeting':
        return Users;
      case 'training':
        return BookOpen;
      case 'exam':
        return Edit;
      default:
        return Clock;
    }
  };

  const formatWeekRange = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Lunes
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 4); // Viernes
    
    return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} de ${endOfWeek.toLocaleDateString('es-ES', { month: 'long' })} ${endOfWeek.getFullYear()}`;
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction * 7));
    setCurrentWeek(newWeek);
  };

  return (
    <div className={`${isMobile ? 'h-screen flex flex-col' : 'space-y-6'} ${isMobile ? '' : ''}`}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 ${isMobile ? 'px-4 py-3 bg-white border-b flex-shrink-0' : ''}`}>
        
        
        <div className="flex items-center space-x-3">

          <button 
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center space-x-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${
              isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'
            }`}
          >
            <Plus className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
            <span>Nueva Actividad</span>
          </button>
        </div>
      </div>


      {/* Vista de Calendario */}
      <div className={`${isMobile ? 'flex-1 overflow-hidden' : ''}`}>
        {showCalendar ? (
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
            onEventCreated={handleEventCreated}
          />
        ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-6 border-b border-gray-200">
            {/* Time column header */}
            <div className="p-4 bg-gray-50 border-r border-gray-200">
              <div className="text-sm font-medium text-gray-700">Hora</div>
            </div>
            
            {/* Day headers */}
            {daysOfWeek.map((day) => (
              <div key={day.key} className="p-4 bg-gray-50 text-center border-r border-gray-200 last:border-r-0">
                <div className="text-sm font-medium text-gray-900">{day.label}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date().toLocaleDateString('es-ES', { day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="grid grid-cols-6 min-h-[600px]">
              {/* Time slots */}
              <div className="border-r border-gray-200 bg-gray-50">
                {timeSlots.map((time, index) => (
                  <div
                    key={time}
                    className="h-[60px] border-b border-gray-100 px-4 py-2 text-sm text-gray-600"
                  >
                    {index % 2 === 0 ? time : ''}
                  </div>
                ))}
              </div>

              {/* Days columns */}
              {daysOfWeek.map((day) => (
                <div key={day.key} className="relative border-r border-gray-200 last:border-r-0">
                  {/* Time grid lines */}
                  {timeSlots.map((time) => (
                    <div
                      key={time}
                      className="h-[60px] border-b border-gray-100"
                    />
                  ))}
                  
                  {/* Events */}
                  {getEventsForDay(day.key).map((event) => {
                    const IconComponent = getTypeIcon(event.type);
                    return (
                      <div
                        key={event.id}
                        className="absolute left-1 right-1 rounded-lg p-2 text-white text-xs shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                        style={{
                          backgroundColor: event.color,
                          top: `${getEventPosition(event.startTime)}px`,
                          height: `${getEventHeight(event.startTime, event.endTime)}px`,
                          minHeight: '50px'
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-1 mb-1">
                              <IconComponent className="w-3 h-3 flex-shrink-0" />
                              <span className="font-medium truncate">{event.title}</span>
                            </div>
                            <div className="text-xs opacity-90 mb-1">
                              {event.startTime} - {event.endTime}
                            </div>
                            {event.classroom && (
                              <div className="flex items-center space-x-1 text-xs opacity-80">
                                <MapPin className="w-2 h-2" />
                                <span>{event.classroom}</span>
                              </div>
                            )}
                            {event.students && (
                              <div className="flex items-center space-x-1 text-xs opacity-80">
                                <Users className="w-2 h-2" />
                                <span>{event.students} estudiantes</span>
                              </div>
                            )}
                          </div>
                          <button className="p-1 hover:bg-black hover:bg-opacity-20 rounded">
                            <MoreVertical className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Quick Stats */}


      {/* Modal para agregar actividad */}
      <ModalAgregarActividad
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={null}
        onEventCreated={handleEventCreated}
      />
    </div>
  );
};

export default Horarios;
