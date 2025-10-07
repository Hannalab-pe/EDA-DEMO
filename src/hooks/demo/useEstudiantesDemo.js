import {
  useDemoQuery,
  useDemoMutation,
  createDemoQueryFn,
  createDemoMutationFn,
} from "./useDemoQuery";
import { mockData } from "../../data/mockData";

/**
 * Hook para obtener todos los estudiantes
 */
export const useEstudiantesDemo = (filters = {}) => {
  return useDemoQuery({
    queryKey: ["estudiantes", filters],
    queryFn: createDemoQueryFn("estudiantes", filters),
    defaultData: [],
  });
};

/**
 * Hook para obtener estudiantes por aula
 */
export const useEstudiantesPorAulaDemo = (aulaId) => {
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
 * Hook para obtener un estudiante por ID
 */
export const useEstudianteDemo = (estudianteId) => {
  return useDemoQuery({
    queryKey: ["estudiante", estudianteId],
    queryFn: async () => {
      const estudiante = mockData.estudiantes.find(
        (e) => e.id === estudianteId
      );
      if (!estudiante) {
        throw new Error("Estudiante no encontrado");
      }
      return estudiante;
    },
    enabled: !!estudianteId,
    defaultData: null,
  });
};

/**
 * Hook para crear estudiante
 */
export const useCrearEstudianteDemo = () => {
  return useDemoMutation({
    mutationFn: createDemoMutationFn("create", "estudiantes"),
    onSuccess: (data) => {
      console.log("🎭 Demo: Estudiante creado exitosamente", data);
    },
  });
};

/**
 * Hook para actualizar estudiante
 */
export const useActualizarEstudianteDemo = () => {
  return useDemoMutation({
    mutationFn: createDemoMutationFn("update", "estudiantes"),
    onSuccess: (data) => {
      console.log("🎭 Demo: Estudiante actualizado exitosamente", data);
    },
  });
};

/**
 * Hook para eliminar estudiante
 */
export const useEliminarEstudianteDemo = () => {
  return useDemoMutation({
    mutationFn: createDemoMutationFn("delete", "estudiantes"),
    onSuccess: (data) => {
      console.log("🎭 Demo: Estudiante eliminado exitosamente", data);
    },
  });
};

/**
 * Hook para obtener estudiantes de un profesor (mis estudiantes)
 */
export const useMisEstudiantesDemo = (profesorId) => {
  return useDemoQuery({
    queryKey: ["mis-estudiantes", profesorId],
    queryFn: async () => {
      // Obtener aulas del profesor
      const aulasProfesor = mockData.aulas.filter(
        (aula) => aula.docenteId === profesorId
      );
      const aulaIds = aulasProfesor.map((a) => a.id);

      // Obtener estudiantes de esas aulas
      const estudiantes = mockData.estudiantes.filter((e) =>
        aulaIds.includes(e.aulaId)
      );

      // Calcular estadísticas
      const totalEstudiantes = estudiantes.length;
      const totalAulas = aulasProfesor.length;
      const promedioEdad =
        totalEstudiantes > 0
          ? Math.round(
              estudiantes.reduce((sum, e) => {
                const edad =
                  new Date().getFullYear() -
                  new Date(e.fechaNacimiento).getFullYear();
                return sum + edad;
              }, 0) / totalEstudiantes
            )
          : 0;

      return {
        estudiantes: estudiantes.map((estudiante) => ({
          ...estudiante,
          aula: aulasProfesor.find((a) => a.id === estudiante.aulaId),
          grado: mockData.grados.find((g) => g.id === estudiante.gradoId),
          edad:
            new Date().getFullYear() -
            new Date(estudiante.fechaNacimiento).getFullYear(),
        })),
        aulas: aulasProfesor.map((aula) => ({
          ...aula,
          grado: mockData.grados.find((g) => g.id === aula.gradoId),
          cantidadEstudiantes: estudiantes.filter((e) => e.aulaId === aula.id)
            .length,
        })),
        statistics: {
          totalEstudiantes,
          totalAulas,
          promedioEdad,
          estudiantesPorAula:
            totalAulas > 0 ? Math.round(totalEstudiantes / totalAulas) : 0,
        },
      };
    },
    enabled: !!profesorId,
    defaultData: { estudiantes: [], aulas: [], statistics: {} },
  });
};
