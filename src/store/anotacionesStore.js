// 🎭 Store temporal para anotaciones en modo demo
// Persiste durante la sesión del navegador

let anotacionesTemporales = [];

export const anotacionesStore = {
  // Agregar una nueva anotación
  agregarAnotacion: (nuevaAnotacion) => {
    console.log("🎭 [STORE] Agregando anotación:", nuevaAnotacion);
    anotacionesTemporales = [nuevaAnotacion, ...anotacionesTemporales];
    console.log("✅ [STORE] Total anotaciones:", anotacionesTemporales.length);
    return nuevaAnotacion;
  },

  // Obtener todas las anotaciones temporales
  obtenerAnotaciones: () => {
    console.log(
      "📋 [STORE] Obteniendo anotaciones temporales:",
      anotacionesTemporales.length
    );
    return anotacionesTemporales;
  },

  // Actualizar una anotación existente
  actualizarAnotacion: (id, datosActualizados) => {
    console.log("🎭 [STORE] Actualizando anotación:", id);
    const index = anotacionesTemporales.findIndex(
      (anot) => anot.idAnotacionAlumno === id
    );

    if (index !== -1) {
      anotacionesTemporales[index] = {
        ...anotacionesTemporales[index],
        ...datosActualizados,
      };
      console.log("✅ [STORE] Anotación actualizada");
      return anotacionesTemporales[index];
    }

    console.warn("⚠️ [STORE] Anotación no encontrada:", id);
    return null;
  },

  // Eliminar una anotación
  eliminarAnotacion: (id) => {
    console.log("🎭 [STORE] Eliminando anotación:", id);
    const lengthAntes = anotacionesTemporales.length;
    anotacionesTemporales = anotacionesTemporales.filter(
      (anot) => anot.idAnotacionAlumno !== id
    );
    const eliminada = lengthAntes > anotacionesTemporales.length;
    console.log(
      eliminada
        ? "✅ [STORE] Anotación eliminada"
        : "⚠️ [STORE] Anotación no encontrada"
    );
    return eliminada;
  },

  // Limpiar todas las anotaciones temporales (útil para reset)
  limpiarAnotaciones: () => {
    console.log("🗑️ [STORE] Limpiando todas las anotaciones temporales");
    anotacionesTemporales = [];
  },

  // Obtener cantidad de anotaciones
  contarAnotaciones: () => {
    return anotacionesTemporales.length;
  },
};
