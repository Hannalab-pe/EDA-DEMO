// demoComentariosDocentesService.js - Servicio DEMO para gestión de comentarios de docentes
import { mockData } from "../data/mockData";

const simulateApiDelay = () =>
  new Promise((resolve) => setTimeout(resolve, 300));

class DemoComentariosDocentesService {
  // Obtener todos los comentarios
  async getAll(params = {}) {
    await simulateApiDelay();
    console.log("[DEMO] Obteniendo todos los comentarios docentes");

    let comentarios = [...mockData.comentariosDocentes];

    // Aplicar filtros si existen
    if (params.idTrabajador) {
      comentarios = comentarios.filter(
        (c) => c.idTrabajador?.idTrabajador === params.idTrabajador
      );
    }

    if (params.calificacion) {
      comentarios = comentarios.filter(
        (c) => c.calificacion === parseInt(params.calificacion)
      );
    }

    if (params.fechaInicio && params.fechaFin) {
      comentarios = comentarios.filter((c) => {
        const fecha = new Date(c.fecha);
        return (
          fecha >= new Date(params.fechaInicio) &&
          fecha <= new Date(params.fechaFin)
        );
      });
    }

    // Ordenar por fecha más reciente
    comentarios.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    return {
      success: true,
      data: comentarios,
      total: comentarios.length,
    };
  }

  // Obtener comentario por ID
  async getById(id) {
    await simulateApiDelay();
    console.log(`[DEMO] Buscando comentario con ID: ${id}`);

    const comentario = mockData.comentariosDocentes.find(
      (c) => c.idComentarioTrabajador === parseInt(id)
    );

    if (!comentario) {
      throw new Error("Comentario no encontrado");
    }

    return {
      success: true,
      data: comentario,
    };
  }

  // Obtener comentarios por trabajador
  async getByTrabajador(idTrabajador) {
    await simulateApiDelay();
    console.log(
      `[DEMO] Obteniendo comentarios para trabajador: ${idTrabajador}`
    );

    const comentarios = mockData.comentariosDocentes
      .filter((c) => c.idTrabajador?.idTrabajador === parseInt(idTrabajador))
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    return {
      success: true,
      data: comentarios,
      total: comentarios.length,
    };
  }

  // Crear nuevo comentario
  async create(comentarioData) {
    await simulateApiDelay();
    console.log("[DEMO] Creando nuevo comentario:", comentarioData);

    // Generar nuevo ID
    const nuevoId =
      Math.max(
        ...mockData.comentariosDocentes.map((c) => c.idComentarioTrabajador),
        0
      ) + 1;

    // Buscar información del trabajador
    const trabajador = mockData.trabajadores.find(
      (t) => t.idTrabajador === comentarioData.idTrabajador
    );

    const nuevoComentario = {
      idComentarioTrabajador: nuevoId,
      motivo: comentarioData.motivo,
      descripcion: comentarioData.descripcion,
      archivoUrl: comentarioData.archivoUrl || null, // ✅ Agregar archivoUrl
      fecha: comentarioData.fecha || new Date().toISOString().split("T")[0],
      calificacion: comentarioData.calificacion || 3,
      idTrabajador: trabajador
        ? {
            idTrabajador: trabajador.idTrabajador,
            nombre: trabajador.nombre,
            apellido: trabajador.apellido,
            idRol: trabajador.idRol || {
              nombre: "DOCENTE",
            },
          }
        : null,
      idUsuarioComentador: {
        idUsuario: 1,
        usuario: "admin",
        nombre: "Administrador",
      },
    };

    mockData.comentariosDocentes.push(nuevoComentario);

    console.log("✅ [DEMO] Comentario creado exitosamente:", nuevoComentario);

    return {
      success: true,
      message: "Comentario creado exitosamente",
      data: nuevoComentario,
    };
  }

