import { mockData } from "../data/mockData";

// Simular delay de API
const simulateApiDelay = () =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * 600 + 200));

// Obtener todas las planillas con filtros opcionales
export const getAllPlanillas = async (filters = {}) => {
  await simulateApiDelay();
  
  let planillas = [...mockData.planillas];
  
  // Filtrar por mes
  if (filters.mes) {
    planillas = planillas.filter(p => p.mes === parseInt(filters.mes));
  }
  
  // Filtrar por año
  if (filters.anio) {
    planillas = planillas.filter(p => p.anio === parseInt(filters.anio));
  }
  
  // Filtrar por estado
  if (filters.estado) {
    planillas = planillas.filter(p => p.estado === filters.estado);
  }
  
  // Ordenar por fecha de generación (más reciente primero)
  planillas.sort((a, b) => new Date(b.fechaGeneracion) - new Date(a.fechaGeneracion));
  
  return planillas.map(p => ({ ...p }));
};

// Obtener planillas por periodo específico
export const getPlanillasByPeriodo = async (mes, anio) => {
  await simulateApiDelay();
  
  const planillas = mockData.planillas.filter(
    p => p.mes === parseInt(mes) && p.anio === parseInt(anio)
  );
  
  return planillas.map(p => ({ ...p }));
};

// Obtener una planilla por ID
export const getPlanillaById = async (id) => {
  await simulateApiDelay();
  
  const planilla = mockData.planillas.find(p => p.idPlanilla === parseInt(id));
  
  if (!planilla) {
    throw new Error("Planilla no encontrada");
  }
  
  return { ...planilla };
};

// Obtener trabajadores disponibles para generar planilla
export const getTrabajadoresDisponibles = async (mes, anio) => {
  await simulateApiDelay();
  
  // Verificar si ya existe planilla para el periodo
  const planillaExistente = mockData.planillas.find(
    p => p.mes === parseInt(mes) && p.anio === parseInt(anio)
  );
  
  // Si existe planilla, devolver los trabajadores que ya están en ella
  if (planillaExistente && planillaExistente.detallesPlanilla && planillaExistente.detallesPlanilla.length > 0) {
    return planillaExistente.detallesPlanilla.map(d => ({
      ...d.idTrabajador,
      sueldoBase: d.sueldoBase,
      diasTrabajados: d.diasTrabajados,
      tipoDocumento: "DNI",
      direccion: "Lima, Perú",
      telefono: "987654321",
      estaActivo: true,
      contratoTrabajadors3: [{
        numeroContrato: `CONT-${d.idTrabajador.idTrabajador}-2025`,
        cargoContrato: "Docente",
        lugarTrabajo: "Sede Principal",
        sueldoContratado: d.sueldoBase.toFixed(2),
      }],
    }));
  }
  
  // Si no existe, devolver trabajadores de ejemplo
  return [
    {
      idTrabajador: 1,
      nombre: "María",
      apellido: "González",
      nroDocumento: "12345678",
      correo: "maria.gonzalez@colegio.edu.pe",
      tipoDocumento: "DNI",
      direccion: "Lima, Perú",
      telefono: "987654321",
      sueldoBase: 2500.00,
      diasTrabajados: 30,
      estaActivo: true,
      contratoTrabajadors3: [{
        numeroContrato: "CONT-1-2025",
        cargoContrato: "Profesora de Matemáticas",
        lugarTrabajo: "Sede Principal",
        sueldoContratado: "2500.00",
      }],
    },
    {
      idTrabajador: 2,
      nombre: "Carlos",
      apellido: "Rodríguez",
      nroDocumento: "23456789",
      correo: "carlos.rodriguez@colegio.edu.pe",
      tipoDocumento: "DNI",
      direccion: "Lima, Perú",
      telefono: "987654322",
      sueldoBase: 3200.00,
      diasTrabajados: 30,
      estaActivo: true,
      contratoTrabajadors3: [{
        numeroContrato: "CONT-2-2025",
        cargoContrato: "Coordinador Académico",
        lugarTrabajo: "Sede Principal",
        sueldoContratado: "3200.00",
      }],
    },
    {
      idTrabajador: 3,
      nombre: "Ana",
      apellido: "Martínez",
      nroDocumento: "34567890",
      correo: "ana.martinez@colegio.edu.pe",
      tipoDocumento: "DNI",
      direccion: "Lima, Perú",
      telefono: "987654323",
      sueldoBase: 2400.00,
      diasTrabajados: 30,
      estaActivo: true,
      contratoTrabajadors3: [{
        numeroContrato: "CONT-3-2025",
        cargoContrato: "Profesora de Comunicación",
        lugarTrabajo: "Sede Principal",
        sueldoContratado: "2400.00",
      }],
    },
  ];
};

