import { mockData } from "../data/mockData";

// Simular delay de red para hacer la demo más realista
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Estado local para estudiantes (simulando base de datos)
let estudiantesLocal = [...mockData.estudiantes];

export const demoEstudiantesService = {
  // Obtener todos los estudiantes
  async getEstudiantes(filters = {}) {
    console.log("🎭 [DEMO] Obteniendo estudiantes con filtros:", filters);
    await delay(300);

    let estudiantes = [...estudiantesLocal];

    // Aplicar filtros si existen
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      estudiantes = estudiantes.filter(
        (est) =>
          est.nombre.toLowerCase().includes(searchLower) ||
          est.apellidos.toLowerCase().includes(searchLower) ||
          est.dni.includes(searchLower)
      );
    }

    if (filters.grade) {
      estudiantes = estudiantes.filter((est) => est.gradoId === filters.grade);
    }

    if (filters.status) {
      estudiantes = estudiantes.filter((est) => est.estado === filters.status);
    }

    console.log("✅ [DEMO] Estudiantes obtenidos:", estudiantes.length);
    return estudiantes;
  },

  // Obtener estudiante por ID
  async getEstudianteById(id) {
    console.log("🎭 [DEMO] Obteniendo estudiante ID:", id);
    await delay(200);

    const estudiante = estudiantesLocal.find((est) => est.id === id);

    if (!estudiante) {
      throw new Error("Estudiante no encontrado");
    }

    console.log("✅ [DEMO] Estudiante encontrado:", estudiante.nombre);
    return estudiante;
  },

  // Crear nuevo estudiante
  async createEstudiante(estudianteData) {
    console.log("🎭 [DEMO] Creando estudiante:", estudianteData);
    await delay(800);

    // Generar nuevo ID
    const newId = (estudiantesLocal.length + 1).toString();

    const nuevoEstudiante = {
      id: newId,
      ...estudianteData,
      estado: "ACTIVO",
      fechaIngreso: new Date().toISOString().split("T")[0],
    };

    // Agregar a la "base de datos" local
    estudiantesLocal.push(nuevoEstudiante);

    console.log("✅ [DEMO] Estudiante creado con ID:", newId);
    return nuevoEstudiante;
  },

  // Actualizar estudiante
  async updateEstudiante({ id, ...estudianteData }) {
    console.log("🎭 [DEMO] Actualizando estudiante ID:", id);
    console.log("🎭 [DEMO] Datos:", estudianteData);
    await delay(600);

    const index = estudiantesLocal.findIndex((est) => est.id === id);

    if (index === -1) {
      throw new Error("Estudiante no encontrado");
    }

    // Actualizar estudiante
    estudiantesLocal[index] = {
      ...estudiantesLocal[index],
      ...estudianteData,
      id, // Mantener el ID original
    };

    console.log(
      "✅ [DEMO] Estudiante actualizado:",
      estudiantesLocal[index].nombre
    );
    return estudiantesLocal[index];
  },

  // Eliminar estudiante (cambiar estado a INACTIVO)
  async deleteEstudiante(id) {
    console.log("🎭 [DEMO] Desactivando estudiante ID:", id);
    await delay(400);

    const index = estudiantesLocal.findIndex((est) => est.id === id);

    if (index === -1) {
      throw new Error("Estudiante no encontrado");
    }

    // Cambiar estado a INACTIVO en lugar de eliminar
    estudiantesLocal[index].estado = "INACTIVO";

    console.log("✅ [DEMO] Estudiante desactivado");
    return { id, estado: "INACTIVO" };
  },

  // Toggle estado del estudiante
  async toggleEstudianteStatus(id) {
    console.log("🎭 [DEMO] Cambiando estado del estudiante ID:", id);
    await delay(400);

    const index = estudiantesLocal.findIndex((est) => est.id === id);

    if (index === -1) {
      throw new Error("Estudiante no encontrado");
    }

    // Cambiar entre ACTIVO e INACTIVO
    const nuevoEstado =
      estudiantesLocal[index].estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
    estudiantesLocal[index].estado = nuevoEstado;

    console.log(`✅ [DEMO] Estado cambiado a: ${nuevoEstado}`);
    return { id, estado: nuevoEstado };
  },

  // Resetear datos a valores iniciales (útil para demo)
  resetEstudiantes() {
    console.log("🔄 [DEMO] Reseteando estudiantes a valores iniciales");
    estudiantesLocal = [...mockData.estudiantes];
  },
};
