import { mockData } from "../data/mockData";

// Simular delay de API
const simulateApiDelay = () =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * 600 + 200));

// Obtener todos los tipos de seguros
export const getAllTiposSeguros = async (filtros = {}) => {
  await simulateApiDelay();
  
  let seguros = [...mockData.tiposSeguros];
  
  // Filtrar por estado activo
  if (filtros.estaActivo !== undefined) {
    seguros = seguros.filter(s => s.estaActivo === filtros.estaActivo);
  }
  
  // Filtrar por obligatorio
  if (filtros.esObligatorio !== undefined) {
    seguros = seguros.filter(s => s.esObligatorio === filtros.esObligatorio);
  }
  
  // Filtrar por tipo de cálculo
  if (filtros.tipoCalculo) {
    seguros = seguros.filter(s => s.tipoCalculo === filtros.tipoCalculo);
  }
  
  // Ordenar por fecha de creación (más reciente primero)
  seguros.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
  
  return seguros.map(s => ({ ...s }));
};

// Obtener un tipo de seguro por ID
export const getTipoSeguroById = async (id) => {
  await simulateApiDelay();
  
  const seguro = mockData.tiposSeguros.find(s => s.idTipoSeguro === parseInt(id));
  
  if (!seguro) {
    throw new Error("Tipo de seguro no encontrado");
  }
  
  return { ...seguro };
};

// Crear un nuevo tipo de seguro (funciona agregando a mockData temporalmente)
export const createTipoSeguro = async (data) => {
  await simulateApiDelay();
  
  const nuevoSeguro = {
    idTipoSeguro: mockData.tiposSeguros.length + 1,
    nombreSeguro: data.nombreSeguro,
    descripcion: data.descripcion,
    tipoCalculo: data.tipoCalculo,
    porcentajeDescuento: data.tipoCalculo === "PORCENTAJE" ? parseFloat(data.porcentajeDescuento) : null,
    montoFijo: data.tipoCalculo === "MONTO_FIJO" ? parseFloat(data.montoFijo) : null,
    esObligatorio: data.esObligatorio || false,
    estaActivo: data.estaActivo !== undefined ? data.estaActivo : true,
    cobertura: data.cobertura || "Cobertura estándar",
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
    creadoPor: "Usuario Demo",
  };
  
  // Agregar a mockData (persiste durante la sesión)
  mockData.tiposSeguros.push(nuevoSeguro);
  
  return { ...nuevoSeguro };
};

// Actualizar un tipo de seguro
export const updateTipoSeguro = async (id, data) => {
  await simulateApiDelay();
  
  const index = mockData.tiposSeguros.findIndex(s => s.idTipoSeguro === parseInt(id));
  
  if (index === -1) {
    throw new Error("Tipo de seguro no encontrado");
  }
  
  mockData.tiposSeguros[index] = {
    ...mockData.tiposSeguros[index],
    ...data,
    idTipoSeguro: parseInt(id), // Mantener el ID original
    fechaActualizacion: new Date().toISOString(),
  };
  
  return { ...mockData.tiposSeguros[index] };
};

// Eliminar un tipo de seguro
export const deleteTipoSeguro = async (id) => {
  await simulateApiDelay();
  
  const index = mockData.tiposSeguros.findIndex(s => s.idTipoSeguro === parseInt(id));
  
  if (index === -1) {
    throw new Error("Tipo de seguro no encontrado");
  }
  
  const seguroEliminado = mockData.tiposSeguros[index];
  mockData.tiposSeguros.splice(index, 1);
  
  return { ...seguroEliminado };
};

// Activar/Desactivar un tipo de seguro
export const toggleEstadoSeguro = async (id) => {
  await simulateApiDelay();
  
  const index = mockData.tiposSeguros.findIndex(s => s.idTipoSeguro === parseInt(id));
  
  if (index === -1) {
    throw new Error("Tipo de seguro no encontrado");
  }
  
  mockData.tiposSeguros[index].estaActivo = !mockData.tiposSeguros[index].estaActivo;
  mockData.tiposSeguros[index].fechaActualizacion = new Date().toISOString();
  
  return { ...mockData.tiposSeguros[index] };
};

// Obtener estadísticas de tipos de seguros
export const getEstadisticas = async () => {
  await simulateApiDelay();
  
  const seguros = mockData.tiposSeguros;
  
  const totalSeguros = seguros.length;
  const segurosActivos = seguros.filter(s => s.estaActivo).length;
  const segurosInactivos = seguros.filter(s => !s.estaActivo).length;
  const segurosObligatorios = seguros.filter(s => s.esObligatorio).length;
  const segurosPorcentaje = seguros.filter(s => s.tipoCalculo === "PORCENTAJE").length;
  const segurosMontoFijo = seguros.filter(s => s.tipoCalculo === "MONTO_FIJO").length;
  
  return {
    totalSeguros,
    segurosActivos,
    segurosInactivos,
    segurosObligatorios,
    segurosPorcentaje,
    segurosMontoFijo,
  };
};

export default {
  getAllTiposSeguros,
  getTipoSeguroById,
  createTipoSeguro,
  updateTipoSeguro,
  deleteTipoSeguro,
  toggleEstadoSeguro,
  getEstadisticas,
};
