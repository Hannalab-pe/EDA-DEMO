import { useDemoQuery, useDemoMutation, createDemoQueryFn, createDemoMutationFn } from './useDemoQuery';
import { mockData } from '../../data/mockData';

/**
 * Hook para obtener grados
 */
export const useGradosDemo = (filters = {}) => {
  return useDemoQuery({
    queryKey: ['grados', filters],
    queryFn: createDemoQueryFn('grados', filters),
    defaultData: []
  });
};

/**
 * Hook para obtener aulas
 */
export const useAulasDemo = (filters = {}) => {
  return useDemoQuery({
    queryKey: ['aulas', filters],
    queryFn: async () => {
      let aulas = mockData.aulas;
      
      // Aplicar filtros
      if (filters.gradoId) {
        aulas = aulas.filter(a => a.gradoId === filters.gradoId);
      }
      
      if (filters.estado) {
        aulas = aulas.filter(a => a.estado === filters.estado);
      }
      
      // Agregar información adicional
      return aulas.map(aula => {
        const grado = mockData.grados.find(g => g.id === aula.gradoId);
        const estudiantes = mockData.estudiantes.filter(e => e.aulaId === aula.id);
        const docente = mockData.trabajadores.find(t => t.id === aula.docenteId);
        
        return {
          ...aula,
          grado: grado?.nombre || 'Sin grado',
          totalEstudiantes: estudiantes.length,
          docente: docente ? `${docente.nombre} ${docente.apellidos}` : 'Sin docente asignado'
        };
      });
    },
    defaultData: []
  });
};

/**
 * Hook para obtener trabajadores
 */
export const useTrabajadoresDemo = (filters = {}) => {
  return useDemoQuery({
    queryKey: ['trabajadores', filters],
    queryFn: async () => {
      let trabajadores = mockData.trabajadores;
      
      // Aplicar filtros
      if (filters.rol) {
        trabajadores = trabajadores.filter(t => t.rol === filters.rol);
      }
      
      if (filters.estado) {
        trabajadores = trabajadores.filter(t => t.estado === filters.estado);
      }
      
      if (filters.tipoContrato) {
        trabajadores = trabajadores.filter(t => t.tipoContrato === filters.tipoContrato);
      }
      
      // Agregar información adicional
      return trabajadores.map(trabajador => {
        let infoAdicional = {};
        
        if (trabajador.rol === 'DOCENTE') {
          const aulasAsignadas = mockData.aulas.filter(a => a.docenteId === trabajador.id);
          const estudiantesACargo = mockData.estudiantes.filter(e => 
            aulasAsignadas.some(aula => aula.id === e.aulaId)
          );
          
          infoAdicional = {
            aulasAsignadas: aulasAsignadas.length,
            estudiantesACargo: estudiantesACargo.length,
            aulas: aulasAsignadas.map(a => a.nombre)
          };
        }
        
        return {
          ...trabajador,
          ...infoAdicional
        };
      });
    },
    defaultData: []
  });
};

/**
 * Hook para obtener padres/apoderados
 */
export const usePadresDemo = (filters = {}) => {
  return useDemoQuery({
    queryKey: ['padres', filters],
    queryFn: async () => {
      let padres = mockData.padres;
      
      // Aplicar filtros
      if (filters.estado) {
        padres = padres.filter(p => p.estado === filters.estado);
      }
      
      // Agregar información de hijos
      return padres.map(padre => {
        const hijos = mockData.estudiantes.filter(e => e.padreId === padre.id);
        return {
          ...padre,
          hijos: hijos.map(h => ({
            id: h.id,
            nombre: `${h.nombre} ${h.apellidos}`,
            grado: mockData.grados.find(g => g.id === h.gradoId)?.nombre || 'Sin grado'
          })),
          totalHijos: hijos.length
        };
      });
    },
    defaultData: []
  });
};

/**
 * Hook para crear grado
 */
export const useCrearGradoDemo = () => {
  return useDemoMutation({
    mutationFn: async (gradoData) => {
      const nuevoGrado = {
        id: Date.now().toString(),
        ...gradoData,
        fechaCreacion: new Date().toISOString(),
        estado: 'ACTIVO'
      };
      console.log('🎭 Demo: Creando grado', nuevoGrado);
      return nuevoGrado;
    },
    onSuccess: (data) => {
      console.log('🎭 Demo: Grado creado exitosamente', data);
    }
  });
};

