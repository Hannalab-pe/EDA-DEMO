// demoEvaluacionBimestralService.js - Servicio DEMO para evaluaciones bimestrales de docentes
import { mockData } from "../data/mockData";

const simulateApiDelay = () =>
  new Promise((resolve) => setTimeout(resolve, 400));

class DemoEvaluacionBimestralService {
  // Calcular promedio de los 5 puntajes
  calcularPromedio(puntajes) {
    const {
      puntajePlanificacion,
      puntajeMetodologia,
      puntajePuntualidad,
      puntajeCreatividad,
      puntajeComunicacion,
    } = puntajes;

    const promedio =
      (parseFloat(puntajePlanificacion) +
        parseFloat(puntajeMetodologia) +
        parseFloat(puntajePuntualidad) +
        parseFloat(puntajeCreatividad) +
        parseFloat(puntajeComunicacion)) /
      5;

    return parseFloat(promedio.toFixed(2));
  }

  // Obtener todas las evaluaciones
  async getAll(params = {}) {
    await simulateApiDelay();
    console.log("[DEMO] Obteniendo todas las evaluaciones bimestrales");

    let evaluaciones = [...mockData.evaluacionesBimestralesDocentes];

    // Aplicar filtros
    if (params.idTrabajador) {
      evaluaciones = evaluaciones.filter(
        (e) => e.idTrabajador === parseInt(params.idTrabajador)
      );
    }

    if (params.idBimestre) {
      evaluaciones = evaluaciones.filter(
        (e) => e.idBimestre === parseInt(params.idBimestre)
      );
    }

    if (params.promedioMinimo) {
      evaluaciones = evaluaciones.filter(
        (e) => e.promedioFinal >= parseFloat(params.promedioMinimo)
      );
    }

    // Ordenar por fecha más reciente
    evaluaciones.sort(
      (a, b) => new Date(b.fechaEvaluacion) - new Date(a.fechaEvaluacion)
    );

    return {
      success: true,
      evaluaciones: evaluaciones,
      total: evaluaciones.length,
    };
  }

  // Obtener evaluación por ID
  async getById(id) {
    await simulateApiDelay();
    console.log(`[DEMO] Buscando evaluación con ID: ${id}`);

    const evaluacion = mockData.evaluacionesBimestralesDocentes.find(
      (e) => e.idEvaluacion === parseInt(id)
    );

    if (!evaluacion) {
      throw new Error("Evaluación no encontrada");
    }

    return {
      success: true,
      data: evaluacion,
    };
  }

  // Obtener evaluaciones por trabajador
  async getByTrabajador(idTrabajador) {
    await simulateApiDelay();
    console.log(
      `[DEMO] Obteniendo evaluaciones para trabajador: ${idTrabajador}`
    );

    const evaluaciones = mockData.evaluacionesBimestralesDocentes
      .filter((e) => e.idTrabajador === parseInt(idTrabajador))
      .sort(
        (a, b) => new Date(b.fechaEvaluacion) - new Date(a.fechaEvaluacion)
      );

    return {
      success: true,
      data: evaluaciones,
      total: evaluaciones.length,
    };
  }

  // Obtener evaluaciones por bimestre
  async getByBimestre(idBimestre) {
    await simulateApiDelay();
    console.log(`[DEMO] Obteniendo evaluaciones para bimestre: ${idBimestre}`);

    const evaluaciones = mockData.evaluacionesBimestralesDocentes
      .filter((e) => e.idBimestre === parseInt(idBimestre))
      .sort(
        (a, b) => new Date(b.fechaEvaluacion) - new Date(a.fechaEvaluacion)
      );

    return {
      success: true,
      data: evaluaciones,
      total: evaluaciones.length,
    };
  }

