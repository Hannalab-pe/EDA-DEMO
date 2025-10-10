import { useState, useMemo } from 'react';
import { Users, GraduationCap, BookOpen, DollarSign } from 'lucide-react';

/**
 * Hook DEMO para el dashboard administrativo
 * Retorna datos estáticos para demostración sin llamadas a API
 */
export const useAdminDashboardDemo = () => {
  const [loading] = useState(false);
  const [error] = useState(null);

  // Datos de demostración estáticos
  const dashboardData = useMemo(() => ({
    estudiantes: {
      total: 156,
      activos: 148,
      inactivos: 8,
      loading: false,
      porGrado: [
        { grado: '3 años', cantidad: 42, color: '#3B82F6' },
        { grado: '4 años', cantidad: 58, color: '#10B981' },
        { grado: '5 años', cantidad: 56, color: '#F59E0B' }
      ]
    },
    trabajadores: {
      total: 24,
      activos: 22,
      inactivos: 2,
      loading: false,
      porCargo: [
        { cargo: 'Docentes', cantidad: 12 },
        { cargo: 'Auxiliares', cantidad: 6 },
        { cargo: 'Administrativos', cantidad: 4 },
        { cargo: 'Otros', cantidad: 2 }
      ]
    },
    aulas: {
      total: 8,
      ocupadas: 6,
      disponibles: 2,
      capacidadTotal: 192,
      capacidadUsada: 148
    },
    finanzas: {
      saldoActual: 45780.50,
      ingresosMes: 28450.00,
      egresosMes: 15320.00,
      loading: false,
      movimientosRecientes: [
        { tipo: 'ingreso', concepto: 'Pensiones Marzo', monto: 18500, fecha: '2024-03-15' },
        { tipo: 'ingreso', concepto: 'Matrículas', monto: 9950, fecha: '2024-03-10' },
        { tipo: 'egreso', concepto: 'Planilla Docentes', monto: 8500, fecha: '2024-03-05' },
        { tipo: 'egreso', concepto: 'Servicios Básicos', monto: 2200, fecha: '2024-03-03' },
        { tipo: 'egreso', concepto: 'Material Didáctico', monto: 1850, fecha: '2024-03-01' }
      ]
    },
    padres: {
      total: 135,
      conPagosAlDia: 118,
      conPagosPendientes: 17,
      morosos: 8
    }
  }), []);

  // Estadísticas para las tarjetas principales
  const stats = useMemo(() => [
    {
      title: "Total Estudiantes",
      value: dashboardData.estudiantes.total.toString(),
      subtitle: `${dashboardData.estudiantes.activos} activos`,
      icon: Users,
      color: "#3B82F6",
      change: "+12%",
      trend: "up",
      loading: false
    },
    {
      title: "Profesores Activos",
      value: dashboardData.trabajadores.activos.toString(),
      subtitle: `${dashboardData.trabajadores.total} en total`,
      icon: GraduationCap,
      color: "#10B981",
      change: "+3%",
      trend: "up",
      loading: false
    },
    {
      title: "Aulas Activas",
      value: dashboardData.aulas.ocupadas.toString(),
      subtitle: `${dashboardData.aulas.total} disponibles`,
      icon: BookOpen,
      color: "#F59E0B",
      change: "75% ocupación",
      trend: "stable",
      loading: false
    },
    {
      title: "Saldo Actual",
      value: `S/ ${dashboardData.finanzas.saldoActual.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
      subtitle: "Balance del mes",
      icon: DollarSign,
      color: "#8B5CF6",
      change: "+28.7%",
      trend: "up",
      loading: false
    },
  ], [dashboardData]);

  // Estadísticas financieras detalladas
  const financialStats = useMemo(() => ({
    ingresosMes: dashboardData.finanzas.ingresosMes,
    egresosMes: dashboardData.finanzas.egresosMes,
    saldoActual: dashboardData.finanzas.saldoActual,
    utilidadMes: dashboardData.finanzas.ingresosMes - dashboardData.finanzas.egresosMes,
    margenGanancia: ((dashboardData.finanzas.ingresosMes - dashboardData.finanzas.egresosMes) / dashboardData.finanzas.ingresosMes * 100).toFixed(1)
  }), [dashboardData.finanzas]);

  // Datos para gráficos
  const chartData = useMemo(() => ({
    // Datos para gráfico de barras - Estudiantes por grado
    estudiantesPorGrado: {
      labels: dashboardData.estudiantes.porGrado.map(g => g.grado),
      datasets: [{
        label: 'Estudiantes',
        data: dashboardData.estudiantes.porGrado.map(g => g.cantidad),
        backgroundColor: dashboardData.estudiantes.porGrado.map(g => g.color),
      }]
    },

    // Datos para gráfico financiero - Últimos 6 meses
    tendenciaFinanciera: {
      labels: ['Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar'],
      datasets: [
        {
          label: 'Ingresos',
          data: [24500, 26800, 32100, 25900, 27300, 28450],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
        },
        {
          label: 'Egresos',
          data: [18200, 19500, 21800, 17900, 16200, 15320],
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
        }
      ]
    },

    // Datos para gráfico de pie - Distribución de gastos
    distribucionGastos: {
      labels: ['Planillas', 'Servicios', 'Materiales', 'Infraestructura', 'Otros'],
      datasets: [{
        data: [55, 18, 12, 10, 5],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#8B5CF6',
          '#EC4899'
        ]
      }]
    },

    // Datos para gráfico de ocupación de aulas
    ocupacionAulas: {
      labels: ['Aula Roja', 'Aula Azul', 'Aula Verde', 'Aula Amarilla', 'Aula Naranja', 'Aula Violeta'],
      datasets: [{
        label: 'Capacidad',
        data: [25, 25, 24, 24, 22, 22],
        backgroundColor: 'rgba(156, 163, 175, 0.3)',
      }, {
        label: 'Ocupación',
        data: [24, 25, 23, 24, 22, 20],
        backgroundColor: '#3B82F6',
      }]
    }
  }), [dashboardData]);

  // Función de refresh (en demo solo simula un pequeño delay)
  const refreshData = async () => {
    console.log('🎭 DEMO: Simulando refresh de datos del dashboard admin...');
    await new Promise(resolve => setTimeout(resolve, 500));
    return Promise.resolve();
  };

  // Datos de estudiantes simulados para compatibilidad
  const students = useMemo(() =>
    Array.from({ length: dashboardData.estudiantes.total }, (_, i) => ({
      id: i + 1,
      nombre: `Estudiante ${i + 1}`,
      apellido: `Demo`,
      grado: dashboardData.estudiantes.porGrado[i % 3].grado,
      estado: i < dashboardData.estudiantes.activos ? 'activo' : 'inactivo'
    }))
  , [dashboardData.estudiantes]);

  // Datos de trabajadores simulados para compatibilidad
  const trabajadores = useMemo(() =>
    Array.from({ length: dashboardData.trabajadores.total }, (_, i) => ({
      id: i + 1,
      nombre: `Trabajador ${i + 1}`,
      apellido: `Demo`,
      cargo: dashboardData.trabajadores.porCargo[i % 4].cargo,
      estado: i < dashboardData.trabajadores.activos ? 'activo' : 'inactivo'
    }))
  , [dashboardData.trabajadores]);

  return {
    // Datos del dashboard
    stats,
    dashboardData,
    chartData,

    // Estados de carga
    loading,

    // Datos detallados
    students,
    trabajadores,

    // Funciones
    refreshData,

    // Estadísticas financieras detalladas
    financialStats,

    // Error handling
    error
  };
};

export default useAdminDashboardDemo;
