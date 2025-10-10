// src/services/demoPeriodoEscolarService.js
// Servicio DEMO para gestión de períodos escolares (sin API real)

import { mockData, simulateApiDelay } from "../data/mockData";

const demoPeriodoEscolarService = {
  /**
   * Obtener todos los períodos escolares
   */
  getAll: async () => {
    await simulateApiDelay(300, 800);
    console.log(
      "[DEMO] Períodos escolares cargados:",
      mockData.periodosEscolares.length
    );
    return [...mockData.periodosEscolares];
  },

  /**
   * Obtener período escolar por ID
   */
  getById: async (id) => {
    await simulateApiDelay(200, 500);
    const periodo = mockData.periodosEscolares.find(
      (p) => p.idPeriodoEscolar === parseInt(id)
    );
    if (!periodo) {
      throw new Error(`Período escolar con ID ${id} no encontrado`);
    }
    return { ...periodo };
  },

  /**
   * Obtener período escolar activo
   */
  getActivo: async () => {
    await simulateApiDelay(200, 500);
    const periodoActivo = mockData.periodosEscolares.find(
      (p) => p.estaActivo === true
    );
    if (!periodoActivo) {
      throw new Error("No hay período escolar activo");
    }
    return { ...periodoActivo };
  },

  /**
   * Crear nuevo período escolar (DEMO - solo agrega a mockData)
   */
  create: async (data) => {
    await simulateApiDelay(500, 1000);

    const nuevoId =
      Math.max(
        ...mockData.periodosEscolares.map((p) => p.idPeriodoEscolar),
        0
      ) + 1;

    const nuevoPeriodo = {
      idPeriodoEscolar: nuevoId,
      anioEscolar: data.anioEscolar,
      fechaInicio: data.fechaInicio,
      fechaFin: data.fechaFin,
      estaActivo: data.estaActivo || false,
      descripcion: data.descripcion || "",
      creado: new Date().toISOString(),
      actualizado: new Date().toISOString(),
    };

    // Si el nuevo período se marca como activo, desactivar los demás
    if (nuevoPeriodo.estaActivo) {
      mockData.periodosEscolares.forEach((p) => {
        p.estaActivo = false;
      });
    }

    mockData.periodosEscolares.push(nuevoPeriodo);
    console.log("[DEMO] Período escolar creado:", nuevoPeriodo);

    return { ...nuevoPeriodo };
  },

  /**
   * Actualizar período escolar existente (DEMO)
   */
  update: async (id, data) => {
    await simulateApiDelay(500, 1000);

    const index = mockData.periodosEscolares.findIndex(
      (p) => p.idPeriodoEscolar === parseInt(id)
    );

    if (index === -1) {
      throw new Error(`Período escolar con ID ${id} no encontrado`);
    }

    // Si se marca como activo, desactivar los demás
    if (data.estaActivo === true) {
      mockData.periodosEscolares.forEach((p, idx) => {
        if (idx !== index) {
          p.estaActivo = false;
        }
      });
    }

    const periodoActualizado = {
      ...mockData.periodosEscolares[index],
      ...data,
      actualizado: new Date().toISOString(),
    };

    mockData.periodosEscolares[index] = periodoActualizado;
    console.log("[DEMO] Período escolar actualizado:", periodoActualizado);

    return { ...periodoActualizado };
  },

  /**
   * Eliminar período escolar (DEMO)
   */
  delete: async (id) => {
    await simulateApiDelay(400, 700);

    const index = mockData.periodosEscolares.findIndex(
      (p) => p.idPeriodoEscolar === parseInt(id)
    );

    if (index === -1) {
      throw new Error(`Período escolar con ID ${id} no encontrado`);
    }

    // No permitir eliminar el período activo
    if (mockData.periodosEscolares[index].estaActivo) {
      throw new Error("No se puede eliminar el período escolar activo");
    }

    const periodoEliminado = mockData.periodosEscolares.splice(index, 1)[0];
    console.log("[DEMO] Período escolar eliminado:", periodoEliminado);

    return { mensaje: "Período escolar eliminado exitosamente" };
  },

  /**
   * Activar un período escolar específico
   */
  activar: async (id) => {
    await simulateApiDelay(400, 700);

    // Desactivar todos
    mockData.periodosEscolares.forEach((p) => {
      p.estaActivo = false;
    });

    // Activar el solicitado
    const periodo = mockData.periodosEscolares.find(
      (p) => p.idPeriodoEscolar === parseInt(id)
    );

    if (!periodo) {
      throw new Error(`Período escolar con ID ${id} no encontrado`);
    }

    periodo.estaActivo = true;
    periodo.actualizado = new Date().toISOString();

    console.log("[DEMO] Período escolar activado:", periodo);
    return { ...periodo };
  },
};

export default demoPeriodoEscolarService;
