import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  User,
  FileText,
  Calendar,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "../../../../store/useAuthStore";
import { anotacionesStore } from "../../../../store/anotacionesStore";
import { toast } from "sonner";

const ModalAgregarNota = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuthStore();
  const [creating, setCreating] = useState(false);

  // 🎭 DATOS FICTICIOS PARA DEMO
  const estudiantesFicticios = [
    {
      idEstudiante: "est-1",
      nombre: "Ana María",
      apellido: "García Pérez",
      seccion: "A",
    },
    {
      idEstudiante: "est-2",
      nombre: "Carlos Eduardo",
      apellido: "López Martínez",
      seccion: "A",
    },
    {
      idEstudiante: "est-3",
      nombre: "Isabella",
      apellido: "Rodríguez Santos",
      seccion: "B",
    },
    {
      idEstudiante: "est-4",
      nombre: "Diego",
      apellido: "Fernández Rojas",
      seccion: "A",
    },
    {
      idEstudiante: "est-5",
      nombre: "Sofía",
      apellido: "Mendoza Torres",
      seccion: "B",
    },
    {
      idEstudiante: "est-6",
      nombre: "Luis Fernando",
      apellido: "Castro Díaz",
      seccion: "A",
    },
    {
      idEstudiante: "est-7",
      nombre: "Valentina",
      apellido: "Herrera Luna",
      seccion: "C",
    },
    {
      idEstudiante: "est-8",
      nombre: "Miguel Ángel",
      apellido: "Vargas Silva",
      seccion: "B",
    },
  ];

  const cursosFicticios = [
    { idCurso: "curso-1", nombreCurso: "Matemáticas" },
    { idCurso: "curso-2", nombreCurso: "Comunicación" },
    { idCurso: "curso-3", nombreCurso: "Ciencias Naturales" },
    { idCurso: "curso-4", nombreCurso: "Arte y Cultura" },
    { idCurso: "curso-5", nombreCurso: "Educación Física" },
    { idCurso: "curso-6", nombreCurso: "Personal Social" },
    { idCurso: "curso-7", nombreCurso: "Inglés" },
  ];

  const loadingStudents = false;
  const errorStudents = null;

  console.log("🎭 [DEMO] Usando estudiantes ficticios:", estudiantesFicticios);
  console.log("🎭 [DEMO] Usando cursos ficticios:", cursosFicticios);

  // Estado del formulario
  const [formData, setFormData] = useState({
    idTrabajador: "",
    idEstudiante: "",
    titulo: "",
    observacion: "",
    fechaObservacion: new Date().toISOString().split("T")[0],
    idCurso: "",
    estaActivo: true,
  });

  const [errors, setErrors] = useState({});

  // En modo demo, no necesitamos buscar el trabajador desde backend
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        idTrabajador: "trabajador-demo",
      }));
    }
  }, [user]);

  // Resetear formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        idEstudiante: "",
        titulo: "",
        observacion: "",
        fechaObservacion: new Date().toISOString().split("T")[0],
        idCurso: "",
        estaActivo: true,
      }));
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.idEstudiante) {
      newErrors.idEstudiante = "Debe seleccionar un estudiante";
    }

    if (!formData.titulo.trim()) {
      newErrors.titulo = "El título es requerido";
    }

    if (!formData.observacion.trim()) {
      newErrors.observacion = "La observación es requerida";
    }

    if (!formData.fechaObservacion) {
      newErrors.fechaObservacion = "La fecha es requerida";
    }

    if (!formData.idCurso) {
      newErrors.idCurso = "Debe seleccionar un curso";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setCreating(true);
      console.log("🎭 [DEMO] Simulando creación de anotación:", formData);

      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Encontrar datos del estudiante y curso seleccionados
      const estudianteSeleccionado = estudiantesFicticios.find(
        (est) => est.idEstudiante === formData.idEstudiante
      );
      const cursoSeleccionado = cursosFicticios.find(
        (curso) => curso.idCurso === formData.idCurso
      );

      // Crear objeto de anotación en el formato correcto
      const nuevaAnotacion = {
        idAnotacionAlumno: `anot-temp-${Date.now()}`,
        titulo: formData.titulo,
        observacion: formData.observacion,
        fecha: new Date(formData.fechaObservacion).toISOString(),
        tipo: "POSITIVA", // Por defecto, podrías agregar un selector en el formulario
        estudiante: {
          id: estudianteSeleccionado?.idEstudiante,
          nombre: estudianteSeleccionado?.nombre,
          apellido: estudianteSeleccionado?.apellido,
        },
        curso: {
          idCurso: cursoSeleccionado?.idCurso,
          nombreCurso: cursoSeleccionado?.nombreCurso,
        },
        docenteId: formData.idTrabajador,
        esNueva: true, // Flag para identificar que es nueva
      };

      // Agregar al store
      anotacionesStore.agregarAnotacion(nuevaAnotacion);

      console.log("✅ [DEMO] Anotación creada exitosamente:", {
        estudiante: `${estudianteSeleccionado?.nombre} ${estudianteSeleccionado?.apellido}`,
        curso: cursoSeleccionado?.nombreCurso,
        titulo: formData.titulo,
        fecha: formData.fechaObservacion,
      });

      // Mostrar toast de éxito
      toast.success(
        `✅ Anotación agregada para ${estudianteSeleccionado?.nombre} ${estudianteSeleccionado?.apellido}`,
        {
          duration: 4000,
          description:
            "La anotación se ha registrado correctamente en modo demostración",
        }
      );

      setCreating(false);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("❌ Error al crear anotación:", error);
      toast.error("Error al crear la anotación");
      setCreating(false);
    }
  };

  const handleClose = () => {
    if (!creating) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Nueva Anotación
              </h2>
              <p className="text-sm text-gray-600">
                Agregar observación sobre un estudiante
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={creating}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información del profesor */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Profesor</p>
                <p className="text-sm text-blue-700">
                  {user?.nombre} {user?.apellido} - {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Selección de estudiante */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estudiante *
            </label>
            {loadingStudents ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                <span className="text-gray-500">
                  Cargando estudiantes de tus aulas...
                </span>
              </div>
            ) : errorStudents ? (
              <div className="w-full px-3 py-2 border border-red-300 rounded-md bg-red-50">
                <span className="text-red-600">
                  Error al cargar estudiantes
                </span>
              </div>
            ) : (
              <select
                value={formData.idEstudiante}
                onChange={(e) =>
                  handleInputChange("idEstudiante", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.idEstudiante ? "border-red-500" : "border-gray-300"
                }`}
                disabled={creating}
              >
                <option value="">Seleccionar estudiante...</option>
                {estudiantesFicticios.map((student) => (
                  <option
                    key={student.idEstudiante}
                    value={student.idEstudiante}
                  >
                    {student.nombre} {student.apellido} - Sección{" "}
                    {student.seccion}
                  </option>
                ))}
              </select>
            )}

            {/* Información adicional */}
            <p className="mt-1 text-xs text-gray-500">
              {estudiantesFicticios.length} estudiante(s) disponibles (Modo
              demostración)
            </p>

            {errors.idEstudiante && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.idEstudiante}
              </p>
            )}
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => handleInputChange("titulo", e.target.value)}
              placeholder="Ej: Excelente participación en clase"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.titulo ? "border-red-500" : "border-gray-300"
              }`}
              disabled={creating}
              maxLength={200}
            />
            {errors.titulo && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.titulo}
              </p>
            )}
          </div>

          {/* Observación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observación *
            </label>
            <textarea
              value={formData.observacion}
              onChange={(e) => handleInputChange("observacion", e.target.value)}
              placeholder="Descripción detallada de la observación..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.observacion ? "border-red-500" : "border-gray-300"
              }`}
              disabled={creating}
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.observacion ? (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.observacion}
                </p>
              ) : (
                <div></div>
              )}
              <p className="text-xs text-gray-500">
                {formData.observacion.length}/1000
              </p>
            </div>
          </div>

          {/* Fecha y Curso en grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Observación *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.fechaObservacion}
                  onChange={(e) =>
                    handleInputChange("fechaObservacion", e.target.value)
                  }
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.fechaObservacion
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  disabled={creating}
                />
              </div>
              {errors.fechaObservacion && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.fechaObservacion}
                </p>
              )}
            </div>

            {/* Curso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curso *
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.idCurso}
                  onChange={(e) => handleInputChange("idCurso", e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.idCurso ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={creating}
                >
                  <option value="">Seleccionar curso...</option>
                  {cursosFicticios.map((curso) => (
                    <option key={curso.idCurso} value={curso.idCurso}>
                      {curso.nombreCurso}
                    </option>
                  ))}
                </select>
              </div>
              {errors.idCurso && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.idCurso}
                </p>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={creating}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center space-x-2"
            >
              {creating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Anotación</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAgregarNota;
