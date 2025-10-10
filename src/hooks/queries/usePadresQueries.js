// src/hooks/queries/usePadresQueries.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { demoPadresService } from "../../services/demoPadresService";

// Query keys para padres
export const padresKeys = {
  all: ["padres"],
  lists: () => [...padresKeys.all, "list"],
  list: (filters) => [...padresKeys.lists(), { filters }],
  details: () => [...padresKeys.all, "detail"],
  detail: (id) => [...padresKeys.details(), id],
};

// Hook para obtener lista de padres
export const usePadres = (filters = {}) => {
  return useQuery({
    queryKey: padresKeys.list(filters),
    queryFn: () => demoPadresService.getPadres(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

// Hook para obtener un padre por ID
export const usePadre = (id) => {
  return useQuery({
    queryKey: padresKeys.detail(id),
    queryFn: () => demoPadresService.getPadreById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook para crear padre
export const useCreatePadre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (padreData) => {
      // En demo, no subimos imágenes a Cloudinary
      const finalData = {
        ...padreData,
      };
      delete finalData.photoFile;

      return demoPadresService.createPadre(finalData);
    },
    onSuccess: (newPadre) => {
      // Invalidar y refetch de la lista de padres
      queryClient.invalidateQueries({ queryKey: padresKeys.lists() });

      toast.success("¡Padre/apoderado creado exitosamente!", {
        description: `${newPadre.nombre} ${newPadre.apellido} ha sido agregado al sistema`,
      });
    },
    onError: (error) => {
      toast.error("Error al crear padre/apoderado", {
        description: error.message || "Ocurrió un error inesperado",
      });
    },
  });
};

// Hook para actualizar padre
export const useUpdatePadre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...padreData }) => {
      // En demo, no subimos imágenes
      const finalData = {
        ...padreData,
      };
      delete finalData.photoFile;

      return demoPadresService.updatePadre({ id, ...finalData });
    },
    onSuccess: (updatedPadre, { id }) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: padresKeys.lists() });
      queryClient.invalidateQueries({ queryKey: padresKeys.detail(id) });

      // Mostrar mensaje de éxito
      const nombrePadre = updatedPadre?.nombre || "Padre/Apoderado";
      const apellidoPadre = updatedPadre?.apellido || "";
      const nombreCompleto = apellidoPadre
        ? `${nombrePadre} ${apellidoPadre}`
        : nombrePadre;

      toast.success("Padre/apoderado actualizado exitosamente", {
        description: `Los datos de ${nombreCompleto} han sido actualizados`,
      });
    },
    onError: (error) => {
      toast.error("Error al actualizar padre/apoderado", {
        description: error.message || "Ocurrió un error inesperado",
      });
    },
  });
};

// Hook para eliminar padre
export const useDeletePadre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: demoPadresService.deletePadre,
    onSuccess: (deletedId) => {
      // Invalidar lista de padres
      queryClient.invalidateQueries({ queryKey: padresKeys.lists() });

      toast.success("Padre/apoderado eliminado exitosamente", {
        description: "El registro ha sido eliminado del sistema",
      });
    },
    onError: (error) => {
      toast.error("Error al eliminar padre/apoderado", {
        description: error.message || "Ocurrió un error inesperado",
      });
    },
  });
};

// Hook para cambiar estado del padre
export const useTogglePadreStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: demoPadresService.togglePadreStatus,
    onSuccess: (updatedPadre) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: padresKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: padresKeys.detail(
          updatedPadre.idApoderado || updatedPadre.id
        ),
      });

      const newStatus = updatedPadre.estaActivo ? "activado" : "desactivado";
      toast.success(`¡Padre/apoderado ${newStatus} exitosamente!`, {
        description: `${updatedPadre.nombre} ${updatedPadre.apellido} ha sido ${newStatus}`,
      });
    },
    onError: (error) => {
      toast.error("Error al cambiar estado del padre/apoderado", {
        description: error.message || "Ocurrió un error inesperado",
      });
    },
  });
};