// Crear una nueva planilla
export const createPlanilla = async (data) => {
  await simulateApiDelay();
  
  const nuevaPlanilla = {
    idPlanilla: mockData.planillas.length + 1,
    mes: data.mes,
    anio: data.anio,
    periodo: `${String(data.mes).padStart(2, '0')}/${data.anio}`,
    fechaGeneracion: new Date().toISOString(),
    fechaPago: null,
    estado: "procesando",
    totalPlanilla: 0,
    totalTrabajadores: data.trabajadores?.length || 0,
    observaciones: data.observaciones || "",
    detallesPlanilla: data.trabajadores || [],
    generadoPor: {
      nombre: "Admin",
      apellido: "Sistema",
    },
    aprobadoPor: null,
    fechaAprobacion: null,
  };
  
  // Calcular total
  if (data.trabajadores && data.trabajadores.length > 0) {
    nuevaPlanilla.totalPlanilla = data.trabajadores.reduce(
      (sum, t) => sum + (t.sueldoNeto || 0),
      0
    );
  }
  
  mockData.planillas.push(nuevaPlanilla);
  
  return { ...nuevaPlanilla };
};

// Actualizar una planilla
export const updatePlanilla = async (id, data) => {
  await simulateApiDelay();
  
  const index = mockData.planillas.findIndex(p => p.idPlanilla === parseInt(id));
  
  if (index === -1) {
    throw new Error("Planilla no encontrada");
  }
  
  mockData.planillas[index] = {
    ...mockData.planillas[index],
    ...data,
    idPlanilla: parseInt(id), // Mantener el ID original
  };
  
  return { ...mockData.planillas[index] };
};

// Procesar pago de planilla
export const procesarPagoPlanilla = async (id) => {
  await simulateApiDelay();
  
  const index = mockData.planillas.findIndex(p => p.idPlanilla === parseInt(id));
  
  if (index === -1) {
    throw new Error("Planilla no encontrada");
  }
  
  mockData.planillas[index] = {
    ...mockData.planillas[index],
    estado: "pagada",
    fechaPago: new Date().toISOString(),
    aprobadoPor: {
      nombre: "Director",
      apellido: "General",
    },
    fechaAprobacion: new Date().toISOString(),
  };
  
  return { ...mockData.planillas[index] };
};

// Eliminar una planilla
export const deletePlanilla = async (id) => {
  await simulateApiDelay();
  
  const index = mockData.planillas.findIndex(p => p.idPlanilla === parseInt(id));
  
  if (index === -1) {
    throw new Error("Planilla no encontrada");
  }
  
  const planillaEliminada = mockData.planillas[index];
  mockData.planillas.splice(index, 1);
  
  return { ...planillaEliminada };
};

// Obtener estadísticas de planillas por periodo
export const getEstadisticas = async (mes, anio) => {
  await simulateApiDelay();
  
  let planillas = [...mockData.planillas];
  
  // Filtrar por periodo si se proporciona
  if (mes && anio) {
    planillas = planillas.filter(
      p => p.mes === parseInt(mes) && p.anio === parseInt(anio)
    );
  }
  
  const totalPlanillas = planillas.length;
  const totalPagadas = planillas.filter(p => p.estado === "pagada").length;
  const totalPendientes = planillas.filter(p => p.estado === "pendiente").length;
  const totalProcesando = planillas.filter(p => p.estado === "procesando").length;
  
  const totalMontoGeneral = planillas.reduce((sum, p) => sum + (p.totalPlanilla || 0), 0);
  const totalTrabajadoresGeneral = planillas.reduce((sum, p) => sum + (p.totalTrabajadores || 0), 0);
  
  return {
    totalPlanillas,
    totalPagadas,
    totalPendientes,
    totalProcesando,
    totalMontoGeneral,
    totalTrabajadoresGeneral,
  };
};

// Exportar planilla (simulado)
export const exportarPlanilla = async (id, formato = "pdf") => {
  await simulateApiDelay();
  
  const planilla = mockData.planillas.find(p => p.idPlanilla === parseInt(id));
  
  if (!planilla) {
    throw new Error("Planilla no encontrada");
  }
  
  // En producción real, aquí se generaría el archivo
  return {
    success: true,
    mensaje: `Planilla exportada en formato ${formato.toUpperCase()}`,
    nombreArchivo: `planilla_${planilla.periodo.replace('/', '_')}.${formato}`,
  };
};

export default {
  getAllPlanillas,
  getPlanillasByPeriodo,
  getPlanillaById,
  getTrabajadoresDisponibles,
  createPlanilla,
  updatePlanilla,
  procesarPagoPlanilla,
  deletePlanilla,
  getEstadisticas,
  exportarPlanilla,
};
