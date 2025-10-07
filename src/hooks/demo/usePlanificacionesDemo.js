import {
  useDemoQuery,
  useDemoMutation,
  createDemoQueryFn,
  createDemoMutationFn,
} from "./useDemoQuery";
import { mockData } from "../../data/mockData";

/**
 * Hook para obtener planificaciones
 */
export const usePlanificacionesDemo = (filters = {}) => {
  return useDemoQuery({
    queryKey: ["planificaciones", filters],
    queryFn: createDemoQueryFn("planificaciones", filters),
    defaultData: [],
  });
};

/**
 * Hook para obtener planificaciones por trabajador/docente
 */
export const usePlanificacionesTrabajadorDemo = (trabajadorId) => {
  return useDemoQuery({
    queryKey: ["planificaciones", "trabajador", trabajadorId],
    queryFn: async () => {
      const planificaciones = mockData.planificaciones
        .filter((p) => p.docenteId === trabajadorId)
        .map((p) => {
          const aula = mockData.aulas.find((a) => a.id === p.aulaId);
          const grado = mockData.grados.find((g) => g.id === p.gradoId);
          return {
            ...p,
            aulaInfo: aula,
            gradoInfo: grado,
            aula: aula?.nombre || "Aula no encontrada",
            grado: grado?.nombre || "Grado no encontrado",
          };
        });

      return planificaciones.sort(
        (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
      );
    },
    enabled: !!trabajadorId,
    defaultData: [],
  });
};

/**
 * Hook para obtener planificaciones por docente
 */
export const usePlanificacionesPorDocenteDemo = (docenteId) => {
  return useDemoQuery({
    queryKey: ["planificaciones", "docente", docenteId],
    queryFn: async () => {
      const planificaciones = mockData.planificaciones
        .filter((p) => p.docenteId === docenteId)
        .map((p) => {
          const aula = mockData.aulas.find((a) => a.id === p.aulaId);
          const grado = mockData.grados.find((g) => g.id === p.gradoId);
          return {
            ...p,
            aula: aula?.nombre || "Aula no encontrada",
            grado: grado?.nombre || "Grado no encontrado",
          };
        });

      return planificaciones.sort(
        (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
      );
    },
    enabled: !!docenteId,
    defaultData: [],
  });
};

/**
 * Hook para obtener planificaciones por aula
 */
export const usePlanificacionesPorAulaDemo = (aulaId) => {
  return useDemoQuery({
    queryKey: ["planificaciones", "aula", aulaId],
    queryFn: async () => {
      const planificaciones = mockData.planificaciones
        .filter((p) => p.aulaId === aulaId)
        .map((p) => {
          const docente = mockData.trabajadores.find(
            (t) => t.id === p.docenteId
          );
          return {
            ...p,
            docente: docente
              ? `${docente.nombre} ${docente.apellidos}`
              : "Docente no encontrado",
          };
        });

      return planificaciones.sort(
        (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
      );
    },
    enabled: !!aulaId,
    defaultData: [],
  });
};

/**
 * Hook para obtener planificaciones por grado
 */
export const usePlanificacionesPorGradoDemo = (gradoId) => {
  return useDemoQuery({
    queryKey: ["planificaciones", "grado", gradoId],
    queryFn: async () => {
      const planificaciones = mockData.planificaciones
        .filter((p) => p.gradoId === gradoId)
        .map((p) => {
          const docente = mockData.trabajadores.find(
            (t) => t.id === p.docenteId
          );
          const aula = mockData.aulas.find((a) => a.id === p.aulaId);
          return {
            ...p,
            docente: docente
              ? `${docente.nombre} ${docente.apellidos}`
              : "Docente no encontrado",
            aula: aula?.nombre || "Aula no encontrada",
          };
        });

      return planificaciones.sort(
        (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
      );
    },
    enabled: !!gradoId,
    defaultData: [],
  });
};

/**
 * Hook para obtener planificaciones por materia
 */
export const usePlanificacionesPorMateriaDemo = (materia) => {
  return useDemoQuery({
    queryKey: ["planificaciones", "materia", materia],
    queryFn: async () => {
      const planificaciones = mockData.planificaciones
        .filter((p) => p.materia === materia)
        .map((p) => {
          const docente = mockData.trabajadores.find(
            (t) => t.id === p.docenteId
          );
          const aula = mockData.aulas.find((a) => a.id === p.aulaId);
          const grado = mockData.grados.find((g) => g.id === p.gradoId);
          return {
            ...p,
            docente: docente
              ? `${docente.nombre} ${docente.apellidos}`
              : "Docente no encontrado",
            aula: aula?.nombre || "Aula no encontrada",
            grado: grado?.nombre || "Grado no encontrado",
          };
        });

      return planificaciones.sort(
        (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
      );
    },
    enabled: !!materia,
    defaultData: [],
  });
};

/**
 * Hook para obtener planificación detallada
 */
export const usePlanificacionDetalleDemo = (planificacionId) => {
  return useDemoQuery({
    queryKey: ["planificacion", "detalle", planificacionId],
    queryFn: async () => {
      const planificacion = mockData.planificaciones.find(
        (p) => p.id === planificacionId
      );

      if (!planificacion) {
        return null;
      }

      const docente = mockData.trabajadores.find(
        (t) => t.id === planificacion.docenteId
      );
      const aula = mockData.aulas.find((a) => a.id === planificacion.aulaId);
      const grado = mockData.grados.find((g) => g.id === planificacion.gradoId);

      // Simular contenido detallado de la planificación
      return {
        ...planificacion,
        docente: docente
          ? `${docente.nombre} ${docente.apellidos}`
          : "Docente no encontrado",
        aula: aula?.nombre || "Aula no encontrada",
        grado: grado?.nombre || "Grado no encontrado",
        // Contenido expandido para demo
        objetivos: [
          "Desarrollar habilidades de comprensión lectora",
          "Fomentar el pensamiento crítico",
          "Mejorar la expresión oral y escrita",
        ],
        actividades: [
          {
            orden: 1,
            descripcion: "Lectura dirigida del texto",
            duracion: "15 min",
          },
          {
            orden: 2,
            descripcion: "Discusión grupal sobre el tema",
            duracion: "20 min",
          },
          {
            orden: 3,
            descripcion: "Actividad práctica individual",
            duracion: "15 min",
          },
        ],
        recursos: [
          "Libro de texto",
          "Pizarra",
          "Fichas de trabajo",
          "Material audiovisual",
        ],
        evaluacion: {
          criterios: ["Participación", "Comprensión", "Expresión"],
          instrumentos: ["Observación directa", "Rúbrica", "Lista de cotejo"],
        },
      };
    },
    enabled: !!planificacionId,
    defaultData: null,
  });
};

/**
 * Hook para crear planificación
 */
export const useCrearPlanificacionDemo = () => {
  return useDemoMutation({
    mutationFn: async (planificacionData) => {
      const nuevaPlanificacion = {
        id: Date.now().toString(),
        ...planificacionData,
        fechaCreacion: new Date().toISOString(),
        estado: "ACTIVO",
        version: "1.0",
      };
      console.log("🎭 Demo: Creando planificación", nuevaPlanificacion);
      return nuevaPlanificacion;
    },
    onSuccess: (data) => {
      console.log("🎭 Demo: Planificación creada exitosamente", data);
    },
  });
};

/**
 * Hook para actualizar planificación
 */
export const useActualizarPlanificacionDemo = () => {
  return useDemoMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const planificacionActualizada = {
        id,
        ...updateData,
        fechaModificacion: new Date().toISOString(),
        version: "1.1", // Simular versioning
      };
      console.log(
        "🎭 Demo: Actualizando planificación",
        planificacionActualizada
      );
      return planificacionActualizada;
    },
    onSuccess: (data) => {
      console.log("🎭 Demo: Planificación actualizada exitosamente", data);
    },
  });
};

/**
 * Hook para eliminar planificación
 */
export const useEliminarPlanificacionDemo = () => {
  return useDemoMutation({
    mutationFn: createDemoMutationFn("delete", "planificaciones"),
    onSuccess: (data) => {
      console.log("🎭 Demo: Planificación eliminada exitosamente", data);
    },
  });
};

/**
 * Hook para duplicar planificación
 */
export const useDuplicarPlanificacionDemo = () => {
  return useDemoMutation({
    mutationFn: async (planificacionId) => {
      const planificacionOriginal = mockData.planificaciones.find(
        (p) => p.id === planificacionId
      );

      if (!planificacionOriginal) {
        throw new Error("Planificación no encontrada");
      }

      const planificacionDuplicada = {
        ...planificacionOriginal,
        id: Date.now().toString(),
        titulo: `${planificacionOriginal.titulo} (Copia)`,
        fechaCreacion: new Date().toISOString(),
        version: "1.0",
      };

      console.log("🎭 Demo: Duplicando planificación", planificacionDuplicada);
      return planificacionDuplicada;
    },
    onSuccess: (data) => {
      console.log("🎭 Demo: Planificación duplicada exitosamente", data);
    },
  });
};

/**
 * Hook para obtener cronograma de planificaciones
 */
export const useCronogramaPlanificacionesDemo = (filtros = {}) => {
  return useDemoQuery({
    queryKey: ["cronograma", "planificaciones", filtros],
    queryFn: async () => {
      let planificaciones = mockData.planificaciones;

      // Aplicar filtros
      if (filtros.docenteId) {
        planificaciones = planificaciones.filter(
          (p) => p.docenteId === filtros.docenteId
        );
      }

      if (filtros.aulaId) {
        planificaciones = planificaciones.filter(
          (p) => p.aulaId === filtros.aulaId
        );
      }

      if (filtros.gradoId) {
        planificaciones = planificaciones.filter(
          (p) => p.gradoId === filtros.gradoId
        );
      }

      // Agrupar por semana
      const cronograma = planificaciones.reduce((acc, planificacion) => {
        const fecha = new Date(planificacion.fechaClase);
        const semana = getWeekKey(fecha);

        if (!acc[semana]) {
          acc[semana] = [];
        }

        acc[semana].push({
          ...planificacion,
          diaSemana: fecha.toLocaleDateString("es-ES", { weekday: "long" }),
          hora: planificacion.hora || "08:00",
        });

        return acc;
      }, {});

      // Ordenar cada semana por día y hora
      Object.keys(cronograma).forEach((semana) => {
        cronograma[semana].sort((a, b) => {
          const fechaA = new Date(`${a.fechaClase} ${a.hora}`);
          const fechaB = new Date(`${b.fechaClase} ${b.hora}`);
          return fechaA - fechaB;
        });
      });

      return cronograma;
    },
    defaultData: {},
  });
};

/**
 * Hook para estadísticas de planificaciones
 */
export const useEstadisticasPlanificacionesDemo = (filtros = {}) => {
  return useDemoQuery({
    queryKey: ["planificaciones", "estadisticas", filtros],
    queryFn: async () => {
      let planificaciones = mockData.planificaciones;

      // Aplicar filtros
      if (filtros.docenteId) {
        planificaciones = planificaciones.filter(
          (p) => p.docenteId === filtros.docenteId
        );
      }

      if (filtros.gradoId) {
        planificaciones = planificaciones.filter(
          (p) => p.gradoId === filtros.gradoId
        );
      }

      // Calcular estadísticas
      const total = planificaciones.length;
      const porEstado = planificaciones.reduce((acc, p) => {
        acc[p.estado] = (acc[p.estado] || 0) + 1;
        return acc;
      }, {});

      const porMateria = planificaciones.reduce((acc, p) => {
        acc[p.materia] = (acc[p.materia] || 0) + 1;
        return acc;
      }, {});

      const porDocente = planificaciones.reduce((acc, p) => {
        const docente = mockData.trabajadores.find((t) => t.id === p.docenteId);
        const nombreDocente = docente
          ? `${docente.nombre} ${docente.apellidos}`
          : "Desconocido";
        acc[nombreDocente] = (acc[nombreDocente] || 0) + 1;
        return acc;
      }, {});

      // Planificaciones por mes
      const porMes = planificaciones.reduce((acc, p) => {
        const mes = new Date(p.fechaClase).toISOString().slice(0, 7);
        acc[mes] = (acc[mes] || 0) + 1;
        return acc;
      }, {});

      return {
        total,
        porEstado,
        porMateria,
        porDocente,
        porMes,
      };
    },
    defaultData: {
      total: 0,
      porEstado: {},
      porMateria: {},
      porDocente: {},
      porMes: {},
    },
  });
};

// Función auxiliar para obtener la clave de la semana
function getWeekKey(date) {
  const week = new Date(date);
  const day = week.getDay();
  const diff = week.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que lunes sea el primer día
  week.setDate(diff);
  return week.toISOString().slice(0, 10); // YYYY-MM-DD del lunes de la semana
}
