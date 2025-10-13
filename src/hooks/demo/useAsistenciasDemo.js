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
  // En modo DEMO siempre retornamos aulas para que el profesor pueda ver el módulo
  // Obtener todas las aulas disponibles (no filtrar por docente en DEMO)
  const aulas = mockData.aulas.slice(0, 5); // Tomar las primeras 5 aulas para demo

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
      console.log("🎭 Demo: Registrando asistencia masiva", datos);
      // Simular delay de 500ms para feedback visual
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true };
    },
    loadingRegistro: false,
    tieneAulas: true, // Siempre true en DEMO
  };
};

/**
 * Hook para obtener estudiantes de un aula (equivalente a useEstudiantesAula)
 */
export const useEstudiantesAulaDemo = (aulaId) => {
  return useDemoQuery({
    queryKey: ["estudiantes", "aula", aulaId],
    queryFn: async () => {
      if (!aulaId) return [];

      // Filtrar estudiantes del aula
      const estudiantes = mockData.estudiantes.filter(
        (e) => e.aulaId === aulaId
      );

      // Si no hay estudiantes en mockData para esta aula, generar algunos ficticios
      if (estudiantes.length === 0) {
        const nombresDemo = [
          { nombres: "Juan Carlos", apellido: "Pérez González" },
          { nombres: "María Isabel", apellido: "López Martínez" },
          { nombres: "Pedro Luis", apellido: "Sánchez Torres" },
          { nombres: "Ana Sofía", apellido: "Ramírez Díaz" },
          { nombres: "Carlos Alberto", apellido: "García Fernández" },
          { nombres: "Lucía Elena", apellido: "Hernández Ruiz" },
          { nombres: "Miguel Ángel", apellido: "Morales Castro" },
          { nombres: "Valentina", apellido: "Vargas Mendoza" },
          { nombres: "Diego Alejandro", apellido: "Romero Silva" },
          { nombres: "Isabella", apellido: "Cruz Valdez" },
          { nombres: "Santiago", apellido: "Flores Paredes" },
          { nombres: "Camila", apellido: "Gutiérrez Vega" },
        ];

        return nombresDemo.map((est, idx) => ({
          id: `est-demo-${aulaId}-${idx + 1}`,
          id_estudiante: `est-demo-${aulaId}-${idx + 1}`,
          idEstudiante: `est-demo-${aulaId}-${idx + 1}`,
          nombres: est.nombres,
          apellido: est.apellido,
          apellido_paterno: est.apellido.split(" ")[0],
          apellido_materno: est.apellido.split(" ")[1] || "",
          aulaId: aulaId,
          codigo: `EST${String(idx + 1).padStart(3, "0")}`,
        }));
      }

      return estudiantes.map((e) => ({
        ...e,
        id_estudiante: e.id_estudiante || e.id,
        idEstudiante: e.idEstudiante || e.id,
      }));
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
      if (!aulaId || !fecha) return [];

      // En modo DEMO, retornar array vacío para que el profesor pueda registrar
      // Si se quiere simular asistencias previas, descomentar el código de abajo:

      /*
      // Obtener estudiantes del aula
      const estudiantesAula = mockData.estudiantes.filter(
        (e) => e.aulaId === aulaId
      );

      // Simular asistencias para esa fecha
      return estudiantesAula.map((estudiante) => ({
        id: `${estudiante.id}-${fecha}`,
        idEstudiante: estudiante.id,
        id_estudiante: estudiante.id,
        fecha: fecha,
        asistio: Math.random() > 0.2, // 80% presente
        observaciones: Math.random() > 0.5 ? "Presente" : "Tardanza",
        estudiante: estudiante,
      }));
      */

      // Retornar vacío para que el profesor registre desde cero
      return [];
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