  // Crear nueva evaluación
  async create(evaluacionData) {
    await simulateApiDelay();
    console.log("[DEMO] Creando nueva evaluación bimestral:", evaluacionData);

    // Generar nuevo ID
    const nuevoId =
      Math.max(
        ...mockData.evaluacionesBimestralesDocentes.map((e) => e.idEvaluacion),
        0
      ) + 1;

    // Buscar información del trabajador
    const trabajador = mockData.trabajadores.find(
      (t) => t.idTrabajador === parseInt(evaluacionData.idTrabajador)
    );

    // Buscar información del bimestre
    const bimestre = mockData.bimestres.find(
      (b) => b.idBimestre === parseInt(evaluacionData.idBimestre)
    );

    // Calcular promedio automáticamente
    const promedioFinal = this.calcularPromedio({
      puntajePlanificacion: evaluacionData.puntajePlanificacion,
      puntajeMetodologia: evaluacionData.puntajeMetodologia,
      puntajePuntualidad: evaluacionData.puntajePuntualidad,
      puntajeCreatividad: evaluacionData.puntajeCreatividad,
      puntajeComunicacion: evaluacionData.puntajeComunicacion,
    });

    const nuevaEvaluacion = {
      idEvaluacion: nuevoId,
      idTrabajador: parseInt(evaluacionData.idTrabajador),
      trabajador: trabajador
        ? {
            idTrabajador: trabajador.idTrabajador,
            nombre: trabajador.nombre,
            apellido: trabajador.apellido,
            idRol: trabajador.idRol || { nombre: "DOCENTE" },
          }
        : null,
      idBimestre: parseInt(evaluacionData.idBimestre),
      bimestre: bimestre
        ? {
            idBimestre: bimestre.idBimestre,
            nombreBimestre: bimestre.nombreBimestre,
            estaActivo: bimestre.estaActivo,
          }
        : null,
      idCoordinador: evaluacionData.idCoordinador || 1,
      coordinador: {
        idCoordinador: evaluacionData.idCoordinador || 1,
        nombre: "Administrador",
        apellido: "Sistema",
      },
      puntajePlanificacion: parseFloat(evaluacionData.puntajePlanificacion),
      puntajeMetodologia: parseFloat(evaluacionData.puntajeMetodologia),
      puntajePuntualidad: parseFloat(evaluacionData.puntajePuntualidad),
      puntajeCreatividad: parseFloat(evaluacionData.puntajeCreatividad),
      puntajeComunicacion: parseFloat(evaluacionData.puntajeComunicacion),
      promedioFinal: promedioFinal,
      observaciones: evaluacionData.observaciones,
      fechaEvaluacion:
        evaluacionData.fechaEvaluacion ||
        new Date().toISOString().split("T")[0],
      creado: new Date().toISOString(),
    };

    mockData.evaluacionesBimestralesDocentes.push(nuevaEvaluacion);

    console.log(
      "✅ [DEMO] Evaluación creada exitosamente:",
      nuevaEvaluacion
    );

    return {
      success: true,
      message: "Evaluación creada exitosamente",
      data: nuevaEvaluacion,
    };
  }

