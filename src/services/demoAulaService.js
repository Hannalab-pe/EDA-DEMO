// Servicio DEMO para aulas (sin conexión a API)
import { mockData, generateId } from "../data/mockData";

/**
 * Servicio DEMO para gestión de aulas
 * Todas las operaciones son locales, sin llamadas al backend
 */
export const demoAulaService = {
  /**
   * Obtener todas las aulas
   */
  async getAllAulas(filters = {}) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let aulas = [...(mockData.aulas || [])];

    // Aplicar filtros si existen
    if (filters.seccion) {
      aulas = aulas.filter((a) =>
        a.seccion?.toLowerCase().includes(filters.seccion.toLowerCase())
      );
    }
    if (filters.estado !== undefined) {
      aulas = aulas.filter((a) => a.estaActivo === filters.estado);
    }
    if (filters.capacidad) {
      aulas = aulas.filter((a) => a.capacidad >= parseInt(filters.capacidad));
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      aulas = aulas.filter(
        (a) =>
          a.seccion?.toLowerCase().includes(searchLower) ||
          a.idGrado?.grado?.toLowerCase().includes(searchLower)
      );
    }

    console.log("📋 [DEMO] Aulas obtenidas:", aulas.length);
    return aulas;
  },

  /**
   * Obtener un aula por ID
   */
  async getAulaById(id) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const aula = (mockData.aulas || []).find((a) => a.idAula === parseInt(id));

    if (!aula) {
      throw new Error("Aula no encontrada");
    }

    console.log("📄 [DEMO] Aula encontrada:", aula);
    return aula;
  },

  /**
   * Crear una nueva aula
   */
  async createAula(aulaData) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    console.log("📝 [DEMO] Creando aula:", aulaData);

    // Validar datos requeridos
    const requiredFields = ["seccion", "capacidad"];
    const missingFields = requiredFields.filter((field) => !aulaData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Faltan campos requeridos: ${missingFields.join(", ")}`);
    }

    // Buscar el grado
    let gradoData = null;
    if (aulaData.idGrado) {
      gradoData = (mockData.grados || []).find(
        (g) => g.idGrado === parseInt(aulaData.idGrado)
      );
    }

    const nuevaAula = {
      idAula: parseInt(generateId()),
      seccion: aulaData.seccion,
      capacidad: parseInt(aulaData.capacidad),
      estaActivo:
        aulaData.estaActivo !== undefined ? aulaData.estaActivo : true,
      idGrado: gradoData || null,
    };

    // Inicializar array si no existe
    if (!mockData.aulas) {
      mockData.aulas = [];
    }

    mockData.aulas.push(nuevaAula);

    console.log("✅ [DEMO] Aula creada:", nuevaAula);
    return nuevaAula;
  },

  /**
   * Actualizar un aula existente
   */
  async updateAula(id, updateData) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    console.log("📝 [DEMO] Actualizando aula:", id, updateData);

    if (!mockData.aulas) {
      mockData.aulas = [];
    }

    const index = mockData.aulas.findIndex((a) => a.idAula === parseInt(id));

    if (index === -1) {
      throw new Error("Aula no encontrada");
    }

    // Si se actualiza el grado, buscar los datos completos
    if (updateData.idGrado) {
      const gradoData = (mockData.grados || []).find(
        (g) => g.idGrado === parseInt(updateData.idGrado)
      );
      if (gradoData) {
        updateData.idGrado = gradoData;
      }
    }

    mockData.aulas[index] = {
      ...mockData.aulas[index],
      ...updateData,
      idAula: parseInt(id),
    };

    console.log("✅ [DEMO] Aula actualizada:", mockData.aulas[index]);
    return mockData.aulas[index];
  },

  /**
   * Eliminar un aula
   */
  async deleteAula(id) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    console.log("🗑️ [DEMO] Eliminando aula:", id);

    if (!mockData.aulas) {
      mockData.aulas = [];
    }

    const index = mockData.aulas.findIndex((a) => a.idAula === parseInt(id));

    if (index === -1) {
      throw new Error("Aula no encontrada");
    }

    const aulaEliminada = mockData.aulas.splice(index, 1)[0];

    console.log("✅ [DEMO] Aula eliminada:", aulaEliminada);
    return { success: true, message: "Aula eliminada correctamente" };
  },

  /**
   * Cambiar estado de un aula (activar/desactivar)
   */
  async toggleAulaStatus(id, nuevoEstado) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    console.log("🔄 [DEMO] Cambiando estado de aula:", id, "a", nuevoEstado);

    if (!mockData.aulas) {
      mockData.aulas = [];
    }

    const index = mockData.aulas.findIndex((a) => a.idAula === parseInt(id));

    if (index === -1) {
      throw new Error("Aula no encontrada");
    }

    mockData.aulas[index].estaActivo = nuevoEstado;

    console.log("✅ [DEMO] Estado de aula actualizado:", mockData.aulas[index]);
    return mockData.aulas[index];
  },

  /**
   * Obtener aulas sin asignación a ningún docente
   */
  async getAulasSinAsignacion() {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!mockData.aulas) {
      return [];
    }

    // Si no hay asignaciones, todas las aulas están disponibles
    if (!mockData.asignacionesAula || mockData.asignacionesAula.length === 0) {
      return mockData.aulas.filter((a) => a.estaActivo);
    }

    // IDs de aulas ya asignadas
    const aulasAsignadas = mockData.asignacionesAula
      .filter((a) => a.estadoActivo)
      .map((a) => a.idAula?.idAula || a.idAula);

    // Filtrar aulas no asignadas y activas
    const aulasSinAsignar = mockData.aulas.filter(
      (aula) => !aulasAsignadas.includes(aula.idAula) && aula.estaActivo
    );

    console.log("📋 [DEMO] Aulas sin asignación:", aulasSinAsignar.length);
    return aulasSinAsignar;
  },

  /**
   * Obtener aulas disponibles por grado
   */
  async getAulasDisponiblesPorGrado(idGrado) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    console.log("🎯 [DEMO] Obteniendo aulas disponibles para grado:", idGrado);

    if (!mockData.aulas) {
      return [];
    }

    // Filtrar por grado
    let aulasPorGrado = mockData.aulas.filter(
      (aula) => aula.idGrado?.idGrado === parseInt(idGrado) && aula.estaActivo
    );

    // Si hay asignaciones, filtrar las ya asignadas
    if (mockData.asignacionesAula && mockData.asignacionesAula.length > 0) {
      const aulasAsignadas = mockData.asignacionesAula
        .filter((a) => a.estadoActivo)
        .map((a) => a.idAula?.idAula || a.idAula);

      aulasPorGrado = aulasPorGrado.filter(
        (aula) => !aulasAsignadas.includes(aula.idAula)
      );
    }

    console.log(
      "✅ [DEMO] Aulas disponibles encontradas:",
      aulasPorGrado.length
    );
    return aulasPorGrado;
  },

  /**
   * Obtener estadísticas de aulas
   */
  async getAulasStats() {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const aulas = mockData.aulas || [];
    const asignaciones = mockData.asignacionesAula || [];

    const totalAulas = aulas.length;
    const aulasActivas = aulas.filter((a) => a.estaActivo).length;
    const aulasAsignadas = asignaciones.filter((a) => a.estadoActivo).length;
    const aulasDisponibles = aulasActivas - aulasAsignadas;

    return {
      total: totalAulas,
      activas: aulasActivas,
      asignadas: aulasAsignadas,
      disponibles: aulasDisponibles > 0 ? aulasDisponibles : 0,
    };
  },
};

export default demoAulaService;
