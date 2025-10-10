import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Info, School, X } from "lucide-react";
import { toast } from "sonner";

const ModalEditarAula = ({ isOpen, onClose, asignacion }) => {
  const [form, setForm] = useState({
    seccion: "",
    cantidadEstudiantes: "",
    descripcion: "",
    ubicacion: "",
    equipamiento: "",
    idGrado: "",
  });

  // Cargar datos de la asignación cuando se abre el modal
  useEffect(() => {
    if (asignacion && isOpen) {
      const aula = asignacion.idAula || {};
      setForm({
        seccion: aula.seccion || "",
        cantidadEstudiantes:
          aula.capacidad?.toString() ||
          aula.cantidadEstudiantes?.toString() ||
          "",
        descripcion: aula.descripcion || "",
        ubicacion: aula.ubicacion || "",
        equipamiento: aula.equipamiento || "",
        idGrado: aula.idGrado?.idGrado || "",
      });
    }
  }, [asignacion, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    toast.info("📢 Funcionalidad no disponible en modo demo", {
      description:
        "Contáctanos para obtener el sistema completo con todas las funcionalidades de gestión de asignaciones de aulas.",
      duration: 5000,
    });
  };

  const handleClose = () => {
    setForm({
      seccion: "",
      cantidadEstudiantes: "",
      descripcion: "",
      ubicacion: "",
      equipamiento: "",
      idGrado: "",
    });
    onClose();
  };

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
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex items-center"
                  >
                    <School className="w-5 h-5 mr-2 text-blue-600" />
                    Editar Asignación de Aula
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Información básica */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="seccion"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Sección
                      </label>
                      <input
                        type="text"
                        id="seccion"
                        name="seccion"
                        value={form.seccion}
                        onChange={handleChange}
                        placeholder="Ej: A, B, C"
                        disabled
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed opacity-60"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="cantidadEstudiantes"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Capacidad de Estudiantes
                      </label>
                      <input
                        type="number"
                        id="cantidadEstudiantes"
                        name="cantidadEstudiantes"
                        value={form.cantidadEstudiantes}
                        onChange={handleChange}
                        disabled
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed opacity-60"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center"
                    >
                      <Info className="w-4 h-4 mr-2" />
                      Ver Sistema Completo
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

export default ModalEditarAula;
