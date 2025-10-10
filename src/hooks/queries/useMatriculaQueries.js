// src/hooks/queries/useMatriculaQueries.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { demoMatriculaService } from "../../services/demoMatriculaService";

// Query keys para matrícula
export const matriculaKeys = {
  all: ["matriculas"],
  lists: () => [...matriculaKeys.all, "list"],
  list: (filters) => [...matriculaKeys.lists(), { filters }],
  details: () => [...matriculaKeys.all, "detail"],
  detail: (id) => [...matriculaKeys.details(), id],
  // stats: () => [...matriculaKeys.all, 'stats'], // Comentado - endpoint no existe
};

// Hook para obtener lista de matrículas
export const useMatriculas = (filters = {}) => {
  // Normalizar filtros para evitar queries innecesarias
  const normalizedFilters = Object.keys(filters).reduce((acc, key) => {
    if (filters[key] && filters[key] !== "" && filters[key] !== "all") {
      acc[key] = filters[key];
    }
    return acc;
  }, {});

  return useQuery({
    queryKey: matriculaKeys.list(normalizedFilters),
    queryFn: () => {
      console.log("🔄 useMatriculas - Ejecutando queryFn...");
      return demoMatriculaService.getMatriculas(normalizedFilters);
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false, // No refetch al montar si hay datos en cache
    retry: 2,
    select: (data) => {
      if (data?.data && Array.isArray(data.data)) {
        return data.data;
      } else if (Array.isArray(data)) {
        return data;
      } else {
        return [];
      }
    },
  });
};

// Hook para obtener una matrícula por ID
export const useMatricula = (id) => {
  return useQuery({
    queryKey: matriculaKeys.detail(id),
    queryFn: () => demoMatriculaService.getMatriculaById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook para crear matrícula
export const useCreateMatricula = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (matriculaData) => {
      // Preparar datos finales (sin Cloudinary, voucher como string simple)
      const finalData = {
        ...matriculaData,
        voucherImagen: matriculaData.voucherImagen || "",
      };

      return demoMatriculaService.createMatricula(finalData);
    },
    onSuccess: (newMatricula) => {
      // Invalidar y refetch de las listas
      queryClient.invalidateQueries({ queryKey: matriculaKeys.lists() });

      toast.success("¡Matrícula creada exitosamente!", {
        description: `La matrícula ha sido registrada en el sistema`,
      });
    },
    onError: (error) => {
      toast.error("Error al crear matrícula", {
        description: error.message || "Ocurrió un error inesperado",
      });
    },
  });
};

// Hook para actualizar matrícula
export const useUpdateMatricula = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...matriculaData }) => {
      // Preparar datos actualizados (sin Cloudinary)
      const finalData = {
        ...matriculaData,
        voucherImagen: matriculaData.voucherImagen || "",
      };

      return demoMatriculaService.updateMatricula(id, finalData);
    },
    onSuccess: (updatedMatricula, { id }) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: matriculaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: matriculaKeys.detail(id) });

      toast.success("Matrícula actualizada exitosamente", {
        description: "Los datos de la matrícula han sido actualizados",
      });
    },
    onError: (error) => {
      toast.error("Error al actualizar matrícula", {
        description: error.message || "Ocurrió un error inesperado",
      });
    },
  });
};

// Hook para eliminar matrícula
export const useDeleteMatricula = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: demoMatriculaService.deleteMatricula,
    onSuccess: (deletedId) => {
      // Invalidar listas
      queryClient.invalidateQueries({ queryKey: matriculaKeys.lists() });

      toast.success("Matrícula eliminada exitosamente", {
        description: "El registro ha sido eliminado del sistema",
      });
    },
    onError: (error) => {
      toast.error("Error al eliminar matrícula", {
        description: error.message || "Ocurrió un error inesperado",
      });
    },
  });
};

// Hook para cambiar estado de matrícula
export const useToggleMatriculaStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: demoMatriculaService.toggleMatriculaStatus,
    onSuccess: (updatedMatricula) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: matriculaKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: matriculaKeys.detail(updatedMatricula.idMatricula),
      });

      const newStatus =
        updatedMatricula.estado === "activo" ? "activada" : "desactivada";
      toast.success(`¡Matrícula ${newStatus} exitosamente!`, {
        description: `La matrícula ha sido ${newStatus}`,
      });
    },
    onError: (error) => {
      toast.error("Error al cambiar estado de la matrícula", {
        description: error.message || "Ocurrió un error inesperado",
      });
    },
  });
};

// Hook para importar datos (DEMO - no funcional)
export const useImportMatriculas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      // Simulación de importación sin funcionalidad real
      return Promise.resolve({ imported: 0, success: 0 });
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: matriculaKeys.all });

      toast.info("Función no disponible en modo demo", {
        description:
          "La importación de datos no está habilitada en la versión de demostración",
      });
    },
    onError: (error) => {
      toast.error("Error al importar datos", {
        description: error.message || "Ocurrió un error durante la importación",
      });
    },
  });
};

// Hook para exportar datos (DEMO - no funcional)
export const useExportMatriculas = () => {
  return useMutation({
    mutationFn: () => {
      // Simulación de exportación sin funcionalidad real
      return Promise.resolve(new Blob());
    },
    onSuccess: () => {
      toast.info("Función no disponible en modo demo", {
        description:
          "La exportación de datos no está habilitada en la versión de demostración",
      });
    },
    onError: (error) => {
      toast.error("Error al exportar datos", {
        description: error.message || "Ocurrió un error durante la exportación",
      });
    },
  });
};
