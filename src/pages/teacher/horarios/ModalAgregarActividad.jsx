import React, { useState } from "react";
import { X, Calendar, Clock, BookOpen, Save } from "lucide-react";

const ModalAgregarActividad = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    actividad: "",
    tipo: "clase",
    dia_semana: "lunes",
    hora_inicio: "08:00",
    hora_fin: "09:00",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const tiposActividad = [
    { value: "clase", label: "Clase", icon: BookOpen },
    { value: "recreo", label: "Recreo", icon: Clock },
    { value: "evaluacion", label: "Evaluación", icon: Calendar },
    {
      value: "actividad_especial",
      label: "Actividad Especial",
      icon: Calendar,
    },
    { value: "capacitacion", label: "Capacitación", icon: BookOpen },
  ];

  const diasSemana = [
    { value: "lunes", label: "Lunes" },
    { value: "martes", label: "Martes" },
    { value: "miercoles", label: "Miércoles" },
    { value: "jueves", label: "Jueves" },
    { value: "viernes", label: "Viernes" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.actividad.trim()) {
      newErrors.actividad = "El nombre de la actividad es requerido";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida";
    }

    if (formData.hora_inicio >= formData.hora_fin) {
      newErrors.hora_fin =
        "La hora de fin debe ser posterior a la hora de inicio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Nueva Actividad
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre de la actividad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Actividad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="actividad"
              value={formData.actividad}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.actividad ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: Matemáticas 5to A"
            />
            {errors.actividad && (
              <p className="text-red-500 text-sm mt-1">{errors.actividad}</p>
            )}
          </div>

          {/* Tipo de actividad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Actividad
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              {tiposActividad.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          {/* Día de la semana */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Día de la Semana
            </label>
            <select
              name="dia_semana"
              value={formData.dia_semana}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              {diasSemana.map((dia) => (
                <option key={dia.value} value={dia.value}>
                  {dia.label}
                </option>
              ))}
            </select>
          </div>

          {/* Horarios */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de Inicio
              </label>
              <input
                type="time"
                name="hora_inicio"
                value={formData.hora_inicio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de Fin
              </label>
              <input
                type="time"
                name="hora_fin"
                value={formData.hora_fin}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.hora_fin ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.hora_fin && (
                <p className="text-red-500 text-sm mt-1">{errors.hora_fin}</p>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Descripción de la actividad..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Crear Actividad
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarActividad;