  // Actualizar evaluación existente
  async update(id, evaluacionData) {
    await simulateApiDelay();
    console.log(`[DEMO] Actualizando evaluación ${id}:`, evaluacionData);

    const index = mockData.evaluacionesBimestralesDocentes.findIndex(
      (e) => e.idEvaluacion === parseInt(id)
    );

    if (index === -1) {
      throw new Error("Evaluación no encontrada");
    }

    // Recalcular promedio si se actualizan puntajes
    let promedioFinal = mockData.evaluacionesBimestralesDocentes[index]
      .promedioFinal;

    if (
      evaluacionData.puntajePlanificacion !== undefined ||
      evaluacionData.puntajeMetodologia !== undefined ||
      evaluacionData.puntajePuntualidad !== undefined ||
      evaluacionData.puntajeCreatividad !== undefined ||
      evaluacionData.puntajeComunicacion !== undefined
    ) {
      promedioFinal = this.calcularPromedio({
        puntajePlanificacion:
          evaluacionData.puntajePlanificacion ??
          mockData.evaluacionesBimestralesDocentes[index].puntajePlanificacion,
        puntajeMetodologia:
          evaluacionData.puntajeMetodologia ??
          mockData.evaluacionesBimestralesDocentes[index].puntajeMetodologia,
        puntajePuntualidad:
          evaluacionData.puntajePuntualidad ??
          mockData.evaluacionesBimestralesDocentes[index].puntajePuntualidad,
        puntajeCreatividad:
          evaluacionData.puntajeCreatividad ??
          mockData.evaluacionesBimestralesDocentes[index].puntajeCreatividad,
        puntajeComunicacion:
          evaluacionData.puntajeComunicacion ??
          mockData.evaluacionesBimestralesDocentes[index].puntajeComunicacion,
      });
    }

    // Actualizar trabajador si cambió
    let trabajadorInfo =
      mockData.evaluacionesBimestralesDocentes[index].trabajador;
    if (
      evaluacionData.idTrabajador &&
      evaluacionData.idTrabajador !==
        mockData.evaluacionesBimestralesDocentes[index].idTrabajador
    ) {
      const trabajador = mockData.trabajadores.find(
        (t) => t.idTrabajador === parseInt(evaluacionData.idTrabajador)
      );
      if (trabajador) {
        trabajadorInfo = {
          idTrabajador: trabajador.idTrabajador,
          nombre: trabajador.nombre,
          apellido: trabajador.apellido,
          idRol: trabajador.idRol || { nombre: "DOCENTE" },
        };
      }
    }

    // Actualizar bimestre si cambió
    let bimestreInfo =
      mockData.evaluacionesBimestralesDocentes[index].bimestre;
    if (
      evaluacionData.idBimestre &&
      evaluacionData.idBimestre !==
        mockData.evaluacionesBimestralesDocentes[index].idBimestre
    ) {
      const bimestre = mockData.bimestres.find(
        (b) => b.idBimestre === parseInt(evaluacionData.idBimestre)
      );
      if (bimestre) {
        bimestreInfo = {
          idBimestre: bimestre.idBimestre,
          nombreBimestre: bimestre.nombreBimestre,
          estaActivo: bimestre.estaActivo,
        };
      }
    }

    mockData.evaluacionesBimestralesDocentes[index] = {
      ...mockData.evaluacionesBimestralesDocentes[index],
      puntajePlanificacion:
        evaluacionData.puntajePlanificacion !== undefined
          ? parseFloat(evaluacionData.puntajePlanificacion)
          : mockData.evaluacionesBimestralesDocentes[index]
              .puntajePlanificacion,
      puntajeMetodologia:
        evaluacionData.puntajeMetodologia !== undefined
          ? parseFloat(evaluacionData.puntajeMetodologia)
          : mockData.evaluacionesBimestralesDocentes[index].puntajeMetodologia,
      puntajePuntualidad:
        evaluacionData.puntajePuntualidad !== undefined
          ? parseFloat(evaluacionData.puntajePuntualidad)
          : mockData.evaluacionesBimestralesDocentes[index].puntajePuntualidad,
      puntajeCreatividad:
        evaluacionData.puntajeCreatividad !== undefined
          ? parseFloat(evaluacionData.puntajeCreatividad)
          : mockData.evaluacionesBimestralesDocentes[index].puntajeCreatividad,
      puntajeComunicacion:
        evaluacionData.puntajeComunicacion !== undefined
          ? parseFloat(evaluacionData.puntajeComunicacion)
          : mockData.evaluacionesBimestralesDocentes[index]
              .puntajeComunicacion,
      promedioFinal: promedioFinal,
      observaciones:
        evaluacionData.observaciones ||
        mockData.evaluacionesBimestralesDocentes[index].observaciones,
      fechaEvaluacion:
        evaluacionData.fechaEvaluacion ||
        mockData.evaluacionesBimestralesDocentes[index].fechaEvaluacion,
      trabajador: trabajadorInfo,
      bimestre: bimestreInfo,
      idTrabajador: trabajadorInfo?.idTrabajador,
      idBimestre: bimestreInfo?.idBimestre,
    };

    console.log(
      "✅ [DEMO] Evaluación actualizada:",
      mockData.evaluacionesBimestralesDocentes[index]
    );

    return {
      success: true,
      message: "Evaluación actualizada exitosamente",
      data: mockData.evaluacionesBimestralesDocentes[index],
    };
  }

