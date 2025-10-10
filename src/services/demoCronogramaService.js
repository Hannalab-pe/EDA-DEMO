// demoCronogramaService.js - Servicio DEMO para gestión de cronogramas (horarios)
import { mockData } from "../data/mockData";

const simulateApiDelay = () =>
  new Promise((resolve) => setTimeout(resolve, 300));

class DemoCronogramaService {
  // Obtener cronogramas por aula
  async getCronogramaPorAula(idAula) {
    await simulateApiDelay();
    console.log(`[DEMO] Obteniendo cronogramas para aula: ${idAula}`);

    const cronogramas = mockData.cronogramas.filter(
      (c) => c.idAula === idAula && c.estaActivo
    );

    return {
      success: true,
      cronogramas: cronogramas.sort((a, b) => {
        const diasOrden = [
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
          "Domingo",
        ];
        const diaCompare =
          diasOrden.indexOf(a.diaSemana) - diasOrden.indexOf(b.diaSemana);
        if (diaCompare !== 0) return diaCompare;

        return a.horaInicio.localeCompare(b.horaInicio);
      }),
    };
  }

  // Obtener cronogramas de múltiples aulas
  async getCronogramaMultiplesAulas(idsAulas) {
    await simulateApiDelay();
    console.log(`[DEMO] Obteniendo cronogramas para aulas: ${idsAulas}`);

    const cronogramas = mockData.cronogramas.filter(
      (c) => idsAulas.includes(c.idAula) && c.estaActivo
    );

    return {
      success: true,
      cronogramas: cronogramas.sort((a, b) => {
        const diasOrden = [
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
          "Domingo",
        ];
        const diaCompare =
          diasOrden.indexOf(a.diaSemana) - diasOrden.indexOf(b.diaSemana);
        if (diaCompare !== 0) return diaCompare;

        return a.horaInicio.localeCompare(b.horaInicio);
      }),
    };
  }

  // Obtener cronogramas del docente (de todas sus aulas asignadas)
  async getCronogramaDocente(aulasTrabajadorData) {
    await simulateApiDelay();
    console.log(
      `[DEMO] Obteniendo cronogramas del docente con aulas:`,
      aulasTrabajadorData
    );

    if (!aulasTrabajadorData || aulasTrabajadorData.length === 0) {
      return {
        success: true,
        cronogramas: [],
      };
    }

    const idsAulas = aulasTrabajadorData.map((a) => a.idAula?.toString());
    return this.getCronogramaMultiplesAulas(idsAulas);
  }

  // Obtener todos los cronogramas activos
  async getAll() {
    await simulateApiDelay();
    console.log("[DEMO] Obteniendo todos los cronogramas");

    return mockData.cronogramas
      .filter((c) => c.estaActivo)
      .sort((a, b) => {
        const diasOrden = [
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
          "Domingo",
        ];
        const diaCompare =
          diasOrden.indexOf(a.diaSemana) - diasOrden.indexOf(b.diaSemana);
        if (diaCompare !== 0) return diaCompare;

        return a.horaInicio.localeCompare(b.horaInicio);
      });
  }

  // Obtener un cronograma por ID
  async getById(idCronograma) {
    await simulateApiDelay();
    console.log(`[DEMO] Buscando cronograma con ID: ${idCronograma}`);

    const cronograma = mockData.cronogramas.find(
      (c) => c.idCronograma === idCronograma
    );

    if (!cronograma) {
      throw new Error("Cronograma no encontrado");
    }

    return cronograma;
  }

  // Crear nuevo cronograma
  async create(cronogramaData) {
    await simulateApiDelay();
    console.log("[DEMO] Creando nuevo cronograma:", cronogramaData);

    // Validar que no exista conflicto de horario
    const conflicto = mockData.cronogramas.find(
      (c) =>
        c.idAula === cronogramaData.idAula &&
        c.diaSemana === cronogramaData.diaSemana &&
        c.estaActivo &&
        ((cronogramaData.horaInicio >= c.horaInicio &&
          cronogramaData.horaInicio < c.horaFin) ||
          (cronogramaData.horaFin > c.horaInicio &&
            cronogramaData.horaFin <= c.horaFin) ||
          (cronogramaData.horaInicio <= c.horaInicio &&
            cronogramaData.horaFin >= c.horaFin))
    );

    if (conflicto) {
      throw new Error(
        `Existe un conflicto de horario con otra clase en el mismo día y aula`
      );
    }

    const nuevoId = (
      Math.max(
        ...mockData.cronogramas.map((c) => parseInt(c.idCronograma)),
        0
      ) + 1
    ).toString();

    // Buscar información relacionada
    const aula = mockData.aulas.find((a) => a.idAula === cronogramaData.idAula);
    const curso = mockData.cursos.find(
      (c) => c.idCurso === cronogramaData.idCurso
    );
    const trabajador = mockData.trabajadores.find(
      (t) => t.idTrabajador === cronogramaData.idTrabajador
    );

    const nuevoCronograma = {
      idCronograma: nuevoId,
      ...cronogramaData,
      aula: aula
        ? {
            idAula: aula.idAula,
            seccion: aula.seccion,
            idGrado: aula.idGrado,
          }
        : null,
      curso: curso
        ? {
            idCurso: curso.idCurso,
            nombre: curso.nombre,
            codigo: curso.codigo,
          }
        : null,
      trabajador: trabajador
        ? {
            idTrabajador: trabajador.idTrabajador,
            nombre: trabajador.nombre,
            apellido: trabajador.apellido,
          }
        : null,
      estaActivo: true,
      creado: new Date().toISOString(),
      actualizado: new Date().toISOString(),
    };

    mockData.cronogramas.push(nuevoCronograma);

    return {
      success: true,
      message: "Cronograma creado exitosamente",
      cronograma: nuevoCronograma,
    };
  }

