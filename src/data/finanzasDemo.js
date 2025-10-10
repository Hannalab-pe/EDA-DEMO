/**
 * Datos de demostración para módulos de finanzas
 * Sistema de gestión financiera completo para jardín infantil
 */

// Generar fecha aleatoria en los últimos 3 meses
const getRandomDate = (daysAgo = 90) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString().split('T')[0];
};

// Saldo de caja actual
export const saldoCajaDemo = {
  saldo: 45780.50,
  ingresos: 28450.00,
  egresos: 15320.00,
  saldoInicial: 32650.50,
  ultimaActualizacion: new Date().toISOString()
};

// Movimientos de caja (últimos 3 meses)
export const movimientosCajaDemo = [
  // Ingresos - Pensiones
  {
    id: 1,
    tipo: 'INGRESO',
    concepto: 'Pensión Marzo - Aula Azul',
    descripcion: 'Pago de pensiones del mes de marzo',
    monto: 6500.00,
    categoria: 'PENSION_MENSUAL',
    subcategoria: 'Pensión Regular',
    metodoPago: 'TRANSFERENCIA',
    comprobante: 'RECIBO-2024-0312',
    estado: 'CONFIRMADO',
    fecha: '2024-03-15',
    numeroTransaccion: 'TRF-2024-0312',
    creadoPor: 'admin@nidopro.com'
  },
  {
    id: 2,
    tipo: 'INGRESO',
    concepto: 'Pensión Marzo - Aula Verde',
    descripcion: 'Pago de pensiones del mes de marzo',
    monto: 5800.00,
    categoria: 'PENSION_MENSUAL',
    subcategoria: 'Pensión Regular',
    metodoPago: 'EFECTIVO',
    comprobante: 'RECIBO-2024-0313',
    estado: 'CONFIRMADO',
    fecha: '2024-03-16',
    creadoPor: 'admin@nidopro.com'
  },
  {
    id: 3,
    tipo: 'INGRESO',
    concepto: 'Pensión Marzo - Aula Amarilla',
    descripcion: 'Pago de pensiones del mes de marzo',
    monto: 6200.00,
    categoria: 'PENSION_MENSUAL',
    subcategoria: 'Pensión Regular',
    metodoPago: 'YAPE',
    comprobante: 'RECIBO-2024-0314',
    estado: 'CONFIRMADO',
    fecha: '2024-03-17',
    numeroTransaccion: 'YPE-2024-0314',
    creadoPor: 'admin@nidopro.com'
  },

  // Ingresos - Matrículas
  {
    id: 4,
    tipo: 'INGRESO',
    concepto: 'Matrículas 2024',
    descripcion: 'Pagos de matrículas nuevos ingresos',
    monto: 9950.00,
    categoria: 'MATRICULA',
    subcategoria: 'Matrícula Inicial',
    metodoPago: 'TRANSFERENCIA',
    comprobante: 'RECIBO-2024-0301',
    estado: 'CONFIRMADO',
    fecha: '2024-03-10',
    numeroTransaccion: 'TRF-2024-0301',
    creadoPor: 'admin@nidopro.com'
  },

  // Egresos - Planillas
  {
    id: 5,
    tipo: 'EGRESO',
    concepto: 'Planilla Docentes Marzo',
    descripcion: 'Pago de sueldos docentes marzo 2024',
    monto: 8500.00,
    categoria: 'PAGO_PLANILLA',
    subcategoria: 'Sueldo Docente',
    metodoPago: 'TRANSFERENCIA',
    comprobante: 'PLANILLA-2024-03',
    estado: 'CONFIRMADO',
    fecha: '2024-03-05',
    numeroTransaccion: 'PLN-2024-03-DOC',
    creadoPor: 'admin@nidopro.com'
  },
  {
    id: 6,
    tipo: 'EGRESO',
    concepto: 'Planilla Administrativos Marzo',
    descripcion: 'Pago de sueldos personal administrativo',
    monto: 3200.00,
    categoria: 'PAGO_PLANILLA',
    subcategoria: 'Sueldo Administrativo',
    metodoPago: 'TRANSFERENCIA',
    comprobante: 'PLANILLA-2024-03-ADM',
    estado: 'CONFIRMADO',
    fecha: '2024-03-05',
    numeroTransaccion: 'PLN-2024-03-ADM',
    creadoPor: 'admin@nidopro.com'
  },

  // Egresos - Gastos Operativos
  {
    id: 7,
    tipo: 'EGRESO',
    concepto: 'Servicios Básicos',
    descripcion: 'Luz, agua, internet - Marzo',
    monto: 2200.00,
    categoria: 'GASTOS_OPERATIVOS',
    subcategoria: 'Servicios',
    metodoPago: 'TRANSFERENCIA',
    comprobante: 'FACT-2024-SRV-03',
    estado: 'CONFIRMADO',
    fecha: '2024-03-03',
    numeroTransaccion: 'SRV-2024-03',
    creadoPor: 'admin@nidopro.com'
  },
  {
    id: 8,
    tipo: 'EGRESO',
    concepto: 'Material Didáctico',
    descripcion: 'Compra de material educativo y juguetes',
    monto: 1850.00,
    categoria: 'GASTOS_OPERATIVOS',
    subcategoria: 'Material Educativo',
    metodoPago: 'EFECTIVO',
    comprobante: 'FACT-2024-MAT-03',
    estado: 'CONFIRMADO',
    fecha: '2024-03-01',
    creadoPor: 'admin@nidopro.com'
  },
  {
    id: 9,
    tipo: 'EGRESO',
    concepto: 'Alimentos y Snacks',
    descripcion: 'Compra mensual de alimentos para lonchera',
    monto: 1420.00,
    categoria: 'GASTOS_OPERATIVOS',
    subcategoria: 'Alimentación',
    metodoPago: 'EFECTIVO',
    comprobante: 'FACT-2024-ALI-03',
    estado: 'CONFIRMADO',
    fecha: '2024-03-08',
    creadoPor: 'admin@nidopro.com'
  },

  // Egresos - Mantenimiento
  {
    id: 10,
    tipo: 'EGRESO',
    concepto: 'Mantenimiento Infraestructura',
    descripcion: 'Pintura y reparaciones menores',
    monto: 980.00,
    categoria: 'INFRAESTRUCTURA',
    subcategoria: 'Mantenimiento',
    metodoPago: 'EFECTIVO',
    comprobante: 'FACT-2024-MNT-03',
    estado: 'CONFIRMADO',
    fecha: '2024-03-12',
    creadoPor: 'admin@nidopro.com'
  },

  // Más movimientos históricos
  {
    id: 11,
    tipo: 'INGRESO',
    concepto: 'Pensión Febrero - Total',
    descripcion: 'Consolidado pensiones febrero',
    monto: 17500.00,
    categoria: 'PENSION_MENSUAL',
    subcategoria: 'Pensión Regular',
    metodoPago: 'MIXTO',
    comprobante: 'RECIBO-2024-0201',
    estado: 'CONFIRMADO',
    fecha: '2024-02-28',
    creadoPor: 'admin@nidopro.com'
  },
  {
    id: 12,
    tipo: 'EGRESO',
    concepto: 'Planilla Febrero',
    descripcion: 'Pago de planilla completa febrero',
    monto: 11200.00,
    categoria: 'PAGO_PLANILLA',
    subcategoria: 'Sueldo Total',
    metodoPago: 'TRANSFERENCIA',
    comprobante: 'PLANILLA-2024-02',
    estado: 'CONFIRMADO',
    fecha: '2024-02-05',
    numeroTransaccion: 'PLN-2024-02',
    creadoPor: 'admin@nidopro.com'
  }
];

