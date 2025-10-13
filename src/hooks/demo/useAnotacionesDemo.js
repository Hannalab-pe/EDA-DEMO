import {
  useDemoQuery,
  useDemoMutation,
  createDemoQueryFn,
  createDemoMutationFn,
} from "./useDemoQuery";
import { mockData } from "../../data/mockData";
import { anotacionesStore } from "../../store/anotacionesStore";

/**
 * Hook para obtener anotaciones por trabajador/docente
 */
export const useAnotacionesByTrabajadorDemo = (trabajadorId) => {
  return useDemoQuery({
    queryKey: ["anotaciones", "trabajador", trabajadorId],
    queryFn: async () => {
      console.log(
        "🎭 [ANOTACIONES DEMO] Generando anotaciones ficticias para trabajador:",
        trabajadorId || "2"
      );

      // Simular delay de carga
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Obtener anotaciones temporales del store
      const anotacionesTemporales = anotacionesStore.obtenerAnotaciones();
      console.log(
        "📦 [STORE] Anotaciones temporales obtenidas:",
        anotacionesTemporales.length
      );

      // Generar anotaciones ficticias base
      const anotacionesFicticias = [
        {
          idAnotacionAlumno: "anot-1",
          titulo: "Excelente progreso en matemáticas",
          observacion:
            "Ana ha mostrado una mejora significativa en la resolución de problemas de fracciones. Su participación en clase es activa y sus tareas están bien desarrolladas.",
          fecha: "2025-10-12T10:30:00",
          tipo: "POSITIVA",
          estudiante: {
            id: "est-1",
            nombre: "Ana María",
            apellido: "García Pérez",
          },
          curso: {
            idCurso: "1",
            nombreCurso: "Matemática",
          },
          docenteId: trabajadorId || "2",
        },
        {
          idAnotacionAlumno: "anot-2",
          titulo: "Incidente en el recreo",
          observacion:
            "Carlos tuvo una discusión menor con un compañero durante el recreo. Se conversó con ambos estudiantes y resolvieron sus diferencias. Requiere seguimiento.",
          fecha: "2025-10-11T14:15:00",
          tipo: "NEGATIVA",
          estudiante: {
            id: "est-2",
            nombre: "Carlos Eduardo",
            apellido: "López Torres",
          },
          curso: {
            idCurso: "2",
            nombreCurso: "Comunicación",
          },
          docenteId: trabajadorId || "2",
        },
        {
          idAnotacionAlumno: "anot-3",
          titulo: "Reconocimiento por proyecto de ciencias",
          observacion:
            "Isabella presentó un proyecto excepcional sobre el sistema solar. Su creatividad y dedicación fueron notables. Se recomienda para la feria de ciencias.",
          fecha: "2025-10-10T09:45:00",
          tipo: "POSITIVA",
          estudiante: {
            id: "est-3",
            nombre: "Isabella",
            apellido: "Rodríguez Martínez",
          },
          curso: {
            idCurso: "3",
            nombreCurso: "Ciencia y Tecnología",
          },
          docenteId: trabajadorId || "2",
        },
        {
          idAnotacionAlumno: "anot-4",
          titulo: "Ausencias frecuentes",
          observacion:
            "Diego ha faltado 3 veces esta semana. Los padres indican problemas de salud menores. Importante dar seguimiento a las tareas perdidas.",
          fecha: "2025-10-09T11:20:00",
          tipo: "NEUTRA",
          estudiante: {
            id: "est-4",
            nombre: "Diego",
            apellido: "Fernández Ruiz",
          },
          curso: {
            idCurso: "4",
            nombreCurso: "Personal Social",
          },
          docenteId: trabajadorId || "2",
        },
        {
          idAnotacionAlumno: "anot-5",
          titulo: "Participación destacada en clase",
          observacion:
            "Sofía ha demostrado un gran interés en las actividades de arte. Sus dibujos reflejan creatividad y técnica avanzada para su edad.",
          fecha: "2025-10-08T15:00:00",
          tipo: "POSITIVA",
          estudiante: {
            id: "est-5",
            nombre: "Sofía",
            apellido: "Mendoza Castro",
          },
          curso: {
            idCurso: "5",
            nombreCurso: "Arte y Cultura",
          },
          docenteId: trabajadorId || "2",
        },
        {
          idAnotacionAlumno: "anot-6",
          titulo: "Mejora en conducta",
          observacion:
            "Luis ha mostrado una actitud más positiva en clase esta semana. Está cumpliendo con las normas de convivencia y colabora con sus compañeros.",
          fecha: "2025-10-07T13:30:00",
          tipo: "POSITIVA",
          estudiante: {
            id: "est-6",
            nombre: "Luis",
            apellido: "Ramírez Soto",
          },
          curso: {
            idCurso: "2",
            nombreCurso: "Comunicación",
          },
          docenteId: trabajadorId || "2",
        },
      ];

      // Combinar: anotaciones temporales primero (más recientes), luego las ficticias
      const todasLasAnotaciones = [
        ...anotacionesTemporales,
        ...anotacionesFicticias,
      ];

      console.log(
        "✅ [ANOTACIONES DEMO] Total anotaciones:",
        todasLasAnotaciones.length,
        "(Temporales:",
        anotacionesTemporales.length,
        "+ Base:",
        anotacionesFicticias.length,
        ")"
      );

      return todasLasAnotaciones;
    },
    enabled: true, // Siempre habilitado
    refetchOnMount: "always",
    staleTime: 0,
    defaultData: [],
  });
};

