import { mockData } from "../data/mockData";

/**
 * Servicio DEMO para gestión de asignaciones de cursos (offline)
 * Todas las operaciones se realizan sobre el array mockData.asignacionesCursos
 * SIN conexión a backend
 */

export const demoAsignacionCursosService = {
  /**
   * Obtener todas las asignaciones de cursos con filtros opcionales
   */
  getAsignacionCursos: async (filters = {}) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simular latencia

      let asignaciones = [...mockData.asignacionesCursos];

      // Aplicar filtros si existen
      if (filters.idTrabajador) {
        asignaciones = asignaciones.filter(
          (a) => a.idTrabajador.idTrabajador === filters.idTrabajador
        );
      }

      if (filters.idCurso) {
        asignaciones = asignaciones.filter(
          (a) => a.idCurso.idCurso === filters.idCurso
        );
      }

      if (filters.idGrado) {
        asignaciones = asignaciones.filter(
          (a) => a.idGrado.idGrado === filters.idGrado
        );
      }

      if (filters.idAula) {
        asignaciones = asignaciones.filter(
          (a) => a.idAula.idAula === filters.idAula
        );
      }

      if (filters.anioEscolar) {
        asignaciones = asignaciones.filter(
          (a) => a.anioEscolar === filters.anioEscolar
        );
      }

      if (filters.estaActivo !== undefined) {
        asignaciones = asignaciones.filter(
          (a) => a.estaActivo === filters.estaActivo
        );
      }

      return {
        data: asignaciones,
        total: asignaciones.length,
      };
    } catch (error) {
      console.error("Error al obtener asignaciones de cursos:", error);
      throw error;
    }
  },

  /**
   * Obtener una asignación de curso por ID
   */
  getAsignacionCursoById: async (id) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200)); // Simular latencia

      const asignacion = mockData.asignacionesCursos.find(
        (a) => a.idAsignacionCurso === id
      );

      if (!asignacion) {
        throw new Error("Asignación de curso no encontrada");
      }

      return { data: asignacion };
    } catch (error) {
      console.error("Error al obtener asignación de curso:", error);
      throw error;
    }
  },

  /**
   * Crear nueva asignación de curso
   */
  createAsignacionCurso: async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400)); // Simular latencia

      // Validar duplicados: mismo trabajador + curso + grado + aula + año escolar
      const duplicado = mockData.asignacionesCursos.find(
        (a) =>
          a.idTrabajador.idTrabajador === data.idTrabajador &&
          a.idCurso.idCurso === data.idCurso &&
          a.idGrado.idGrado === data.idGrado &&
          a.idAula.idAula === data.idAula &&
          a.anioEscolar === data.anioEscolar &&
          a.estaActivo
      );

      if (duplicado) {
        throw new Error("Ya existe una asignación activa con los mismos datos");
      }

      // Obtener datos completos de las relaciones
      const trabajador = mockData.trabajadores.find(
        (t) => t.idTrabajador === data.idTrabajador
      );
      const curso = mockData.cursos.find((c) => c.idCurso === data.idCurso);
      const grado = mockData.grados.find((g) => g.idGrado === data.idGrado);
      const aula = mockData.aulas.find((a) => a.idAula === data.idAula);

      if (!trabajador) {
        throw new Error("Trabajador no encontrado");
      }
      if (!curso) {
        throw new Error("Curso no encontrado");
      }
      if (!grado) {
        throw new Error("Grado no encontrado");
      }
      if (!aula) {
        throw new Error("Aula no encontrada");
      }

      // Generar nuevo ID
      const maxId = mockData.asignacionesCursos.reduce(
        (max, a) => Math.max(max, parseInt(a.idAsignacionCurso) || 0),
        0
      );
      const newId = String(maxId + 1);

      // Crear nueva asignación
      const nuevaAsignacion = {
        idAsignacionCurso: newId,
        idTrabajador: {
          idTrabajador: trabajador.idTrabajador,
          nombre: trabajador.nombre,
          apellido: trabajador.apellido,
          nroDocumento: trabajador.nroDocumento,
          idRol: trabajador.idRol,
        },
        idCurso: {
          idCurso: curso.idCurso,
          nombre: curso.nombre,
          codigo: curso.codigo,
        },
        idGrado: {
          idGrado: grado.idGrado,
          grado: grado.grado,
        },
        idAula: {
          idAula: aula.idAula,
          seccion: aula.seccion,
        },
        anioEscolar: data.anioEscolar,
        estaActivo: data.estaActivo !== undefined ? data.estaActivo : true,
        creado: new Date().toISOString(),
        actualizado: new Date().toISOString(),
      };

      // Agregar al array
      mockData.asignacionesCursos.push(nuevaAsignacion);

      return { data: nuevaAsignacion };
    } catch (error) {
      console.error("Error al crear asignación de curso:", error);
      throw error;
    }
  },

  /**
   * Actualizar asignación de curso existente
   */
  updateAsignacionCurso: async ({ id, data }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400)); // Simular latencia

      const index = mockData.asignacionesCursos.findIndex(
        (a) => a.idAsignacionCurso === id
      );

      if (index === -1) {
        throw new Error("Asignación de curso no encontrada");
      }

      // Si se cambian los datos principales, validar duplicados
      if (
        data.idTrabajador ||
        data.idCurso ||
        data.idGrado ||
        data.idAula ||
        data.anioEscolar
      ) {
        const asignacionActual = mockData.asignacionesCursos[index];
        const duplicado = mockData.asignacionesCursos.find(
          (a) =>
            a.idAsignacionCurso !== id &&
            a.idTrabajador.idTrabajador ===
              (data.idTrabajador ||
                asignacionActual.idTrabajador.idTrabajador) &&
            a.idCurso.idCurso ===
              (data.idCurso || asignacionActual.idCurso.idCurso) &&
            a.idGrado.idGrado ===
              (data.idGrado || asignacionActual.idGrado.idGrado) &&
            a.idAula.idAula ===
              (data.idAula || asignacionActual.idAula.idAula) &&
            a.anioEscolar ===
              (data.anioEscolar || asignacionActual.anioEscolar) &&
            a.estaActivo
        );

        if (duplicado) {
          throw new Error(
            "Ya existe una asignación activa con los mismos datos"
          );
        }
      }

      // Actualizar relaciones si cambiaron
      let trabajadorData = mockData.asignacionesCursos[index].idTrabajador;
      let cursoData = mockData.asignacionesCursos[index].idCurso;
      let gradoData = mockData.asignacionesCursos[index].idGrado;
      let aulaData = mockData.asignacionesCursos[index].idAula;

      if (data.idTrabajador) {
        const trabajador = mockData.trabajadores.find(
          (t) => t.idTrabajador === data.idTrabajador
        );
        if (!trabajador) {
          throw new Error("Trabajador no encontrado");
        }
        trabajadorData = {
          idTrabajador: trabajador.idTrabajador,
          nombre: trabajador.nombre,
          apellido: trabajador.apellido,
          nroDocumento: trabajador.nroDocumento,
          idRol: trabajador.idRol,
        };
      }

      if (data.idCurso) {
        const curso = mockData.cursos.find((c) => c.idCurso === data.idCurso);
        if (!curso) {
          throw new Error("Curso no encontrado");
        }
        cursoData = {
          idCurso: curso.idCurso,
          nombre: curso.nombre,
          codigo: curso.codigo,
        };
      }

      if (data.idGrado) {
        const grado = mockData.grados.find((g) => g.idGrado === data.idGrado);
        if (!grado) {
          throw new Error("Grado no encontrado");
        }
        gradoData = {
          idGrado: grado.idGrado,
          grado: grado.grado,
        };
      }

      if (data.idAula) {
        const aula = mockData.aulas.find((a) => a.idAula === data.idAula);
        if (!aula) {
          throw new Error("Aula no encontrada");
        }
        aulaData = {
          idAula: aula.idAula,
          seccion: aula.seccion,
        };
      }

      // Actualizar asignación
      const asignacionActualizada = {
        ...mockData.asignacionesCursos[index],
        idTrabajador: trabajadorData,
        idCurso: cursoData,
        idGrado: gradoData,
        idAula: aulaData,
        anioEscolar:
          data.anioEscolar || mockData.asignacionesCursos[index].anioEscolar,
        estaActivo:
          data.estaActivo !== undefined
            ? data.estaActivo
            : mockData.asignacionesCursos[index].estaActivo,
        actualizado: new Date().toISOString(),
      };

      mockData.asignacionesCursos[index] = asignacionActualizada;

      return { data: asignacionActualizada };
    } catch (error) {
      console.error("Error al actualizar asignación de curso:", error);
      throw error;
    }
  },

  /**
   * Eliminar asignación de curso
   */
  deleteAsignacionCurso: async (id) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simular latencia

      const index = mockData.asignacionesCursos.findIndex(
        (a) => a.idAsignacionCurso === id
      );

      if (index === -1) {
        throw new Error("Asignación de curso no encontrada");
      }

      // Eliminar del array
      mockData.asignacionesCursos.splice(index, 1);

      return { data: { message: "Asignación eliminada exitosamente" } };
    } catch (error) {
      console.error("Error al eliminar asignación de curso:", error);
      throw error;
    }
  },

  /**
   * Cambiar estado de asignación (activar/desactivar)
   */
  toggleAsignacionStatus: async (id) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simular latencia

      const index = mockData.asignacionesCursos.findIndex(
        (a) => a.idAsignacionCurso === id
      );

      if (index === -1) {
        throw new Error("Asignación de curso no encontrada");
      }

      mockData.asignacionesCursos[index].estaActivo =
        !mockData.asignacionesCursos[index].estaActivo;
      mockData.asignacionesCursos[index].actualizado = new Date().toISOString();

      return { data: mockData.asignacionesCursos[index] };
    } catch (error) {
      console.error("Error al cambiar estado de asignación:", error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de asignaciones
   */
  getAsignacionesStats: async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200)); // Simular latencia

      const totalAsignaciones = mockData.asignacionesCursos.length;
      const asignacionesActivas = mockData.asignacionesCursos.filter(
        (a) => a.estaActivo
      ).length;
      const asignacionesInactivas = totalAsignaciones - asignacionesActivas;

      // Contar docentes con asignaciones
      const docentesUnicos = new Set(
        mockData.asignacionesCursos
          .filter((a) => a.estaActivo)
          .map((a) => a.idTrabajador.idTrabajador)
      );

      return {
        data: {
          totalAsignaciones,
          asignacionesActivas,
          asignacionesInactivas,
          totalDocentes: docentesUnicos.size,
        },
      };
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      throw error;
    }
  },
};
