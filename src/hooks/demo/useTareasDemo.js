import {
  useDemoQuery,
  useDemoMutation,
  createDemoQueryFn,
  createDemoMutationFn,
} from "./useDemoQuery";
import { mockData } from "../../data/mockData";

/**
 * Hook para obtener tareas
 */
export const useTareasDemo = (filters = {}) => {
  return useDemoQuery({
    queryKey: ["tareas", filters],
    queryFn: createDemoQueryFn("tareas", filters),
    defaultData: [],
  });
};

/**
 * Hook para obtener tareas por estudiante
 */
export const useTareasPorEstudianteDemo = (estudianteId) => {
  return useDemoQuery({
    queryKey: ["tareas", "estudiante", estudianteId],
    queryFn: async () => {
      // Obtener datos del estudiante
      const estudiante = mockData.estudiantes.find(
        (e) => e.id === estudianteId
      );
      if (!estudiante) return [];

      // Filtrar tareas por grado y aula del estudiante
      const tareas = mockData.tareas.filter(
        (t) =>
          t.gradoId === estudiante.gradoId || t.aulaId === estudiante.aulaId
      );

      // Simular estado de entrega para cada tarea
      return tareas.map((tarea) => ({
        ...tarea,
        entregada: Math.random() > 0.3, // 70% probabilidad de estar entregada
        fechaEntrega: Math.random() > 0.5 ? new Date().toISOString() : null,
        calificacion:
          Math.random() > 0.4
            ? ["A", "B", "C"][Math.floor(Math.random() * 3)]
            : null,
        comentarios: Math.random() > 0.6 ? "Excelente trabajo" : null,
      }));
    },
    enabled: !!estudianteId,
    defaultData: [],
  });
};

/**
 * Hook para obtener tareas por aula
 */
export const useTareasPorAulaDemo = (aulaId) => {
  return useDemoQuery({
    queryKey: ["tareas", "aula", aulaId],
    queryFn: async () => {
      const tareas = mockData.tareas.filter((t) => t.aulaId === aulaId);

      // Agregar estadísticas de entrega
      return tareas.map((tarea) => ({
        ...tarea,
        estadisticas: {
          totalEstudiantes: 15,
          entregadas: Math.floor(Math.random() * 15) + 1,
          pendientes: Math.floor(Math.random() * 5),
          calificadas: Math.floor(Math.random() * 12) + 1,
        },
      }));
    },
    enabled: !!aulaId,
    defaultData: [],
  });
};

/**
 * Hook para obtener tareas por docente
 */
