// Servicio demo para cursos - Sin conexión a backend
import { mockData, simulateApiDelay, generateId } from "../data/mockData";

export const demoCursosService = {
  // Obtener todos los cursos
  getAll: async () => {
    await simulateApiDelay();

    return {
      info: {
        data: [...mockData.cursos],
        total: mockData.cursos.length,
      },
    };
  },

  // Obtener curso por ID
  getById: async (id) => {
    await simulateApiDelay();

    const curso = mockData.cursos.find((c) => c.idCurso === id);

    if (!curso) {
      throw new Error("Curso no encontrado");
    }

    return {
      info: {
        data: curso,
      },
    };
  },

  // Crear nuevo curso
  create: async (cursoData) => {
    await simulateApiDelay();

    // Verificar si ya existe un curso con el mismo código
    const cursoExistente = mockData.cursos.find(
      (c) => c.codigo.toLowerCase() === cursoData.codigo.toLowerCase()
    );

    if (cursoExistente) {
      throw new Error("Ya existe un curso con ese código");
    }

    // Verificar si ya existe un curso con el mismo nombre
    const nombreExistente = mockData.cursos.find(
      (c) => c.nombre.toLowerCase() === cursoData.nombre.toLowerCase()
    );

    if (nombreExistente) {
      throw new Error("Ya existe un curso con ese nombre");
    }

    // Crear nuevo curso
    const nuevoCurso = {
      idCurso: generateId(),
      nombre: cursoData.nombre,
      descripcion: cursoData.descripcion || "",
      codigo: cursoData.codigo,
      horasPorSemana: parseInt(cursoData.horasPorSemana) || 0,
      nivel: cursoData.nivel || "Primaria",
      estaActivo: true,
      creado: new Date().toISOString(),
      actualizado: new Date().toISOString(),
    };

    // Agregar a la data mock
    mockData.cursos.push(nuevoCurso);

    return {
      info: {
        data: nuevoCurso,
        message: "Curso creado exitosamente",
      },
    };
  },

  // Actualizar curso
  update: async (id, cursoData) => {
    await simulateApiDelay();

    const index = mockData.cursos.findIndex((c) => c.idCurso === id);

    if (index === -1) {
      throw new Error("Curso no encontrado");
    }

    // Verificar código duplicado (excepto el mismo curso)
    if (cursoData.codigo) {
      const codigoDuplicado = mockData.cursos.find(
        (c) =>
          c.codigo.toLowerCase() === cursoData.codigo.toLowerCase() &&
          c.idCurso !== id
      );

      if (codigoDuplicado) {
        throw new Error("Ya existe otro curso con ese código");
      }
    }

    // Verificar nombre duplicado (excepto el mismo curso)
    if (cursoData.nombre) {
      const nombreDuplicado = mockData.cursos.find(
        (c) =>
          c.nombre.toLowerCase() === cursoData.nombre.toLowerCase() &&
          c.idCurso !== id
      );

      if (nombreDuplicado) {
        throw new Error("Ya existe otro curso con ese nombre");
      }
    }

    // Actualizar campos
    if (cursoData.nombre !== undefined) {
      mockData.cursos[index].nombre = cursoData.nombre;
    }

    if (cursoData.descripcion !== undefined) {
      mockData.cursos[index].descripcion = cursoData.descripcion;
    }

    if (cursoData.codigo !== undefined) {
      mockData.cursos[index].codigo = cursoData.codigo;
    }

    if (cursoData.horasPorSemana !== undefined) {
      mockData.cursos[index].horasPorSemana = parseInt(
        cursoData.horasPorSemana
      );
    }

    if (cursoData.nivel !== undefined) {
      mockData.cursos[index].nivel = cursoData.nivel;
    }

    if (cursoData.estaActivo !== undefined) {
      mockData.cursos[index].estaActivo = cursoData.estaActivo;
    }

    mockData.cursos[index].actualizado = new Date().toISOString();

    return {
      info: {
        data: mockData.cursos[index],
        message: "Curso actualizado exitosamente",
      },
    };
  },

  // Eliminar curso (cambiar estado a inactivo)
  delete: async (id) => {
    await simulateApiDelay();

    const index = mockData.cursos.findIndex((c) => c.idCurso === id);

    if (index === -1) {
      throw new Error("Curso no encontrado");
    }

    // Cambiar estado a inactivo en lugar de eliminar
    mockData.cursos[index].estaActivo = false;
    mockData.cursos[index].actualizado = new Date().toISOString();

    return {
      info: {
        message: "Curso eliminado exitosamente",
      },
    };
  },

  // Cambiar estado de curso
  toggleStatus: async (id) => {
    await simulateApiDelay();

    const index = mockData.cursos.findIndex((c) => c.idCurso === id);

    if (index === -1) {
      throw new Error("Curso no encontrado");
    }

    mockData.cursos[index].estaActivo = !mockData.cursos[index].estaActivo;
    mockData.cursos[index].actualizado = new Date().toISOString();

    return {
      info: {
        data: mockData.cursos[index],
        message: `Curso ${
          mockData.cursos[index].estaActivo ? "activado" : "desactivado"
        } exitosamente`,
      },
    };
  },

  // Obtener estadísticas de cursos
  getStats: async () => {
    await simulateApiDelay();

    const total = mockData.cursos.length;
    const activos = mockData.cursos.filter((c) => c.estaActivo).length;
    const inactivos = mockData.cursos.filter((c) => !c.estaActivo).length;

    const porNivel = mockData.cursos.reduce((acc, c) => {
      acc[c.nivel] = (acc[c.nivel] || 0) + 1;
      return acc;
    }, {});

    const horasTotales = mockData.cursos
      .filter((c) => c.estaActivo)
      .reduce((sum, c) => sum + c.horasPorSemana, 0);

    return {
      info: {
        data: {
          total,
          activos,
          inactivos,
          porNivel,
          horasTotales,
        },
      },
    };
  },
};
