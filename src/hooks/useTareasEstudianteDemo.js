import { useState, useEffect } from "react";
import { toast } from "sonner";

/**
 * Hook personalizado DEMO para gestionar las tareas de un estudiante
 * Utiliza datos ficticios sin conexión al backend
 */
export const useTareasEstudianteDemo = () => {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefetching, setIsRefetching] = useState(false);

  /**
   * Generar tareas ficticias
   */
  const generarTareasFicticias = () => {
    const hoy = new Date();

    return [
      {
        id: 1,
        title: "Problemas de multiplicación y división",
        description:
          "Resolver los ejercicios de la página 45 del libro de matemáticas. Incluye 20 problemas de multiplicación de dos dígitos y 15 problemas de división simple.",
        subject: "Matemáticas",
        dueDate: new Date(
          hoy.getTime() + 2 * 24 * 60 * 60 * 1000
        ).toISOString(),
        assignedDate: new Date(
          hoy.getTime() - 1 * 24 * 60 * 60 * 1000
        ).toISOString(),
        status: "pending",
        priority: "high",
        teacher: "Ana Martínez",
        grade: "4to Grado",
        timeEstimate: "45 min",
        notes: null,
        completedAt: null,
      },
      {
        id: 2,
        title: 'Comprensión lectora: "El Principito"',
        description:
          'Leer el capítulo 5 de "El Principito" y responder las 10 preguntas de comprensión lectora. Incluir un resumen de máximo 200 palabras.',
        subject: "Comunicación",
        dueDate: new Date(
          hoy.getTime() + 5 * 24 * 60 * 60 * 1000
        ).toISOString(),
        assignedDate: new Date(
          hoy.getTime() - 2 * 24 * 60 * 60 * 1000
        ).toISOString(),
        status: "completed",
        priority: "medium",
        teacher: "Carlos Rodríguez",
        grade: "4to Grado",
        timeEstimate: "60 min",
        notes: "Excelente trabajo, muy buena comprensión del texto",
        completedAt: new Date(
          hoy.getTime() - 1 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
      {
        id: 3,
        title: "Experimento: El ciclo del agua",
        description:
          "Realizar el experimento del ciclo del agua en casa con materiales reciclados. Documentar el proceso con fotos y describir cada etapa observada.",
        subject: "Ciencias Naturales",
        dueDate: new Date(
          hoy.getTime() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        assignedDate: hoy.toISOString(),
        status: "pending",
        priority: "medium",
        teacher: "Luis Fernández",
        grade: "4to Grado",
        timeEstimate: "90 min",
        notes: null,
        completedAt: null,
      },
      {
        id: 4,
        title: "Mapa del Perú antiguo",
        description:
          "Dibujar un mapa del Perú antiguo señalando las principales culturas pre-incas: Chavín, Paracas, Nazca, Mochica y Tiahuanaco. Incluir leyenda y colores.",
        subject: "Personal Social",
        dueDate: new Date(
          hoy.getTime() - 1 * 24 * 60 * 60 * 1000
        ).toISOString(),
        assignedDate: new Date(
          hoy.getTime() - 8 * 24 * 60 * 60 * 1000
        ).toISOString(),
        status: "overdue",
        priority: "high",
        teacher: "Patricia Torres",
        grade: "4to Grado",
        timeEstimate: "60 min",
        notes: null,
        completedAt: null,
      },
      {
        id: 5,
        title: "Vocabulario en inglés: Family members",
        description:
          "Estudiar y memorizar las 20 palabras sobre miembros de la familia en inglés. Practicar pronunciación con el audio del libro digital.",
        subject: "Inglés",
        dueDate: new Date(
          hoy.getTime() + 3 * 24 * 60 * 60 * 1000
        ).toISOString(),
        assignedDate: new Date(
          hoy.getTime() - 3 * 24 * 60 * 60 * 1000
        ).toISOString(),
        status: "completed",
        priority: "low",
        teacher: "Roberto Sánchez",
        grade: "4to Grado",
        timeEstimate: "30 min",
        notes: "Muy buena pronunciación",
        completedAt: new Date(
          hoy.getTime() - 2 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
      {
        id: 6,
        title: "Dibujo: Paisaje con perspectiva",
        description:
          "Crear un dibujo de un paisaje usando la técnica de perspectiva. Usar lápices de colores o acuarelas. Tamaño A4.",
        subject: "Arte",
        dueDate: new Date(
          hoy.getTime() + 10 * 24 * 60 * 60 * 1000
        ).toISOString(),
        assignedDate: new Date(
          hoy.getTime() - 1 * 24 * 60 * 60 * 1000
        ).toISOString(),
        status: "pending",
        priority: "low",
        teacher: "María González",
        grade: "4to Grado",
        timeEstimate: "120 min",
        notes: null,
        completedAt: null,
      },
    ];
  };

  /**
   * Cargar tareas del estudiante desde datos ficticios
   */
  const cargarTareasEstudiante = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔍 [DEMO] Cargando tareas ficticias del estudiante...");

      // Simular carga de datos
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Generar tareas ficticias
      const tareasArray = generarTareasFicticias();

      // Transformar datos mock al formato esperado
      const tareasTransformadas = transformarTareas(tareasArray);

      console.log(
        "✅ [DEMO] Tareas ficticias cargadas:",
        tareasTransformadas.length
      );

      setTareas(tareasTransformadas || []);
    } catch (error) {
      console.error(
        "❌ [HOOK TAREAS ESTUDIANTE DEMO] Error al cargar tareas:",
        error
      );
      setError(error.message);
      toast.error("Error al cargar las tareas");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mapear estado del mock al frontend
   */
  const mapearEstado = (estadoMock) => {
    const estadosMap = {
      pending: "pending",
      completed: "completed",
      in_progress: "in_progress",
      overdue: "overdue",
      draft: "draft",
    };
    return estadosMap[estadoMock] || "pending";
  };

  /**
   * Transformar datos mock al formato esperado por el componente
   */
  const transformarTareas = (tareasMock) => {
    if (!Array.isArray(tareasMock)) {
      console.warn(
        "⚠️ [HOOK TAREAS ESTUDIANTE DEMO] Datos no son un array:",
        tareasMock
      );
      return [];
    }

    return tareasMock.map((tarea) => {
      return {
        id: tarea.id,
        idTarea: tarea.id,
        title: tarea.title,
        titulo: tarea.title,
        description: tarea.description,
        descripcion: tarea.description,
        subject: tarea.subject,
        materia: tarea.subject,
        dueDate: tarea.dueDate,
        fechaEntrega: tarea.dueDate,
        fechaAsignacion: tarea.assignedDate || new Date().toISOString(),
        status: mapearEstado(tarea.status),
        estado: mapearEstado(tarea.status),
        priority: tarea.priority || "medium",
        prioridad: tarea.priority || "medium",

        // Información del aula y grado
        aula: `${tarea.grade || "1ro"} - Sección A`,
        aulaInfo: {
          idAula: 1,
          seccion: "A",
          grado: tarea.grade || "1ro",
          descripcion: tarea.subject,
          cantidadEstudiantes: 25,
        },

        // Información del profesor
        profesor: tarea.teacher || "Prof. Demo",
        profesorInfo: {
          idTrabajador: 1,
          nombre: tarea.teacher?.split(" ")[0] || "Demo",
          apellido: tarea.teacher?.split(" ")[1] || "Teacher",
          correo: "profesor@demo.com",
          telefono: "+123456789",
        },

        // Información de la entrega del estudiante
        entrega: {
          idTareaEntrega: tarea.id,
          fechaEntregaRealizada: tarea.completedAt,
          archivoUrl: null,
          estado: tarea.status,
          realizoTarea: tarea.status === "completed",
          observaciones: tarea.notes || "",
        },

        // Estado de entrega
        realizoTarea: tarea.status === "completed",
        completedAt: tarea.completedAt,

        // Datos adicionales para UI
        emoji: getEmojiBySubject(tarea.subject),
        timeEstimate: tarea.timeEstimate || "30 min",

        // Fechas para comparación
        isOverdue:
          new Date(tarea.dueDate) < new Date() && tarea.status !== "completed",
        daysLeft: Math.ceil(
          (new Date(tarea.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
        ),
      };
    });
  };

  /**
   * Obtener emoji según la materia
   */
  const getEmojiBySubject = (subject) => {
    const emojiMap = {
      matemáticas: "🔢",
      matematica: "🔢",
      mathematics: "🔢",
      lenguaje: "📚",
      español: "📚",
      literatura: "📚",
      language: "📚",
      ciencias: "🔬",
      ciencia: "🔬",
      science: "🔬",
      historia: "📜",
      history: "📜",
      geografía: "🌍",
      geografia: "🌍",
      geography: "🌍",
      "educación física": "⚽",
      "educacion fisica": "⚽",
      "physical education": "⚽",
      arte: "🎨",
      art: "🎨",
      música: "🎵",
      musica: "🎵",
      music: "🎵",
      inglés: "🇬🇧",
      ingles: "🇬🇧",
      english: "🇬🇧",
    };

    const subjectLower = subject?.toLowerCase() || "";
    return emojiMap[subjectLower] || "📝";
  };

  /**
   * Refrescar la lista de tareas
   */
  const refrescarTareas = async () => {
    setIsRefetching(true);
    try {
      await cargarTareasEstudiante();
      toast.success("Tareas actualizadas");
    } finally {
      setIsRefetching(false);
    }
  };

  // Cargar tareas al montar el componente
  useEffect(() => {
    cargarTareasEstudiante();
  }, []);

  return {
    tareas,
    loading,
    error,
    refrescarTareas,
    isRefetching,
    cargarTareasEstudiante,
  };
};

export default useTareasEstudianteDemo;
