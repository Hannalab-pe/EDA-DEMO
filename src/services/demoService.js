import { mockData, simulateApiDelay, generateId, filterData, paginateData } from '../data/mockData';

// Variable para controlar el modo demo
const DEMO_MODE = true;

class DemoServiceBase {
  constructor(dataKey) {
    this.dataKey = dataKey;
    this.data = mockData[dataKey] || [];
  }

  // Obtener todos los elementos
  async getAll(filters = {}, pagination = null) {
    if (!DEMO_MODE) {
      throw new Error('Demo mode is disabled');
    }

    await simulateApiDelay();
    
    let filteredData = filterData(this.data, filters);
    
    if (pagination) {
      return paginateData(filteredData, pagination.page, pagination.limit);
    }
    
    return {
      data: filteredData,
      success: true,
      message: `${this.dataKey} obtenidos exitosamente`
    };
  }

  // Obtener por ID
  async getById(id) {
    if (!DEMO_MODE) {
      throw new Error('Demo mode is disabled');
    }

    await simulateApiDelay();
    
    const item = this.data.find(item => item.id.toString() === id.toString());
    
    if (!item) {
      throw new Error(`${this.dataKey} con ID ${id} no encontrado`);
    }
    
    return {
      data: item,
      success: true,
      message: `${this.dataKey} encontrado exitosamente`
    };
  }

  // Crear nuevo elemento
  async create(newItem) {
    if (!DEMO_MODE) {
      throw new Error('Demo mode is disabled');
    }

    await simulateApiDelay();
    
    const item = {
      id: generateId(),
      ...newItem,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    };
    
    // En demo mode, solo simular sin persistir
    console.log(`🎭 Demo: Creando ${this.dataKey}:`, item);
    
    return {
      data: item,
      success: true,
      message: `${this.dataKey} creado exitosamente`
    };
  }

  // Actualizar elemento
  async update(id, updateData) {
    if (!DEMO_MODE) {
      throw new Error('Demo mode is disabled');
    }

    await simulateApiDelay();
    
    const existingItem = this.data.find(item => item.id.toString() === id.toString());
    
    if (!existingItem) {
      throw new Error(`${this.dataKey} con ID ${id} no encontrado`);
    }
    
    const updatedItem = {
      ...existingItem,
      ...updateData,
      fechaActualizacion: new Date().toISOString()
    };
    
    // En demo mode, solo simular sin persistir
    console.log(`🎭 Demo: Actualizando ${this.dataKey} ${id}:`, updatedItem);
    
    return {
      data: updatedItem,
      success: true,
      message: `${this.dataKey} actualizado exitosamente`
    };
  }

  // Eliminar elemento
  async delete(id) {
    if (!DEMO_MODE) {
      throw new Error('Demo mode is disabled');
    }

    await simulateApiDelay();
    
    const existingItem = this.data.find(item => item.id.toString() === id.toString());
    
    if (!existingItem) {
      throw new Error(`${this.dataKey} con ID ${id} no encontrado`);
    }
    
    // En demo mode, solo simular sin persistir
    console.log(`🎭 Demo: Eliminando ${this.dataKey} ${id}`);
    
    return {
      success: true,
      message: `${this.dataKey} eliminado exitosamente`
    };
  }

