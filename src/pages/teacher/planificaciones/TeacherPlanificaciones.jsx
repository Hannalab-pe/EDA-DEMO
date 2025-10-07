import React, { useState } from "react";
import { toast } from "sonner";
import { formatFechaEvaluacion } from "../../../utils/dateUtils";
import { mockData } from "../../../data/mockData";

const TeacherPlanificaciones = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planificaciones, setPlanificaciones] = useState(
    mockData.planificaciones
  );

  // Simular función de agregar planificación
  const handleAgregarPlanificacion = () => {
    console.log('�️ Botón "Agregar Planificación" clickeado (DEMO)');
    toast.success("Funcionalidad de planificaciones en modo demo");
    // En una versión real, aquí se abriría el modal
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Mis Planificaciones (Demo)
        </h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow"
          onClick={handleAgregarPlanificacion}
        >
          + Agregar Planificación
        </button>
      </div>

      {/* Renderizar planificaciones demo */}
      {planificaciones && planificaciones.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {planificaciones.map((plan) => (
            <div
              key={plan.id}
              className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-200"
            >
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 text-2xl font-bold">📋</span>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-xl text-blue-800">
                    {plan.titulo}
                  </div>
                  <div className="text-sm text-gray-500">{plan.estado}</div>
                </div>
              </div>

              <div className="mb-4 text-gray-700">
                <div className="font-medium text-gray-800 mb-1">
                  Descripción:
                </div>
                <div className="text-sm">{plan.descripcion}</div>
              </div>

              <div className="mb-4 text-gray-700">
                <div className="font-medium text-gray-800 mb-1">Fechas:</div>
                <div className="text-sm">
                  Del {plan.fechaInicio} al {plan.fechaFin}
                </div>
              </div>

              <div className="mb-4">
                <div className="font-medium text-gray-800 mb-2">Materias:</div>
                <div className="flex flex-wrap gap-1">
                  {plan.materias?.map((materia, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {materia}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <button
                  onClick={() => toast.info("Ver detalles en modo demo")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No hay planificaciones
          </h3>
          <p className="text-gray-500 mb-6">
            Comienza creando tu primera planificación
          </p>
          <button
            onClick={handleAgregarPlanificacion}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            + Crear Planificación
          </button>
        </div>
      )}
    </div>
  );
};

export default TeacherPlanificaciones;