  // Actualizar comentario existente
  async update(id, comentarioData) {
    await simulateApiDelay();
    console.log(`[DEMO] Actualizando comentario ${id}:`, comentarioData);

    const index = mockData.comentariosDocentes.findIndex(
      (c) => c.idComentarioTrabajador === parseInt(id)
    );

    if (index === -1) {
      throw new Error("Comentario no encontrado");
    }

    // Actualizar trabajador si cambió
    let trabajadorInfo = mockData.comentariosDocentes[index].idTrabajador;
    if (
      comentarioData.idTrabajador &&
      comentarioData.idTrabajador !==
        mockData.comentariosDocentes[index].idTrabajador?.idTrabajador
    ) {
      const trabajador = mockData.trabajadores.find(
        (t) => t.idTrabajador === comentarioData.idTrabajador
      );
      if (trabajador) {
        trabajadorInfo = {
          idTrabajador: trabajador.idTrabajador,
          nombre: trabajador.nombre,
          apellido: trabajador.apellido,
          idRol: trabajador.idRol || {
            nombre: "DOCENTE",
          },
        };
      }
    }

    mockData.comentariosDocentes[index] = {
      ...mockData.comentariosDocentes[index],
      motivo:
        comentarioData.motivo || mockData.comentariosDocentes[index].motivo,
      descripcion:
        comentarioData.descripcion ||
        mockData.comentariosDocentes[index].descripcion,
      archivoUrl:
        comentarioData.archivoUrl !== undefined
          ? comentarioData.archivoUrl
          : mockData.comentariosDocentes[index].archivoUrl, // ✅ Actualizar archivoUrl
      fecha: comentarioData.fecha || mockData.comentariosDocentes[index].fecha,
      calificacion:
        comentarioData.calificacion !== undefined
          ? comentarioData.calificacion
          : mockData.comentariosDocentes[index].calificacion,
      idTrabajador: trabajadorInfo,
    };

    console.log(
      "✅ [DEMO] Comentario actualizado:",
      mockData.comentariosDocentes[index]
    );

    return {
      success: true,
      message: "Comentario actualizado exitosamente",
      data: mockData.comentariosDocentes[index],
    };
  }

  // Eliminar comentario
  async delete(id) {
    await simulateApiDelay();
    console.log(`[DEMO] Eliminando comentario: ${id}`);

    const index = mockData.comentariosDocentes.findIndex(
      (c) => c.idComentarioTrabajador === parseInt(id)
    );

    if (index === -1) {
      throw new Error("Comentario no encontrado");
    }

    // Eliminar del array
    mockData.comentariosDocentes.splice(index, 1);

    return {
      success: true,
      message: "Comentario eliminado exitosamente",
    };
  }

  // Obtener estadísticas de comentarios
  async getEstadisticas(idTrabajador = null) {
    await simulateApiDelay();
    console.log("[DEMO] Obteniendo estadísticas de comentarios");

    let comentarios = mockData.comentariosDocentes;

    if (idTrabajador) {
      comentarios = comentarios.filter(
        (c) => c.idTrabajador?.idTrabajador === parseInt(idTrabajador)
      );
    }

    const total = comentarios.length;
    const promedioCalificacion =
      total > 0
        ? (
            comentarios.reduce((sum, c) => sum + c.calificacion, 0) / total
          ).toFixed(1)
        : 0;

    const porCalificacion = {
      5: comentarios.filter((c) => c.calificacion === 5).length,
      4: comentarios.filter((c) => c.calificacion === 4).length,
      3: comentarios.filter((c) => c.calificacion === 3).length,
      2: comentarios.filter((c) => c.calificacion === 2).length,
      1: comentarios.filter((c) => c.calificacion === 1).length,
    };

    return {
      success: true,
      data: {
        total,
        promedioCalificacion: parseFloat(promedioCalificacion),
        porCalificacion,
      },
    };
  }

  // Obtener comentarios recientes
  async getRecientes(limit = 5) {
    await simulateApiDelay();
    console.log(`[DEMO] Obteniendo ${limit} comentarios recientes`);

    const comentarios = [...mockData.comentariosDocentes]
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, limit);

    return {
      success: true,
      data: comentarios,
    };
  }
}

export default new DemoComentariosDocentesService();
