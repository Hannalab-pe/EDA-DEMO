// src/hooks/queries/useEstudiantesQueries.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { demoEstudiantesService } from "../../services/demoEstudiantesService";

// Query keys para estudiantes
export const estudiantesKeys = {
  all: ["estudiantes"],
  lists: () => [...estudiantesKeys.all, "list"],
  list: (filters) => [...estudiantesKeys.lists(), { filters }],
  details: () => [...estudiantesKeys.all, "detail"],
  detail: (id) => [...estudiantesKeys.details(), id],
};

// Servicio API para estudiantes (ahora usando servicio demo)
const estudiantesService = {
  getEstudiantes: async (filters = {}) => {
    return await demoEstudiantesService.getEstudiantes(filters);
  },

  getEstudianteById: async (id) => {
    return await demoEstudiantesService.getEstudianteById(id);
  },

  createEstudiante: async (estudianteData) => {
    return await demoEstudiantesService.createEstudiante(estudianteData);
  },

  updateEstudiante: async ({ id, ...estudianteData }) => {
    console.log("🔧 Service updateEstudiante - ID recibido:", id);
    console.log("🔧 Service updateEstudiante - Datos:", estudianteData);

    if (!id) {
      throw new Error("ID del estudiante es requerido para actualizar");
    }

    return await demoEstudiantesService.updateEstudiante({
      id,
      ...estudianteData,
    });
  },

  deleteEstudiante: async (id) => {
    return await demoEstudiantesService.deleteEstudiante(id);
  },

  toggleEstudianteStatus: async (id) => {
    console.log(`🔄 Cambiando estado del estudiante ID: ${id}`);
    const result = await demoEstudiantesService.toggleEstudianteStatus(id);
    console.log("✅ Estado del estudiante actualizado:", result);
    return result;
  },
};

// Hook para obtener lista de estudiantes
export const useEstudiantes = (filters = {}) => {
  return useQuery({
    queryKey: estudiantesKeys.list(filters),
    queryFn: () => estudiantesService.getEstudiantes(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

// Hook para obtener un estudiante por ID
export const useEstudiante = (id) => {
  return useQuery({
    queryKey: estudiantesKeys.detail(id),
    queryFn: () => estudiantesService.getEstudianteById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook para crear estudiante
export const useCreateEstudiante = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (estudianteData) => {
      // En modo demo, no subimos imágenes a Cloudinary
      // Solo usamos el emoji o foto que viene en los datos
      const photoData = estudianteData.foto || estudianteData.photo || "👤";

      // Preparar datos finales
      const finalData = {
        ...estudianteData,
        foto: photoData,
      };
      delete finalData.photoFile;
      delete finalData.photo;

      return estudiantesService.createEstudiante(finalData);
    },
    onSuccess: (newEstudiante) => {
      // Invalidar y refetch de la lista de estudiantes
      queryClient.invalidateQueries({ queryKey: estudiantesKeys.lists() });

      toast.success("¡Estudiante creado exitosamente! (Demo)", {
        description: `${newEstudiante.nombre} ${newEstudiante.apellidos} ha sido agregado al sistema`,
      });
    },
    onError: (error) => {
      toast.error("Error al crear estudiante", {
        description: error.message || "Ocurrió un error inesperado",
      });
    },
  });
};

// Hook para actualizar estudiante
export const useUpdateEstudiante = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...estudianteData }) => {
      console.log("🔧 useUpdateEstudiante mutation - ID recibido:", id);
      console.log(
        "🔧 useUpdateEstudiante mutation - Datos recibidos:",
        estudianteData
      );

      if (!id) {
        console.error("❌ ID del estudiante es undefined o null");
        throw new Error("ID del estudiante es requerido");
      }

      // En modo demo, solo usamos emoji o foto simple
      const photoData = estudianteData.foto || estudianteData.photo || "👤";

      // Preparar datos actualizados
      const finalData = {
        ...estudianteData,
        foto: photoData,
      };
      delete finalData.photoFile;
      delete finalData.photo;

      console.log("🔧 Datos finales a enviar:", finalData);
      return estudiantesService.updateEstudiante({ id, ...finalData });
    },
    onSuccess: (updatedEstudiante, { id }) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: estudiantesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: estudiantesKeys.detail(id) });

      toast.success("Estudiante actualizado exitosamente (Demo)", {
        description: `Los datos de ${updatedEstudiante.nombre} ${updatedEstudiante.apellidos} han sido actualizados`,
      });
    },
    onError: (error) => {
      toast.error("Error al actualizar estudiante", {
        description: error.message || "Ocurrió un error inesperado",
      });
    },
  });
};

// Hook para eliminar estudiante (desactivar)
export const useDeleteEstudiante = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => {
      console.log("🔄 Desactivando estudiante ID:", id);

      if (!id) {
        console.error("❌ No se encontró ID del estudiante:", id);
        throw new Error("ID del estudiante no encontrado");
      }

      // Usar la función correcta del servicio que llama al DELETE endpoint
      return estudiantesService.toggleEstudianteStatus(id);
    },
    onMutate: () => {
      const loadingToast = toast.loading("Desactivando estudiante...", {
        description: "Procesando desactivación...",
      });
      return { loadingToast };
    },
    onSuccess: (data, id, context) => {
      // Invalidar lista de estudiantes
      queryClient.invalidateQueries({ queryKey: estudiantesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: estudiantesKeys.detail(id) });

      toast.success("Estudiante desactivado exitosamente", {
        id: context.loadingToast,
        description: "El estudiante ha sido desactivado del sistema",
      });

      console.log("✅ Estudiante desactivado y cache invalidado");
    },
    onError: (error, variables, context) => {
      toast.error("Error al desactivar estudiante", {
        id: context?.loadingToast,
        description: error.message || "Ocurrió un error inesperado",
      });
      console.error("❌ Error al desactivar estudiante:", error);
    },
  });
};

// Hook para cambiar estado del estudiante
export const useToggleEstudianteStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => {
      console.log("🔄 Cambiando estado del estudiante ID:", id);

      if (!id) {
        console.error("❌ No se encontró ID del estudiante:", id);
        throw new Error("ID del estudiante no encontrado");
      }

      return estudiantesService.toggleEstudianteStatus(id);
    },
    onMutate: () => {
      const loadingToast = toast.loading("Cambiando estado del estudiante...", {
        description: "Procesando cambio...",
      });
      return { loadingToast };
    },
    onSuccess: (data, id, context) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: estudiantesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: estudiantesKeys.detail(id) });

      toast.success("¡Estado del estudiante actualizado exitosamente!", {
        id: context.loadingToast,
        description: "El estado ha sido cambiado correctamente",
      });

      console.log("✅ Estado del estudiante actualizado y cache invalidado");
    },
    onError: (error, variables, context) => {
      toast.error("Error al cambiar estado del estudiante", {
        id: context?.loadingToast,
        description: error.message || "Ocurrió un error inesperado",
      });
      console.error("❌ Error al cambiar estado del estudiante:", error);
    },
  });
};