/**
 * Hook para crear aula
 */
export const useCrearAulaDemo = () => {
  return useDemoMutation({
    mutationFn: async (aulaData) => {
      const nuevaAula = {
        id: Date.now().toString(),
        ...aulaData,
        fechaCreacion: new Date().toISOString(),
        estado: 'ACTIVO'
      };
      console.log('🎭 Demo: Creando aula', nuevaAula);
      return nuevaAula;
    },
    onSuccess: (data) => {
      console.log('🎭 Demo: Aula creada exitosamente', data);
    }
  });
};

/**
 * Hook para crear trabajador
 */
export const useCrearTrabajadorDemo = () => {
  return useDemoMutation({
    mutationFn: async (trabajadorData) => {
      const nuevoTrabajador = {
        id: Date.now().toString(),
        ...trabajadorData,
        fechaIngreso: new Date().toISOString(),
        estado: 'ACTIVO'
      };
      console.log('🎭 Demo: Creando trabajador', nuevoTrabajador);
      return nuevoTrabajador;
    },
    onSuccess: (data) => {
      console.log('🎭 Demo: Trabajador creado exitosamente', data);
    }
  });
};

/**
 * Hook para crear padre/apoderado
 */
export const useCrearPadreDemo = () => {
  return useDemoMutation({
    mutationFn: async (padreData) => {
      const nuevoPadre = {
        id: Date.now().toString(),
        ...padreData,
        fechaRegistro: new Date().toISOString(),
        estado: 'ACTIVO'
      };
      console.log('🎭 Demo: Creando padre/apoderado', nuevoPadre);
      return nuevoPadre;
    },
    onSuccess: (data) => {
      console.log('🎭 Demo: Padre/apoderado creado exitosamente', data);
    }
  });
};

/**
 * Hook para actualizar trabajador
 */
export const useActualizarTrabajadorDemo = () => {
  return useDemoMutation({
    mutationFn: createDemoMutationFn('update', 'trabajadores'),
    onSuccess: (data) => {
      console.log('🎭 Demo: Trabajador actualizado exitosamente', data);
    }
  });
};

/**
 * Hook para actualizar aula
 */
export const useActualizarAulaDemo = () => {
  return useDemoMutation({
    mutationFn: createDemoMutationFn('update', 'aulas'),
    onSuccess: (data) => {
      console.log('🎭 Demo: Aula actualizada exitosamente', data);
    }
  });
};

/**
 * Hook para asignar docente a aula
 */
export const useAsignarDocenteAulaDemo = () => {
  return useDemoMutation({
    mutationFn: async ({ aulaId, docenteId }) => {
      const asignacion = {
        aulaId,
        docenteId,
        fechaAsignacion: new Date().toISOString(),
        estado: 'ACTIVO'
      };
      console.log('🎭 Demo: Asignando docente a aula', asignacion);
      return asignacion;
    },
    onSuccess: (data) => {
      console.log('🎭 Demo: Docente asignado exitosamente', data);
    }
  });
};

/**
 * Hook para obtener horarios
 */
export const useHorariosDemo = (filtros = {}) => {
  return useDemoQuery({
    queryKey: ['horarios', filtros],
    queryFn: async () => {
      // Generar horarios ficticios
      const materias = ['Matemáticas', 'Comunicación', 'Ciencias', 'Personal Social', 'Arte', 'Educación Física'];
      const horas = ['08:00', '09:00', '10:00', '11:30', '12:30', '13:30'];
      const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
      
      let horarios = [];
      
      if (filtros.aulaId) {
        const aula = mockData.aulas.find(a => a.id === filtros.aulaId);
        if (aula) {
          dias.forEach((dia, diaIndex) => {
            horas.forEach((hora, horaIndex) => {
              if (horaIndex < 5) { // Solo 5 horas por día
                horarios.push({
                  id: `${filtros.aulaId}-${diaIndex}-${horaIndex}`,
                  aulaId: filtros.aulaId,
                  aula: aula.nombre,
                  dia,
                  hora,
                  materia: materias[horaIndex % materias.length],
                  docenteId: aula.docenteId,
                  docente: 'Docente Asignado'
                });
              }
            });
          });
        }
      }
      
      return horarios;
    },
    enabled: !!filtros.aulaId,
    defaultData: []
  });
};