/**
 * Hook para obtener anotaciones con operaciones CRUD
 */
export const useAnotacionesDemo = (filters = {}) => {
  const query = useDemoQuery({
    queryKey: ["anotaciones", filters],
    queryFn: createDemoQueryFn("anotaciones", filters),
    defaultData: [],
  });

  // Agregar operaciones CRUD simuladas
  const deleteAnotacion = async (id) => {
    console.log("🎭 [DEMO] Simulando eliminación de anotación:", id);

    // Simular delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log("✅ [DEMO] Anotación eliminada exitosamente");
    return { success: true };
  };

  return {
    ...query,
    deleteAnotacion,
    deleting: false,
  };
};

/**
 * Hook para obtener anotaciones por estudiante
 */
export const useAnotacionesPorEstudianteDemo = (estudianteId) => {
  return useDemoQuery({
    queryKey: ["anotaciones", "estudiante", estudianteId],
    queryFn: async () => {
      const anotaciones = mockData.anotaciones.filter(
        (a) => a.estudianteId === estudianteId
      );

      // Ordenar por fecha más reciente
      return anotaciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    },
    enabled: !!estudianteId,
    defaultData: [],
  });
};

/**
 * Hook para obtener anotaciones por aula
 */
export const useAnotacionesPorAulaDemo = (aulaId) => {
  return useDemoQuery({
    queryKey: ["anotaciones", "aula", aulaId],
    queryFn: async () => {
      // Filtrar por estudiantes del aula
      const estudiantesAula = mockData.estudiantes
        .filter((e) => e.aulaId === aulaId)
        .map((e) => e.id);

      const anotaciones = mockData.anotaciones
        .filter((a) => estudiantesAula.includes(a.estudianteId))
        .map((a) => {
          const estudiante = mockData.estudiantes.find(
            (e) => e.id === a.estudianteId
          );
          return {
            ...a,
            estudiante: estudiante
              ? `${estudiante.nombre} ${estudiante.apellidos}`
              : "Estudiante no encontrado",
          };
        });

      return anotaciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    },
    enabled: !!aulaId,
    defaultData: [],
  });
};

/**
 * Hook para obtener anotaciones por docente
 */
export const useAnotacionesPorDocenteDemo = (docenteId) => {
  return useDemoQuery({
    queryKey: ["anotaciones", "docente", docenteId],
    queryFn: async () => {
      const anotaciones = mockData.anotaciones
        .filter((a) => a.docenteId === docenteId)
        .map((a) => {
          const estudiante = mockData.estudiantes.find(
            (e) => e.id === a.estudianteId
          );
          return {
            ...a,
            estudiante: estudiante
              ? `${estudiante.nombre} ${estudiante.apellidos}`
              : "Estudiante no encontrado",
          };
        });

      return anotaciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    },
    enabled: !!docenteId,
    defaultData: [],
  });
};

