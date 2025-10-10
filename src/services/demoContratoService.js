// Servicio DEMO para contratos (sin conexión a API)
import { mockData, generateId } from "../data/mockData";

/**
 * Servicio DEMO para gestión de contratos
 * Todas las operaciones son locales, sin llamadas al backend
 */
export const demoContratoService = {
  /**
   * Obtener todos los contratos
   */
  async getAllContratos(filters = {}) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let contratos = [...(mockData.contratos || [])];

    // Aplicar filtros si existen
    if (filters.estadoContrato) {
      contratos = contratos.filter((c) => c.estadoContrato === filters.estadoContrato);
    }
    if (filters.idTrabajador) {
      contratos = contratos.filter(
        (c) => c.idTrabajador?.idTrabajador === parseInt(filters.idTrabajador)
      );
    }
    if (filters.idTipoContrato) {
      contratos = contratos.filter(
        (c) => c.idTipoContrato?.idTipoContrato === parseInt(filters.idTipoContrato)
      );
    }

    console.log("📋 [DEMO] Contratos obtenidos:", contratos.length);
    return contratos;
  },

  /**
   * Obtener un contrato por ID
   */
  async getContratoById(id) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const contrato = (mockData.contratos || []).find(
      (c) => c.idContrato === parseInt(id)
    );

    if (!contrato) {
      throw new Error("Contrato no encontrado");
    }

    console.log("📄 [DEMO] Contrato encontrado:", contrato);
    return contrato;
  },

  /**
   * Obtener contratos por trabajador
   */
  async getContratosByTrabajador(idTrabajador) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const contratos = (mockData.contratos || []).filter(
      (c) => c.idTrabajador?.idTrabajador === parseInt(idTrabajador)
    );

    console.log(
      `📋 [DEMO] Contratos del trabajador ${idTrabajador}:`,
      contratos.length
    );
    return contratos;
  },

  /**
   * Obtener contratos activos
   */
  async getContratosActivos() {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const contratos = (mockData.contratos || []).filter(
      (c) => c.estadoContrato === "activo"
    );

    console.log("📋 [DEMO] Contratos activos:", contratos.length);
    return contratos;
  },

  /**
   * Obtener contratos próximos a vencer (30 días)
   */
  async getContratosPorVencer() {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const hoy = new Date();
    const treintaDias = new Date();
    treintaDias.setDate(treintaDias.getDate() + 30);

    const contratos = (mockData.contratos || []).filter((c) => {
      if (!c.fechaFin || c.estadoContrato !== "activo") return false;
      
      const fechaFin = new Date(c.fechaFin);
      return fechaFin >= hoy && fechaFin <= treintaDias;
    });

    console.log("⚠️ [DEMO] Contratos por vencer:", contratos.length);
    return contratos;
  },

  /**
   * Obtener contratos vencidos
   */
  async getContratosVencidos() {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const contratos = (mockData.contratos || []).filter(
      (c) => c.estadoContrato === "vencido"
    );

    console.log("🔴 [DEMO] Contratos vencidos:", contratos.length);
    return contratos;
  },

  /**
   * Crear un nuevo contrato
   */
  async createContrato(contratoData) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    console.log("📝 [DEMO] Creando contrato:", contratoData);

    // Validar datos requeridos
    const requiredFields = [
      "fechaInicio",
      "salario",
      "estadoContrato",
      "idTipoContrato",
      "idTrabajador",
    ];
    const missingFields = requiredFields.filter(
      (field) => !contratoData[field]
    );

    if (missingFields.length > 0) {
      throw new Error(`Faltan campos requeridos: ${missingFields.join(", ")}`);
    }

    // Buscar el tipo de contrato
    const tipoContrato = (mockData.tiposContrato || []).find(
      (tc) => tc.idTipoContrato === parseInt(contratoData.idTipoContrato)
    );
    if (!tipoContrato) {
      throw new Error("Tipo de contrato no encontrado");
    }

    // Buscar el trabajador
    const trabajador = (mockData.trabajadores || []).find(
      (t) => t.idTrabajador === parseInt(contratoData.idTrabajador)
    );
    if (!trabajador) {
      throw new Error("Trabajador no encontrado");
    }

    // Crear el nuevo contrato
    const nuevoContrato = {
      idContrato: parseInt(generateId()),
      fechaInicio: contratoData.fechaInicio,
      fechaFin: contratoData.fechaFin || null,
      salario: parseFloat(contratoData.salario),
      estadoContrato: contratoData.estadoContrato,
      observaciones: contratoData.observaciones || "",
      creado: new Date().toISOString(),
      actualizado: new Date().toISOString(),
      idTipoContrato: {
        idTipoContrato: tipoContrato.idTipoContrato,
        nombreTipo: tipoContrato.nombreTipo,
        descripcion: tipoContrato.descripcion,
        duracionMeses: tipoContrato.duracionMeses,
      },
      idTrabajador: {
        idTrabajador: trabajador.idTrabajador,
        nombre: trabajador.nombre,
        apellido: trabajador.apellido,
        nroDocumento: trabajador.nroDocumento,
        correo: trabajador.correo,
        telefono: trabajador.telefono,
        idRol: trabajador.idRol,
      },
    };

    // Agregar a mockData
    if (!mockData.contratos) {
      mockData.contratos = [];
    }
    mockData.contratos.push(nuevoContrato);

    console.log("✅ [DEMO] Contrato creado exitosamente:", nuevoContrato);
    return nuevoContrato;
  },

  /**
   * Actualizar un contrato existente
   */
  async updateContrato(id, contratoData) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    console.log(`📝 [DEMO] Actualizando contrato ${id}:`, contratoData);

    const index = (mockData.contratos || []).findIndex(
      (c) => c.idContrato === parseInt(id)
    );

    if (index === -1) {
      throw new Error("Contrato no encontrado");
    }

    // Actualizar el contrato
    const contratoActualizado = {
      ...mockData.contratos[index],
      ...contratoData,
      actualizado: new Date().toISOString(),
    };

    mockData.contratos[index] = contratoActualizado;

    console.log("✅ [DEMO] Contrato actualizado:", contratoActualizado);
    return contratoActualizado;
  },

  /**
   * Eliminar un contrato
   */
  async deleteContrato(id) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    console.log(`🗑️ [DEMO] Eliminando contrato ${id}`);

    const index = (mockData.contratos || []).findIndex(
      (c) => c.idContrato === parseInt(id)
    );

    if (index === -1) {
      throw new Error("Contrato no encontrado");
    }

    const contratoEliminado = mockData.contratos.splice(index, 1)[0];

    console.log("✅ [DEMO] Contrato eliminado:", contratoEliminado);
    return contratoEliminado;
  },

  /**
   * Obtener todos los tipos de contrato
   */
  async getAllTiposContrato() {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const tiposContrato = mockData.tiposContrato || [];

    console.log("📋 [DEMO] Tipos de contrato:", tiposContrato.length);
    return tiposContrato;
  },

  /**
   * Obtener estadísticas de contratos
   */
  async getEstadisticas() {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const contratos = mockData.contratos || [];
    const hoy = new Date();
    const treintaDias = new Date();
    treintaDias.setDate(treintaDias.getDate() + 30);

    const estadisticas = {
      total: contratos.length,
      active: contratos.filter((c) => c.estadoContrato === "activo").length,
      expiringSoon: contratos.filter((c) => {
        if (!c.fechaFin || c.estadoContrato !== "activo") return false;
        const fechaFin = new Date(c.fechaFin);
        return fechaFin >= hoy && fechaFin <= treintaDias;
      }).length,
      expired: contratos.filter((c) => c.estadoContrato === "vencido").length,
    };

    console.log("📊 [DEMO] Estadísticas de contratos:", estadisticas);
    return estadisticas;
  },
};
