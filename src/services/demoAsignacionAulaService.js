// Servicio DEMO para asignación de aulas (sin conexión a API)
import { mockData, generateId } from "../data/mockData";

/**
 * Servicio DEMO para gestión de asignaciones de aula
 * Todas las operaciones son locales, sin llamadas al backend
 */
export const demoAsignacionAulaService = {
  /**
   * Crear una nueva asignación de aula para un docente
   */
  createAsignacion: async (asignacionData) => {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 400));

    console.log("📝 [DEMO] Creando asignación de aula:", asignacionData);

    // Validar datos requeridos
    const requiredFields = [
      "fechaAsignacion",
      "estadoActivo",
      "idAula",
      "idTrabajador",
    ];
    const missingFields = requiredFields.filter(
      (field) =>
        asignacionData[field] === undefined || asignacionData[field] === null
    );

    if (missingFields.length > 0) {
      throw new Error(`Faltan campos requeridos: ${missingFields.join(", ")}`);
    }

    // Buscar el aula
    const aula = mockData.aulas?.find(
      (a) => a.idAula === parseInt(asignacionData.idAula)
    );
    if (!aula) {
      throw new Error("Aula no encontrada");
    }

    // Buscar el trabajador
    const trabajador = mockData.trabajadores.find(
      (t) => t.idTrabajador === parseInt(asignacionData.idTrabajador)
    );
    if (!trabajador) {
      throw new Error("Trabajador no encontrado");
    }

    // Crear la nueva asignación
    const nuevaAsignacion = {
      idAsignacionAula: parseInt(generateId()),
      fechaAsignacion: asignacionData.fechaAsignacion,
      estadoActivo: asignacionData.estadoActivo,
      idAula: {
        idAula: aula.idAula,
        seccion: aula.seccion,
        capacidad: aula.capacidad,
        estaActivo: aula.estaActivo,
        idGrado: aula.idGrado,
      },
      idTrabajador: {
        idTrabajador: trabajador.idTrabajador,
        nombre: trabajador.nombre,
        apellido: trabajador.apellido,
        nroDocumento: trabajador.nroDocumento,
        correo: trabajador.correo,
        idRol: trabajador.idRol,
      },
    };

    // Agregar a mockData si existe el array
    if (!mockData.asignacionesAula) {
      mockData.asignacionesAula = [];
    }
    mockData.asignacionesAula.push(nuevaAsignacion);

    console.log("✅ [DEMO] Asignación creada exitosamente:", nuevaAsignacion);
    return nuevaAsignacion;
  },

  /**
   * Obtener todas las asignaciones de aula
   */
  getAllAsignaciones: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!mockData.asignacionesAula) {
      mockData.asignacionesAula = [];
    }

    console.log(
      "📋 [DEMO] Obteniendo todas las asignaciones:",
      mockData.asignacionesAula.length
    );
    return mockData.asignacionesAula;
  },

  /**
   * Obtener asignaciones de un trabajador específico
   */
  getAsignacionesByTrabajador: async (idTrabajador) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!mockData.asignacionesAula) {
      mockData.asignacionesAula = [];
    }

    const asignaciones = mockData.asignacionesAula.filter(
      (a) => a.idTrabajador?.idTrabajador === parseInt(idTrabajador)
    );

    console.log(
      `📋 [DEMO] Asignaciones del trabajador ${idTrabajador}:`,
      asignaciones.length
    );
    return asignaciones;
  },

  /**
   * Obtener asignación por ID
   */
  getAsignacionById: async (idAsignacion) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!mockData.asignacionesAula) {
      mockData.asignacionesAula = [];
    }

    const asignacion = mockData.asignacionesAula.find(
      (a) => a.idAsignacionAula === parseInt(idAsignacion)
    );

    if (!asignacion) {
      throw new Error("Asignación no encontrada");
    }

    console.log("📄 [DEMO] Asignación encontrada:", asignacion);
    return asignacion;
  },

  /**
   * Actualizar una asignación existente
   */
  updateAsignacion: async (idAsignacion, updateData) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    console.log("📝 [DEMO] Actualizando asignación:", idAsignacion, updateData);

    if (!mockData.asignacionesAula) {
      mockData.asignacionesAula = [];
    }

    const index = mockData.asignacionesAula.findIndex(
      (a) => a.idAsignacionAula === parseInt(idAsignacion)
    );

    if (index === -1) {
      throw new Error("Asignación no encontrada");
    }

    // Si se actualiza el aula, buscar los datos completos
    if (updateData.idAula) {
      const aula = mockData.aulas?.find(
        (a) => a.idAula === parseInt(updateData.idAula)
      );
      if (aula) {
        updateData.idAula = {
          idAula: aula.idAula,
          seccion: aula.seccion,
          capacidad: aula.capacidad,
          estaActivo: aula.estaActivo,
          idGrado: aula.idGrado,
        };
      }
    }

    // Actualizar la asignación
    mockData.asignacionesAula[index] = {
      ...mockData.asignacionesAula[index],
      ...updateData,
      idAsignacionAula: parseInt(idAsignacion),
    };

    console.log(
      "✅ [DEMO] Asignación actualizada:",
      mockData.asignacionesAula[index]
    );
    return mockData.asignacionesAula[index];
  },

  /**
   * Eliminar una asignación
   */
  deleteAsignacion: async (idAsignacion) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    console.log("🗑️ [DEMO] Eliminando asignación:", idAsignacion);

    if (!mockData.asignacionesAula) {
      mockData.asignacionesAula = [];
    }

    const index = mockData.asignacionesAula.findIndex(
      (a) => a.idAsignacionAula === parseInt(idAsignacion)
    );

    if (index === -1) {
      throw new Error("Asignación no encontrada");
    }

    const asignacionEliminada = mockData.asignacionesAula.splice(index, 1)[0];

    console.log("✅ [DEMO] Asignación eliminada:", asignacionEliminada);
    return { success: true, message: "Asignación eliminada correctamente" };
  },

  /**
   * Obtener aulas sin asignar a ningún docente
   */
  getAulasSinAsignar: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!mockData.aulas) {
      return [];
    }

    if (!mockData.asignacionesAula) {
      mockData.asignacionesAula = [];
    }

    // IDs de aulas ya asignadas
    const aulasAsignadas = mockData.asignacionesAula
      .filter((a) => a.estadoActivo)
      .map((a) => a.idAula?.idAula || a.idAula);

    // Filtrar aulas no asignadas
    const aulasSinAsignar = mockData.aulas.filter(
      (aula) => !aulasAsignadas.includes(aula.idAula) && aula.estaActivo
    );

    console.log("📋 [DEMO] Aulas sin asignar:", aulasSinAsignar.length);
    return aulasSinAsignar;
  },
};

export default demoAsignacionAulaService;
