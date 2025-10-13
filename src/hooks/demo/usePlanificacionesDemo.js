import {
  useDemoQuery,
  useDemoMutation,
  createDemoQueryFn,
  createDemoMutationFn,
} from "./useDemoQuery";
import { mockData } from "../../data/mockData";
import { planificacionesStore } from "../../store/planificacionesStore";

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
      console.log(
        "🎭 [PLANIFICACIONES DEMO] Generando planificaciones para trabajador:",
        trabajadorId
      );

      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Obtener planificaciones temporales del store
      const planificacionesTemporales =
        planificacionesStore.obtenerPlanificaciones();
      console.log(
        "📦 [STORE] Planificaciones temporales:",
        planificacionesTemporales.length
      );

      // Planificaciones ficticias base
      const planificacionesFicticias = [
        {
          idPlanificacion: "plan-1",
          titulo: "Unidad 1: Introducción a las Fracciones",
          descripcion:
            "Planificación completa para la introducción del concepto de fracciones, operaciones básicas y aplicaciones en la vida cotidiana.",
          fechaInicio: "2025-10-14",
          fechaFin: "2025-10-31",
          estado: "EN PROGRESO",
          curso: {
            idCurso: "1",
            nombreCurso: "Matemática",
          },
          grado: {
            idGrado: "4",
            nombreGrado: "4to Primaria",
          },
          bimestre: "III Bimestre",
          competencias: [
            "Resuelve problemas de cantidad",
            "Razona y argumenta",
          ],
          materias: ["Fracciones", "Operaciones", "Problemas"],
          sesiones: 12,
          sesionesCompletadas: 7,
          progreso: 58,
          docenteId: trabajadorId || "1",
        },
        {
          idPlanificacion: "plan-2",
          titulo: "Unidad 2: Comprensión Lectora Nivel Inferencial",
          descripcion:
            "Desarrollo de estrategias de comprensión lectora con enfoque en inferencias y pensamiento crítico mediante textos narrativos.",
          fechaInicio: "2025-10-07",
          fechaFin: "2025-10-28",
          estado: "EN PROGRESO",
          curso: {
            idCurso: "2",
            nombreCurso: "Comunicación",
          },
          grado: {
            idGrado: "4",
            nombreGrado: "4to Primaria",
          },
          bimestre: "III Bimestre",
          competencias: [
            "Lee diversos tipos de textos",
            "Se comunica oralmente",
          ],
          materias: ["Comprensión lectora", "Análisis", "Reflexión"],
          sesiones: 10,
          sesionesCompletadas: 6,
          progreso: 60,
          docenteId: trabajadorId || "1",
        },
        {
          idPlanificacion: "plan-3",
          titulo: "Unidad 3: Sistema Solar y Planetas",
          descripcion:
            "Exploración del sistema solar, características de los planetas y movimientos de la Tierra. Incluye experimentos prácticos.",
          fechaInicio: "2025-10-01",
          fechaFin: "2025-10-22",
          estado: "COMPLETADA",
          curso: {
            idCurso: "3",
            nombreCurso: "Ciencia y Tecnología",
          },
          grado: {
            idGrado: "4",
            nombreGrado: "4to Primaria",
          },
          bimestre: "III Bimestre",
          competencias: [
            "Explica el mundo físico",
            "Indaga mediante métodos científicos",
          ],
          materias: ["Astronomía", "Sistema Solar", "Experimentos"],
          sesiones: 8,
          sesionesCompletadas: 8,
          progreso: 100,
          docenteId: trabajadorId || "1",
        },
        {
          idPlanificacion: "plan-4",
          titulo: "Proyecto: Historia del Perú Antiguo",
          descripcion:
            "Proyecto integrador sobre las principales culturas preincas del Perú: Chavín, Moche, Nazca y sus aportes culturales.",
          fechaInicio: "2025-10-15",
          fechaFin: "2025-11-05",
          estado: "PLANIFICADA",
          curso: {
            idCurso: "4",
            nombreCurso: "Personal Social",
          },
          grado: {
            idGrado: "4",
            nombreGrado: "4to Primaria",
          },
          bimestre: "III Bimestre",
          competencias: [
            "Construye interpretaciones históricas",
            "Gestiona responsablemente el espacio",
          ],
          materias: ["Historia", "Culturas preincas", "Patrimonio"],
          sesiones: 15,
          sesionesCompletadas: 0,
          progreso: 0,
          docenteId: trabajadorId || "1",
        },
        {
          idPlanificacion: "plan-5",
          titulo: "Taller: Técnicas de Pintura y Color",
          descripcion:
            "Taller práctico de técnicas de pintura: acuarela, témpera y collage. Desarrollo de la creatividad y expresión artística.",
          fechaInicio: "2025-10-08",
          fechaFin: "2025-10-29",
          estado: "EN PROGRESO",
          curso: {
            idCurso: "5",
            nombreCurso: "Arte y Cultura",
          },
          grado: {
            idGrado: "4",
            nombreGrado: "4to Primaria",
          },
          bimestre: "III Bimestre",
          competencias: [
            "Crea proyectos artísticos",
            "Aprecia manifestaciones artístico-culturales",
          ],
          materias: ["Pintura", "Color", "Técnicas artísticas"],
          sesiones: 8,
          sesionesCompletadas: 4,
          progreso: 50,
          docenteId: trabajadorId || "1",
        },
      ];

      // Combinar: temporales primero (más recientes), luego ficticias
      const todasLasPlanificaciones = [
        ...planificacionesTemporales,
        ...planificacionesFicticias,
      ];

      console.log(
        "✅ [PLANIFICACIONES DEMO] Total:",
        todasLasPlanificaciones.length,
        "(Temporales:",
        planificacionesTemporales.length,
        "+ Base:",
        planificacionesFicticias.length,
        ")"
      );

      return todasLasPlanificaciones.sort(
        (a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio)
      );
    },
    enabled: !!trabajadorId,
    refetchOnMount: "always",
    staleTime: 0,
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
