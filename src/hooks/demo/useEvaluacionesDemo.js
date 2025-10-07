import {
  useDemoQuery,
  useDemoMutation,
  createDemoQueryFn,
  createDemoMutationFn,
} from "./useDemoQuery";
import { mockData } from "../../data/mockData";

/**
 * Hook para obtener evaluaciones de un profesor específico
 */
export const useEvaluacionesProfesorDemo = (profesorId) => {
  return useDemoQuery({
    queryKey: ["evaluaciones", "profesor", profesorId],
    queryFn: async () => {
      // Simular evaluaciones del profesor Carlos Ruiz (ID: 2)
      const evaluaciones = [
        {
          id: "1",
          profesorId: "2",
          motivo: "Evaluación de desempeño docente - Primer bimestre",
          fechaCreacion: "2024-09-15",
          fechaEvaluacion: "2024-09-20",
          estado: "COMPLETADA",
          puntaje: 18.5,
          puntajeMaximo: 20,
          coordinador: {
            id: "1",
            nombre: "María",
            apellido: "González",
            cargo: "Coordinadora Académica",
          },
          areas: [
            {
              nombre: "Planificación de clases",
              puntaje: 4.5,
              puntajeMaximo: 5,
            },
            {
              nombre: "Metodología de enseñanza",
              puntaje: 4.7,
              puntajeMaximo: 5,
            },
            { nombre: "Manejo del aula", puntaje: 4.3, puntajeMaximo: 5 },
            {
              nombre: "Evaluación estudiantil",
              puntaje: 5.0,
              puntajeMaximo: 5,
            },
          ],
          observaciones:
            "Excelente desempeño en el aula. Maneja muy bien la metodología lúdica apropiada para la edad.",
          recomendaciones:
            "Continuar con la innovación en actividades didácticas.",
          archivoUrl: null,
        },
        {
          id: "2",
          profesorId: "2",
          motivo: "Evaluación de integración curricular",
          fechaCreacion: "2024-08-10",
          fechaEvaluacion: "2024-08-15",
          estado: "COMPLETADA",
          puntaje: 17.2,
          puntajeMaximo: 20,
          coordinador: {
            id: "1",
            nombre: "María",
            apellido: "González",
            cargo: "Coordinadora Académica",
          },
          areas: [
            {
              nombre: "Integración de materias",
              puntaje: 4.2,
              puntajeMaximo: 5,
            },
            {
              nombre: "Uso de recursos didácticos",
              puntaje: 4.5,
              puntajeMaximo: 5,
            },
            {
              nombre: "Comunicación con padres",
              puntaje: 4.0,
              puntajeMaximo: 5,
            },
            {
              nombre: "Seguimiento individual",
              puntaje: 4.5,
              puntajeMaximo: 5,
            },
          ],
          observaciones:
            "Muy buen trabajo en la integración de actividades. Los padres destacan la comunicación fluida.",
          recomendaciones: "Fortalecer el uso de tecnología educativa.",
          archivoUrl: null,
        },
      ];

      return evaluaciones.filter((e) => e.profesorId === profesorId);
    },
    enabled: !!profesorId,
    defaultData: [],
  });
};

/**
 * Hook para obtener evaluaciones
 */
export const useEvaluacionesDemo = (filters = {}) => {
  return useDemoQuery({
    queryKey: ["evaluaciones", filters],
    queryFn: createDemoQueryFn("evaluaciones", filters),
    defaultData: [],
  });
};

/**
 * Hook para obtener evaluaciones por estudiante
 */
export const useEvaluacionesPorEstudianteDemo = (estudianteId) => {
  return useDemoQuery({
    queryKey: ["evaluaciones", "estudiante", estudianteId],
    queryFn: async () => {
      const evaluaciones = mockData.evaluaciones
        .filter((e) => e.estudianteId === estudianteId)
        .map((e) => {
          const docente = mockData.trabajadores.find(
            (t) => t.id === e.docenteId
          );
          return {
            ...e,
            docente: docente
              ? `${docente.nombre} ${docente.apellidos}`
              : "Docente no encontrado",
          };
        });

      return evaluaciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    },
    enabled: !!estudianteId,
    defaultData: [],
  });
};