export const useTareasPorDocenteDemo = (docenteId) => {
  return useDemoQuery({
    queryKey: ["tareas", "docente", docenteId],
    queryFn: async () => {
      // En modo DEMO, si no hay docenteId usar uno por defecto
      const idDocente = docenteId || "2"; // Carlos Ruiz como default

      console.log(
        "🎭 [TAREAS DEMO] Iniciando carga de tareas para docente:",
        idDocente,
        "(original:",
        docenteId,
        ")"
      );

      // Obtener tareas del docente desde mockData
      let tareas = mockData.tareas.filter((t) => t.docenteId === idDocente);

      console.log(
        "📚 [TAREAS DEMO] Tareas en mockData para este docente:",
        tareas.length
      );

      // Agregar tareas temporales creadas en esta sesión
      const tareasTemporalesDelDocente = tareasTemporalesDemo.filter(
        (t) => t.docenteId === idDocente
      );

      if (tareasTemporalesDelDocente.length > 0) {
        console.log(
          "📋 [DEMO] Agregando tareas temporales:",
          tareasTemporalesDelDocente.length
        );
        tareas = [...tareas, ...tareasTemporalesDelDocente];
      }

      // Si no hay tareas en mockData ni temporales, generar tareas ficticias para DEMO
      if (tareas.length === 0) {
        console.log("🎭 [DEMO] No hay tareas, generando 6 tareas ficticias...");

        // Obtener aulas del docente para asignar tareas
        let aulasDocente = mockData.aulas
          .filter((a) => a.docenteId === idDocente)
          .slice(0, 3);

        if (aulasDocente.length === 0) {
          // Si no tiene aulas asignadas, usar aulas generales para demo
          console.log(
            "🏫 [DEMO] No hay aulas asignadas, usando aulas generales"
          );
          aulasDocente = mockData.aulas.slice(0, 3);
        }

        console.log(
          "🏫 [DEMO] Aulas para asignar tareas:",
          aulasDocente.length
        );

        const tareasDemo = [
          {
            id: "tarea-demo-1",
            titulo: "Ensayo sobre el Calentamiento Global",
            descripcion:
              "Redactar un ensayo de 500 palabras sobre las causas y consecuencias del calentamiento global, incluyendo propuestas de solución.",
            fechaCreacion: "2025-10-01",
            fechaVencimiento: "2025-10-20",
            estado: "ACTIVO",
            materia: "Ciencias Naturales",
            docenteId: idDocente,
            aulaId: aulasDocente[0]?.id || "1",
            gradoId: aulasDocente[0]?.gradoId || "3",
            archivo: null,
          },
          {
            id: "tarea-demo-2",
            titulo: "Ejercicios de Matemática - Capítulo 5",
            descripcion:
              "Resolver los ejercicios del 1 al 20 del capítulo 5 del libro de matemáticas. Mostrar todo el procedimiento.",
            fechaCreacion: "2025-10-05",
            fechaVencimiento: "2025-10-15",
            estado: "ACTIVO",
            materia: "Matemática",
            docenteId: idDocente,
            aulaId: aulasDocente[1]?.id || aulasDocente[0]?.id || "1",
            gradoId:
              aulasDocente[1]?.gradoId || aulasDocente[0]?.gradoId || "3",
            archivo: null,
          },
          {
            id: "tarea-demo-3",
            titulo: "Lectura: El Quijote - Capítulos 1-3",
            descripcion:
              "Leer los primeros tres capítulos de Don Quijote de la Mancha y realizar un resumen de una página sobre los personajes principales.",
            fechaCreacion: "2025-09-28",
            fechaVencimiento: "2025-10-10",
            estado: "vencida",
            materia: "Comunicación",
            docenteId: idDocente,
            aulaId: aulasDocente[0]?.id || "1",
            gradoId: aulasDocente[0]?.gradoId || "3",
            archivo: null,
          },
          {
            id: "tarea-demo-4",
            titulo: "Proyecto de Ciencias: El Sistema Solar",
            descripcion:
              "Crear una maqueta del sistema solar con materiales reciclados. Incluir los 8 planetas y el sol con sus características principales.",
            fechaCreacion: "2025-10-08",
            fechaVencimiento: "2025-10-25",
            estado: "ACTIVO",
            materia: "Ciencia y Tecnología",
            docenteId: idDocente,
            aulaId: aulasDocente[2]?.id || aulasDocente[0]?.id || "1",
            gradoId:
              aulasDocente[2]?.gradoId || aulasDocente[0]?.gradoId || "3",
            archivo: null,
          },
          {
            id: "tarea-demo-5",
            titulo: "Informe: La Independencia del Perú",
            descripcion:
              "Elaborar un informe detallado sobre el proceso de independencia del Perú, incluyendo causas, personajes importantes y consecuencias.",
            fechaCreacion: "2025-10-12",
            fechaVencimiento: "2025-10-30",
            estado: "ACTIVO",
            materia: "Personal Social",
            docenteId: idDocente,
            aulaId: aulasDocente[0]?.id || "1",
            gradoId: aulasDocente[0]?.gradoId || "3",
            archivo: null,
          },
          {
            id: "tarea-demo-6",
            titulo: "Borrador: Poema sobre la Naturaleza",
            descripcion:
              "Escribir un poema de al menos 3 estrofas sobre la belleza de la naturaleza. Este es un borrador que revisaremos en clase.",
            fechaCreacion: "2025-10-13",
            fechaVencimiento: "2025-10-18",
            estado: "borrador",
            materia: "Comunicación",
            docenteId: idDocente,
            aulaId: aulasDocente[1]?.id || aulasDocente[0]?.id || "1",
            gradoId:
              aulasDocente[1]?.gradoId || aulasDocente[0]?.gradoId || "3",
            archivo: null,
          },
        ];

        tareas = tareasDemo;
      }

      return tareas.map((tarea) => {
        // Obtener info del aula
        const aula = mockData.aulas.find((a) => a.id === tarea.aulaId);
        const grado = mockData.grados.find((g) => g.id === tarea.gradoId);
        const estudiantesAula = mockData.estudiantes.filter(
          (e) => e.aulaId === tarea.aulaId
        );

        // Determinar estado basado en fecha de vencimiento
        let estado = tarea.estado.toLowerCase();
        if (estado === "activo") {
          const hoy = new Date();
          const vencimiento = new Date(tarea.fechaVencimiento);
          if (vencimiento < hoy) {
            estado = "vencida";
          } else {
            estado = "activa";
          }
        }

        // Generar números realistas de entregas
        const totalEstudiantes = estudiantesAula.length || 15;
        const entregadas = Math.min(
          Math.floor(Math.random() * totalEstudiantes * 0.8) + 1,
          totalEstudiantes
        );
        const pendientes = totalEstudiantes - entregadas;

        return {
          ...tarea,
          // Convertir propiedades al formato esperado por el componente
          fechaEntrega: tarea.fechaVencimiento,
          fechaAsignacion: tarea.fechaCreacion,
          aulaInfo: {
            grado: grado?.nombre || "3ro Primaria",
            seccion: aula?.seccion || aula?.nombre || "A",
          },
          estado: estado,
          prioridad:
            estado === "vencida"
              ? "alta"
              : Math.random() > 0.5
              ? "media"
              : "baja",
          totalEstudiantes: totalEstudiantes,
          entregadas: entregadas,
          pendientes: pendientes,
          estadisticas: {
            totalEstudiantes: totalEstudiantes,
            entregadas: entregadas,
            pendientes: pendientes,
            vencidas: estado === "vencida" ? pendientes : 0,
          },
        };
      });

      console.log(
        "✅ [TAREAS DEMO] Total de tareas procesadas:",
        tareas.length
      );
      console.log(
        "📊 [TAREAS DEMO] Retornando tareas:",
        tareas.map((t) => ({
          id: t.id,
          titulo: t.titulo,
          estado: t.estado,
        }))
      );

      return tareas;
    },
    enabled: true, // Siempre habilitado en DEMO
    refetchOnMount: "always", // Siempre refrescar al montar
    staleTime: 0, // Los datos siempre están obsoletos, forzar refetch
  });
};

