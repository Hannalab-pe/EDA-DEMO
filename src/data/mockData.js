// Datos mock para el sistema demo
export const mockData = {
  // Estudiantes
  estudiantes: [
    {
      id: "1",
      nombre: "Sofía",
      apellidos: "Pérez Morales",
      dni: "00123456",
      fechaNacimiento: "2019-03-15",
      genero: "F",
      direccion: "Av. Los Rosales 123, Lima",
      telefono: "987654321",
      email: "sofia.perez@example.com",
      gradoId: "1",
      aulaId: "1",
      padreId: "3",
      estado: "ACTIVO",
      foto: "👧",
      fechaIngreso: "2024-03-01",
      observaciones: "Estudiante destacada en matemáticas",
    },
    {
      id: "2",
      nombre: "Carlos",
      apellidos: "Mendoza Silva",
      dni: "00123457",
      fechaNacimiento: "2018-07-22",
      genero: "M",
      direccion: "Jr. Las Flores 456, Lima",
      telefono: "987654322",
      email: "carlos.mendoza@example.com",
      gradoId: "2",
      aulaId: "2",
      padreId: "4",
      estado: "ACTIVO",
      foto: "👦",
      fechaIngreso: "2024-03-01",
      observaciones: "Muy sociable y colaborativo",
    },
    {
      id: "3",
      nombre: "María",
      apellidos: "González Torres",
      dni: "00123458",
      fechaNacimiento: "2017-11-08",
      genero: "F",
      direccion: "Calle Los Laureles 789, Lima",
      telefono: "987654323",
      email: "maria.gonzalez@example.com",
      gradoId: "3",
      aulaId: "3",
      padreId: "5",
      estado: "ACTIVO",
      foto: "👧",
      fechaIngreso: "2024-03-01",
      observaciones: "Excelente en arte y creatividad",
    },
  ],

  // Grados
  grados: [
    {
      id: "1",
      nombre: "Inicial 3 años",
      descripcion: "Nivel inicial para niños de 3 años",
      edadMinima: 3,
      edadMaxima: 3,
      capacidadMaxima: 15,
      estado: "ACTIVO",
    },
    {
      id: "2",
      nombre: "Inicial 4 años",
      descripcion: "Nivel inicial para niños de 4 años",
      edadMinima: 4,
      edadMaxima: 4,
      capacidadMaxima: 18,
      estado: "ACTIVO",
    },
    {
      id: "3",
      nombre: "Inicial 5 años",
      descripcion: "Nivel inicial para niños de 5 años",
      edadMinima: 5,
      edadMaxima: 5,
      capacidadMaxima: 20,
      estado: "ACTIVO",
    },
  ],

  // Aulas
  aulas: [
    {
      id: "1",
      nombre: "Aula Amarilla",
      descripcion: "Aula para inicial 3 años",
      capacidad: 15,
      ubicacion: "Primer piso",
      gradoId: "1",
      docenteId: "2",
      estado: "ACTIVO",
      color: "#FFF59D",
    },
    {
      id: "2",
      nombre: "Aula Azul",
      descripcion: "Aula para inicial 4 años",
      capacidad: 18,
      ubicacion: "Primer piso",
      gradoId: "2",
      docenteId: "5",
      estado: "ACTIVO",
      color: "#BBDEFB",
    },
    {
      id: "3",
      nombre: "Aula Verde",
      descripcion: "Aula para inicial 5 años",
      capacidad: 20,
      ubicacion: "Segundo piso",
      gradoId: "3",
      docenteId: "6",
      estado: "ACTIVO",
      color: "#C8E6C9",
    },
  ],

  // Padres/Apoderados
  padres: [
    {
      id: "3",
      nombre: "Ana",
      apellidos: "Morales de Pérez",
      dni: "12345678",
      telefono: "987654321",
      email: "ana.morales@gmail.com",
      direccion: "Av. Los Rosales 123, Lima",
      ocupacion: "Ingeniera",
      estado: "ACTIVO",
      relacion: "MADRE",
      hijosIds: ["1"],
    },
    {
      id: "4",
      nombre: "Roberto",
      apellidos: "Mendoza García",
      dni: "12345679",
      telefono: "987654322",
      email: "roberto.mendoza@gmail.com",
      direccion: "Jr. Las Flores 456, Lima",
      ocupacion: "Contador",
      estado: "ACTIVO",
      relacion: "PADRE",
      hijosIds: ["2"],
    },
    {
      id: "5",
      nombre: "Carmen",
      apellidos: "Torres Vega",
      dni: "12345680",
      telefono: "987654323",
      email: "carmen.torres@gmail.com",
      direccion: "Calle Los Laureles 789, Lima",
      ocupacion: "Doctora",
      estado: "ACTIVO",
      relacion: "MADRE",
      hijosIds: ["3"],
    },
  ],

  // Trabajadores/Docentes
  trabajadores: [
    {
      id: "1",
      nombre: "María",
      apellidos: "González Rivera",
      dni: "87654321",
      telefono: "987654320",
      email: "director@nidopro.edu",
      cargo: "DIRECTORA",
      estado: "ACTIVO",
      fechaIngreso: "2020-01-15",
      salario: 4500.0,
      avatar: "👩‍💼",
    },
    {
      id: "2",
      nombre: "Carlos",
      apellidos: "Ruiz Mendoza",
      dni: "87654322",
      telefono: "987654321",
      email: "docente1@nidopro.edu",
      cargo: "DOCENTE",
      estado: "ACTIVO",
      fechaIngreso: "2021-03-01",
      salario: 2800.0,
      avatar: "👨‍🏫",
      aulaAsignada: "1",
      especialidad: "Educación Inicial",
    },
    {
      id: "4",
      nombre: "Elena",
      apellidos: "Vásquez Torres",
      dni: "87654323",
      telefono: "987654323",
      email: "psicologa@nidopro.edu",
      cargo: "PSICOLOGA",
      estado: "ACTIVO",
      fechaIngreso: "2021-08-15",
      salario: 3200.0,
      avatar: "👩‍⚕️",
      especialidad: "Psicología Infantil",
    },
    {
      id: "5",
      nombre: "Lucía",
      apellidos: "Fernández Silva",
      dni: "87654324",
      telefono: "987654324",
      email: "docente2@nidopro.edu",
      cargo: "DOCENTE",
      estado: "ACTIVO",
      fechaIngreso: "2022-01-10",
      salario: 2800.0,
      avatar: "👩‍🏫",
      aulaAsignada: "2",
      especialidad: "Educación Inicial",
    },
  ],

  // Matrículas
  matriculas: [
    {
      id: "1",
      estudianteId: "1",
      gradoId: "1",
      aulaId: "1",
      periodoEscolar: "2024",
      fechaMatricula: "2024-02-15",
      estado: "ACTIVO",
      montoMatricula: 300.0,
      montoMensualidad: 450.0,
      descuento: 0.0,
      observaciones: "Matrícula regular",
    },
    {
      id: "2",
      estudianteId: "2",
      gradoId: "2",
      aulaId: "2",
      periodoEscolar: "2024",
      fechaMatricula: "2024-02-20",
      estado: "ACTIVO",
      montoMatricula: 300.0,
      montoMensualidad: 450.0,
      descuento: 10.0,
      observaciones: "Descuento por hermano",
    },
    {
      id: "3",
      estudianteId: "3",
      gradoId: "3",
      aulaId: "3",
      periodoEscolar: "2024",
      fechaMatricula: "2024-02-18",
      estado: "ACTIVO",
      montoMatricula: 300.0,
      montoMensualidad: 500.0,
      descuento: 0.0,
      observaciones: "Matrícula regular",
    },
  ],

  // Asistencias
  asistencias: [
    {
      id: "1",
      estudianteId: "1",
      fecha: "2024-10-01",
      estado: "PRESENTE",
      horaIngreso: "08:00",
      horaSalida: "13:00",
      observaciones: "",
      registradoPor: "2",
    },
    {
      id: "2",
      estudianteId: "2",
      fecha: "2024-10-01",
      estado: "PRESENTE",
      horaIngreso: "08:15",
      horaSalida: "13:00",
      observaciones: "Llegó tarde",
      registradoPor: "5",
    },
    {
      id: "3",
      estudianteId: "3",
      fecha: "2024-10-01",
      estado: "AUSENTE",
      horaIngreso: null,
      horaSalida: null,
      observaciones: "Falta justificada por enfermedad",
      registradoPor: "6",
    },
  ],

  // Pagos/Pensiones
  pagos: [
    {
      id: "1",
      estudianteId: "1",
      concepto: "PENSION",
      monto: 450.0,
      fechaVencimiento: "2024-10-05",
      fechaPago: "2024-10-01",
      estado: "PAGADO",
      metodoPago: "TRANSFERENCIA",
      numeroRecibo: "REC-2024-001",
      observaciones: "Pago puntual",
    },
    {
      id: "2",
      estudianteId: "2",
      concepto: "PENSION",
      monto: 405.0,
      fechaVencimiento: "2024-10-05",
      fechaPago: null,
      estado: "PENDIENTE",
      metodoPago: null,
      numeroRecibo: null,
      observaciones: "Con descuento por hermano",
    },
    {
      id: "3",
      estudianteId: "1",
      concepto: "MATRICULA",
      monto: 300.0,
      fechaVencimiento: "2024-02-28",
      fechaPago: "2024-02-15",
      estado: "PAGADO",
      metodoPago: "EFECTIVO",
      numeroRecibo: "MAT-2024-001",
      observaciones: "Matrícula 2024",
    },
  ],

  // Tareas
  tareas: [
    {
      id: "1",
      titulo: "Colorear los números del 1 al 10",
      descripcion:
        "Actividad para reforzar el reconocimiento de números básicos",
      gradoId: "1",
      aulaId: "1",
      docenteId: "2", // Carlos Ruiz
      fechaCreacion: "2024-10-01",
      fechaVencimiento: "2024-10-15",
      estado: "ACTIVO",
      materia: "Matemáticas",
      archivo: null,
    },
    {
      id: "2",
      titulo: "Identificar formas geométricas",
      descripcion: "Reconocer y nombrar círculos, cuadrados y triángulos",
      gradoId: "1",
      aulaId: "1",
      docenteId: "2", // Carlos Ruiz
      fechaCreacion: "2024-10-03",
      fechaVencimiento: "2024-10-17",
      estado: "ACTIVO",
      materia: "Matemáticas",
      archivo: null,
    },
    {
      id: "3",
      titulo: "Cantar el abecedario",
      descripcion: "Memorizar y cantar las letras del alfabeto",
      gradoId: "1",
      aulaId: "1",
      docenteId: "2", // Carlos Ruiz
      fechaCreacion: "2024-10-02",
      fechaVencimiento: "2024-10-16",
      estado: "ACTIVO",
      materia: "Comunicación",
      archivo: null,
    },
    {
      id: "4",
      titulo: "Dibujar mi mascota favorita",
      descripción: "Crear un dibujo de su animal favorito",
      gradoId: "2",
      aulaId: "2",
      docenteId: "2", // Carlos Ruiz también enseña aula 2
      fechaCreacion: "2024-09-30",
      fechaVencimiento: "2024-10-10",
      estado: "VENCIDO",
      materia: "Arte",
      archivo: null,
    },
    {
      id: "5",
      titulo: "Traer una hoja de árbol",
      descripcion:
        "Recolectar y traer una hoja de árbol para la clase de ciencias",
      gradoId: "2",
      aulaId: "2",
      docenteId: "2", // Carlos Ruiz
      fechaCreacion: "2024-10-05",
      fechaVencimiento: "2024-10-20",
      estado: "ACTIVO",
      materia: "Ciencias",
      archivo: null,
    },
    {
      id: "6",
      titulo: "Practicar escribir mi nombre",
      descripcion: "Escribir el nombre completo 5 veces en letra clara",
      gradoId: "1",
      aulaId: "1",
      docenteId: "2", // Carlos Ruiz
      fechaCreacion: "2024-10-01",
      fechaVencimiento: "2024-10-12",
      estado: "BORRADOR",
      materia: "Comunicación",
      archivo: null,
    },
    {
      id: "7",
      titulo: "Contar hasta 20",
      descripcion: "Demostrar que puede contar números del 1 al 20",
      gradoId: "2",
      aulaId: "2",
      docenteId: "2", // Carlos Ruiz
      fechaCreacion: "2024-10-04",
      fechaVencimiento: "2024-10-18",
      estado: "ACTIVO",
      materia: "Matemáticas",
      archivo: null,
    },
  ],

  // Evaluaciones
  evaluaciones: [
    {
      id: "1",
      estudianteId: "1",
      docenteId: "2",
      periodo: "PRIMER_BIMESTRE",
      año: 2024,
      materia: "Matemáticas",
      calificacion: "A",
      descripcion: "Excelente reconocimiento de números",
      fechaEvaluacion: "2024-05-15",
      observaciones: "Destaca en conteo",
    },
    {
      id: "2",
      estudianteId: "1",
      docenteId: "2",
      periodo: "PRIMER_BIMESTRE",
      año: 2024,
      materia: "Comunicación",
      calificacion: "B",
      descripcion: "Buen desarrollo del lenguaje",
      fechaEvaluacion: "2024-05-15",
      observaciones: "Puede mejorar la expresión oral",
    },
    {
      id: "3",
      estudianteId: "2",
      docenteId: "5",
      periodo: "PRIMER_BIMESTRE",
      año: 2024,
      materia: "Arte",
      calificacion: "A",
      descripcion: "Muy creativo en sus trabajos",
      fechaEvaluacion: "2024-05-20",
      observaciones: "Excelente uso de colores",
    },
  ],

  // Anotaciones
  anotaciones: [
    {
      id: "1",
      estudianteId: "1",
      docenteId: "2",
      tipo: "POSITIVA",
      titulo: "Excelente participación",
      descripcion: "Sofía participó activamente en la actividad de matemáticas",
      fecha: "2024-10-01",
      prioridad: "BAJA",
      visible_padre: true,
    },
    {
      id: "2",
      estudianteId: "2",
      docenteId: "5",
      tipo: "OBSERVACION",
      titulo: "Necesita apoyo en lectura",
      descripcion: "Carlos requiere refuerzo en reconocimiento de letras",
      fecha: "2024-09-28",
      prioridad: "MEDIA",
      visible_padre: true,
    },
    {
      id: "3",
      estudianteId: "3",
      docenteId: "4",
      tipo: "EVALUACION_PSICOLOGICA",
      titulo: "Evaluación inicial",
      descripcion: "María muestra buen desarrollo socioemocional",
      fecha: "2024-09-15",
      prioridad: "BAJA",
      visible_padre: false,
    },
  ],

  // Cronograma/Planificaciones
  planificaciones: [
    {
      id: "1",
      titulo: "Semana de los números",
      descripcion:
        "Actividades enfocadas en el aprendizaje de números del 1 al 20",
      gradoId: "1",
      docenteId: "2",
      fechaInicio: "2024-10-07",
      fechaFin: "2024-10-11",
      estado: "PLANIFICADO",
      materias: ["Matemáticas", "Arte"],
      recursos: ["Fichas de números", "Colores", "Bloques lógicos"],
    },
    {
      id: "2",
      titulo: "Proyecto familia",
      descripcion: "Actividades sobre la importancia de la familia",
      gradoId: "2",
      docenteId: "5",
      fechaInicio: "2024-10-14",
      fechaFin: "2024-10-18",
      estado: "EN_PROGRESO",
      materias: ["Comunicación", "Arte", "Personal Social"],
      recursos: ["Cartulinas", "Fotos familiares", "Marcadores"],
    },
  ],

  // Reportes
  reportes: [
    {
      id: "1",
      tipo: "ASISTENCIA_MENSUAL",
      titulo: "Reporte de Asistencia - Septiembre 2024",
      descripcion: "Resumen de asistencias del mes de septiembre",
      fechaGeneracion: "2024-10-01",
      generadoPor: "1",
      parametros: {
        mes: 9,
        año: 2024,
        gradoId: null,
      },
      archivo: "reporte_asistencia_sep2024.pdf",
    },
    {
      id: "2",
      tipo: "PAGOS_PENDIENTES",
      titulo: "Pagos Pendientes - Octubre 2024",
      descripcion: "Lista de pensiones pendientes",
      fechaGeneracion: "2024-10-02",
      generadoPor: "1",
      parametros: {
        mes: 10,
        año: 2024,
      },
      archivo: "pagos_pendientes_oct2024.pdf",
    },
  ],

  // Configuraciones del sistema
  configuracion: {
    institucion: {
      nombre: "Nido Pro Demo",
      direccion: "Av. Educación 123, Lima, Perú",
      telefono: "01-234-5678",
      email: "info@nidopro.demo",
      logo: "🏫",
      director: "Dra. María González Rivera",
    },
    periodoEscolar: {
      actual: "2024",
      fechaInicio: "2024-03-01",
      fechaFin: "2024-12-20",
      bimestres: [
        { numero: 1, inicio: "2024-03-01", fin: "2024-05-31" },
        { numero: 2, inicio: "2024-06-01", fin: "2024-08-31" },
        { numero: 3, inicio: "2024-09-01", fin: "2024-11-30" },
        { numero: 4, inicio: "2024-12-01", fin: "2024-12-20" },
      ],
    },
    monedas: {
      principal: "PEN",
      simbolo: "S/",
      decimales: 2,
    },
  },

  // Datos para estudiantes con tareas (para parent dashboard)
  students: [
    {
      id: 1,
      name: "Sofía Pérez",
      grade: "1ro",
      tasks: [
        {
          id: 1,
          title: "Tarea de Matemáticas - Números del 1 al 10",
          description: "Practicar los números del 1 al 10 y colorear las figuras",
          subject: "Matemáticas",
          dueDate: "2024-12-20T23:59:59",
          status: "pending",
          priority: "high",
          teacher: "Prof. Ana García",
          timeEstimate: "45 min",
          grade: "1ro",
          assignedDate: "2024-12-15T09:00:00",
          notes: "Importante revisar con los padres"
        },
        {
          id: 2,
          title: "Lectura de Cuentos",
          description: "Leer el cuento 'El patito feo' y hacer un dibujo",
          subject: "Lenguaje",
          dueDate: "2024-12-22T23:59:59",
          status: "completed",
          priority: "medium",
          teacher: "Prof. María López",
          timeEstimate: "30 min",
          grade: "1ro",
          assignedDate: "2024-12-16T10:00:00",
          completedAt: "2024-12-18T15:30:00",
          notes: "Excelente trabajo realizado"
        },
        {
          id: 3,
          title: "Ciencias Naturales - Los Animales",
          description: "Identificar animales domésticos y salvajes",
          subject: "Ciencias",
          dueDate: "2024-12-25T23:59:59",
          status: "in_progress",
          priority: "medium",
          teacher: "Prof. Carlos Ruiz",
          timeEstimate: "40 min",
          grade: "1ro",
          assignedDate: "2024-12-17T08:00:00",
          notes: "Actividad práctica incluida"
        },
        {
          id: 4,
          title: "Arte y Creatividad",
          description: "Crear una tarjeta navideña usando materiales reciclados",
          subject: "Arte",
          dueDate: "2024-12-19T23:59:59",
          status: "overdue",
          priority: "low",
          teacher: "Prof. Elena Vega",
          timeEstimate: "60 min",
          grade: "1ro",
          assignedDate: "2024-12-12T14:00:00",
          notes: "Materiales disponibles en el aula"
        },
        {
          id: 5,
          title: "Educación Física - Ejercicios",
          description: "Realizar ejercicios de coordinación y equilibrio",
          subject: "Educación Física",
          dueDate: "2024-12-21T23:59:59",
          status: "pending",
          priority: "medium",
          teacher: "Prof. Miguel Torres",
          timeEstimate: "25 min",
          grade: "1ro",
          assignedDate: "2024-12-18T11:00:00",
          notes: "Ejercicios adaptados para casa"
        }
      ]
    }
  ],
};

// Función para simular delay de API
export const simulateApiDelay = (min = 500, max = 1500) => {
  const delay = Math.random() * (max - min) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

// Función para generar ID único
export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Función para filtrar datos por criterios
export const filterData = (data, filters) => {
  return data.filter((item) => {
    return Object.keys(filters).every((key) => {
      if (
        filters[key] === undefined ||
        filters[key] === null ||
        filters[key] === ""
      ) {
        return true;
      }

      if (typeof filters[key] === "string") {
        return item[key]
          ?.toString()
          .toLowerCase()
          .includes(filters[key].toLowerCase());
      }

      return item[key] === filters[key];
    });
  });
};

// Función para paginar datos
export const paginateData = (data, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const paginatedData = data.slice(offset, offset + limit);

  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: data.length,
      totalPages: Math.ceil(data.length / limit),
      hasNext: offset + limit < data.length,
      hasPrev: page > 1,
    },
  };
};