/**
 * Hook para obtener evaluaciones por aula
 */
export const useEvaluacionesPorAulaDemo = (aulaId, periodo = null) => {
  return useDemoQuery({
    queryKey: ["evaluaciones", "aula", aulaId, periodo],
    queryFn: async () => {
      // Obtener estudiantes del aula
      const estudiantesAula = mockData.estudiantes
        .filter((e) => e.aulaId === aulaId)
        .map((e) => e.id);

      let evaluaciones = mockData.evaluaciones.filter((e) =>
        estudiantesAula.includes(e.estudianteId)
      );

      // Filtrar por período si se especifica
      if (periodo) {
        evaluaciones = evaluaciones.filter((e) => e.periodo === periodo);
      }

      // Agregar información del estudiante
      return evaluaciones
        .map((e) => {
          const estudiante = mockData.estudiantes.find(
            (est) => est.id === e.estudianteId
          );
          return {
            ...e,
            estudiante: estudiante
              ? `${estudiante.nombre} ${estudiante.apellidos}`
              : "Estudiante no encontrado",
          };
        })
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    },
    enabled: !!aulaId,
    defaultData: [],
  });
};

/**
 * Hook para obtener evaluaciones por docente
 */
export const useEvaluacionesPorDocenteDemo = (docenteId, periodo = null) => {
  return useDemoQuery({
    queryKey: ["evaluaciones", "docente", docenteId, periodo],
    queryFn: async () => {
      let evaluaciones = mockData.evaluaciones.filter(
        (e) => e.docenteId === docenteId
      );

      // Filtrar por período si se especifica
      if (periodo) {
        evaluaciones = evaluaciones.filter((e) => e.periodo === periodo);
      }

      // Agregar información del estudiante
      return evaluaciones
        .map((e) => {
          const estudiante = mockData.estudiantes.find(
            (est) => est.id === e.estudianteId
          );
          return {
            ...e,
            estudiante: estudiante
              ? `${estudiante.nombre} ${estudiante.apellidos}`
              : "Estudiante no encontrado",
          };
        })
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    },
    enabled: !!docenteId,
    defaultData: [],
  });
};

/**
 * Hook para obtener boletín de notas
 */
export const useBoletinNotasDemo = (estudianteId, periodo) => {
  return useDemoQuery({
    queryKey: ["boletin", estudianteId, periodo],
    queryFn: async () => {
      const evaluaciones = mockData.evaluaciones.filter(
        (e) => e.estudianteId === estudianteId && e.periodo === periodo
      );

      // Agrupar por materia
      const materias = evaluaciones.reduce((acc, evaluacion) => {
        if (!acc[evaluacion.materia]) {
          acc[evaluacion.materia] = [];
        }
        acc[evaluacion.materia].push(evaluacion);
        return acc;
      }, {});

      // Calcular promedio por materia
      const boletinData = Object.entries(materias).map(
        ([materia, evaluacionesMateria]) => {
          const notas = evaluacionesMateria
            .map((e) => parseFloat(e.calificacion))
            .filter((n) => !isNaN(n));
          const promedio =
            notas.length > 0
              ? (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1)
              : "0.0";

          return {
            materia,
            evaluaciones: evaluacionesMateria.length,
            promedio: parseFloat(promedio),
            calificacionTexto: getCalificacionTexto(parseFloat(promedio)),
            detalle: evaluacionesMateria,
          };
        }
      );

      // Calcular promedio general
      const promedios = boletinData.map((m) => m.promedio).filter((p) => p > 0);
      const promedioGeneral =
        promedios.length > 0
          ? (promedios.reduce((a, b) => a + b, 0) / promedios.length).toFixed(1)
          : "0.0";

      return {
        estudianteId,
        periodo,
        materias: boletinData,
        promedioGeneral: parseFloat(promedioGeneral),
        calificacionGeneral: getCalificacionTexto(parseFloat(promedioGeneral)),
      };
    },
    enabled: !!estudianteId && !!periodo,
    defaultData: {
      estudianteId: null,
      periodo: null,
      materias: [],
      promedioGeneral: 0,
      calificacionGeneral: "C",
    },
  });
};

