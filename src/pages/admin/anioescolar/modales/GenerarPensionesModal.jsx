import React, { useState, useEffect } from "react";
import { X, DollarSign, Info } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toast } from "sonner";

const GenerarPensionesModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    anioEscolar: new Date().getFullYear(),
    diaVencimientoPersonalizado: 15,
    descripcion: "",
    regenerarExistentes: false,
    aplicarDescuentosPagoAdelantado: false,
  });

  useEffect(() => {
    // Actualizar descripción por defecto
    setFormData((prev) => ({
      ...prev,
      descripcion: `Generación automática de pensiones para el año escolar ${new Date().getFullYear()}`,
    }));
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // MODO DEMO: Mostrar toast informativo
    toast.info("📢 Funcionalidad no disponible en modo demo", {
      description:
        "Contáctanos para obtener el sistema completo y generar pensiones automáticamente.",
      duration: 5000,
    });
  };

  if (!isOpen) return null;

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
          <div className="fixed inset-0 bg-black/20" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <Dialog.Title
                      as="h2"
                      className="text-xl font-bold text-gray-900"
                    >
                      Generar Pensiones
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {/* Año Escolar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Año Escolar
                    </label>
                    <input
                      type="number"
                      name="anioEscolar"
                      value={formData.anioEscolar}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="2024"
                      required
                    />
                  </div>

                  {/* Día Vencimiento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Día de Vencimiento
                    </label>
                    <input
                      type="number"
                      name="diaVencimientoPersonalizado"
                      value={formData.diaVencimientoPersonalizado}
                      onChange={handleInputChange}
                      min="1"
                      max="31"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Descripción de la generación..."
                      required
                    />
                  </div>

                  {/* Regenerar Existentes */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="regenerarExistentes"
                      checked={formData.regenerarExistentes}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Regenerar pensiones existentes
                    </label>
                  </div>

                  {/* Aplicar Descuentos */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="aplicarDescuentosPagoAdelantado"
                      checked={formData.aplicarDescuentosPagoAdelantado}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Aplicar descuentos por pago adelantado
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <Info className="w-4 h-4" />
                      <span>Generar Pensiones</span>
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

export default GenerarPensionesModal;
