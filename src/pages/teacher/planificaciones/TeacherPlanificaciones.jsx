import React, { useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Calendar,
  BookOpen,
  Users,
  Target,
  CheckCircle,
  Clock,
  FileText,
  Edit,
  Trash2,
  Eye,
  Award,
  RefreshCw,
  X,
  Save,
} from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";
import { usePlanificacionesTrabajadorDemo } from "../../../hooks/demo/usePlanificacionesDemo";
import { planificacionesStore } from "../../../store/planificacionesStore";

const TeacherPlanificaciones = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("all");

  // Estado del formulario
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    curso: "",
    bimestre: "III Bimestre",
    sesiones: 10,
  });

  // Hooks para datos
  const { user } = useAuthStore();
  const trabajadorId =
    user?.entidadId || localStorage.getItem("entidadId") || "1";

  // Hook para obtener planificaciones (versión demo)
  const {
    data: planificaciones = [],
    isLoading,
    error,
    refetch,
  } = usePlanificacionesTrabajadorDemo(trabajadorId);

  console.log("📚 Planificaciones obtenidas:", planificaciones);
  console.log("📚 Estado de loading:", isLoading);

  // Cursos disponibles para seleccionar
  const cursosDisponibles = [
    { id: "1", nombre: "Matemática" },
    { id: "2", nombre: "Comunicación" },
    { id: "3", nombre: "Ciencia y Tecnología" },
    { id: "4", nombre: "Personal Social" },
    { id: "5", nombre: "Arte y Cultura" },
    { id: "6", nombre: "Educación Física" },
    { id: "7", nombre: "Inglés" },
  ];

  // Filtros
  const planificacionesFiltradas = planificaciones.filter((plan) => {
    const matchesSearch =
      searchTerm === "" ||
      plan.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.curso?.nombreCurso?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEstado =
      selectedEstado === "all" || plan.estado === selectedEstado;

    return matchesSearch && matchesEstado;
  });

  // Función para manejar el formulario
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Función para agregar planificación
  const handleAgregarPlanificacion = async () => {
    console.log("🎭 [DEMO] Agregando nueva planificación:", formData);

    // Validación simple
    if (
      !formData.titulo ||
      !formData.descripcion ||
      !formData.fechaInicio ||
      !formData.fechaFin ||
      !formData.curso
    ) {
      toast.error("Por favor complete todos los campos obligatorios");
      return;
    }

    try {
      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Encontrar el curso seleccionado
      const cursoSeleccionado = cursosDisponibles.find(
        (c) => c.id === formData.curso
      );

      // Crear nueva planificación
      const nuevaPlanificacion = {
        idPlanificacion: `plan-temp-${Date.now()}`,
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        estado: "PLANIFICADA",
        curso: {
          idCurso: cursoSeleccionado?.id,
          nombreCurso: cursoSeleccionado?.nombre,
        },
        grado: {
          idGrado: "4",
          nombreGrado: "4to Primaria",
        },
        bimestre: formData.bimestre,
        competencias: ["Competencia 1", "Competencia 2"],
        materias: [cursoSeleccionado?.nombre],
        sesiones: parseInt(formData.sesiones) || 10,
        sesionesCompletadas: 0,
        progreso: 0,
        docenteId: trabajadorId,
        esNueva: true,
      };

      // Agregar al store
      planificacionesStore.agregarPlanificacion(nuevaPlanificacion);

      console.log("✅ [DEMO] Planificación creada:", nuevaPlanificacion);

      toast.success("✅ Planificación agregada exitosamente", {
        duration: 4000,
        description: `${formData.titulo} ha sido registrada`,
      });

      // Limpiar formulario y cerrar modal
      setFormData({
        titulo: "",
        descripcion: "",
        fechaInicio: "",
        fechaFin: "",
        curso: "",
        bimestre: "III Bimestre",
        sesiones: 10,
      });
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error("❌ Error al crear planificación:", error);
      toast.error("Error al crear la planificación");
    }
  };

  // Función para obtener el color según el estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "COMPLETADA":
        return "bg-green-100 text-green-800 border-green-200";
      case "EN PROGRESO":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PLANIFICADA":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Función para obtener el icono según el estado
  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "COMPLETADA":
        return <CheckCircle className="w-4 h-4" />;
      case "EN PROGRESO":
        return <Clock className="w-4 h-4" />;
      case "PLANIFICADA":
        return <Calendar className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-blue-600" />
            Mis Planificaciones
          </h2>
          <p className="text-gray-600 mt-1">
            Gestiona tus unidades y sesiones de aprendizaje
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Planificación
          </button>

          <button
            onClick={refetch}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 border border-gray-300"
            title="Actualizar planificaciones"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
            {/* Búsqueda */}
            <div className="relative w-full sm:w-64">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar planificaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              />
            </div>

            {/* Filtro por estado */}
            <select
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="PLANIFICADA">Planificada</option>
              <option value="EN PROGRESO">En Progreso</option>
              <option value="COMPLETADA">Completada</option>
            </select>
          </div>

          <div className="text-sm text-gray-600 flex items-center gap-4">
            <span>
              {planificacionesFiltradas.length} planificaciones encontradas
            </span>

            {isLoading && (
              <div className="flex items-center gap-2 text-blue-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Cargando...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid de planificaciones */}
      {planificacionesFiltradas.length > 0 ? (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Mostrando {planificacionesFiltradas.length} planificaciones
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {planificacionesFiltradas.map((plan) => (
              <div
                key={plan.idPlanificacion}
                className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-200"
              >
                {/* Cabecera con icono y título - Estilo Admin */}
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 text-2xl font-bold">
                      {plan.curso?.nombreCurso?.charAt(0) || "📋"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-xl text-blue-800">
                      {plan.titulo}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(plan.fechaInicio).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div className="mb-4 text-gray-700">
                  <div className="font-medium text-gray-800 mb-1">
                    Descripción:
                  </div>
                  <div className="text-sm leading-relaxed">
                    {plan.descripcion}
                  </div>
                </div>

                {/* Información del Curso y Grado - Estilo Admin */}
                <div className="mb-4">
                  <div className="font-medium text-gray-800 mb-2">
                    Información del Curso:
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Curso:
                      </span>
                      <span className="text-sm font-bold text-blue-700">
                        {plan.curso?.nombreCurso}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Grado:
                      </span>
                      <span className="text-sm font-bold text-green-700">
                        {plan.grado?.nombreGrado}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Bimestre:
                      </span>
                      <span className="text-sm font-bold text-purple-700">
                        {plan.bimestre}
                      </span>
                    </div>
                    {plan.sesiones && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          Sesiones:
                        </span>
                        <span className="text-sm font-bold text-orange-700">
                          {plan.sesionesCompletadas || 0}/{plan.sesiones}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fechas */}
                <div className="mb-4 text-gray-700">
                  <div className="font-medium text-gray-800 mb-1">Fechas:</div>
                  <div className="text-sm">
                    Del{" "}
                    {new Date(plan.fechaInicio).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                    })}{" "}
                    al{" "}
                    {new Date(plan.fechaFin).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>

                {/* Materias/Temas - Estilo Admin */}
                {plan.materias && plan.materias.length > 0 && (
                  <div className="mb-4">
                    <div className="font-medium text-gray-800 mb-2">Temas:</div>
                    <div className="flex flex-wrap gap-2">
                      {plan.materias.map((materia, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {materia}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Competencias - Estilo Admin */}
                {plan.competencias && plan.competencias.length > 0 && (
                  <div className="mb-4">
                    <div className="font-medium text-gray-800 mb-2">
                      Competencias:
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 leading-relaxed space-y-1">
                      {plan.competencias.map((comp, idx) => (
                        <div key={idx}>• {comp}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer con estado y acciones - Estilo Admin */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <button
                    onClick={() =>
                      toast.info("📋 Ver detalles completos en modo demo", {
                        duration: 4000,
                      })
                    }
                    className="text-blue-600 underline font-semibold hover:text-blue-800 transition-colors"
                  >
                    Ver detalles
                  </button>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold ${
                      plan.estado === "COMPLETADA"
                        ? "bg-green-100 text-green-700"
                        : plan.estado === "EN PROGRESO"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {plan.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        // Empty State
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            {error
              ? "Error al cargar planificaciones"
              : searchTerm
              ? "No se encontraron planificaciones"
              : "No hay planificaciones"}
          </h3>
          <p className="text-gray-500 mb-6">
            {error
              ? "Hubo un problema al cargar las planificaciones. Intenta actualizar."
              : searchTerm
              ? "Prueba ajustando los filtros de búsqueda"
              : "Comienza creando tu primera planificación académica"}
          </p>
          {!searchTerm && !error && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Plus className="w-5 h-5" />
              Crear Primera Planificación
            </button>
          )}
          {error && (
            <button
              onClick={refetch}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Intentar de Nuevo
            </button>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && planificacionesFiltradas.length === 0 && (
        <div className="text-center py-16">
          <RefreshCw className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Cargando planificaciones...
          </h3>
          <p className="text-gray-600">
            Obteniendo tus planificaciones académicas
          </p>
        </div>
      )}

      {/* Modal para agregar planificación */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Nueva Planificación
                  </h2>
                  <p className="text-sm text-gray-600">
                    Crear una nueva unidad o sesión de aprendizaje
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange("titulo", e.target.value)}
                  placeholder="Ej: Unidad 1: Introducción a las Fracciones"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={200}
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    handleInputChange("descripcion", e.target.value)
                  }
                  placeholder="Describe los objetivos y contenidos de la planificación..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.descripcion.length}/500 caracteres
                </p>
              </div>

              {/* Grid de fechas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fecha inicio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.fechaInicio}
                      onChange={(e) =>
                        handleInputChange("fechaInicio", e.target.value)
                      }
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Fecha fin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Fin *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.fechaFin}
                      onChange={(e) =>
                        handleInputChange("fechaFin", e.target.value)
                      }
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Grid de curso y bimestre */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Curso */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Curso *
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.curso}
                      onChange={(e) =>
                        handleInputChange("curso", e.target.value)
                      }
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar curso...</option>
                      {cursosDisponibles.map((curso) => (
                        <option key={curso.id} value={curso.id}>
                          {curso.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Bimestre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bimestre
                  </label>
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.bimestre}
                      onChange={(e) =>
                        handleInputChange("bimestre", e.target.value)
                      }
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="I Bimestre">I Bimestre</option>
                      <option value="II Bimestre">II Bimestre</option>
                      <option value="III Bimestre">III Bimestre</option>
                      <option value="IV Bimestre">IV Bimestre</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Número de sesiones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Sesiones
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.sesiones}
                    onChange={(e) =>
                      handleInputChange("sesiones", e.target.value)
                    }
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Cantidad de sesiones de aprendizaje que incluirá esta
                  planificación
                </p>
              </div>

              {/* Info adicional */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">Modo Demostración</p>
                    <p className="text-blue-700">
                      Las planificaciones creadas en modo demo se almacenarán
                      temporalmente durante esta sesión. Para acceder a todas
                      las funcionalidades, contáctenos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer con botones */}
            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAgregarPlanificacion}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar Planificación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherPlanificaciones;
