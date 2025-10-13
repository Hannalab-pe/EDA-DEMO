/**
 * Store temporal para evaluaciones de estudiantes (modo demo)
 * Este módulo permite compartir el estado de evaluaciones entre componentes
 */

// Array temporal de evaluaciones creadas en la sesión
export let evaluacionesTemporalesDemo = [];

/**
 * Agregar una nueva evaluación al store temporal
 */
export const agregarEvaluacionDemo = (evaluacion) => {
  evaluacionesTemporalesDemo.push(evaluacion);
  console.log("➕ [STORE DEMO] Evaluación agregada:", evaluacion);
  console.log(
    "📊 [STORE DEMO] Total evaluaciones temporales:",
    evaluacionesTemporalesDemo.length
  );
  return evaluacion;
};

/**
 * Obtener todas las evaluaciones temporales
 */
export const obtenerEvaluacionesDemo = () => {
  return evaluacionesTemporalesDemo;
};

/**
 * Limpiar todas las evaluaciones temporales
 */
export const limpiarEvaluacionesDemo = () => {
  evaluacionesTemporalesDemo = [];
  console.log("🗑️ [STORE DEMO] Evaluaciones temporales limpiadas");
};

/**
 * Actualizar una evaluación existente por ID
 */
export const actualizarEvaluacionDemo = (idEvaluacion, datosActualizados) => {
  const indice = evaluacionesTemporalesDemo.findIndex(
    (e) => e.idEvaluacion === idEvaluacion
  );

  if (indice !== -1) {
    evaluacionesTemporalesDemo[indice] = {
      ...evaluacionesTemporalesDemo[indice],
      ...datosActualizados,
    };
    console.log(
      "✏️ [STORE DEMO] Evaluación actualizada:",
      evaluacionesTemporalesDemo[indice]
    );
    return evaluacionesTemporalesDemo[indice];
  }

  console.warn(
    "⚠️ [STORE DEMO] No se encontró evaluación con ID:",
    idEvaluacion
  );
  return null;
};

/**
 * Eliminar una evaluación por ID
 */
export const eliminarEvaluacionDemo = (idEvaluacion) => {
  const indice = evaluacionesTemporalesDemo.findIndex(
    (e) => e.idEvaluacion === idEvaluacion
  );

  if (indice !== -1) {
    const eliminada = evaluacionesTemporalesDemo.splice(indice, 1)[0];
    console.log("🗑️ [STORE DEMO] Evaluación eliminada:", eliminada);
    console.log(
      "📊 [STORE DEMO] Total evaluaciones temporales:",
      evaluacionesTemporalesDemo.length
    );
    return eliminada;
  }

  console.warn(
    "⚠️ [STORE DEMO] No se encontró evaluación con ID:",
    idEvaluacion
  );
  return null;
};