// Lista temporal para almacenar tareas creadas en la sesión DEMO
let tareasTemporalesDemo = [];

/**
 * Hook para crear tarea
 */
export const useCrearTareaDemo = () => {
  return useDemoMutation({
    mutationFn: async (tareaData) => {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 800));

      const nuevaTarea = {
        id: `tarea-${Date.now()}`,
        ...tareaData,
        fechaCreacion: new Date().toISOString().split("T")[0],
        estado: "ACTIVO",
      };

      // Agregar a la lista temporal de tareas demo
      tareasTemporalesDemo.push(nuevaTarea);

      console.log(
        "🎭 Demo: Tarea creada y agregada a lista temporal",
        nuevaTarea
      );
      console.log(
        "📋 Demo: Total de tareas temporales:",
        tareasTemporalesDemo.length
      );

      return nuevaTarea;
    },
    onSuccess: (data) => {
      console.log("✅ Demo: Tarea creada exitosamente", data);
    },
  });
};

/**
 * Hook para actualizar tarea
 */
export const useActualizarTareaDemo = () => {
  return useDemoMutation({
    mutationFn: async ({ id, data }) => {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 700));

      console.log("🎭 Demo: Actualizando tarea con ID:", id, "Datos:", data);

      // Buscar en tareas temporales y actualizar si existe
      const indiceTemp = tareasTemporalesDemo.findIndex((t) => t.id === id);
      if (indiceTemp !== -1) {
        tareasTemporalesDemo[indiceTemp] = {
          ...tareasTemporalesDemo[indiceTemp],
          ...data,
          fechaActualizacion: new Date().toISOString().split("T")[0],
        };
        console.log(
          "📝 Demo: Tarea temporal actualizada:",
          tareasTemporalesDemo[indiceTemp]
        );
        return tareasTemporalesDemo[indiceTemp];
      }

      // Si no es temporal, simular actualización exitosa
      const tareaActualizada = {
        id,
        ...data,
        fechaActualizacion: new Date().toISOString().split("T")[0],
      };

      console.log("📝 Demo: Tarea actualizada (simulado):", tareaActualizada);
      return tareaActualizada;
    },
    onSuccess: (data) => {
      console.log("✅ Demo: Tarea actualizada exitosamente", data);
    },
  });
};

/**
 * Hook para eliminar tarea
 */
export const useEliminarTareaDemo = () => {
  return useDemoMutation({
    mutationFn: async (tareaId) => {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 600));

      console.log("🎭 Demo: Eliminando tarea con ID:", tareaId);

      // Buscar en tareas temporales y eliminar si existe
      const indiceTemp = tareasTemporalesDemo.findIndex(
        (t) => t.id === tareaId
      );
      if (indiceTemp !== -1) {
        const tareaEliminada = tareasTemporalesDemo.splice(indiceTemp, 1)[0];
        console.log("🗑️ Demo: Tarea temporal eliminada:", tareaEliminada);
      }

      // Retornar éxito (en DEMO siempre funciona)
      return {
        success: true,
        id: tareaId,
        message: "Tarea eliminada correctamente en modo DEMO",
      };
    },
    onSuccess: (data) => {
      console.log("✅ Demo: Tarea eliminada exitosamente", data);
    },
  });
};

/**
 * Hook para entregar tarea (estudiante)
 */
export const useEntregarTareaDemo = () => {
  return useDemoMutation({
    mutationFn: async ({ tareaId, estudianteId, archivo, comentarios }) => {
      const entrega = {
        id: Date.now().toString(),
        tareaId,
        estudianteId,
        fechaEntrega: new Date().toISOString(),
        archivo: archivo || null,
        comentarios: comentarios || "",
        estado: "ENTREGADA",
      };
      console.log("🎭 Demo: Entregando tarea", entrega);
      return entrega;
    },
    onSuccess: (data) => {
      console.log("🎭 Demo: Tarea entregada exitosamente", data);
    },
  });
};

/**
 * Hook para calificar tarea (docente)
 */
export const useCalificarTareaDemo = () => {
  return useDemoMutation({
    mutationFn: async ({ entregaId, calificacion, comentarios }) => {
      const calificacionData = {
        entregaId,
        calificacion,
        comentarios,
        fechaCalificacion: new Date().toISOString(),
        calificadoPor: "2", // ID del docente demo
      };
      console.log("🎭 Demo: Calificando tarea", calificacionData);
      return calificacionData;
    },
    onSuccess: (data) => {
      console.log("🎭 Demo: Tarea calificada exitosamente", data);
    },
  });
};
