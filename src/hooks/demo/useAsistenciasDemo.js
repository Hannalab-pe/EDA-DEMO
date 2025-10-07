import {
  useDemoQuery,
  useDemoMutation,
  createDemoQueryFn,
  createDemoMutationFn,
} from "./useDemoQuery";
import { mockData } from "../../data/mockData";

/**
 * Hook para obtener asistencias
 */
export const useAsistenciasDemo = (filters = {}) => {
  return useDemoQuery({
    queryKey: ["asistencias", filters],
    queryFn: createDemoQueryFn("asistencias", filters),
    defaultData: [],
  });
};

/**
 * Hook para obtener asistencias por estudiante
 */
export const useAsistenciasPorEstudianteDemo = (
  estudianteId,
  fechaInicio,
  fechaFin
) => {
  return useDemoQuery({
    queryKey: [
      "asistencias",
      "estudiante",
      estudianteId,
      fechaInicio,
      fechaFin,
    ],
    queryFn: async () => {
      let asistencias = mockData.asistencias.filter(
        (a) => a.estudianteId === estudianteId
      );

      if (fechaInicio) {
        asistencias = asistencias.filter((a) => a.fecha >= fechaInicio);
      }

      if (fechaFin) {
        asistencias = asistencias.filter((a) => a.fecha <= fechaFin);
      }

      return asistencias;
    },
    enabled: !!estudianteId,
    defaultData: [],
  });
};

/**
 * Hook para obtener asistencias por aula
 */
export const useAsistenciasPorAulaDemo = (aulaId, fecha) => {
  return useDemoQuery({
    queryKey: ["asistencias", "aula", aulaId, fecha],
    queryFn: async () => {
      // Obtener estudiantes del aula
      const estudiantesAula = mockData.estudiantes.filter(
        (e) => e.aulaId === aulaId
      );
      const estudiantesIds = estudiantesAula.map((e) => e.id);

      // Filtrar asistencias por estudiantes del aula y fecha
      let asistencias = mockData.asistencias.filter((a) =>
        estudiantesIds.includes(a.estudianteId)
      );

      if (fecha) {
        asistencias = asistencias.filter((a) => a.fecha === fecha);
      }

      // Combinar con datos de estudiantes
      return asistencias.map((asistencia) => ({
        ...asistencia,
        estudiante: estudiantesAula.find(
          (e) => e.id === asistencia.estudianteId
        ),
      }));
    },
    enabled: !!aulaId,
    defaultData: [],
  });
};

/**
 * Hook para registrar asistencia
 */
export const useRegistrarAsistenciaDemo = () => {
  return useDemoMutation({
    mutationFn: async (asistenciaData) => {
      const nuevaAsistencia = {
        id: Date.now().toString(),
        ...asistenciaData,
        fecha: asistenciaData.fecha || new Date().toISOString().split("T")[0],
        registradoPor: asistenciaData.registradoPor || "2", // ID del docente demo
      };
      console.log("🎭 Demo: Registrando asistencia", nuevaAsistencia);
      return nuevaAsistencia;
    },
    onSuccess: (data) => {
      console.log("🎭 Demo: Asistencia registrada exitosamente", data);
    },
  });
};

/**
 * Hook para actualizar asistencia
 */
export const useActualizarAsistenciaDemo = () => {
  return useDemoMutation({
    mutationFn: createDemoMutationFn("update", "asistencias"),
    onSuccess: (data) => {
      console.log("🎭 Demo: Asistencia actualizada exitosamente", data);
    },
  });
};

/**
 * Hook para gestión de asistencia del profesor (equivalente a useAsistenciaProfesor)
 */
export const useAsistenciaProfesorDemo = () => {
  // Obtener aulas del profesor desde mock data
  const aulas = mockData.aulas.filter((aula) => aula.docenteId === "2"); // Carlos Ruiz

  return {
    aulas: aulas.map((aula) => ({
      ...aula,
      id_aula: aula.id,
      grado:
        mockData.grados.find((g) => g.id === aula.gradoId)?.nombre ||
        "Sin grado",
    })),
    loadingAulas: false,
    errorAulas: null,
    registrarAsistencia: async (datos) => {
      console.log("🎭 Demo: Registrando asistencia", datos);
      return { success: true };
    },
    loadingRegistro: false,
    tieneAulas: aulas.length > 0,
  };
};

/**
 * Hook para obtener estudiantes de un aula (equivalente a useEstudiantesAula)
 */
export const useEstudiantesAulaDemo = (aulaId) => {
  return useDemoQuery({
    queryKey: ["estudiantes", "aula", aulaId],
    queryFn: async () => {
      const estudiantes = mockData.estudiantes.filter(
        (e) => e.aulaId === aulaId
      );
      return estudiantes;
    },
    enabled: !!aulaId,
    defaultData: [],
  });
};

/**
 * Hook para obtener asistencias por aula y fecha (equivalente a useAsistenciasPorAulaYFecha)
 */
export const useAsistenciasPorAulaYFechaDemo = (aulaId, fecha) => {
  return useDemoQuery({
    queryKey: ["asistencias", "aula-fecha", aulaId, fecha],
    queryFn: async () => {
      // Obtener estudiantes del aula
      const estudiantesAula = mockData.estudiantes.filter(
        (e) => e.aulaId === aulaId
      );

      // Simular asistencias para esa fecha
      return estudiantesAula.map((estudiante) => ({
        id: `${estudiante.id}-${fecha}`,
        estudianteId: estudiante.id,
        fecha: fecha,
        estado: Math.random() > 0.2 ? "PRESENTE" : "AUSENTE", // 80% presente
        observaciones: "",
        estudiante: estudiante,
      }));
    },
    enabled: !!aulaId && !!fecha,
    defaultData: [],
  });
};

/**
 * Hook para obtener estadísticas de asistencia
 */
export const useEstadisticasAsistenciaDemo = (aulaId, periodo = "mes") => {
  return useDemoQuery({
    queryKey: ["estadisticas", "asistencia", aulaId, periodo],
    queryFn: async () => {
      const today = new Date();
      const fechaInicio = new Date(today.getFullYear(), today.getMonth(), 1);
      const fechaFin = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      // Simular estadísticas
      const estadisticas = {
        totalClases: 20,
        promedioAsistencia: 85.5,
        estudiantesPresentes: 12,
        estudiantesAusentes: 3,
        estudiantesTotales: 15,
        tendencia: "estable",
        porDias: [
          { dia: "Lunes", presente: 14, ausente: 1 },
          { dia: "Martes", presente: 13, ausente: 2 },
          { dia: "Miércoles", presente: 15, ausente: 0 },
          { dia: "Jueves", presente: 12, ausente: 3 },
          { dia: "Viernes", presente: 14, ausente: 1 },
        ],
      };

      return estadisticas;
    },
    enabled: !!aulaId,
    defaultData: {},
  });
};
