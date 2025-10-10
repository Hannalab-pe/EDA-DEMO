// Servicio demo para matrículas - Sin conexión a backend
import { mockData, simulateApiDelay, generateId } from "../data/mockData";

export const demoMatriculaService = {
  // Obtener todas las matrículas con filtros opcionales
  getMatriculas: async (filters = {}) => {
    await simulateApiDelay();

    let matriculas = [...mockData.matriculas];

    // Aplicar filtros
    if (filters.estado) {
      matriculas = matriculas.filter((m) => m.estado === filters.estado);
    }

    if (filters.anioEscolar) {
      matriculas = matriculas.filter(
        (m) => m.anioEscolar === filters.anioEscolar
      );
    }

    if (filters.metodoPago) {
      matriculas = matriculas.filter(
        (m) => m.metodoPago === filters.metodoPago
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      matriculas = matriculas.filter(
        (m) =>
          m.idEstudiante.nombre.toLowerCase().includes(searchLower) ||
          m.idEstudiante.apellido.toLowerCase().includes(searchLower) ||
          m.idEstudiante.nroDocumento.toLowerCase().includes(searchLower)
      );
    }

    // Paginación
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const offset = (page - 1) * limit;

    const paginatedMatriculas = matriculas.slice(offset, offset + limit);

    return {
      data: paginatedMatriculas,
      pagination: {
        page,
        limit,
        total: matriculas.length,
        totalPages: Math.ceil(matriculas.length / limit),
        hasNext: offset + limit < matriculas.length,
        hasPrev: page > 1,
      },
    };
  },

  // Obtener matrícula por ID
  getMatriculaById: async (id) => {
    await simulateApiDelay();

    const matricula = mockData.matriculas.find((m) => m.idMatricula === id);

    if (!matricula) {
      throw new Error("Matrícula no encontrada");
    }

    return matricula;
  },

  // Crear nueva matrícula
  createMatricula: async (matriculaData) => {
    await simulateApiDelay();

    // Obtener idEstudiante de forma flexible
    let idEstudiante;

    // Si viene el objeto completo idEstudiante
    if (matriculaData.idEstudiante) {
      if (typeof matriculaData.idEstudiante === "string") {
        idEstudiante = matriculaData.idEstudiante;
      } else if (matriculaData.idEstudiante.id) {
        idEstudiante = matriculaData.idEstudiante.id;
      }
    }

    // Si no viene idEstudiante, intentar obtenerlo de estudianteData
    if (!idEstudiante && matriculaData.estudianteData?.nroDocumento) {
      // Buscar estudiante por documento en la data de estudiantes
      const estudianteEncontrado = mockData.estudiantes.find(
        (e) => e.nroDocumento === matriculaData.estudianteData.nroDocumento
      );

      if (estudianteEncontrado) {
        idEstudiante = estudianteEncontrado.id;
      } else {
        // Crear nuevo estudiante temporal (solo para demo)
        const nuevoEstudiante = {
          id: generateId(),
          nombre: matriculaData.estudianteData?.nombre || "Nuevo",
          apellido: matriculaData.estudianteData?.apellido || "Estudiante",
          nroDocumento:
            matriculaData.estudianteData?.nroDocumento ||
            generateId().slice(0, 8),
          tipoDocumento: matriculaData.estudianteData?.tipoDocumento || "DNI",
          imagen_estudiante: null,
          idUsuario: {
            usuario: `estudiante${mockData.estudiantes.length + 1}`,
            estaActivo: true,
            creado: new Date().toISOString(),
          },
          contactosEmergencia:
            matriculaData.estudianteData?.contactosEmergencia || [],
          matriculas: [],
        };

        mockData.estudiantes.push(nuevoEstudiante);
        idEstudiante = nuevoEstudiante.id;
      }
    }

    // Si aún no tenemos idEstudiante, usar el primero disponible o crear uno
    if (!idEstudiante) {
      if (mockData.estudiantes.length > 0) {
        idEstudiante = mockData.estudiantes[0].id;
      } else {
        throw new Error("No hay estudiantes disponibles");
      }
    }

    // Buscar el estudiante completo
    const estudiante = mockData.estudiantes.find((e) => e.id === idEstudiante);

    if (!estudiante) {
      throw new Error("Estudiante no encontrado");
    }

    // Verificar si ya existe una matrícula activa para este estudiante en el mismo año
    const anioEscolar =
      matriculaData.anioEscolar || new Date().getFullYear().toString();
    const matriculaExistente = mockData.matriculas.find(
      (m) =>
        m.idEstudiante.id === idEstudiante &&
        m.anioEscolar === anioEscolar &&
        m.estado === "activo"
    );

    if (matriculaExistente) {
      throw new Error(
        "El estudiante ya tiene una matrícula activa para este año escolar"
      );
    }

    // Crear nueva matrícula
    const nuevaMatricula = {
      idMatricula: generateId(),
      costoMatricula: parseFloat(
        matriculaData.costoMatricula || matriculaData.costo || 250.0
      ),
      fechaIngreso: matriculaData.fechaIngreso || new Date().toISOString(),
      metodoPago: matriculaData.metodoPago || "Efectivo",
      voucherImagen:
        matriculaData.voucherImagen || matriculaData.voucherImg || "",
      anioEscolar: anioEscolar,
      estado: "activo",
      creado: new Date().toISOString(),
      actualizado: new Date().toISOString(),
      idEstudiante: {
        id: estudiante.id,
        nombre: estudiante.nombre,
        apellido: estudiante.apellido,
        nroDocumento: estudiante.nroDocumento,
      },
    };

    // Agregar a la data mock
    mockData.matriculas.push(nuevaMatricula);

    return nuevaMatricula;
  },

  // Actualizar matrícula
  updateMatricula: async (id, matriculaData) => {
    await simulateApiDelay();

    const index = mockData.matriculas.findIndex((m) => m.idMatricula === id);

    if (index === -1) {
      throw new Error("Matrícula no encontrada");
    }

    // Si se cambia el estudiante, validar que existe
    if (
      matriculaData.idEstudiante &&
      matriculaData.idEstudiante !== mockData.matriculas[index].idEstudiante.id
    ) {
      const estudiante = mockData.estudiantes.find(
        (e) => e.id === matriculaData.idEstudiante
      );

      if (!estudiante) {
        throw new Error("Estudiante no encontrado");
      }

      // Actualizar datos del estudiante
      mockData.matriculas[index].idEstudiante = {
        id: estudiante.id,
        nombre: estudiante.nombre,
        apellido: estudiante.apellido,
        nroDocumento: estudiante.nroDocumento,
      };
    }

    // Actualizar campos
    if (matriculaData.costoMatricula !== undefined) {
      mockData.matriculas[index].costoMatricula = parseFloat(
        matriculaData.costoMatricula
      );
    }

    if (matriculaData.metodoPago) {
      mockData.matriculas[index].metodoPago = matriculaData.metodoPago;
    }

    if (matriculaData.voucherImagen !== undefined) {
      mockData.matriculas[index].voucherImagen = matriculaData.voucherImagen;
    }

    if (matriculaData.anioEscolar) {
      mockData.matriculas[index].anioEscolar = matriculaData.anioEscolar;
    }

    if (matriculaData.estado) {
      mockData.matriculas[index].estado = matriculaData.estado;
    }

    mockData.matriculas[index].actualizado = new Date().toISOString();

    return mockData.matriculas[index];
  },

  // Eliminar matrícula (cambiar estado a inactivo)
  deleteMatricula: async (id) => {
    await simulateApiDelay();

    const index = mockData.matriculas.findIndex((m) => m.idMatricula === id);

    if (index === -1) {
      throw new Error("Matrícula no encontrada");
    }

    // Cambiar estado a inactivo en lugar de eliminar
    mockData.matriculas[index].estado = "inactivo";
    mockData.matriculas[index].actualizado = new Date().toISOString();

    return { message: "Matrícula eliminada exitosamente" };
  },

  // Cambiar estado de matrícula
  toggleMatriculaStatus: async (id) => {
    await simulateApiDelay();

    const index = mockData.matriculas.findIndex((m) => m.idMatricula === id);

    if (index === -1) {
      throw new Error("Matrícula no encontrada");
    }

    mockData.matriculas[index].estado =
      mockData.matriculas[index].estado === "activo" ? "inactivo" : "activo";
    mockData.matriculas[index].actualizado = new Date().toISOString();

    return mockData.matriculas[index];
  },

  // Obtener estadísticas de matrículas
  getMatriculasStats: async () => {
    await simulateApiDelay();

    const total = mockData.matriculas.length;
    const activas = mockData.matriculas.filter(
      (m) => m.estado === "activo"
    ).length;
    const inactivas = mockData.matriculas.filter(
      (m) => m.estado === "inactivo"
    ).length;

    const totalIngresos = mockData.matriculas
      .filter((m) => m.estado === "activo")
      .reduce((sum, m) => sum + m.costoMatricula, 0);

    const porMetodoPago = mockData.matriculas
      .filter((m) => m.estado === "activo")
      .reduce((acc, m) => {
        acc[m.metodoPago] = (acc[m.metodoPago] || 0) + 1;
        return acc;
      }, {});

    return {
      total,
      activas,
      inactivas,
      totalIngresos,
      porMetodoPago,
    };
  },
};
