import {
  useDemoQuery,
  useDemoMutation,
  createDemoQueryFn,
  createDemoMutationFn,
} from "./useDemoQuery";
import { mockData } from "../../data/mockData";

/**
 * Hook para obtener anotaciones por trabajador/docente
 */
export const useAnotacionesByTrabajadorDemo = (trabajadorId) => {
  return useDemoQuery({
    queryKey: ["anotaciones", "trabajador", trabajadorId],
    queryFn: async () => {
      // Obtener aulas del trabajador
      const aulasTrabajadar = mockData.aulas.filter(
        (a) => a.docenteId === trabajadorId
      );
      const aulaIds = aulasTrabajadar.map((a) => a.id);

      // Obtener estudiantes de esas aulas
      const estudiantesIds = mockData.estudiantes
        .filter((e) => aulaIds.includes(e.aulaId))
        .map((e) => e.id);

      // Filtrar anotaciones de esos estudiantes
      const anotaciones = mockData.anotaciones
        .filter((a) => estudiantesIds.includes(a.estudianteId))
        .map((a) => {
          const estudiante = mockData.estudiantes.find(
            (e) => e.id === a.estudianteId
          );
          return {
            ...a,
            estudiante: estudiante
              ? `${estudiante.nombre} ${estudiante.apellidos}`
              : "Estudiante no encontrado",
            estudianteData: estudiante,
          };
        });

      return anotaciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    },
    enabled: !!trabajadorId,
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
    console.log("🎭 Demo: Eliminando anotación", id);
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
