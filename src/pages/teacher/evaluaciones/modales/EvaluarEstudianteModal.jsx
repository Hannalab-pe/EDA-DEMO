import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  X,
  UserCheck,
  Users,
  Award,
  FileText,
  Save,
  Bug,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import VerEstudiantesEvaluadosModal from "./VerEstudiantesEvaluadosModal";

const EvaluarEstudianteModal = ({ isOpen, onClose, evaluacion }) => {
  const [formData, setFormData] = useState({
    calificacion: "A",
    observaciones: "",
    idEvaluacion: "",
    idEstudiante: "",
  });
  const [estudiantes, setEstudiantes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEstudiantes, setIsLoadingEstudiantes] = useState(false);
  const [estudiantesEvaluados, setEstudiantesEvaluados] = useState(new Set());
  const [libretaCalificaciones, setLibretaCalificaciones] = useState([]);
  const [showEvaluadosModal, setShowEvaluadosModal] = useState(false);
  const [currentIdAula, setCurrentIdAula] = useState(null);
  const [errors, setErrors] = useState({});

  // Obtener aula del profesor
  const fetchAulaTrabajador = async () => {
    try {
      console.log("🔍 Obteniendo aula del trabajador (DEMO)");

      // Importar datos demo
      const { mockData } = await import("../../../../data/mockData.js");

      // Para demo, usar el usuario autenticado (docente con ID "2")
      const authStorage = localStorage.getItem("auth-storage");
      let docenteId = "2"; // Default

      if (authStorage) {
        const authData = JSON.parse(authStorage);
        docenteId = authData.state?.user?.entidadId || "2";
      }

      // Buscar aulas asignadas al docente
      const aulasDocente = mockData.aulas.filter(
        (aula) => aula.docenteId === docenteId
      );

      if (aulasDocente.length === 0) {
        console.log("⚠️ No se encontraron aulas para el docente");
        toast.info("No tienes aulas asignadas");
        return null;
      }

      const primeraAula = aulasDocente[0];
      const idAula = primeraAula.id;

      console.log("✅ Aula encontrada (DEMO):", primeraAula);
      console.log("🆔 ID del aula:", idAula);

      // Guardar el idAula para el modal de estudiantes evaluados
      setCurrentIdAula(idAula);

      return idAula;
    } catch (error) {
      console.error("❌ Error en fetchAulaTrabajador (DEMO):", error);
      toast.error("Error al cargar información del aula");
      return null;
    }
  };

  // Obtener estudiantes del aula (DEMO)
  const fetchEstudiantesAula = async (idAula) => {
    if (!idAula) {
      console.error("No se recibió idAula");
      return;
    }

    console.log("🔍 Obteniendo estudiantes del aula (DEMO):", idAula);
    setIsLoadingEstudiantes(true);

    try {
      // Simular delay de carga
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Importar datos demo
      const { mockData } = await import("../../../../data/mockData.js");

      // Filtrar estudiantes por aula
      const estudiantesDelAula = mockData.estudiantes.filter(
        (estudiante) => estudiante.aulaId === idAula
      );

      console.log(
        "✅ Estudiantes obtenidos (DEMO):",
        estudiantesDelAula.length
      );
      setEstudiantes(estudiantesDelAula);
    } catch (error) {
      console.error("❌ Error en fetchEstudiantesAula (DEMO):", error);
      toast.error("Error al cargar estudiantes");
    } finally {
      setIsLoadingEstudiantes(false);
    }
  };

  // Obtener libreta de calificaciones del aula (DEMO)
  const fetchLibretaCalificaciones = async (idAula) => {
    if (!idAula) {
      console.error("No se recibió idAula para libreta");
      return;
    }

    console.log(
      "🔍 Obteniendo libreta de calificaciones del aula (DEMO):",
      idAula
    );

    try {
      // Simular delay de carga
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Importar datos demo
      const { mockData } = await import("../../../../data/mockData.js");

      // Simular estudiantes que ya tienen calificaciones
      const estudiantesConCalificaciones = new Set();
      const libretasCompletas = [];

      // Para demo, simular que algunos estudiantes ya están evaluados
      const estudiantesDelAula = mockData.estudiantes.filter(
        (estudiante) => estudiante.aulaId === idAula
      );
      const evaluacionesExistentes = mockData.evaluaciones.filter(
        (evaluacion) =>
          estudiantesDelAula.some((est) => est.id === evaluacion.estudianteId)
      );

      evaluacionesExistentes.forEach((evaluacion) => {
        const estudiante = estudiantesDelAula.find(
          (est) => est.id === evaluacion.estudianteId
        );
        if (estudiante) {
          estudiantesConCalificaciones.add(estudiante.id);
          libretasCompletas.push({
            estudiante: {
              idEstudiante: estudiante.id,
              nombre: estudiante.nombre,
              apellidos: estudiante.apellidos,
            },
            libreta: {
              calificacion: evaluacion.calificacion,
              observaciones: evaluacion.observaciones,
            },
          });
        }
      });

      console.log(
        "✅ Estudiantes ya evaluados (DEMO):",
        Array.from(estudiantesConCalificaciones)
      );
      console.log("📊 Libretas completas (DEMO):", libretasCompletas.length);

      setEstudiantesEvaluados(estudiantesConCalificaciones);
      setLibretaCalificaciones(libretasCompletas);
    } catch (error) {
      console.error("❌ Error en fetchLibretaCalificaciones (DEMO):", error);
    }
  };

  // Resetear formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen && evaluacion) {
      console.log("Abriendo modal de evaluación para:", evaluacion);
      setFormData({
        calificacion: "A",
        observaciones: "",
        idEvaluacion: evaluacion.idEvaluacion || "",
        idEstudiante: "",
      });
      setErrors({});
      setEstudiantes([]);
      setEstudiantesEvaluados(new Set());
      setLibretaCalificaciones([]);

      // Obtener aula y estudiantes
      const loadData = async () => {
        console.log("Iniciando carga de datos...");
        const idAula = await fetchAulaTrabajador();
        if (idAula) {
          await fetchEstudiantesAula(idAula);
          await fetchLibretaCalificaciones(idAula);
        } else {
          console.error("No se pudo obtener idAula");
        }
      };

      loadData();
    }
  }, [isOpen, evaluacion]);

  // Función para manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Función para validar el formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.idEstudiante) {
      newErrors.idEstudiante = "Debe seleccionar un estudiante";
    }

    if (!formData.calificacion) {
      newErrors.calificacion = "La calificación es requerida";
    }

    if (!formData.observaciones.trim()) {
      newErrors.observaciones = "Las observaciones son requeridas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor, complete todos los campos requeridos");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("💾 Guardando evaluación del estudiante (DEMO):", formData);

      // Simular delay de guardado
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simular éxito del guardado
      toast.success("Evaluación del estudiante guardada correctamente");
      onClose();
    } catch (error) {
      console.error("❌ Error saving evaluacion estudiante (DEMO):", error);
      toast.error("Error al guardar la evaluación del estudiante");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/20 bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md mx-4 sm:mx-auto transform overflow-hidden rounded-2xl bg-white p-4 sm:p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-base sm:text-lg font-medium leading-6 text-gray-900 flex items-center justify-between"
                >
                  <span className="flex items-center">
                    <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                    <span className="text-sm sm:text-base">
                      Evaluar Estudiante
                    </span>
                  </span>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600 p-1"
                      onClick={onClose}
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="space-y-4">
                    {/* Estadísticas de evaluación */}
                    {estudiantes.length > 0 && (
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="text-sm font-medium text-blue-700">
                              Estudiantes evaluados: {estudiantesEvaluados.size}{" "}
                              de {estudiantes.length}
                            </span>
                          </div>
                          <div className="text-xs text-blue-600">
                            {estudiantesEvaluados.size === estudiantes.length
                              ? "✅ Todos evaluados"
                              : "⏳ Pendientes por evaluar"}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Información de la evaluación */}
                    {evaluacion && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Evaluación:
                        </h4>
                        <p className="text-sm text-gray-600">
                          {evaluacion.descripcion}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Tipo: {evaluacion.tipoEvaluacion} | Fecha:{" "}
                          {new Date(evaluacion.fecha).toLocaleDateString(
                            "es-ES"
                          )}
                        </p>
                      </div>
                    )}

                    {/* Botón para ver estudiantes evaluados */}
                    {estudiantesEvaluados.size > 0 && (
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <button
                          onClick={() => setShowEvaluadosModal(true)}
                          className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver {estudiantesEvaluados.size} estudiante
                          {estudiantesEvaluados.size !== 1 ? "s" : ""} ya
                          evaluado{estudiantesEvaluados.size !== 1 ? "s" : ""}
                        </button>
                      </div>
                    )}

                    {/* Estudiante */}
                    <div>
                      <label
                        htmlFor="idEstudiante"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Estudiante *
                      </label>
                      <div className="relative">
                        <select
                          id="idEstudiante"
                          name="idEstudiante"
                          value={formData.idEstudiante}
                          onChange={handleInputChange}
                          disabled={isLoadingEstudiantes}
                          className={`w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            errors.idEstudiante
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">
                            {isLoadingEstudiantes
                              ? "Cargando estudiantes..."
                              : "Seleccionar estudiante..."}
                          </option>
                          {estudiantes.map((estudiante) => {
                            const yaEvaluado = estudiantesEvaluados.has(
                              estudiante.idEstudiante
                            );
                            return (
                              <option
                                key={estudiante.idEstudiante}
                                value={estudiante.idEstudiante}
                              >
                                {estudiante.nombre} {estudiante.apellido}{" "}
                                {yaEvaluado ? "✓ (Ya evaluado)" : ""}
                              </option>
                            );
                          })}
                        </select>
                        <Users className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.idEstudiante && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.idEstudiante}
                        </p>
                      )}
                    </div>

                    {/* Calificación */}
                    <div>
                      <label
                        htmlFor="calificacion"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Calificación *
                      </label>
                      <div className="relative">
                        <select
                          id="calificacion"
                          name="calificacion"
                          value={formData.calificacion}
                          onChange={handleInputChange}
                          className={`w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            errors.calificacion
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="A">A - Excelente</option>
                          <option value="B">B - Bueno</option>
                          <option value="C">C - Regular</option>
                          <option value="D">D - Deficiente</option>
                          <option value="F">F - Insuficiente</option>
                        </select>
                        <Award className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.calificacion && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.calificacion}
                        </p>
                      )}
                    </div>

                    {/* Observaciones */}
                    <div>
                      <label
                        htmlFor="observaciones"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Observaciones *
                      </label>
                      <textarea
                        id="observaciones"
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.observaciones
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Escribe tus observaciones sobre el desempeño del estudiante..."
                      />
                      {errors.observaciones && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.observaciones}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isLoadingEstudiantes}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Evaluar Estudiante
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>

      {/* Modal para ver estudiantes evaluados */}
      <VerEstudiantesEvaluadosModal
        isOpen={showEvaluadosModal}
        onClose={() => setShowEvaluadosModal(false)}
        idAula={currentIdAula}
        evaluacion={evaluacion}
      />
    </Transition>
  );
};

export default EvaluarEstudianteModal;