  // Buscar elementos
  async search(query, fields = []) {
    if (!DEMO_MODE) {
      throw new Error('Demo mode is disabled');
    }

    await simulateApiDelay();
    
    const results = this.data.filter(item => {
      if (fields.length === 0) {
        // Buscar en todos los campos string
        return Object.values(item).some(value => 
          typeof value === 'string' && 
          value.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      // Buscar solo en campos específicos
      return fields.some(field => 
        item[field] && 
        item[field].toString().toLowerCase().includes(query.toLowerCase())
      );
    });
    
    return {
      data: results,
      success: true,
      message: `Búsqueda completada: ${results.length} resultados encontrados`
    };
  }

  // Obtener estadísticas básicas
  async getStats() {
    if (!DEMO_MODE) {
      throw new Error('Demo mode is disabled');
    }

    await simulateApiDelay();
    
    const stats = {
      total: this.data.length,
      activos: this.data.filter(item => item.estado === 'ACTIVO').length,
      inactivos: this.data.filter(item => item.estado === 'INACTIVO').length,
      ultimaActualizacion: new Date().toISOString()
    };
    
    return {
      data: stats,
      success: true,
      message: 'Estadísticas obtenidas exitosamente'
    };
  }
}

// Servicios específicos que extienden la clase base
export class EstudiantesDemoService extends DemoServiceBase {
  constructor() {
    super('estudiantes');
  }

  async getByGrado(gradoId) {
    await simulateApiDelay();
    const estudiantes = this.data.filter(e => e.gradoId === gradoId.toString());
    return {
      data: estudiantes,
      success: true,
      message: `Estudiantes del grado ${gradoId} obtenidos exitosamente`
    };
  }

  async getByAula(aulaId) {
    await simulateApiDelay();
    const estudiantes = this.data.filter(e => e.aulaId === aulaId.toString());
    return {
      data: estudiantes,
      success: true,
      message: `Estudiantes del aula ${aulaId} obtenidos exitosamente`
    };
  }
}

export class PadresDemoService extends DemoServiceBase {
  constructor() {
    super('padres');
  }

  async getHijos(padreId) {
    await simulateApiDelay();
    const padre = this.data.find(p => p.id.toString() === padreId.toString());
    if (!padre) {
      throw new Error('Padre no encontrado');
    }

    const hijos = mockData.estudiantes.filter(e => 
      padre.hijosIds.includes(e.id)
    );

    return {
      data: hijos,
      success: true,
      message: 'Hijos obtenidos exitosamente'
    };
  }
}

export class TrabajadoresDemoService extends DemoServiceBase {
  constructor() {
    super('trabajadores');
  }

  async getDocentes() {
    await simulateApiDelay();
    const docentes = this.data.filter(t => t.cargo === 'DOCENTE');
    return {
      data: docentes,
      success: true,
      message: 'Docentes obtenidos exitosamente'
    };
  }
}

export class AsistenciasDemoService extends DemoServiceBase {
  constructor() {
    super('asistencias');
  }

  async getByEstudiante(estudianteId, fechaInicio, fechaFin) {
    await simulateApiDelay();
    let asistencias = this.data.filter(a => a.estudianteId === estudianteId.toString());
    
    if (fechaInicio) {
      asistencias = asistencias.filter(a => a.fecha >= fechaInicio);
    }
    
    if (fechaFin) {
      asistencias = asistencias.filter(a => a.fecha <= fechaFin);
    }

    return {
      data: asistencias,
      success: true,
      message: 'Asistencias obtenidas exitosamente'
    };
  }

  async getByFecha(fecha) {
    await simulateApiDelay();
    const asistencias = this.data.filter(a => a.fecha === fecha);
    return {
      data: asistencias,
      success: true,
      message: `Asistencias del ${fecha} obtenidas exitosamente`
    };
  }
}

export class PagosDemoService extends DemoServiceBase {
  constructor() {
    super('pagos');
  }

  async getByEstudiante(estudianteId) {
    await simulateApiDelay();
    const pagos = this.data.filter(p => p.estudianteId === estudianteId.toString());
    return {
      data: pagos,
      success: true,
      message: 'Pagos obtenidos exitosamente'
    };
  }

  async getPendientes() {
    await simulateApiDelay();
    const pagos = this.data.filter(p => p.estado === 'PENDIENTE');
    return {
      data: pagos,
      success: true,
      message: 'Pagos pendientes obtenidos exitosamente'
    };
  }
}

// Instancias de servicios
export const estudiantesDemoService = new EstudiantesDemoService();
export const padresDemoService = new PadresDemoService();
export const trabajadoresDemoService = new TrabajadoresDemoService();
export const asistenciasDemoService = new AsistenciasDemoService();
export const pagosDemoService = new PagosDemoService();

// Servicios genéricos
export const gradosDemoService = new DemoServiceBase('grados');
export const aulasDemoService = new DemoServiceBase('aulas');
export const matriculasDemoService = new DemoServiceBase('matriculas');
export const tareasDemoService = new DemoServiceBase('tareas');
export const evaluacionesDemoService = new DemoServiceBase('evaluaciones');
export const anotacionesDemoService = new DemoServiceBase('anotaciones');
export const planificacionesDemoService = new DemoServiceBase('planificaciones');
export const reportesDemoService = new DemoServiceBase('reportes');

export { DEMO_MODE };