/**
 * Hook para crear evaluación
 */
export const useCrearEvaluacionDemo = () => {
  return useDemoMutation({
    mutationFn: async (evaluacionData) => {
      const nuevaEvaluacion = {
        id: Date.now().toString(),
        ...evaluacionData,
        fecha: new Date().toISOString(),
        año: new Date().getFullYear(),
      };
      console.log("🎭 Demo: Creando evaluación", nuevaEvaluacion);
      return nuevaEvaluacion;
    },
    onSuccess: (data) => {
      console.log("🎭 Demo: Evaluación creada exitosamente", data);
    },
  });
};

/**
 * Hook para actualizar evaluación
 */
export const useActualizarEvaluacionDemo = () => {
  return useDemoMutation({
    mutationFn: createDemoMutationFn("update", "evaluaciones"),
    onSuccess: (data) => {
      console.log("🎭 Demo: Evaluación actualizada exitosamente", data);
    },
  });
};

/**
 * Hook para eliminar evaluación
 */
export const useEliminarEvaluacionDemo = () => {
  return useDemoMutation({
    mutationFn: createDemoMutationFn("delete", "evaluaciones"),
    onSuccess: (data) => {
      console.log("🎭 Demo: Evaluación eliminada exitosamente", data);
    },
  });
};

/**
 * Hook para estadísticas de evaluaciones
 */
export const useEstadisticasEvaluacionesDemo = (filtros = {}) => {
  return useDemoQuery({
    queryKey: ["evaluaciones", "estadisticas", filtros],
    queryFn: async () => {
      let evaluaciones = mockData.evaluaciones;

      // Aplicar filtros
      if (filtros.aulaId) {
        const estudiantesAula = mockData.estudiantes
          .filter((e) => e.aulaId === filtros.aulaId)
          .map((e) => e.id);
        evaluaciones = evaluaciones.filter((e) =>
          estudiantesAula.includes(e.estudianteId)
        );
      }

      if (filtros.docenteId) {
        evaluaciones = evaluaciones.filter(
          (e) => e.docenteId === filtros.docenteId
        );
      }

      if (filtros.periodo) {
        evaluaciones = evaluaciones.filter(
          (e) => e.periodo === filtros.periodo
        );
      }

      // Calcular estadísticas
      const notas = evaluaciones
        .map((e) => parseFloat(e.calificacion))
        .filter((n) => !isNaN(n));

      const total = notas.length;
      const suma = notas.reduce((a, b) => a + b, 0);
      const promedio = total > 0 ? (suma / total).toFixed(1) : 0;

      // Distribución por calificaciones
      const excelentes = notas.filter((n) => n >= 18).length;
      const buenas = notas.filter((n) => n >= 14 && n < 18).length;
      const regulares = notas.filter((n) => n >= 11 && n < 14).length;
      const deficientes = notas.filter((n) => n < 11).length;

      // Por materia
      const porMateria = evaluaciones.reduce((acc, e) => {
        const nota = parseFloat(e.calificacion);
        if (!isNaN(nota)) {
          if (!acc[e.materia]) {
            acc[e.materia] = { suma: 0, count: 0 };
          }
          acc[e.materia].suma += nota;
          acc[e.materia].count += 1;
        }
        return acc;
      }, {});

      const promediosPorMateria = Object.entries(porMateria).map(
        ([materia, data]) => ({
          materia,
          promedio: (data.suma / data.count).toFixed(1),
          evaluaciones: data.count,
        })
      );

      return {
        total,
        promedio: parseFloat(promedio),
        distribucion: {
          excelentes,
          buenas,
          regulares,
          deficientes,
        },
        porMateria: promediosPorMateria,
      };
    },
    defaultData: {
      total: 0,
      promedio: 0,
      distribucion: {
        excelentes: 0,
        buenas: 0,
        regulares: 0,
        deficientes: 0,
      },
      porMateria: [],
    },
  });
};

// Función auxiliar para convertir nota numérica a texto
function getCalificacionTexto(nota) {
  if (nota >= 18) return "AD"; // Logro destacado
  if (nota >= 14) return "A"; // Logro esperado
  if (nota >= 11) return "B"; // En proceso
  return "C"; // En inicio
}
