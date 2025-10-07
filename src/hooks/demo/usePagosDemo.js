import { useDemoQuery, useDemoMutation, createDemoQueryFn, createDemoMutationFn } from './useDemoQuery';
import { mockData } from '../../data/mockData';

/**
 * Hook para obtener pagos
 */
export const usePagosDemo = (filters = {}) => {
  return useDemoQuery({
    queryKey: ['pagos', filters],
    queryFn: createDemoQueryFn('pagos', filters),
    defaultData: []
  });
};

/**
 * Hook para obtener pensiones
 */
export const usePensionesDemo = (filters = {}) => {
  return useDemoQuery({
    queryKey: ['pensiones', filters],
    queryFn: createDemoQueryFn('pensiones', filters),
    defaultData: []
  });
};

/**
 * Hook para obtener pagos por estudiante
 */
export const usePagosPorEstudianteDemo = (estudianteId) => {
  return useDemoQuery({
    queryKey: ['pagos', 'estudiante', estudianteId],
    queryFn: async () => {
      const pagos = mockData.pagos
        .filter(p => p.estudianteId === estudianteId)
        .map(p => {
          const pension = mockData.pensiones.find(pen => pen.id === p.pensionId);
          return {
            ...p,
            pension: pension || null
          };
        });
      
      return pagos.sort((a, b) => new Date(b.fechaPago) - new Date(a.fechaPago));
    },
    enabled: !!estudianteId,
    defaultData: []
  });
};

/**
 * Hook para obtener pensiones por estudiante
 */
export const usePensionesPorEstudianteDemo = (estudianteId) => {
  return useDemoQuery({
    queryKey: ['pensiones', 'estudiante', estudianteId],
    queryFn: async () => {
      const pensiones = mockData.pensiones
        .filter(p => p.estudianteId === estudianteId)
        .map(p => {
          // Buscar si hay pago asociado
          const pago = mockData.pagos.find(pago => pago.pensionId === p.id);
          return {
            ...p,
            pagado: !!pago,
            pago: pago || null
          };
        });
      
      return pensiones.sort((a, b) => new Date(b.fechaVencimiento) - new Date(a.fechaVencimiento));
    },
    enabled: !!estudianteId,
    defaultData: []
  });
};

/**
 * Hook para obtener pagos por padre/apoderado
 */
export const usePagosPorPadreDemo = (padreId) => {
  return useDemoQuery({
    queryKey: ['pagos', 'padre', padreId],
    queryFn: async () => {
      // Obtener estudiantes del padre
      const estudiantesPadre = mockData.estudiantes
        .filter(e => e.padreId === padreId)
        .map(e => e.id);
      
      const pagos = mockData.pagos
        .filter(p => estudiantesPadre.includes(p.estudianteId))
        .map(p => {
          const estudiante = mockData.estudiantes.find(e => e.id === p.estudianteId);
          const pension = mockData.pensiones.find(pen => pen.id === p.pensionId);
          return {
            ...p,
            estudiante: estudiante ? `${estudiante.nombre} ${estudiante.apellidos}` : 'Estudiante no encontrado',
            pension: pension || null
          };
        });
      
      return pagos.sort((a, b) => new Date(b.fechaPago) - new Date(a.fechaPago));
    },
    enabled: !!padreId,
    defaultData: []
  });
};

/**
 * Hook para obtener pensiones por padre/apoderado
 */
export const usePensionesPorPadreDemo = (padreId) => {
  return useDemoQuery({
    queryKey: ['pensiones', 'padre', padreId],
    queryFn: async () => {
      // Obtener estudiantes del padre
      const estudiantesPadre = mockData.estudiantes
        .filter(e => e.padreId === padreId)
        .map(e => e.id);
      
      const pensiones = mockData.pensiones
        .filter(p => estudiantesPadre.includes(p.estudianteId))
        .map(p => {
          const estudiante = mockData.estudiantes.find(e => e.id === p.estudianteId);
          const pago = mockData.pagos.find(pago => pago.pensionId === p.id);
          return {
            ...p,
            estudiante: estudiante ? `${estudiante.nombre} ${estudiante.apellidos}` : 'Estudiante no encontrado',
            pagado: !!pago,
            pago: pago || null
          };
        });
      
      return pensiones.sort((a, b) => new Date(b.fechaVencimiento) - new Date(a.fechaVencimiento));
    },
    enabled: !!padreId,
    defaultData: []
  });
};

/**
 * Hook para estado de pagos (dashboard)
 */
