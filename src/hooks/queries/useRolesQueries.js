// src/hooks/queries/useRolesQueries.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { demoRolesService } from "../../services/demoRolesService";

// Query keys para roles
export const rolesKeys = {
  all: ["roles"],
  lists: () => [...rolesKeys.all, "list"],
  list: (filters) => [...rolesKeys.lists(), { filters }],
  details: () => [...rolesKeys.all, "detail"],
  detail: (id) => [...rolesKeys.details(), id],
};

/**
 * Hook para obtener todos los roles con filtros opcionales
 */
export const useRoles = (filters = {}) => {
  return useQuery({
    queryKey: rolesKeys.list(filters),
    queryFn: () => demoRolesService.getRoles(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para obtener un rol específico por ID
 */
export const useRol = (id) => {
  return useQuery({
    queryKey: rolesKeys.detail(id),
    queryFn: () => demoRolesService.getRolById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook para crear un nuevo rol
 */
export const useCreateRol = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: demoRolesService.createRol,
    onSuccess: (newRol) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });

      toast.success("Rol creado exitosamente", {
        description: `El rol "${newRol.nombre}" ha sido creado`,
      });
    },
    onError: (error) => {
      toast.error("Error al crear rol", {
        description: error.message || "Ocurrió un error inesperado",
      });
    },
  });
};

/**
 * Hook para actualizar un rol existente
 */
export const useUpdateRol = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: demoRolesService.updateRol,
    onSuccess: (updatedRol, { id }) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: rolesKeys.detail(id) });

      // Mostrar mensaje de éxito, manejando el caso donde updatedRol podría ser undefined
      const nombreRol = updatedRol?.nombre || "Rol";

      toast.success("Rol actualizado exitosamente", {
        description: `Los datos del rol "${nombreRol}" han sido actualizados`,
      });
    },
    onError: (error) => {
      toast.error("Error al actualizar rol", {
        description: error.message || "Ocurrió un error inesperado",
      });
    },
  });
};

/**
 * Hook para eliminar un rol
 */
export const useDeleteRol = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: demoRolesService.deleteRol,
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });

      toast.success("Rol eliminado exitosamente");
    },
    onError: (error) => {
      toast.error("Error al eliminar rol", {
        description: error.message || "Ocurrió un error inesperado",
      });
    },
  });
};

/**
 * Hook para cambiar el estado de un rol
 */
export const useToggleRolStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: demoRolesService.toggleRolStatus,
    onSuccess: (updatedRol) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });

      const statusText = updatedRol.estaActivo ? "activado" : "desactivado";
      toast.success(`Rol ${statusText} exitosamente`, {
        description: `El rol "${updatedRol.nombre}" ha sido ${statusText}`,
      });
    },
    onError: (error) => {
      toast.error("Error al cambiar estado del rol", {
        description: error.message || "Ocurrió un error inesperado",
      });
    },
  });
};
