import { useDemoQuery, createDemoQueryFn } from './useDemoQuery';
import { mockData } from '../../data/mockData';

/**
 * Hook para reporte de estudiantes
 */
export const useReporteEstudiantesDemo = (filtros = {}) => {
  return useDemoQuery({
    queryKey: ['reportes', 'estudiantes', filtros],
    queryFn: async () => {
      let estudiantes = mockData.estudiantes;
      
      // Aplicar filtros
      if (filtros.gradoId) {
        estudiantes = estudiantes.filter(e => e.gradoId === filtros.gradoId);
      }
      
      if (filtros.aulaId) {
        estudiantes = estudiantes.filter(e => e.aulaId === filtros.aulaId);
      }
      
      if (filtros.estado) {
        estudiantes = estudiantes.filter(e => e.estado === filtros.estado);
      }
      
      // Estadísticas generales
      const total = estudiantes.length;
      const porGenero = estudiantes.reduce((acc, e) => {
        acc[e.genero] = (acc[e.genero] || 0) + 1;
        return acc;
      }, {});
      
      const porGrado = estudiantes.reduce((acc, e) => {
        const grado = mockData.grados.find(g => g.id === e.gradoId);
        const nombreGrado = grado?.nombre || 'Sin grado';
        acc[nombreGrado] = (acc[nombreGrado] || 0) + 1;
        return acc;
      }, {});
      
      const porEstado = estudiantes.reduce((acc, e) => {
        acc[e.estado] = (acc[e.estado] || 0) + 1;
        return acc;
      }, {});
      
      // Rangos de edad
      const edades = estudiantes.map(e => {
        const nacimiento = new Date(e.fechaNacimiento);
        const hoy = new Date();
        return hoy.getFullYear() - nacimiento.getFullYear();
      });
      
      const rangoEdades = edades.reduce((acc, edad) => {
        let rango = '';
        if (edad <= 5) rango = '3-5 años';
        else if (edad <= 8) rango = '6-8 años';
        else if (edad <= 11) rango = '9-11 años';
        else rango = '12+ años';
        
        acc[rango] = (acc[rango] || 0) + 1;
        return acc;
      }, {});
      
      return {
        total,
        porGenero,
        porGrado,
        porEstado,
        rangoEdades,
        edadPromedio: edades.length > 0 ? (edades.reduce((a, b) => a + b, 0) / edades.length).toFixed(1) : 0,
        estudiantesDetalle: estudiantes.map(e => {
          const grado = mockData.grados.find(g => g.id === e.gradoId);
          const aula = mockData.aulas.find(a => a.id === e.aulaId);
          return {
            ...e,
            grado: grado?.nombre || 'Sin grado',
            aula: aula?.nombre || 'Sin aula'
          };
        })
      };
    },
    defaultData: {
      total: 0,
      porGenero: {},
      porGrado: {},
      porEstado: {},
      rangoEdades: {},
      edadPromedio: 0,
      estudiantesDetalle: []
    }
  });
};

/**
 * Hook para reporte de asistencias
 */
