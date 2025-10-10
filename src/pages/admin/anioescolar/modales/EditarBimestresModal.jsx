import React, { useState, useEffect } from "react";
import { X, Calendar, Info, Edit } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toast } from "sonner";

const EditarBimestresModal = ({ isOpen, onClose, bimestres, periodo }) => {
  const [bimestresData, setBimestresData] = useState([]);

  // Inicializar datos cuando se abre el modal
  useEffect(() => {
    if (isOpen && bimestres && bimestres.length > 0) {
      setBimestresData(
        bimestres.map((bimestre) => ({
          id: bimestre.idBimestre,
          numeroBimestre: bimestre.numeroBimestre,
          nombreBimestre: bimestre.nombreBimestre,
          fechaInicio: bimestre.fechaInicio,
          fechaFin: bimestre.fechaFin,
          fechaLimiteProgramacion: bimestre.fechaLimiteProgramacion,
        }))
      );
    }
  }, [isOpen, bimestres]);

  const handleInputChange = (index, field, value) => {
    setBimestresData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // MODO DEMO: Mostrar toast informativo
    toast.info("📢 Funcionalidad no disponible en modo demo", {
      description:
        "Contáctanos para obtener el sistema completo y editar fechas de bimestres reales.",
      duration: 5000,
    });
  };

  if (!isOpen || !bimestres || bimestres.length === 0) return null;

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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Edit className="w-6 h-6 text-blue-600" />
                    </div>
                    <Dialog.Title
                      as="h2"
                      className="text-xl font-bold text-gray-900"
                    >
                      Editar Fechas de Bimestres
                    </Dialog.Title>
                  </div>
                  <button
                    type="button"
                    className="rounded-md p-2 hover:bg-gray-100 transition-colors"
                    onClick={onClose}
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Periodo Info */}
                {periodo && (
                  <div className="px-6 py-3 bg-gray-50 border-b">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Período:</span> Año{" "}
                      {periodo.anioEscolar} -{" "}
                      {periodo.descripcion || "Sin descripción"}
                    </p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {bimestresData.map((bimestre, index) => (
                      <div
                        key={bimestre.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <h4 className="font-medium text-gray-900 mb-3">
                          {bimestre.numeroBimestre}° Bimestre -{" "}
                          {bimestre.nombreBimestre}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Fecha de Inicio
                            </label>
                            <input
                              type="date"
                              value={bimestre.fechaInicio}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "fechaInicio",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Fecha de Fin
                            </label>
                            <input
                              type="date"
                              value={bimestre.fechaFin}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "fechaFin",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Límite de Programación
                            </label>
                            <input
                              type="date"
                              value={bimestre.fechaLimiteProgramacion}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "fechaLimiteProgramacion",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
                    >
                      <Info className="w-4 h-4" />
                      Actualizar Fechas
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

export default EditarBimestresModal;