export const useEstadoPagosDemo = (filtros = {}) => {
  return useDemoQuery({
    queryKey: ['pagos', 'estado', filtros],
    queryFn: async () => {
      let pensiones = mockData.pensiones;
      let pagos = mockData.pagos;
      
      // Aplicar filtros si es necesario
      if (filtros.estudianteId) {
        pensiones = pensiones.filter(p => p.estudianteId === filtros.estudianteId);
        pagos = pagos.filter(p => p.estudianteId === filtros.estudianteId);
      }
      
      if (filtros.padreId) {
        const estudiantesPadre = mockData.estudiantes
          .filter(e => e.padreId === filtros.padreId)
          .map(e => e.id);
        pensiones = pensiones.filter(p => estudiantesPadre.includes(p.estudianteId));
        pagos = pagos.filter(p => estudiantesPadre.includes(p.estudianteId));
      }
      
      // Calcular estadísticas
      const totalPensiones = pensiones.length;
      const pensionesIdsConPago = new Set(pagos.map(p => p.pensionId));
      const pensiones_pagadas = pensiones.filter(p => pensionesIdsConPago.has(p.id)).length;
      const pensiones_pendientes = totalPensiones - pensiones_pagadas;
      
      // Pensiones vencidas (sin pagar y fecha vencida)
      const hoy = new Date();
      const pensiones_vencidas = pensiones.filter(p => 
        !pensionesIdsConPago.has(p.id) && new Date(p.fechaVencimiento) < hoy
      ).length;
      
      // Montos
      const montoTotal = pensiones.reduce((sum, p) => sum + parseFloat(p.monto), 0);
      const montoPagado = pensiones
        .filter(p => pensionesIdsConPago.has(p.id))
        .reduce((sum, p) => sum + parseFloat(p.monto), 0);
      const montoPendiente = montoTotal - montoPagado;
      
      // Próximos vencimientos (próximos 7 días)
      const proximaSemanaPensiones = pensiones.filter(p => {
        if (pensionesIdsConPago.has(p.id)) return false;
        const vencimiento = new Date(p.fechaVencimiento);
        const proximaSemana = new Date();
        proximaSemana.setDate(proximaSemana.getDate() + 7);
        return vencimiento >= hoy && vencimiento <= proximaSemana;
      }).length;
      
      return {
        totalPensiones,
        pensiones_pagadas,
        pensiones_pendientes,
        pensiones_vencidas,
        proximosVencimientos: proximaSemanaPensiones,
        montos: {
          total: montoTotal,
          pagado: montoPagado,
          pendiente: montoPendiente
        },
        porcentajePago: totalPensiones > 0 ? ((pensiones_pagadas / totalPensiones) * 100).toFixed(1) : 0
      };
    },
    defaultData: {
      totalPensiones: 0,
      pensiones_pagadas: 0,
      pensiones_pendientes: 0,
      pensiones_vencidas: 0,
      proximosVencimientos: 0,
      montos: { total: 0, pagado: 0, pendiente: 0 },
      porcentajePago: 0
    }
  });
};

/**
 * Hook para crear pago
 */
export const useCrearPagoDemo = () => {
  return useDemoMutation({
    mutationFn: async (pagoData) => {
      const nuevoPago = {
        id: Date.now().toString(),
        ...pagoData,
        fechaPago: new Date().toISOString(),
        estado: 'COMPLETADO'
      };
      console.log('🎭 Demo: Registrando pago', nuevoPago);
      return nuevoPago;
    },
    onSuccess: (data) => {
      console.log('🎭 Demo: Pago registrado exitosamente', data);
    }
  });
};

/**
 * Hook para crear pensión
 */
export const useCrearPensionDemo = () => {
  return useDemoMutation({
    mutationFn: async (pensionData) => {
      const nuevaPension = {
        id: Date.now().toString(),
        ...pensionData,
        fechaCreacion: new Date().toISOString(),
        estado: 'PENDIENTE'
      };
      console.log('🎭 Demo: Creando pensión', nuevaPension);
      return nuevaPension;
    },
    onSuccess: (data) => {
      console.log('🎭 Demo: Pensión creada exitosamente', data);
    }
  });
};

/**
 * Hook para actualizar pensión
 */
export const useActualizarPensionDemo = () => {
  return useDemoMutation({
    mutationFn: createDemoMutationFn('update', 'pensiones'),
    onSuccess: (data) => {
      console.log('🎭 Demo: Pensión actualizada exitosamente', data);
    }
  });
};

/**
 * Hook para eliminar pensión
 */
export const useEliminarPensionDemo = () => {
  return useDemoMutation({
    mutationFn: createDemoMutationFn('delete', 'pensiones'),
    onSuccess: (data) => {
      console.log('🎭 Demo: Pensión eliminada exitosamente', data);
    }
  });
};

/**
 * Hook para reporte de ingresos
 */
export const useReporteIngresosDemo = (filtros = {}) => {
  return useDemoQuery({
    queryKey: ['reportes', 'ingresos', filtros],
    queryFn: async () => {
      let pagos = mockData.pagos;
      
      // Aplicar filtros de fecha
      if (filtros.fechaInicio) {
        pagos = pagos.filter(p => new Date(p.fechaPago) >= new Date(filtros.fechaInicio));
      }
      
      if (filtros.fechaFin) {
        pagos = pagos.filter(p => new Date(p.fechaPago) <= new Date(filtros.fechaFin));
      }
      
      // Agrupar por mes
      const ingresosPorMes = pagos.reduce((acc, pago) => {
        const mes = new Date(pago.fechaPago).toISOString().slice(0, 7);
        if (!acc[mes]) {
          acc[mes] = { totalPagos: 0, montoTotal: 0, pagos: [] };
        }
        acc[mes].totalPagos += 1;
        acc[mes].montoTotal += parseFloat(pago.monto);
        acc[mes].pagos.push(pago);
        return acc;
      }, {});
      
      // Agrupar por método de pago
      const porMetodoPago = pagos.reduce((acc, pago) => {
        if (!acc[pago.metodoPago]) {
          acc[pago.metodoPago] = { total: 0, monto: 0 };
        }
        acc[pago.metodoPago].total += 1;
        acc[pago.metodoPago].monto += parseFloat(pago.monto);
        return acc;
      }, {});
      
      const totalIngresos = pagos.reduce((sum, p) => sum + parseFloat(p.monto), 0);
      
      return {
        totalPagos: pagos.length,
        totalIngresos,
        promedioMonto: pagos.length > 0 ? (totalIngresos / pagos.length).toFixed(2) : 0,
        ingresosPorMes,
        porMetodoPago,
        pagosDetalle: pagos.sort((a, b) => new Date(b.fechaPago) - new Date(a.fechaPago))
      };
    },
    defaultData: {
      totalPagos: 0,
      totalIngresos: 0,
      promedioMonto: 0,
      ingresosPorMes: {},
      porMetodoPago: {},
      pagosDetalle: []
    }
  });
};