// 🎭 Store temporal para planificaciones en modo demo
// Persiste durante la sesión del navegador

let planificacionesTemporales = [];

export const planificacionesStore = {
  // Agregar una nueva planificación
  agregarPlanificacion: (nuevaPlanificacion) => {
    console.log("🎭 [STORE] Agregando planificación:", nuevaPlanificacion);
    planificacionesTemporales = [
      nuevaPlanificacion,
      ...planificacionesTemporales,
    ];
    console.log(
      "✅ [STORE] Total planificaciones:",
      planificacionesTemporales.length
    );
    return nuevaPlanificacion;
  },

  // Obtener todas las planificaciones temporales
  obtenerPlanificaciones: () => {
    console.log(
      "📋 [STORE] Obteniendo planificaciones temporales:",
      planificacionesTemporales.length
    );
    return planificacionesTemporales;
  },

  // Actualizar una planificación existente
  actualizarPlanificacion: (id, datosActualizados) => {
    console.log("🎭 [STORE] Actualizando planificación:", id);
    const index = planificacionesTemporales.findIndex(
      (plan) => plan.idPlanificacion === id
    );

    if (index !== -1) {
      planificacionesTemporales[index] = {
        ...planificacionesTemporales[index],
        ...datosActualizados,
      };
      console.log("✅ [STORE] Planificación actualizada");
      return planificacionesTemporales[index];
    }

    console.warn("⚠️ [STORE] Planificación no encontrada:", id);
    return null;
  },

  // Eliminar una planificación
  eliminarPlanificacion: (id) => {
    console.log("🎭 [STORE] Eliminando planificación:", id);
    const lengthAntes = planificacionesTemporales.length;
    planificacionesTemporales = planificacionesTemporales.filter(
      (plan) => plan.idPlanificacion !== id
    );
    const eliminada = lengthAntes > planificacionesTemporales.length;
    console.log(
      eliminada
        ? "✅ [STORE] Planificación eliminada"
        : "⚠️ [STORE] Planificación no encontrada"
    );
    return eliminada;
  },

  // Limpiar todas las planificaciones temporales
  limpiarPlanificaciones: () => {
    console.log("🗑️ [STORE] Limpiando todas las planificaciones temporales");
    planificacionesTemporales = [];
  },

  // Obtener cantidad de planificaciones
  contarPlanificaciones: () => {
    return planificacionesTemporales.length;
  },
};
