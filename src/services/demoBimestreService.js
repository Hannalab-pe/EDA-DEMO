// src/services/demoBimestreService.js
// Servicio DEMO para gestión de bimestres (sin API real)

import { mockData, simulateApiDelay } from "../data/mockData";

const demoBimestreService = {
  /**
   * Obtener todos los bimestres agrupados por período
   */
  getAll: async () => {
    await simulateApiDelay(300, 800);
    console.log("[DEMO] Bimestres cargados:", mockData.bimestresDetallados.length);
    
    return {
      bimestres: [...mockData.bimestresDetallados],
      total: mockData.bimestresDetallados.length,
    };
  },

  /**
   * Obtener bimestres de un período específico
   */
  getByPeriodo: async (idPeriodoEscolar) => {
    await simulateApiDelay(200, 500);
    
    const bimestres = mockData.bimestresDetallados.filter(
      (b) => b.idPeriodoEscolar === parseInt(idPeriodoEscolar)
    );
    
    console.log(`[DEMO] Bimestres del período ${idPeriodoEscolar}:`, bimestres.length);
    return bimestres;
  },

  /**
   * Obtener bimestre activo
   */
  getActivo: async () => {
    await simulateApiDelay(200, 500);
    
    const bimestreActivo = mockData.bimestresDetallados.find((b) => b.estaActivo === true);
    
    if (!bimestreActivo) {
      throw new Error("No hay bimestre activo");
    }
    
    console.log("[DEMO] Bimestre activo:", bimestreActivo);
    return { ...bimestreActivo };
  },

  /**
   * Obtener bimestre por ID
   */
  getById: async (id) => {
    await simulateApiDelay(200, 500);
    
    const bimestre = mockData.bimestresDetallados.find(
      (b) => b.idBimestre === parseInt(id)
    );
    
    if (!bimestre) {
      throw new Error(`Bimestre con ID ${id} no encontrado`);
    }
    
    return { ...bimestre };
  },

  /**
   * Generar bimestres automáticamente para un período escolar (DEMO)
   */
  generarAutomaticos: async (idPeriodoEscolar) => {
    await simulateApiDelay(800, 1500);
    
    const periodo = mockData.periodosEscolares.find(
      (p) => p.idPeriodoEscolar === parseInt(idPeriodoEscolar)
    );

    if (!periodo) {
      throw new Error(`Período escolar con ID ${idPeriodoEscolar} no encontrado`);
    }

    // Verificar si ya existen bimestres para este período
    const bimestresExistentes = mockData.bimestresDetallados.filter(
      (b) => b.idPeriodoEscolar === parseInt(idPeriodoEscolar)
    );

    if (bimestresExistentes.length > 0) {
      throw new Error(`Ya existen ${bimestresExistentes.length} bimestres para este período`);
    }

    // Calcular fechas automáticamente
    const fechaInicio = new Date(periodo.fechaInicio);
    const fechaFin = new Date(periodo.fechaFin);
    const duracionTotal = fechaFin - fechaInicio;
    const duracionBimestre = duracionTotal / 4; // 4 bimestres

    const nuevosBimestres = [];
    const baseId = Math.max(...mockData.bimestresDetallados.map((b) => b.idBimestre), 0) + 1;

    for (let i = 0; i < 4; i++) {
      const inicioMilisegundos = fechaInicio.getTime() + duracionBimestre * i;
      const finMilisegundos = fechaInicio.getTime() + duracionBimestre * (i + 1) - 1;

      const nuevoBimestre = {
        idBimestre: baseId + i,
        idPeriodoEscolar: parseInt(idPeriodoEscolar),
        numeroBimestre: i + 1,
        nombreBimestre: `${["I", "II", "III", "IV"][i]} Bimestre`,
        fechaInicio: new Date(inicioMilisegundos).toISOString().split("T")[0],
        fechaFin: new Date(finMilisegundos).toISOString().split("T")[0],
        fechaLimiteProgramacion: new Date(inicioMilisegundos - 5 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // 5 días antes
        estaActivo: false,
        creado: new Date().toISOString(),
        actualizado: new Date().toISOString(),
      };

      nuevosBimestres.push(nuevoBimestre);
      mockData.bimestresDetallados.push(nuevoBimestre);
    }

    console.log(`[DEMO] ${nuevosBimestres.length} bimestres generados para período ${periodo.anioEscolar}`);
    return nuevosBimestres;
  },

  /**
   * Actualizar fechas de bimestres (DEMO)
   */
  actualizarFechas: async (actualizaciones) => {
    await simulateApiDelay(600, 1200);
    
    const bimestresActualizados = [];

    for (const actualizacion of actualizaciones) {
      const index = mockData.bimestresDetallados.findIndex(
        (b) => b.idBimestre === parseInt(actualizacion.idBimestre)
      );

      if (index !== -1) {
        mockData.bimestresDetallados[index] = {
          ...mockData.bimestresDetallados[index],
          fechaInicio: actualizacion.fechaInicio,
          fechaFin: actualizacion.fechaFin,
          fechaLimiteProgramacion:
            actualizacion.fechaLimiteProgramacion ||
            mockData.bimestresDetallados[index].fechaLimiteProgramacion,
          actualizado: new Date().toISOString(),
        };

        bimestresActualizados.push(mockData.bimestresDetallados[index]);
      }
    }

    console.log("[DEMO] Bimestres actualizados:", bimestresActualizados.length);
    return bimestresActualizados;
  },

  /**
   * Activar un bimestre específico
   */
  activar: async (id) => {
    await simulateApiDelay(400, 700);
    
    // Desactivar todos los bimestres
    mockData.bimestresDetallados.forEach((b) => {
      b.estaActivo = false;
    });

    // Activar el solicitado
    const bimestre = mockData.bimestresDetallados.find(
      (b) => b.idBimestre === parseInt(id)
    );

    if (!bimestre) {
      throw new Error(`Bimestre con ID ${id} no encontrado`);
    }

    bimestre.estaActivo = true;
    bimestre.actualizado = new Date().toISOString();

    console.log("[DEMO] Bimestre activado:", bimestre);
    return { ...bimestre };
  },

  /**
   * Eliminar bimestres de un período (DEMO)
   */
  eliminarPorPeriodo: async (idPeriodoEscolar) => {
    await simulateApiDelay(500, 900);
    
    const bimestresOriginales = mockData.bimestresDetallados.length;
    
    mockData.bimestresDetallados = mockData.bimestresDetallados.filter(
      (b) => b.idPeriodoEscolar !== parseInt(idPeriodoEscolar)
    );

    const eliminados = bimestresOriginales - mockData.bimestresDetallados.length;
    
    console.log(`[DEMO] ${eliminados} bimestres eliminados del período ${idPeriodoEscolar}`);
    return { mensaje: `${eliminados} bimestres eliminados exitosamente` };
  },
};

export default demoBimestreService;