  // Actualizar cronograma existente
  async update(idCronograma, cronogramaData) {
    await simulateApiDelay();
    console.log(
      `[DEMO] Actualizando cronograma ${idCronograma}:`,
      cronogramaData
    );

    const index = mockData.cronogramas.findIndex(
      (c) => c.idCronograma === idCronograma
    );

    if (index === -1) {
      throw new Error("Cronograma no encontrado");
    }

    // Validar conflicto de horario (excluyendo el mismo cronograma)
    if (cronogramaData.diaSemana || cronogramaData.horaInicio) {
      const cronogramaActual = mockData.cronogramas[index];
      const diaSemana = cronogramaData.diaSemana || cronogramaActual.diaSemana;
      const horaInicio =
        cronogramaData.horaInicio || cronogramaActual.horaInicio;
      const horaFin = cronogramaData.horaFin || cronogramaActual.horaFin;
      const idAula = cronogramaData.idAula || cronogramaActual.idAula;

      const conflicto = mockData.cronogramas.find(
        (c) =>
          c.idCronograma !== idCronograma &&
          c.idAula === idAula &&
          c.diaSemana === diaSemana &&
          c.estaActivo &&
          ((horaInicio >= c.horaInicio && horaInicio < c.horaFin) ||
            (horaFin > c.horaInicio && horaFin <= c.horaFin) ||
            (horaInicio <= c.horaInicio && horaFin >= c.horaFin))
      );

      if (conflicto) {
        throw new Error(
          `Existe un conflicto de horario con otra clase en el mismo día y aula`
        );
      }
    }

    // Buscar información relacionada si se actualiza
    let aula = mockData.cronogramas[index].aula;
    let curso = mockData.cronogramas[index].curso;
    let trabajador = mockData.cronogramas[index].trabajador;

    if (cronogramaData.idAula) {
      const aulaFound = mockData.aulas.find(
        (a) => a.idAula === cronogramaData.idAula
      );
      if (aulaFound) {
        aula = {
          idAula: aulaFound.idAula,
          seccion: aulaFound.seccion,
          idGrado: aulaFound.idGrado,
        };
      }
    }

    if (cronogramaData.idCurso) {
      const cursoFound = mockData.cursos.find(
        (c) => c.idCurso === cronogramaData.idCurso
      );
      if (cursoFound) {
        curso = {
          idCurso: cursoFound.idCurso,
          nombre: cursoFound.nombre,
          codigo: cursoFound.codigo,
        };
      }
    }

    if (cronogramaData.idTrabajador) {
      const trabajadorFound = mockData.trabajadores.find(
        (t) => t.idTrabajador === cronogramaData.idTrabajador
      );
      if (trabajadorFound) {
        trabajador = {
          idTrabajador: trabajadorFound.idTrabajador,
          nombre: trabajadorFound.nombre,
          apellido: trabajadorFound.apellido,
        };
      }
    }

    mockData.cronogramas[index] = {
      ...mockData.cronogramas[index],
      ...cronogramaData,
      aula,
      curso,
      trabajador,
      actualizado: new Date().toISOString(),
    };

    return {
      success: true,
      message: "Cronograma actualizado exitosamente",
      cronograma: mockData.cronogramas[index],
    };
  }

  // Eliminar cronograma (soft delete)
  async delete(idCronograma) {
    await simulateApiDelay();
    console.log(`[DEMO] Eliminando cronograma: ${idCronograma}`);

    const index = mockData.cronogramas.findIndex(
      (c) => c.idCronograma === idCronograma
    );

    if (index === -1) {
      throw new Error("Cronograma no encontrado");
    }

    mockData.cronogramas[index] = {
      ...mockData.cronogramas[index],
      estaActivo: false,
      actualizado: new Date().toISOString(),
    };

    return {
      success: true,
      message: "Cronograma eliminado exitosamente",
    };
  }

  // Eliminar múltiples cronogramas
  async deleteMultiple(idsCronogramas) {
    await simulateApiDelay();
    console.log(`[DEMO] Eliminando múltiples cronogramas:`, idsCronogramas);

    let deletedCount = 0;

    idsCronogramas.forEach((id) => {
      const index = mockData.cronogramas.findIndex(
        (c) => c.idCronograma === id
      );
      if (index !== -1) {
        mockData.cronogramas[index] = {
          ...mockData.cronogramas[index],
          estaActivo: false,
          actualizado: new Date().toISOString(),
        };
        deletedCount++;
      }
    });

    return {
      success: true,
      message: `${deletedCount} cronogramas eliminados exitosamente`,
    };
  }

  // Obtener cronogramas por curso
  async getByCurso(idCurso) {
    await simulateApiDelay();
    console.log(`[DEMO] Obteniendo cronogramas para curso: ${idCurso}`);

    const cronogramas = mockData.cronogramas.filter(
      (c) => c.idCurso === idCurso && c.estaActivo
    );

    return cronogramas;
  }

  // Obtener cronogramas por trabajador/docente
  async getByTrabajador(idTrabajador) {
    await simulateApiDelay();
    console.log(
      `[DEMO] Obteniendo cronogramas para trabajador: ${idTrabajador}`
    );

    const cronogramas = mockData.cronogramas.filter(
      (c) => c.idTrabajador === idTrabajador && c.estaActivo
    );

    return cronogramas.sort((a, b) => {
      const diasOrden = [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
      ];
      const diaCompare =
        diasOrden.indexOf(a.diaSemana) - diasOrden.indexOf(b.diaSemana);
      if (diaCompare !== 0) return diaCompare;

      return a.horaInicio.localeCompare(b.horaInicio);
    });
  }
}

export default new DemoCronogramaService();