/**
 * Hook para obtener anotaciones por padre
 */
export const useAnotacionesPorPadreDemo = (padreId) => {
  return useDemoQuery({
    queryKey: ["anotaciones", "padre", padreId],
    queryFn: async () => {
      // Encontrar estudiantes del padre
      const estudiantesPadre = mockData.estudiantes
        .filter((e) => e.padreId === padreId)
        .map((e) => e.id);

      const anotaciones = mockData.anotaciones
        .filter((a) => estudiantesPadre.includes(a.estudianteId))
        .map((a) => {
          const estudiante = mockData.estudiantes.find(
            (e) => e.id === a.estudianteId
          );
          const docente = mockData.trabajadores.find(
            (t) => t.id === a.docenteId
          );
          return {
            ...a,
            estudiante: estudiante
              ? `${estudiante.nombre} ${estudiante.apellidos}`
              : "Estudiante no encontrado",
            docente: docente
              ? `${docente.nombre} ${docente.apellidos}`
              : "Docente no encontrado",
          };
        });

      return anotaciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    },
    enabled: !!padreId,
    defaultData: [],
  });
};

/**
 * Hook para crear anotación
 */
export const useCrearAnotacionDemo = () => {
  return useDemoMutation({
    mutationFn: async (anotacionData) => {
      const nuevaAnotacion = {
        id: Date.now().toString(),
        ...anotacionData,
        fecha: new Date().toISOString(),
        estado: "ACTIVO",
      };
      console.log("🎭 Demo: Creando anotación", nuevaAnotacion);
      return nuevaAnotacion;
    },
    onSuccess: (data) => {
      console.log("🎭 Demo: Anotación creada exitosamente", data);
    },
  });
};

/**
 * Hook para actualizar anotación
 */
export const useActualizarAnotacionDemo = () => {
  return useDemoMutation({
    mutationFn: createDemoMutationFn("update", "anotaciones"),
    onSuccess: (data) => {
      console.log("🎭 Demo: Anotación actualizada exitosamente", data);
    },
  });
};

/**
 * Hook para eliminar anotación
 */
export const useEliminarAnotacionDemo = () => {
  return useDemoMutation({
    mutationFn: createDemoMutationFn("delete", "anotaciones"),
    onSuccess: (data) => {
      console.log("🎭 Demo: Anotación eliminada exitosamente", data);
    },
  });
};

/**
 * Hook para estadísticas de anotaciones
 */
export const useEstadisticasAnotacionesDemo = (filtros = {}) => {
  return useDemoQuery({
    queryKey: ["anotaciones", "estadisticas", filtros],
    queryFn: async () => {
      let anotaciones = mockData.anotaciones;

      // Aplicar filtros
      if (filtros.aulaId) {
        const estudiantesAula = mockData.estudiantes
          .filter((e) => e.aulaId === filtros.aulaId)
          .map((e) => e.id);
        anotaciones = anotaciones.filter((a) =>
          estudiantesAula.includes(a.estudianteId)
        );
      }

      if (filtros.docenteId) {
        anotaciones = anotaciones.filter(
          (a) => a.docenteId === filtros.docenteId
        );
      }

      // Calcular estadísticas
      const total = anotaciones.length;
      const positivas = anotaciones.filter((a) => a.tipo === "POSITIVA").length;
      const negativas = anotaciones.filter((a) => a.tipo === "NEGATIVA").length;
      const neutras = anotaciones.filter((a) => a.tipo === "NEUTRA").length;

      // Anotaciones por mes
      const porMes = anotaciones.reduce((acc, a) => {
        const mes = new Date(a.fecha).toISOString().slice(0, 7);
        acc[mes] = (acc[mes] || 0) + 1;
        return acc;
      }, {});

      return {
        total,
        positivas,
        negativas,
        neutras,
        porcentajePositivas:
          total > 0 ? ((positivas / total) * 100).toFixed(1) : 0,
        porMes,
      };
    },
    defaultData: {
      total: 0,
      positivas: 0,
      negativas: 0,
      neutras: 0,
      porcentajePositivas: 0,
      porMes: {},
    },
  });
};
