import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, Calendar, FileText, BookOpen, Save } from "lucide-react";
import { toast } from "sonner";
import { agregarEvaluacionDemo } from "../evaluacionesStore";

const CrearEvaluacionModal = ({
  isOpen,
  onClose,
  onSuccess,
  evaluacion,
  cursos,
}) => {
  const [formData, setFormData] = useState({
    fecha: "",
    descripcion: "",
    tipoEvaluacion: "EXAMEN",
    idCurso: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Resetear formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      if (evaluacion) {
        // Si estamos editando, cargar los datos de la evaluación
        setFormData({
          fecha: evaluacion.fecha
            ? new Date(evaluacion.fecha).toISOString().split("T")[0]
            : "",
          descripcion: evaluacion.descripcion || "",
          tipoEvaluacion: evaluacion.tipoEvaluacion || "EXAMEN",
          idCurso: evaluacion.idCurso || "",
        });
      } else {
        // Si estamos creando, resetear el formulario
        setFormData({
          fecha: new Date().toISOString().split("T")[0], // Fecha actual por defecto
          descripcion: "",
          tipoEvaluacion: "EXAMEN",
          idCurso: "",
        });
      }
      setErrors({});
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

    // Si estamos editando, solo validar descripción
    if (evaluacion) {
      if (!formData.descripcion.trim()) {
        newErrors.descripcion = "La descripción es requerida";
      }
    } else {
      // Si estamos creando, validar todos los campos
      if (!formData.fecha) {
        newErrors.fecha = "La fecha es requerida";
      }

      if (!formData.descripcion.trim()) {
        newErrors.descripcion = "La descripción es requerida";
      }

      if (!formData.idCurso) {
        newErrors.idCurso = "Debe seleccionar un curso";
      }

      if (!formData.tipoEvaluacion) {
        newErrors.tipoEvaluacion = "El tipo de evaluación es requerido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para manejar el envío del formulario (DEMO)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor, complete todos los campos requeridos");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("🎭 [DEMO] Guardando evaluación:", formData);

      // Simular delay de guardado
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (evaluacion) {
        // MODO EDICIÓN - Solo actualizar descripción
        console.log("✏️ [DEMO] Editando evaluación existente");
        toast.success("Evaluación actualizada correctamente");
      } else {
        // MODO CREACIÓN - Agregar nueva evaluación al store temporal
        const nuevaEvaluacion = {
          idEvaluacion: `eval-custom-${Date.now()}`,
          fecha: formData.fecha,
          descripcion: formData.descripcion,
          tipoEvaluacion: formData.tipoEvaluacion,
          idCurso: formData.idCurso,
          docenteId: "2",
        };

        // Agregar al store temporal
        agregarEvaluacionDemo(nuevaEvaluacion);

        console.log("➕ [DEMO] Nueva evaluación creada:", nuevaEvaluacion);
        toast.success("Evaluación creada correctamente");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("❌ Error saving evaluacion (DEMO):", error);
      toast.error("Error al guardar la evaluación");
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between"
                >
                  <span className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-green-600" />
                    {evaluacion
                      ? "Editar Descripción de Evaluación"
                      : "Crear Nueva Evaluación"}
                  </span>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Title>

                {evaluacion && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-700">
                      💡 Solo puedes editar la descripción de la evaluación. Los
                      otros campos están bloqueados para mantener la integridad
                      de los datos.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="space-y-4">
                    {/* Fecha */}
                    <div>
                      <label
                        htmlFor="fecha"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Fecha *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          id="fecha"
                          name="fecha"
                          value={formData.fecha}
                          onChange={handleInputChange}
                          disabled={evaluacion ? true : false}
                          className={`w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            evaluacion
                              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                              : ""
                          } ${
                            errors.fecha ? "border-red-500" : "border-gray-300"
                          }`}
                          min={new Date().toISOString().split("T")[0]} // No permitir fechas pasadas
                        />
                        <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.fecha && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.fecha}
                        </p>
                      )}
                    </div>

                    {/* Descripción */}
                    <div>
                      <label
                        htmlFor="descripcion"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Descripción *
                      </label>
                      <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.descripcion
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Describe la evaluación..."
                      />
                      {errors.descripcion && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.descripcion}
                        </p>
                      )}
                    </div>

                    {/* Tipo de Evaluación */}
                    <div>
                      <label
                        htmlFor="tipoEvaluacion"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Tipo de Evaluación *
                      </label>
                      <select
                        id="tipoEvaluacion"
                        name="tipoEvaluacion"
                        value={formData.tipoEvaluacion}
                        onChange={handleInputChange}
                        disabled={evaluacion ? true : false}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          evaluacion
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                            : ""
                        } ${
                          errors.tipoEvaluacion
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="EXAMEN">Examen</option>
                        <option value="TRABAJO">Trabajo</option>
                        <option value="PROYECTO">Proyecto</option>
                        <option value="TAREA">Tarea</option>
                        <option value="QUIZ">Quiz</option>
                      </select>
                      {errors.tipoEvaluacion && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.tipoEvaluacion}
                        </p>
                      )}
                    </div>

                    {/* Curso */}
                    <div>
                      <label
                        htmlFor="idCurso"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Curso *
                      </label>
                      <div className="relative">
                        <select
                          id="idCurso"
                          name="idCurso"
                          value={formData.idCurso}
                          onChange={handleInputChange}
                          disabled={evaluacion ? true : false}
                          className={`w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            evaluacion
                              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                              : ""
                          } ${
                            errors.idCurso
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Seleccionar curso...</option>
                          {cursos.map((curso) => (
                            <option key={curso.idCurso} value={curso.idCurso}>
                              {curso.nombreCurso}
                            </option>
                          ))}
                        </select>
                        <BookOpen className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.idCurso && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.idCurso}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {evaluacion ? "Actualizar" : "Crear"}
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
    </Transition>
  );
};

export default CrearEvaluacionModal;
