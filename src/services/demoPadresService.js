// src/services/demoPadresService.js
import { mockData } from "../data/mockData";

/**
 * Servicio demo para gestión de padres/apoderados
 * Simula operaciones CRUD sin llamadas al backend
 */

// Simular delay de red
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

let padresCache = [...mockData.padres];

export const demoPadresService = {
  /**
   * Obtener todos los padres con sus estudiantes
   */
  getPadres: async (filters = {}) => {
    await delay(400);

    let result = [...padresCache];

    // Aplicar filtros si existen
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (padre) =>
          padre.nombre?.toLowerCase().includes(searchLower) ||
          padre.apellido?.toLowerCase().includes(searchLower) ||
          padre.correo?.toLowerCase().includes(searchLower) ||
          padre.numero?.toLowerCase().includes(searchLower) ||
          padre.documentoIdentidad?.includes(searchLower)
      );
    }

    if (filters.relation) {
      result = result.filter(
        (padre) => padre.tipoApoderado === filters.relation
      );
    }

    if (filters.status) {
      const isActive = filters.status === "active";
      result = result.filter((padre) => padre.estaActivo === isActive);
    }

    return result;
  },

  /**
   * Obtener un padre por ID
   */
  getPadreById: async (id) => {
    await delay(300);

    const padre = padresCache.find((p) => p.id === id || p.idApoderado === id);
    if (!padre) {
      throw new Error("Padre no encontrado");
    }

    return padre;
  },

  /**
   * Crear un nuevo padre
   */
  createPadre: async (padreData) => {
    await delay(500);

    const newPadre = {
      id: `padre-${Date.now()}`,
      idApoderado: `padre-${Date.now()}`,
      nombre: padreData.nombre,
      apellido: padreData.apellido,
      tipoApoderado: padreData.tipoApoderado || "Padre",
      documentoIdentidad: padreData.documentoIdentidad,
      tipoDocumentoIdentidad: padreData.tipoDocumentoIdentidad || "DNI",
      correo: padreData.correo,
      numero: padreData.numero,
      direccion: padreData.direccion || "",
      ocupacion: padreData.ocupacion || "",
      creado: new Date().toISOString(),
      actualizado: new Date().toISOString(),
      estaActivo: true,
      matriculas: [],
    };

    padresCache.push(newPadre);
    return newPadre;
  },

  /**
   * Actualizar un padre existente
   */
  updatePadre: async ({ id, ...padreData }) => {
    await delay(500);

    const index = padresCache.findIndex(
      (p) => p.id === id || p.idApoderado === id
    );
    if (index === -1) {
      throw new Error("Padre no encontrado");
    }

    const updatedPadre = {
      ...padresCache[index],
      ...padreData,
      actualizado: new Date().toISOString(),
    };

    padresCache[index] = updatedPadre;
    return updatedPadre;
  },

  /**
   * Eliminar un padre
   */
  deletePadre: async (id) => {
    await delay(400);

    const index = padresCache.findIndex(
      (p) => p.id === id || p.idApoderado === id
    );
    if (index === -1) {
      throw new Error("Padre no encontrado");
    }

    padresCache.splice(index, 1);
    return id;
  },

  /**
   * Cambiar estado de un padre (activar/desactivar)
   */
  togglePadreStatus: async (id) => {
    await delay(300);

    const padre = padresCache.find((p) => p.id === id || p.idApoderado === id);
    if (!padre) {
      throw new Error("Padre no encontrado");
    }

    padre.estaActivo = !padre.estaActivo;
    padre.actualizado = new Date().toISOString();

    return padre;
  },
};

export default demoPadresService;
