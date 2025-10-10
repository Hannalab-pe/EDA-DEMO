import { mockData } from "../data/mockData";

/**
 * Servicio DEMO para gestión de grados (offline)
 * Todas las operaciones se realizan sobre el array mockData.grados
 * SIN conexión a backend
 */

export const demoGradosService = {
  /**
   * Obtener todos los grados
   */
  getAllGrados: async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simular latencia

      return [...mockData.grados];
    } catch (error) {
      console.error("Error al obtener grados:", error);
      throw error;
    }
  },

  /**
   * Obtener un grado por ID
   */
  getGradoById: async (id) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200)); // Simular latencia

      const grado = mockData.grados.find(
        (g) => g.idGrado === id || g.idGrado === String(id)
      );

      if (!grado) {
        throw new Error("Grado no encontrado");
      }

      return grado;
    } catch (error) {
      console.error("Error al obtener grado:", error);
      throw error;
    }
  },

  /**
   * Crear nuevo grado
   */
  createGrado: async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400)); // Simular latencia

      // Validar datos requeridos
      if (!data.grado || !data.descripcion) {
        throw new Error(
          "El nombre del grado y la descripción son obligatorios"
        );
      }

      // Validar duplicado por nombre de grado
      const duplicado = mockData.grados.find(
        (g) => g.grado.toLowerCase().trim() === data.grado.toLowerCase().trim()
      );

      if (duplicado) {
        throw new Error("Ya existe un grado con ese nombre");
      }

      // Generar nuevo ID
      const maxId = mockData.grados.reduce(
        (max, g) => Math.max(max, parseInt(g.idGrado) || 0),
        0
      );
      const newId = String(maxId + 1);

      // Crear nuevo grado
      const nuevoGrado = {
        idGrado: newId,
        grado: data.grado.trim(),
        descripcion: data.descripcion.trim(),
        nivel: data.nivel || "Primaria",
        edadMinima: data.edadMinima || 6,
        edadMaxima: data.edadMaxima || 12,
        capacidadMaxima: data.capacidadMaxima || 25,
        estaActivo: data.estaActivo !== undefined ? data.estaActivo : true,
        creado: new Date().toISOString(),
        actualizado: new Date().toISOString(),
      };

      // Agregar al array
      mockData.grados.push(nuevoGrado);

      return nuevoGrado;
    } catch (error) {
      console.error("Error al crear grado:", error);
      throw error;
    }
  },

  /**
   * Actualizar grado existente
   */
  updateGrado: async (id, data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400)); // Simular latencia

      const index = mockData.grados.findIndex(
        (g) => g.idGrado === id || g.idGrado === String(id)
      );

      if (index === -1) {
        throw new Error("Grado no encontrado");
      }

      // Si se cambia el nombre, validar duplicados
      if (data.grado) {
        const duplicado = mockData.grados.find(
          (g) =>
            g.idGrado !== id &&
            g.idGrado !== String(id) &&
            g.grado.toLowerCase().trim() === data.grado.toLowerCase().trim()
        );

        if (duplicado) {
          throw new Error("Ya existe un grado con ese nombre");
        }
      }

      // Actualizar grado
      const gradoActualizado = {
        ...mockData.grados[index],
        grado:
          data.grado !== undefined
            ? data.grado.trim()
            : mockData.grados[index].grado,
        descripcion:
          data.descripcion !== undefined
            ? data.descripcion.trim()
            : mockData.grados[index].descripcion,
        nivel:
          data.nivel !== undefined ? data.nivel : mockData.grados[index].nivel,
        edadMinima:
          data.edadMinima !== undefined
            ? data.edadMinima
            : mockData.grados[index].edadMinima,
        edadMaxima:
          data.edadMaxima !== undefined
            ? data.edadMaxima
            : mockData.grados[index].edadMaxima,
        capacidadMaxima:
          data.capacidadMaxima !== undefined
            ? data.capacidadMaxima
            : mockData.grados[index].capacidadMaxima,
        estaActivo:
          data.estaActivo !== undefined
            ? data.estaActivo
            : mockData.grados[index].estaActivo,
        actualizado: new Date().toISOString(),
      };

      mockData.grados[index] = gradoActualizado;

      return gradoActualizado;
    } catch (error) {
      console.error("Error al actualizar grado:", error);
      throw error;
    }
  },

  /**
   * Eliminar grado
   */
  deleteGrado: async (id) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simular latencia

      const index = mockData.grados.findIndex(
        (g) => g.idGrado === id || g.idGrado === String(id)
      );

      if (index === -1) {
        throw new Error("Grado no encontrado");
      }

      // Verificar si hay aulas asignadas a este grado
      const aulasAsignadas = mockData.asignacionesAula.filter(
        (a) =>
          a.idGrado &&
          (a.idGrado.idGrado === id || a.idGrado.idGrado === String(id))
      );

      if (aulasAsignadas.length > 0) {
        throw new Error(
          "No se puede eliminar el grado porque tiene aulas asignadas"
        );
      }

      // Verificar si hay asignaciones de cursos a este grado
      const asignacionesCursos = mockData.asignacionesCursos?.filter(
        (a) =>
          a.idGrado &&
          (a.idGrado.idGrado === id || a.idGrado.idGrado === String(id))
      );

      if (asignacionesCursos && asignacionesCursos.length > 0) {
        throw new Error(
          "No se puede eliminar el grado porque tiene cursos asignados"
        );
      }

      // Eliminar del array
      mockData.grados.splice(index, 1);

      return { message: "Grado eliminado exitosamente" };
    } catch (error) {
      console.error("Error al eliminar grado:", error);
      throw error;
    }
  },

  /**
   * Cambiar estado de grado (activar/desactivar)
   */
  toggleGradoStatus: async (id) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simular latencia

      const index = mockData.grados.findIndex(
        (g) => g.idGrado === id || g.idGrado === String(id)
      );

      if (index === -1) {
        throw new Error("Grado no encontrado");
      }

      mockData.grados[index].estaActivo = !mockData.grados[index].estaActivo;
      mockData.grados[index].actualizado = new Date().toISOString();

      return mockData.grados[index];
    } catch (error) {
      console.error("Error al cambiar estado de grado:", error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de grados
   */
  getGradosStats: async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200)); // Simular latencia

      const totalGrados = mockData.grados.length;
      const gradosActivos = mockData.grados.filter((g) => g.estaActivo).length;
      const gradosInactivos = totalGrados - gradosActivos;

      // Contar grados por nivel
      const gradosPorNivel = mockData.grados.reduce((acc, grado) => {
        const nivel = grado.nivel || "Sin nivel";
        acc[nivel] = (acc[nivel] || 0) + 1;
        return acc;
      }, {});

      return {
        totalGrados,
        gradosActivos,
        gradosInactivos,
        gradosPorNivel,
      };
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      throw error;
    }
  },
};
