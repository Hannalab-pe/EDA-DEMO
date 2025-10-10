// Servicio DEMO para roles (sin conexión a API)
import { mockData, generateId } from "../data/mockData";

/**
 * Servicio DEMO para gestión de roles
 * Todas las operaciones son locales, sin llamadas al backend
 */
export const demoRolesService = {
  /**
   * Obtener todos los roles
   */
  getRoles: async (filters = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let roles = [...mockData.roles];

    // Aplicar filtros si existen
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      roles = roles.filter(
        (r) =>
          r.nombre?.toLowerCase().includes(searchLower) ||
          r.descripcion?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status !== undefined && filters.status !== "") {
      const isActive =
        filters.status === "true" ||
        filters.status === true ||
        filters.status === 1;
      roles = roles.filter((r) => r.estaActivo === isActive);
    }

    console.log("📋 [DEMO] Roles obtenidos:", roles.length);
    return roles;
  },

  /**
   * Obtener un rol por ID
   */
  getRolById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const rol = mockData.roles.find((r) => r.idRol === parseInt(id));

    if (!rol) {
      throw new Error("Rol no encontrado");
    }

    console.log("📄 [DEMO] Rol encontrado:", rol);
    return rol;
  },

  /**
   * Crear un nuevo rol
   */
  createRol: async (rolData) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    console.log("📝 [DEMO] Creando rol:", rolData);

    // Validar datos requeridos
    if (!rolData.nombre) {
      throw new Error("El nombre del rol es requerido");
    }

    // Verificar si ya existe un rol con ese nombre
    const existeRol = mockData.roles.find(
      (r) => r.nombre.toLowerCase() === rolData.nombre.toLowerCase()
    );

    if (existeRol) {
      throw new Error("Ya existe un rol con ese nombre");
    }

    const nuevoRol = {
      idRol: parseInt(generateId()),
      nombre: rolData.nombre.toUpperCase(),
      descripcion: rolData.descripcion || "",
      estaActivo: rolData.estaActivo !== undefined ? rolData.estaActivo : true,
      creado: new Date().toISOString(),
      actualizado: new Date().toISOString(),
    };

    mockData.roles.push(nuevoRol);

    console.log("✅ [DEMO] Rol creado:", nuevoRol);
    return nuevoRol;
  },

  /**
   * Actualizar un rol existente
   */
  updateRol: async ({ id, ...rolData }) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    console.log("📝 [DEMO] Actualizando rol:", id, rolData);

    const index = mockData.roles.findIndex((r) => r.idRol === parseInt(id));

    if (index === -1) {
      throw new Error("Rol no encontrado");
    }

    // Si se actualiza el nombre, verificar que no exista otro con ese nombre
    if (rolData.nombre) {
      const existeRol = mockData.roles.find(
        (r) =>
          r.nombre.toLowerCase() === rolData.nombre.toLowerCase() &&
          r.idRol !== parseInt(id)
      );

      if (existeRol) {
        throw new Error("Ya existe un rol con ese nombre");
      }
    }

    mockData.roles[index] = {
      ...mockData.roles[index],
      ...rolData,
      nombre: rolData.nombre
        ? rolData.nombre.toUpperCase()
        : mockData.roles[index].nombre,
      idRol: parseInt(id),
      actualizado: new Date().toISOString(),
    };

    console.log("✅ [DEMO] Rol actualizado:", mockData.roles[index]);
    return mockData.roles[index];
  },

  /**
   * Eliminar un rol
   */
  deleteRol: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    console.log("🗑️ [DEMO] Eliminando rol:", id);

    const index = mockData.roles.findIndex((r) => r.idRol === parseInt(id));

    if (index === -1) {
      throw new Error("Rol no encontrado");
    }

    // Verificar si hay trabajadores con este rol
    const trabajadoresConRol = mockData.trabajadores.filter(
      (t) => t.idRol?.idRol === parseInt(id) || t.idRol === parseInt(id)
    );

    if (trabajadoresConRol.length > 0) {
      throw new Error(
        `No se puede eliminar el rol porque hay ${trabajadoresConRol.length} trabajador(es) asignado(s) a este rol`
      );
    }

    const rolEliminado = mockData.roles.splice(index, 1)[0];

    console.log("✅ [DEMO] Rol eliminado:", rolEliminado);
    return parseInt(id);
  },

  /**
   * Cambiar estado de un rol (activar/desactivar)
   */
  toggleRolStatus: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    console.log("🔄 [DEMO] Cambiando estado de rol:", id);

    const index = mockData.roles.findIndex((r) => r.idRol === parseInt(id));

    if (index === -1) {
      throw new Error("Rol no encontrado");
    }

    mockData.roles[index].estaActivo = !mockData.roles[index].estaActivo;
    mockData.roles[index].actualizado = new Date().toISOString();

    console.log("✅ [DEMO] Estado de rol actualizado:", mockData.roles[index]);
    return mockData.roles[index];
  },

  /**
   * Obtener estadísticas de roles
   */
  getRolesStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const total = mockData.roles.length;
    const activos = mockData.roles.filter((r) => r.estaActivo).length;
    const inactivos = total - activos;

    return {
      total,
      activos,
      inactivos,
    };
  },
};

export default demoRolesService;
