import { useState, useEffect } from "react";
import { toast } from "sonner";
import { mockData } from "../data/mockData";

/**
 * Hook personalizado DEMO para gestionar las tareas de un estudiante
 * Utiliza datos mock en lugar de llamadas al backend
 */
export const useTareasEstudianteDemo = () => {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Cargar tareas del estudiante desde datos mock
   */
  const cargarTareasEstudiante = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simular carga de datos
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Obtener datos mock del estudiante
      const tareasArray =
        mockData.students.find((s) => s.id === 1)?.tasks || [];

      // Transformar datos mock al formato esperado
      const tareasTransformadas = transformarTareas(tareasArray);
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
    await cargarTareasEstudiante();
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
    cargarTareasEstudiante,
  };
};

export default useTareasEstudianteDemo;
