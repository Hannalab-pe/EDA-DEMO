// src/services/demoTrabajadoresService.js
import { mockData } from "../data/mockData";

/**
 * Servicio demo para gestión de trabajadores
 * Simula operaciones CRUD sin llamadas al backend
 */

// Simular delay de red
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

let trabajadoresCache = [...mockData.trabajadores];

export const demoTrabajadoresService = {
  /**
   * Obtener todos los trabajadores
   */
  getAllTrabajadores: async (filters = {}) => {
    await delay(400);

    let result = [...trabajadoresCache];

    // Aplicar filtros si existen
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (trabajador) =>
          trabajador.nombre?.toLowerCase().includes(searchLower) ||
          trabajador.apellido?.toLowerCase().includes(searchLower) ||
          trabajador.correo?.toLowerCase().includes(searchLower) ||
          trabajador.nroDocumento?.includes(searchLower)
      );
    }

    if (filters.rol) {
      result = result.filter(
        (trabajador) => trabajador.idRol?.nombre === filters.rol
      );
    }

    if (filters.tipoContrato) {
      result = result.filter(
        (trabajador) =>
          trabajador.contratoTrabajadors3?.[0]?.idTipoContrato?.nombreTipo ===
          filters.tipoContrato
      );
    }

    return result;
  },

  /**
   * Obtener un trabajador por ID
   */
  getTrabajadorById: async (id) => {
    await delay(300);

    const trabajador = trabajadoresCache.find(
      (t) => t.id === id || t.idTrabajador === id
    );
    if (!trabajador) {
      throw new Error("Trabajador no encontrado");
    }

    return trabajador;
  },

  /**
   * Crear un nuevo trabajador
   */
  createTrabajador: async (trabajadorData) => {
    await delay(500);

    const newTrabajador = {
      id: `trabajador-${Date.now()}`,
      idTrabajador: `trabajador-${Date.now()}`,
      nombre: trabajadorData.nombre,
      apellido: trabajadorData.apellido,
      nroDocumento: trabajadorData.nroDocumento,
      tipoDocumento: trabajadorData.tipoDocumento || "DNI",
      telefono: trabajadorData.telefono,
      correo: trabajadorData.correo,
      direccion: trabajadorData.direccion || "",
      estaActivo: true,
      idRol: {
        idRol: trabajadorData.idRol || "rol-1",
        nombre: trabajadorData.rolNombre || "DOCENTE",
        descripcion: trabajadorData.rolDescripcion || "Docente",
      },
      contratoTrabajadors3: [
        {
          idContratoTrabajador: `contrato-${Date.now()}`,
          cargoContrato: trabajadorData.cargoContrato || "Docente",
          lugarTrabajo: trabajadorData.lugarTrabajo || "Sede Principal",
          sueldoContratado: trabajadorData.sueldoContratado || "2800.00",
          estadoContrato: "ACTIVO",
          idTipoContrato: {
            idTipoContrato: trabajadorData.idTipoContrato || "tipo-1",
            nombreTipo:
              trabajadorData.tipoContratoNombre || "CONTRATO_PLANILLA",
          },
        },
      ],
    };

    trabajadoresCache.push(newTrabajador);
    return newTrabajador;
  },

  /**
   * Actualizar un trabajador existente
   */
  updateTrabajador: async (id, trabajadorData) => {
    await delay(500);

    const index = trabajadoresCache.findIndex(
      (t) => t.id === id || t.idTrabajador === id
    );
    if (index === -1) {
      throw new Error("Trabajador no encontrado");
    }

    const updatedTrabajador = {
      ...trabajadoresCache[index],
      ...trabajadorData,
      actualizado: new Date().toISOString(),
    };

    trabajadoresCache[index] = updatedTrabajador;
    return updatedTrabajador;
  },

  /**
   * Eliminar un trabajador (soft delete - cambiar estado)
   */
  deleteTrabajador: async (id) => {
    await delay(400);

    const index = trabajadoresCache.findIndex(
      (t) => t.id === id || t.idTrabajador === id
    );
    if (index === -1) {
      throw new Error("Trabajador no encontrado");
    }

    // Soft delete - solo cambiar estado
    trabajadoresCache[index].estaActivo = false;
    return trabajadoresCache[index];
  },

  /**
   * Cambiar estado de un trabajador (activar/desactivar)
   */
  toggleTrabajadorStatus: async (id, newStatus) => {
    await delay(300);

    const trabajador = trabajadoresCache.find(
      (t) => t.id === id || t.idTrabajador === id
    );
    if (!trabajador) {
      throw new Error("Trabajador no encontrado");
    }

    trabajador.estaActivo = newStatus;
    trabajador.actualizado = new Date().toISOString();

    return trabajador;
  },
};

export default demoTrabajadoresService;
