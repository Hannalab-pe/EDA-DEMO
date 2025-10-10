import { mockData } from "../data/mockData";

/**
 * Servicio DEMO para gestión de planificaciones (offline)
 * Todas las operaciones se realizan sobre el array mockData.planificaciones
 * SIN conexión a backend
 */

export const demoPlanificacionesService = {
  /**
   * Obtener todas las planificaciones con filtros opcionales
   */
  getPlanificaciones: async (filters = {}) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simular latencia

      let planificaciones = [...mockData.planificaciones];

      // Aplicar filtros si existen
      if (filters.idTrabajador) {
        planificaciones = planificaciones.filter(
          (p) => p.idTrabajador === filters.idTrabajador
        );
      }

      if (filters.tipoPlanificacion) {
        planificaciones = planificaciones.filter(
          (p) => p.tipoPlanificacion === filters.tipoPlanificacion
        );
      }

      if (filters.fechaInicio && filters.fechaFin) {
        planificaciones = planificaciones.filter((p) => {
          const fecha = new Date(p.fechaPlanificacion);
          return (
            fecha >= new Date(filters.fechaInicio) &&
            fecha <= new Date(filters.fechaFin)
          );
        });
      }

      if (filters.estaActivo !== undefined) {
        planificaciones = planificaciones.filter(
          (p) => p.estaActivo === filters.estaActivo
        );
      }

      return planificaciones;
    } catch (error) {
      console.error("Error al obtener planificaciones:", error);
      throw error;
    }
  },

  /**
   * Obtener una planificación por ID
   */
  getPlanificacionById: async (id) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200)); // Simular latencia

      const planificacion = mockData.planificaciones.find(
        (p) => p.idPlanificacion === id || p.idPlanificacion === String(id)
      );

      if (!planificacion) {
        throw new Error("Planificación no encontrada");
      }

      return planificacion;
    } catch (error) {
      console.error("Error al obtener planificación:", error);
      throw error;
    }
  },

  /**
   * Crear nueva planificación
   */
  crearPlanificacion: async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400)); // Simular latencia

      // Validar datos requeridos
      if (!data.tipoPlanificacion || !data.idTrabajador || !data.idAula) {
        throw new Error(
          "Tipo de planificación, trabajador y aula son obligatorios"
        );
      }

      // Obtener datos completos del trabajador
      const trabajador = mockData.trabajadores.find(
        (t) =>
          t.idTrabajador === data.idTrabajador ||
          t.idTrabajador === String(data.idTrabajador)
      );

      if (!trabajador) {
        throw new Error("Trabajador no encontrado");
      }

      // Obtener datos completos del aula
      const aula = mockData.aulas.find(
        (a) => a.idAula === data.idAula || a.idAula === String(data.idAula)
      );

      if (!aula) {
        throw new Error("Aula no encontrada");
      }

      // Generar nuevo ID
      const maxId = mockData.planificaciones.reduce(
        (max, p) => Math.max(max, parseInt(p.idPlanificacion) || 0),
        0
      );
      const newId = String(maxId + 1);

      // URL de PDF de prueba por defecto
      const pdfUrl =
        data.archivoUrl ||
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

      // Crear nueva planificación
      const nuevaPlanificacion = {
        idPlanificacion: newId,
        tipoPlanificacion: data.tipoPlanificacion,
        fechaPlanificacion: data.fechaPlanificacion || new Date().toISOString(),
        idTrabajador: trabajador.idTrabajador,
        trabajador: {
          idTrabajador: trabajador.idTrabajador,
          nombre: trabajador.nombre,
          apellido: trabajador.apellido,
          nroDocumento: trabajador.nroDocumento,
        },
        idAula: aula.idAula,
        aula: {
          idAula: aula.idAula,
          seccion: aula.seccion,
          cantidadEstudiantes: aula.cantidadEstudiantes || 0,
        },
        archivoUrl: pdfUrl,
        archivoNombre: data.archivoNombre || `planificacion_${newId}.pdf`,
        observaciones: data.observaciones || "",
        estaActivo: data.estaActivo !== undefined ? data.estaActivo : true,
        creado: new Date().toISOString(),
        actualizado: new Date().toISOString(),
      };

      // Agregar al array
      mockData.planificaciones.push(nuevaPlanificacion);

      return nuevaPlanificacion;
    } catch (error) {
      console.error("Error al crear planificación:", error);
      throw error;
    }
  },

  /**
   * Actualizar planificación existente
   */
  updatePlanificacion: async (id, data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400)); // Simular latencia

      const index = mockData.planificaciones.findIndex(
        (p) => p.idPlanificacion === id || p.idPlanificacion === String(id)
      );

      if (index === -1) {
        throw new Error("Planificación no encontrada");
      }

      // Actualizar relaciones si cambiaron
      let trabajadorData = mockData.planificaciones[index].trabajador;
      let aulaData = mockData.planificaciones[index].aula;

      if (data.idTrabajador) {
        const trabajador = mockData.trabajadores.find(
          (t) =>
            t.idTrabajador === data.idTrabajador ||
            t.idTrabajador === String(data.idTrabajador)
        );
        if (!trabajador) {
          throw new Error("Trabajador no encontrado");
        }
        trabajadorData = {
          idTrabajador: trabajador.idTrabajador,
          nombre: trabajador.nombre,
          apellido: trabajador.apellido,
          nroDocumento: trabajador.nroDocumento,
        };
      }

      if (data.idAula) {
        const aula = mockData.aulas.find(
          (a) => a.idAula === data.idAula || a.idAula === String(data.idAula)
        );
        if (!aula) {
          throw new Error("Aula no encontrada");
        }
        aulaData = {
          idAula: aula.idAula,
          seccion: aula.seccion,
          cantidadEstudiantes: aula.cantidadEstudiantes || 0,
        };
      }

      // Actualizar planificación
      const planificacionActualizada = {
        ...mockData.planificaciones[index],
        tipoPlanificacion:
          data.tipoPlanificacion ||
          mockData.planificaciones[index].tipoPlanificacion,
        fechaPlanificacion:
          data.fechaPlanificacion ||
          mockData.planificaciones[index].fechaPlanificacion,
        trabajador: trabajadorData,
        idTrabajador: trabajadorData.idTrabajador,
        aula: aulaData,
        idAula: aulaData.idAula,
        archivoUrl:
          data.archivoUrl || mockData.planificaciones[index].archivoUrl,
        archivoNombre:
          data.archivoNombre || mockData.planificaciones[index].archivoNombre,
        observaciones:
          data.observaciones !== undefined
            ? data.observaciones
            : mockData.planificaciones[index].observaciones,
        estaActivo:
          data.estaActivo !== undefined
            ? data.estaActivo
            : mockData.planificaciones[index].estaActivo,
        actualizado: new Date().toISOString(),
      };

      mockData.planificaciones[index] = planificacionActualizada;

      return planificacionActualizada;
    } catch (error) {
      console.error("Error al actualizar planificación:", error);
      throw error;
    }
  },

  /**
   * Eliminar planificación
   */
  deletePlanificacion: async (id) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simular latencia

      const index = mockData.planificaciones.findIndex(
        (p) => p.idPlanificacion === id || p.idPlanificacion === String(id)
      );

      if (index === -1) {
        throw new Error("Planificación no encontrada");
      }

      // Eliminar del array
      mockData.planificaciones.splice(index, 1);

      return { message: "Planificación eliminada exitosamente" };
    } catch (error) {
      console.error("Error al eliminar planificación:", error);
      throw error;
    }
  },

  /**
   * Cambiar estado de planificación (activar/desactivar)
   */
  togglePlanificacionStatus: async (id) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simular latencia

      const index = mockData.planificaciones.findIndex(
        (p) => p.idPlanificacion === id || p.idPlanificacion === String(id)
      );

      if (index === -1) {
        throw new Error("Planificación no encontrada");
      }

      mockData.planificaciones[index].estaActivo =
        !mockData.planificaciones[index].estaActivo;
      mockData.planificaciones[index].actualizado = new Date().toISOString();

      return mockData.planificaciones[index];
    } catch (error) {
      console.error("Error al cambiar estado de planificación:", error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de planificaciones
   */
  getPlanificacionesStats: async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200)); // Simular latencia

      const totalPlanificaciones = mockData.planificaciones.length;
      const planificacionesActivas = mockData.planificaciones.filter(
        (p) => p.estaActivo
      ).length;
      const planificacionesInactivas =
        totalPlanificaciones - planificacionesActivas;

      // Contar planificaciones por tipo
      const planificacionesPorTipo = mockData.planificaciones.reduce(
        (acc, plan) => {
          const tipo = plan.tipoPlanificacion || "Sin tipo";
          acc[tipo] = (acc[tipo] || 0) + 1;
          return acc;
        },
        {}
      );

      // Contar docentes con planificaciones
      const docentesUnicos = new Set(
        mockData.planificaciones
          .filter((p) => p.estaActivo)
          .map((p) => p.idTrabajador)
      );

      return {
        totalPlanificaciones,
        planificacionesActivas,
        planificacionesInactivas,
        planificacionesPorTipo,
        totalDocentes: docentesUnicos.size,
      };
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      throw error;
    }
  },

  /**
   * Abrir archivo PDF en nueva pestaña
   */
  abrirArchivoPDF: (url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      throw new Error("URL de archivo no disponible");
    }
  },
};