// Pagos de pensiones por estudiante
export const pagosPensionesDemo = [
  {
    id: 1,
    estudianteId: 1,
    estudiante: {
      nombre: 'Sofía',
      apellido: 'Pérez Morales',
      nombreCompleto: 'Sofía Pérez Morales',
      grado: '4 años',
      aula: 'Aula Azul',
      codigo: 'EST-2024-001'
    },
    mes: 'Marzo',
    anio: 2024,
    monto: 350.00,
    montoPagado: 350.00,
    fechaVencimiento: '2024-03-10',
    fechaPago: '2024-03-08',
    metodoPago: 'TRANSFERENCIA',
    estado: 'PAGADO',
    comprobante: 'PENSION-2024-03-001',
    mora: 0
  },
  {
    id: 2,
    estudianteId: 2,
    estudiante: {
      nombre: 'Lucas',
      apellido: 'García Torres',
      nombreCompleto: 'Lucas García Torres',
      grado: '5 años',
      aula: 'Aula Verde',
      codigo: 'EST-2024-002'
    },
    mes: 'Marzo',
    anio: 2024,
    monto: 350.00,
    montoPagado: 350.00,
    fechaVencimiento: '2024-03-10',
    fechaPago: '2024-03-09',
    metodoPago: 'YAPE',
    estado: 'PAGADO',
    comprobante: 'PENSION-2024-03-002',
    mora: 0
  },
  {
    id: 3,
    estudianteId: 3,
    estudiante: {
      nombre: 'Valentina',
      apellido: 'Rodríguez Silva',
      nombreCompleto: 'Valentina Rodríguez Silva',
      grado: '3 años',
      aula: 'Aula Amarilla',
      codigo: 'EST-2024-003'
    },
    mes: 'Marzo',
    anio: 2024,
    monto: 350.00,
    montoPagado: 0,
    fechaVencimiento: '2024-03-10',
    fechaPago: null,
    metodoPago: null,
    estado: 'PENDIENTE',
    comprobante: null,
    mora: 15.00
  },
  {
    id: 4,
    estudianteId: 4,
    estudiante: {
      nombre: 'Mateo',
      apellido: 'López Fernández',
      nombreCompleto: 'Mateo López Fernández',
      grado: '4 años',
      aula: 'Aula Azul',
      codigo: 'EST-2024-004'
    },
    mes: 'Marzo',
    anio: 2024,
    monto: 350.00,
    montoPagado: 350.00,
    fechaVencimiento: '2024-03-10',
    fechaPago: '2024-03-10',
    metodoPago: 'EFECTIVO',
    estado: 'PAGADO',
    comprobante: 'PENSION-2024-03-004',
    mora: 0
  },
  {
    id: 5,
    estudianteId: 5,
    estudiante: {
      nombre: 'Emma',
      apellido: 'Martínez Díaz',
      nombreCompleto: 'Emma Martínez Díaz',
      grado: '5 años',
      aula: 'Aula Verde',
      codigo: 'EST-2024-005'
    },
    mes: 'Marzo',
    anio: 2024,
    monto: 350.00,
    montoPagado: 0,
    fechaVencimiento: '2024-03-10',
    fechaPago: null,
    metodoPago: null,
    estado: 'PENDIENTE',
    comprobante: null,
    mora: 25.00
  }
];

