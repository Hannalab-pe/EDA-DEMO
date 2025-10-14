import React, { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Dialog, Transition } from "@headlessui/react";
import {
  X,
  Calendar,
  Clock,
  User,
  FileText,
  Save,
  Plus,
  Loader2,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "../../../../store/useAuthStore";

// Esquema de validación con Yup
const validationSchema = yup.object({
  nombreActividad: yup
    .string()
    .required("El nombre de la actividad es requerido")
    .trim(),
  descripcion: yup.string().required("La descripción es requerida").trim(),
  fechaInicio: yup.string().required("La fecha de inicio es requerida"),
  fechaFin: yup.string().required("La fecha de fin es requerida"),
  horaInicio: yup.string().required("La hora de inicio es requerida"),
  horaFin: yup.string().required("La hora de fin es requerida"),
  idAula: yup.string().required("El ID del aula es requerido").trim(),
  idTrabajador: yup
    .string()
    .required("El ID del trabajador es requerido")
    .trim(),
});

// Componente FormField reutilizable
const FormField = ({ label, error, required, children, className = "" }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Componente FormSection reutilizable
const FormSection = ({ title, icon: Icon, iconColor, children }) => (
  <div>
    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
      <Icon className={`w-5 h-5 ${iconColor}`} />
      {title}
    </h3>
    {children}
  </div>
);

const ModalAgregarActividad = ({
  isOpen,
  onClose,
  selectedDate = null,
  onEventCreated,
}) => {
  const queryClient = useQueryClient();

  // Hooks
  const { user } = useAuthStore();

  // Datos ficticios de aulas para demo (sin conexión a BD)
  const aulasFicticias = [
    {
      id: "aula-1",
      nombre: "Aula Amarilla",
      grado: "Inicial 4 años",
      seccion: "A",
    },
    {
      id: "aula-2",
      nombre: "Aula Azul",
      grado: "Inicial 5 años",
      seccion: "B",
    },
    {
      id: "aula-3",
      nombre: "Aula Roja",
      grado: "Primaria 1er grado",
      seccion: "A",
    },
    {
      id: "aula-4",
      nombre: "Aula Verde",
      grado: "Primaria 2do grado",
      seccion: "B",
    },
    {
      id: "aula-5",
      nombre: "Aula Morada",
      grado: "Primaria 3er grado",
      seccion: "A",
    },
    {
      id: "aula-6",
      nombre: "Aula Naranja",
      grado: "Inicial 3 años",
      seccion: "C",
    },
  ];

  // Usar aulas ficticias (no hay loading ya que son datos estáticos)
  const aulas = aulasFicticias;
  const loadingAulas = false;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      nombreActividad: "",
      descripcion: "",
      fechaInicio: "",
      fechaFin: "",
      horaInicio: "08:00",
      horaFin: "09:00",
      idAula: "",
      idTrabajador: user?.entidadId || "demo-trabajador-123",
    },
  });

  // Demo: Crear actividad sin backend
  const createActivityMutation = useMutation({
    mutationFn: async (activityData) => {
      console.log("🎭 [DEMO] Simulando creación de actividad:", activityData);

      // Simular delay de red
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 500)
      );

      // Simular respuesta exitosa
      const demoResponse = {
        success: true,
        cronograma: {
          id: Date.now(),
          ...activityData,
          fechaCreacion: new Date().toISOString(),
        },
        message: "Actividad creada exitosamente (demo)",
      };

      console.log("✅ [DEMO] Respuesta simulada:", demoResponse);
      return demoResponse;
    },
    onSuccess: (data) => {
      toast.success("Actividad creada exitosamente (demo)");

      // Demo: Simular datos de respuesta
      const activityData = data.cronograma;

      // Convertir la respuesta demo al formato de React Big Calendar
      const calendarEvent = {
        id: activityData.id,
        title: activityData.titulo,
        start: new Date(
          `${activityData.fechaInicio}T${watch("horaInicio")}:00`
        ),
        end: new Date(`${activityData.fechaFin}T${watch("horaFin")}:00`),
        resource: {
          descripcion: activityData.descripcion,
          idAula: activityData.idAula?.idAula,
          idTrabajador: activityData.idTrabajador?.idTrabajador,
          nombreActividad: activityData.nombreActividad,
        },
      };

      // Notificar al componente padre que se creó un evento
      if (onEventCreated) {
        onEventCreated(calendarEvent);
      }

      queryClient.invalidateQueries({ queryKey: ["cronograma"] });
      handleClose();
    },
    onError: (error) => {
      toast.error("Error al crear la actividad");
      console.error("Error:", error);
    },
  });

  // Efecto para setear fecha seleccionada
  useEffect(() => {
    if (selectedDate && isOpen) {
      const fechaFormateada = selectedDate.toISOString().split("T")[0];
      setValue("fechaInicio", fechaFormateada);
      setValue("fechaFin", fechaFormateada);
    }
  }, [selectedDate, isOpen, setValue]);

  // Efecto para setear el ID del trabajador automáticamente
  useEffect(() => {
    if (isOpen) {
      setValue("idTrabajador", user?.entidadId || "demo-trabajador-123");
    }
  }, [user, isOpen, setValue]);

  const onSubmit = async (data) => {
    console.log("📋 Form submission - data:", data);

    // Validar que la fecha de fin no sea anterior a la de inicio
    if (data.fechaInicio && data.fechaFin && data.fechaInicio > data.fechaFin) {
      toast.error("La fecha de fin debe ser posterior a la fecha de inicio");
      return;
    }

    // Validar horarios si es el mismo día
    if (data.fechaInicio === data.fechaFin && data.horaInicio >= data.horaFin) {
      toast.error("La hora de fin debe ser posterior a la hora de inicio");
      return;
    }

    try {
      // Preparar datos para el backend (formato exacto que pide)
      const backendData = {
        nombreActividad: data.nombreActividad,
        descripcion: data.descripcion,
        fechaInicio: data.fechaInicio,
        fechaFin: data.fechaFin,
        idAula: data.idAula,
        idTrabajador: data.idTrabajador,
      };

      console.log("📤 Datos que se van a enviar al backend:", backendData);
      console.log("📤 Datos del formulario completos:", data);

      await createActivityMutation.mutateAsync(backendData);
    } catch (error) {
      console.error("❌ Error al crear actividad:", error);
      // El error ya está siendo manejado por el mutation
    }
  };

  const handleClose = () => {
    reset({
      nombreActividad: "",
      descripcion: "",
      fechaInicio: "",
      fechaFin: "",
      horaInicio: "08:00",
      horaFin: "09:00",
      idAula: "",
      idTrabajador: user?.entidadId || "demo-trabajador-123",
    });
    onClose();
  };

  const inputClassName = (fieldError) =>
    `w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      fieldError ? "border-red-500" : "border-gray-300"
    }`;

  // Estado de carga general
  const isLoading = createActivityMutation.isPending;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
              <Dialog.Panel className="w-full max-w-2xl sm:max-w-lg md:max-w-2xl mx-4 sm:mx-auto transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                  <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-900">
                      Nueva Actividad
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[70vh] overflow-y-auto"
                >
                  {/* Información de la Actividad */}
                  <FormSection
                    title="Información de la Actividad"
                    icon={FileText}
                    iconColor="text-blue-600"
                  >
                    <div className="space-y-4">
                      <FormField
                        label="Nombre de la Actividad"
                        required
                        error={errors.nombreActividad?.message}
                      >
                        <input
                          {...register("nombreActividad")}
                          className={inputClassName(errors.nombreActividad)}
                          placeholder="Ej: Reunión de padres de familia"
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField
                        label="Descripción"
                        required
                        error={errors.descripcion?.message}
                      >
                        <textarea
                          {...register("descripcion")}
                          rows={3}
                          className={inputClassName(errors.descripcion)}
                          placeholder="Descripción detallada de la actividad"
                          disabled={isLoading}
                        />
                      </FormField>
                    </div>
                  </FormSection>

                  {/* Programación */}
                  <FormSection
                    title="Programación"
                    icon={Calendar}
                    iconColor="text-green-600"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Fecha de Inicio"
                        required
                        error={errors.fechaInicio?.message}
                      >
                        <input
                          type="date"
                          {...register("fechaInicio")}
                          className={inputClassName(errors.fechaInicio)}
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField
                        label="Fecha de Fin"
                        required
                        error={errors.fechaFin?.message}
                      >
                        <input
                          type="date"
                          {...register("fechaFin")}
                          className={inputClassName(errors.fechaFin)}
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField
                        label="Hora de Inicio"
                        required
                        error={errors.horaInicio?.message}
                      >
                        <input
                          type="time"
                          {...register("horaInicio")}
                          className={inputClassName(errors.horaInicio)}
                          disabled={isLoading}
                        />
                      </FormField>

                      <FormField
                        label="Hora de Fin"
                        required
                        error={errors.horaFin?.message}
                      >
                        <input
                          type="time"
                          {...register("horaFin")}
                          className={inputClassName(errors.horaFin)}
                          disabled={isLoading}
                        />
                      </FormField>
                    </div>
                  </FormSection>

                  {/* Asignación */}
                  <FormSection
                    title="Asignación"
                    icon={User}
                    iconColor="text-purple-600"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Aula"
                        required
                        error={errors.idAula?.message}
                      >
                        <select
                          {...register("idAula")}
                          className={inputClassName(errors.idAula)}
                          disabled={isLoading}
                        >
                          <option value="">Seleccionar aula</option>
                          {aulas.map((aula) => (
                            <option key={aula.id} value={aula.id}>
                              {aula.grado && aula.seccion
                                ? `${aula.grado} - ${aula.seccion}`
                                : aula.nombre}
                            </option>
                          ))}
                        </select>
                        <p className="text-blue-600 text-xs mt-1">
                          🏫 Mostrando {aulas.length} aulas disponibles (modo
                          demo)
                        </p>
                      </FormField>

                      <FormField
                        label="Trabajador Asignado"
                        required
                        error={errors.idTrabajador?.message}
                      >
                        <input
                          type="text"
                          className={`${inputClassName(
                            errors.idTrabajador
                          )} bg-gray-50`}
                          value={user?.fullName || "Prof. Demo García"}
                          disabled={true}
                          readOnly
                        />
                        <input
                          type="hidden"
                          {...register("idTrabajador")}
                          value={user?.entidadId || "demo-trabajador-123"}
                        />
                        <p className="text-gray-500 text-xs mt-1">
                          ID: {user?.entidadId || "demo-trabajador-123"}{" "}
                          {!user?.entidadId && "(modo demo)"}
                        </p>
                      </FormField>
                    </div>
                  </FormSection>
                </form>

                {/* Footer Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t bg-gray-50">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isLoading}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed sm:min-w-[140px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Crear Actividad
                      </>
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalAgregarActividad;