export const useReporteAsistenciasDemo = (filtros = {}) => {
  return useDemoQuery({
    queryKey: ['reportes', 'asistencias', filtros],
    queryFn: async () => {
      let asistencias = mockData.asistencias;
      
      // Aplicar filtros
      if (filtros.aulaId) {
        const estudiantesAula = mockData.estudiantes
          .filter(e => e.aulaId === filtros.aulaId)
          .map(e => e.id);
        asistencias = asistencias.filter(a => estudiantesAula.includes(a.estudianteId));
      }
      
      if (filtros.fechaInicio) {
        asistencias = asistencias.filter(a => new Date(a.fecha) >= new Date(filtros.fechaInicio));
      }
      
      if (filtros.fechaFin) {
        asistencias = asistencias.filter(a => new Date(a.fecha) <= new Date(filtros.fechaFin));
      }
      
      // Calcular estadísticas
      const total = asistencias.length;
      const presentes = asistencias.filter(a => a.estado === 'PRESENTE').length;
      const ausentes = asistencias.filter(a => a.estado === 'AUSENTE').length;
      const tardanzas = asistencias.filter(a => a.estado === 'TARDANZA').length;
      
      const porcentajeAsistencia = total > 0 ? ((presentes / total) * 100).toFixed(1) : 0;
      
      // Asistencias por día
      const porDia = asistencias.reduce((acc, a) => {
        const fecha = a.fecha.split('T')[0];
        if (!acc[fecha]) {
          acc[fecha] = { total: 0, presentes: 0, ausentes: 0, tardanzas: 0 };
        }
        acc[fecha].total += 1;
        acc[fecha][a.estado.toLowerCase() + 's'] = (acc[fecha][a.estado.toLowerCase() + 's'] || 0) + 1;
        return acc;
      }, {});
      
      // Top estudiantes con más ausencias
      const ausenciasPorEstudiante = asistencias
        .filter(a => a.estado === 'AUSENTE')
        .reduce((acc, a) => {
          acc[a.estudianteId] = (acc[a.estudianteId] || 0) + 1;
          return acc;
        }, {});
      
      const estudiantesConMasAusencias = Object.entries(ausenciasPorEstudiante)
        .map(([estudianteId, ausencias]) => {
          const estudiante = mockData.estudiantes.find(e => e.id === estudianteId);
          return {
            estudiante: estudiante ? `${estudiante.nombre} ${estudiante.apellidos}` : 'Estudiante no encontrado',
            ausencias
          };
        })
        .sort((a, b) => b.ausencias - a.ausencias)
        .slice(0, 5);
      
      return {
        total,
        presentes,
        ausentes,
        tardanzas,
        porcentajeAsistencia: parseFloat(porcentajeAsistencia),
        porDia,
        estudiantesConMasAusencias
      };
    },
    defaultData: {
      total: 0,
      presentes: 0,
      ausentes: 0,
      tardanzas: 0,
      porcentajeAsistencia: 0,
      porDia: {},
      estudiantesConMasAusencias: []
    }
  });
};

/**
 * Hook para reporte académico
 */
export const useReporteAcademicoDemo = (filtros = {}) => {
  return useDemoQuery({
    queryKey: ['reportes', 'academico', filtros],
    queryFn: async () => {
      let evaluaciones = mockData.evaluaciones;
      
      // Aplicar filtros
      if (filtros.aulaId) {
        const estudiantesAula = mockData.estudiantes
          .filter(e => e.aulaId === filtros.aulaId)
          .map(e => e.id);
        evaluaciones = evaluaciones.filter(e => estudiantesAula.includes(e.estudianteId));
      }
      
      if (filtros.gradoId) {
        const estudiantesGrado = mockData.estudiantes
          .filter(e => e.gradoId === filtros.gradoId)
          .map(e => e.id);
        evaluaciones = evaluaciones.filter(e => estudiantesGrado.includes(e.estudianteId));
      }
      
      if (filtros.periodo) {
        evaluaciones = evaluaciones.filter(e => e.periodo === filtros.periodo);
      }
      
      // Calcular promedios
      const notas = evaluaciones
        .map(e => parseFloat(e.calificacion))
        .filter(n => !isNaN(n));
      
      const promedioGeneral = notas.length > 0 ? 
        (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1) : 0;
      
      // Distribución de calificaciones
      const excelentes = notas.filter(n => n >= 18).length;
      const buenas = notas.filter(n => n >= 14 && n < 18).length;
      const regulares = notas.filter(n => n >= 11 && n < 14).length;
      const deficientes = notas.filter(n => n < 11).length;
      
      // Promedios por materia
      const porMateria = evaluaciones.reduce((acc, e) => {
        const nota = parseFloat(e.calificacion);
        if (!isNaN(nota)) {
          if (!acc[e.materia]) {
            acc[e.materia] = { suma: 0, count: 0, notas: [] };
          }
          acc[e.materia].suma += nota;
          acc[e.materia].count += 1;
          acc[e.materia].notas.push(nota);
        }
        return acc;
      }, {});
      
      const materiasStats = Object.entries(porMateria).map(([materia, data]) => ({
        materia,
        promedio: (data.suma / data.count).toFixed(1),
        evaluaciones: data.count,
        notaMaxima: Math.max(...data.notas).toFixed(1),
        notaMinima: Math.min(...data.notas).toFixed(1)
      }));
      
      // Top estudiantes
      const estudiantesPromedios = evaluaciones.reduce((acc, e) => {
        const nota = parseFloat(e.calificacion);
        if (!isNaN(nota)) {
          if (!acc[e.estudianteId]) {
            acc[e.estudianteId] = { suma: 0, count: 0 };
          }
          acc[e.estudianteId].suma += nota;
          acc[e.estudianteId].count += 1;
        }
        return acc;
      }, {});
      
      const topEstudiantes = Object.entries(estudiantesPromedios)
        .map(([estudianteId, data]) => {
          const estudiante = mockData.estudiantes.find(e => e.id === estudianteId);
          return {
            estudiante: estudiante ? `${estudiante.nombre} ${estudiante.apellidos}` : 'Estudiante no encontrado',
            promedio: (data.suma / data.count).toFixed(1),
            evaluaciones: data.count
          };
        })
        .sort((a, b) => parseFloat(b.promedio) - parseFloat(a.promedio))
        .slice(0, 10);
      
      return {
        totalEvaluaciones: evaluaciones.length,
        promedioGeneral: parseFloat(promedioGeneral),
        distribucion: {
          excelentes,
          buenas,
          regulares,
          deficientes
        },
        porcentajes: {
          excelentes: notas.length > 0 ? ((excelentes / notas.length) * 100).toFixed(1) : 0,
          buenas: notas.length > 0 ? ((buenas / notas.length) * 100).toFixed(1) : 0,
          regulares: notas.length > 0 ? ((regulares / notas.length) * 100).toFixed(1) : 0,
          deficientes: notas.length > 0 ? ((deficientes / notas.length) * 100).toFixed(1) : 0
        },
        materiasStats,
        topEstudiantes
      };
    },
    defaultData: {
      totalEvaluaciones: 0,
      promedioGeneral: 0,
      distribucion: { excelentes: 0, buenas: 0, regulares: 0, deficientes: 0 },
      porcentajes: { excelentes: 0, buenas: 0, regulares: 0, deficientes: 0 },
      materiasStats: [],
      topEstudiantes: []
    }
  });
};

