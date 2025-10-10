import { mockData } from '../data/mockData';

const { planillasMensuales } = mockData;

// Función para simular delay de API
const simulateApiDelay = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 600 + 200);
  });
};

// Obtener planillas mensuales (con filtros opcionales)
export const obtenerPlanillasMensuales = async (filtros = {}) => {
  await simulateApiDelay();
  
  let planillasFiltradas = [...planillasMensuales];
  
  // Aplicar filtros si existen
  if (filtros.estado) {
    planillasFiltradas = planillasFiltradas.filter(
      p => p.estadoPlanilla === filtros.estado
    );
  }
  
  if (filtros.mes) {
    planillasFiltradas = planillasFiltradas.filter(
      p => p.mes === parseInt(filtros.mes)
    );
  }
  
  if (filtros.anio) {
    planillasFiltradas = planillasFiltradas.filter(
      p => p.anio === parseInt(filtros.anio)
    );
  }
  
  return {
    success: true,
    data: planillasFiltradas,
  };
};

// Aprobar planillas masivo (simulado - solo muestra mensaje)
export const aprobarPlanillasMasivo = async (data) => {
  await simulateApiDelay();
  
  // En demo mode, no modificamos los datos reales
  // Solo retornamos éxito para que el toast se muestre
  return {
    success: true,
    message: 'Esta es una demostración. Para aprobar planillas reales, adquiere el software completo.',
  };
};

// Obtener planilla por ID
export const getPlanillaById = async (id) => {
  await simulateApiDelay();
  
  const planilla = planillasMensuales.find(p => p.idPlanillaMensual === id);
  
  if (!planilla) {
    throw new Error('Planilla no encontrada');
  }
  
  return {
    success: true,
    data: { ...planilla },
  };
};

// Obtener estadísticas de planillas
export const getEstadisticas = async () => {
  await simulateApiDelay();
  
  const stats = {
    total: planillasMensuales.length,
    pendientes: planillasMensuales.filter(p => p.estadoPlanilla === 'PENDIENTE').length,
    aprobadas: planillasMensuales.filter(p => p.estadoPlanilla === 'APROBADA').length,
    pagadas: planillasMensuales.filter(p => p.estadoPlanilla === 'PAGADA').length,
    generadas: planillasMensuales.filter(p => p.estadoPlanilla === 'GENERADA').length,
    rechazadas: planillasMensuales.filter(p => p.estadoPlanilla === 'RECHAZADA').length,
  };
  
  return {
    success: true,
    data: stats,
  };
};

const demoPlanillaMensualService = {
  obtenerPlanillasMensuales,
  aprobarPlanillasMasivo,
  getPlanillaById,
  getEstadisticas,
};

export default demoPlanillaMensualService;