// Pagos de matrículas
export const pagosMatriculasDemo = [
  {
    id: 1,
    estudianteId: 1,
    estudiante: {
      nombre: 'Sofía',
      apellido: 'Pérez Morales',
      nombreCompleto: 'Sofía Pérez Morales',
      grado: '4 años',
      codigo: 'EST-2024-001'
    },
    anioEscolar: '2024',
    montoMatricula: 500.00,
    montoPagado: 500.00,
    fechaPago: '2024-01-15',
    metodoPago: 'TRANSFERENCIA',
    estado: 'PAGADO',
    comprobante: 'MATRIC-2024-001',
    descuento: 0
  },
  {
    id: 2,
    estudianteId: 2,
    estudiante: {
      nombre: 'Lucas',
      apellido: 'García Torres',
      nombreCompleto: 'Lucas García Torres',
      grado: '5 años',
      codigo: 'EST-2024-002'
    },
    anioEscolar: '2024',
    montoMatricula: 500.00,
    montoPagado: 450.00,
    fechaPago: '2024-01-20',
    metodoPago: 'EFECTIVO',
    estado: 'PAGADO',
    comprobante: 'MATRIC-2024-002',
    descuento: 50.00,
    razonDescuento: 'Hermano matriculado'
  },
  {
    id: 3,
    estudianteId: 6,
    estudiante: {
      nombre: 'Isabella',
      apellido: 'Sánchez Rojas',
      nombreCompleto: 'Isabella Sánchez Rojas',
      grado: '3 años',
      codigo: 'EST-2024-006'
    },
    anioEscolar: '2024',
    montoMatricula: 500.00,
    montoPagado: 0,
    fechaPago: null,
    metodoPago: null,
    estado: 'PENDIENTE',
    comprobante: null,
    descuento: 0
  }
];