  // Eliminar evaluación
  async delete(id) {
    await simulateApiDelay();
    console.log(`[DEMO] Eliminando evaluación: ${id}`);

    const index = mockData.evaluacionesBimestralesDocentes.findIndex(
      (e) => e.idEvaluacion === parseInt(id)
    );

    if (index === -1) {
      throw new Error("Evaluación no encontrada");
    }

    mockData.evaluacionesBimestralesDocentes.splice(index, 1);

    return {
      success: true,
      message: "Evaluación eliminada exitosamente",
    };
  }

  // Obtener estadísticas de evaluaciones
  async getEstadisticas(params = {}) {
    await simulateApiDelay();
    console.log("[DEMO] Obteniendo estadísticas de evaluaciones");

    let evaluaciones = mockData.evaluacionesBimestralesDocentes;

    // Filtrar por trabajador si se especifica
    if (params.idTrabajador) {
      evaluaciones = evaluaciones.filter(
        (e) => e.idTrabajador === parseInt(params.idTrabajador)
      );
    }

    // Filtrar por bimestre si se especifica
    if (params.idBimestre) {
      evaluaciones = evaluaciones.filter(
        (e) => e.idBimestre === parseInt(params.idBimestre)
      );
    }

    const total = evaluaciones.length;

    if (total === 0) {
      return {
        success: true,
        data: {
          total: 0,
          promedioGeneral: 0,
          promedios: {
            planificacion: 0,
            metodologia: 0,
            puntualidad: 0,
            creatividad: 0,
            comunicacion: 0,
          },
          distribucion: {
            excelente: 0, // 18-20
            bueno: 0, // 15-17.9
            regular: 0, // 11-14.9
            deficiente: 0, // 0-10.9
          },
        },
      };
    }

    const promedioGeneral =
      evaluaciones.reduce((sum, e) => sum + e.promedioFinal, 0) / total;

    const promedios = {
      planificacion:
        evaluaciones.reduce((sum, e) => sum + e.puntajePlanificacion, 0) /
        total,
      metodologia:
        evaluaciones.reduce((sum, e) => sum + e.puntajeMetodologia, 0) / total,
      puntualidad:
        evaluaciones.reduce((sum, e) => sum + e.puntajePuntualidad, 0) / total,
      creatividad:
        evaluaciones.reduce((sum, e) => sum + e.puntajeCreatividad, 0) / total,
      comunicacion:
        evaluaciones.reduce((sum, e) => sum + e.puntajeComunicacion, 0) / total,
    };

    const distribucion = {
      excelente: evaluaciones.filter((e) => e.promedioFinal >= 18).length,
      bueno: evaluaciones.filter(
        (e) => e.promedioFinal >= 15 && e.promedioFinal < 18
      ).length,
      regular: evaluaciones.filter(
        (e) => e.promedioFinal >= 11 && e.promedioFinal < 15
      ).length,
      deficiente: evaluaciones.filter((e) => e.promedioFinal < 11).length,
    };

    return {
      success: true,
      data: {
        total,
        promedioGeneral: parseFloat(promedioGeneral.toFixed(2)),
        promedios: {
          planificacion: parseFloat(promedios.planificacion.toFixed(2)),
          metodologia: parseFloat(promedios.metodologia.toFixed(2)),
          puntualidad: parseFloat(promedios.puntualidad.toFixed(2)),
          creatividad: parseFloat(promedios.creatividad.toFixed(2)),
          comunicacion: parseFloat(promedios.comunicacion.toFixed(2)),
        },
        distribucion,
      },
    };
  }

  // Obtener evaluaciones recientes
  async getRecientes(limit = 10) {
    await simulateApiDelay();
    console.log(`[DEMO] Obteniendo ${limit} evaluaciones recientes`);

    const evaluaciones = [...mockData.evaluacionesBimestralesDocentes]
      .sort(
        (a, b) => new Date(b.fechaEvaluacion) - new Date(a.fechaEvaluacion)
      )
      .slice(0, limit);

    return {
      success: true,
      data: evaluaciones,
    };
  }
}

export default new DemoEvaluacionBimestralService();