/**
 * Hook para dashboard principal con métricas generales
 */
export const useDashboardMetricasDemo = () => {
  return useDemoQuery({
    queryKey: ['dashboard', 'metricas'],
    queryFn: async () => {
      // Conteos básicos
      const totalEstudiantes = mockData.estudiantes.length;
      const totalDocentes = mockData.trabajadores.filter(t => t.rol === 'DOCENTE').length;
      const totalAulas = mockData.aulas.length;
      const totalPadres = mockData.padres.length;
      
      // Asistencia del día (simulada)
      const hoy = new Date().toISOString().split('T')[0];
      const asistenciasHoy = mockData.asistencias.filter(a => a.fecha.startsWith(hoy));
      const asistenciaHoy = {
        presentes: asistenciasHoy.filter(a => a.estado === 'PRESENTE').length,
        ausentes: asistenciasHoy.filter(a => a.estado === 'AUSENTE').length,
        tardanzas: asistenciasHoy.filter(a => a.estado === 'TARDANZA').length
      };
      
      // Pagos del mes
      const mesActual = new Date().toISOString().slice(0, 7);
      const pagosMes = mockData.pagos.filter(p => p.fechaPago.startsWith(mesActual));
      const ingresosMes = pagosMes.reduce((sum, p) => sum + parseFloat(p.monto), 0);
      
      // Tareas pendientes
      const tareasPendientes = mockData.tareas.filter(t => t.estado === 'ACTIVO' && 
        new Date(t.fechaVencimiento) > new Date()).length;
      
      // Evaluaciones recientes
      const evaluacionesRecientes = mockData.evaluaciones
        .filter(e => {
          const fechaEval = new Date(e.fecha);
          const hace7Dias = new Date();
          hace7Dias.setDate(hace7Dias.getDate() - 7);
          return fechaEval >= hace7Dias;
        }).length;
      
      return {
        conteos: {
          estudiantes: totalEstudiantes,
          docentes: totalDocentes,
          aulas: totalAulas,
          padres: totalPadres
        },
        asistenciaHoy,
        finanzas: {
          ingresosMes,
          pagosMes: pagosMes.length
        },
        actividad: {
          tareasPendientes,
          evaluacionesRecientes
        }
      };
    },
    defaultData: {
      conteos: { estudiantes: 0, docentes: 0, aulas: 0, padres: 0 },
      asistenciaHoy: { presentes: 0, ausentes: 0, tardanzas: 0 },
      finanzas: { ingresosMes: 0, pagosMes: 0 },
      actividad: { tareasPendientes: 0, evaluacionesRecientes: 0 }
    }
  });
};