// Planillas de trabajadores
export const planillasTrabajadoresDemo = [
  {
    id: 1,
    trabajadorId: 1,
    trabajador: {
      nombre: 'Carlos',
      apellido: 'Ruiz Mendoza',
      nombreCompleto: 'Prof. Carlos Ruiz Mendoza',
      cargo: 'Docente',
      dni: '12345678'
    },
    mes: 'Marzo',
    anio: 2024,
    sueldoBasico: 2500.00,
    bonificaciones: 200.00,
    descuentos: 250.00,
    sueldoNeto: 2450.00,
    fechaPago: '2024-03-05',
    metodoPago: 'TRANSFERENCIA',
    estado: 'PAGADO',
    comprobante: 'PLANILLA-2024-03-001',
    cuentaBancaria: '****1234'
  },
  {
    id: 2,
    trabajadorId: 2,
    trabajador: {
      nombre: 'Lucía',
      apellido: 'Fernández Silva',
      nombreCompleto: 'Prof. Lucía Fernández Silva',
      cargo: 'Docente',
      dni: '23456789'
    },
    mes: 'Marzo',
    anio: 2024,
    sueldoBasico: 2500.00,
    bonificaciones: 150.00,
    descuentos: 250.00,
    sueldoNeto: 2400.00,
    fechaPago: '2024-03-05',
    metodoPago: 'TRANSFERENCIA',
    estado: 'PAGADO',
    comprobante: 'PLANILLA-2024-03-002',
    cuentaBancaria: '****5678'
  },
  {
    id: 3,
    trabajadorId: 3,
    trabajador: {
      nombre: 'Ana',
      apellido: 'Gómez Vargas',
      nombreCompleto: 'Ana Gómez Vargas',
      cargo: 'Auxiliar',
      dni: '34567890'
    },
    mes: 'Marzo',
    anio: 2024,
    sueldoBasico: 1500.00,
    bonificaciones: 100.00,
    descuentos: 150.00,
    sueldoNeto: 1450.00,
    fechaPago: '2024-03-05',
    metodoPago: 'TRANSFERENCIA',
    estado: 'PAGADO',
    comprobante: 'PLANILLA-2024-03-003',
    cuentaBancaria: '****9012'
  },
  {
    id: 4,
    trabajadorId: 4,
    trabajador: {
      nombre: 'Roberto',
      apellido: 'Chávez Morales',
      nombreCompleto: 'Roberto Chávez Morales',
      cargo: 'Administrativo',
      dni: '45678901'
    },
    mes: 'Marzo',
    anio: 2024,
    sueldoBasico: 1800.00,
    bonificaciones: 0,
    descuentos: 180.00,
    sueldoNeto: 1620.00,
    fechaPago: null,
    metodoPago: null,
    estado: 'PENDIENTE',
    comprobante: null,
    cuentaBancaria: '****3456'
  }
];

// Resumen financiero por mes
export const resumenMensualDemo = {
  '2024-03': {
    mes: 'Marzo',
    anio: 2024,
    ingresos: {
      pensiones: 18500.00,
      matriculas: 9950.00,
      otros: 0,
      total: 28450.00
    },
    egresos: {
      planillas: 11700.00,
      servicios: 2200.00,
      materiales: 1850.00,
      mantenimiento: 980.00,
      otros: 590.00,
      total: 15320.00
    },
    utilidad: 13130.00,
    margen: 46.2
  },
  '2024-02': {
    mes: 'Febrero',
    anio: 2024,
    ingresos: {
      pensiones: 17500.00,
      matriculas: 9800.00,
      otros: 0,
      total: 27300.00
    },
    egresos: {
      planillas: 11200.00,
      servicios: 1950.00,
      materiales: 1650.00,
      mantenimiento: 1200.00,
      otros: 450.00,
      total: 16450.00
    },
    utilidad: 10850.00,
    margen: 39.7
  }
};

export default {
  saldoCajaDemo,
  movimientosCajaDemo,
  pagosPensionesDemo,
  pagosMatriculasDemo,
  planillasTrabajadoresDemo,
  resumenMensualDemo
};
