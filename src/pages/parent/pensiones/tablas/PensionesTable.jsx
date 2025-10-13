// src/pages/parent/pensiones/tablas/PensionesTable.jsx
import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

const PensionesTable = ({ pensiones, loading }) => {
  // Función para manejar el ver detalle (demo)
  const handleVerDetalle = async (pension) => {
    toast.info("Funcionalidad de demostración", {
      description:
        "En la versión completa, podrás ver detalles completos de la pensión y realizar pagos mediante pasarela integrada. Para activar esta funcionalidad, contáctanos.",
      duration: 5000,
    });
  };
  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "PAGADO":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDIENTE":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "VENCIDO":
        return "bg-red-100 text-red-800 border-red-200";
      case "CONDONADO":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Función para obtener el icono del estado
  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "PAGADO":
        return <CheckCircle className="w-4 h-4" />;
      case "PENDIENTE":
        return <Clock className="w-4 h-4" />;
      case "VENCIDO":
        return <AlertCircle className="w-4 h-4" />;
      case "CONDONADO":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Función para formatear montos
  const formatMonto = (monto) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(monto);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!pensiones || pensiones.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay pensiones
          </h3>
          <p className="text-gray-500">
            No se encontraron pensiones para mostrar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Pensiones de Estudiantes
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Historial de pensiones de tus hijos
        </p>
      </div>

      {/* Vista Desktop - Tabla */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estudiante
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mes/Año
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vencimiento
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mora
              </th>
              <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pensiones.map((pension) => (
              <tr
                key={pension.idPensionEstudiante}
                className="hover:bg-gray-50"
              >
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-800">
                          {pension.estudiante?.nombre?.charAt(0)}
                          {pension.estudiante?.apellido?.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {pension.estudiante?.nombre}{" "}
                        {pension.estudiante?.apellido}
                      </div>
                      <div className="text-xs lg:text-sm text-gray-500">
                        {pension.estudiante?.tipoDocumento}:{" "}
                        {pension.estudiante?.nroDocumento}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      {format(
                        new Date(pension.anio, pension.mes - 1),
                        "MMMM yyyy",
                        { locale: es }
                      )}
                    </span>
                  </div>
                </td>

                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatMonto(pension.montoPension)}
                  </div>
                  {pension.montoDescuento > 0 && (
                    <div className="text-xs text-green-600">
                      -{formatMonto(pension.montoDescuento)} descuento
                    </div>
                  )}
                </td>

                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(pension.fechaVencimiento), "dd/MM/yyyy")}
                </td>

                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getEstadoColor(
                      pension.estadoPension
                    )}`}
                  >
                    {getEstadoIcon(pension.estadoPension)}
                    <span className="ml-1">{pension.estadoPension}</span>
                  </span>
                </td>

                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  {pension.diasMora > 0 ? (
                    <div className="text-sm">
                      <div className="font-medium text-red-600">
                        {pension.diasMora} días
                      </div>
                      <div className="text-xs text-red-500">
                        +{formatMonto(pension.montoMora)}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </td>

                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleVerDetalle(pension)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista Mobile - Cards */}
      <div className="md:hidden divide-y divide-gray-200">
        {pensiones.map((pension) => (
          <div
            key={pension.idPensionEstudiante}
            className="p-4 hover:bg-gray-50"
          >
            {/* Header con estudiante y estado */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-800">
                    {pension.estudiante?.nombre?.charAt(0)}
                    {pension.estudiante?.apellido?.charAt(0)}
                  </span>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">
                    {pension.estudiante?.nombre} {pension.estudiante?.apellido}
                  </div>
                  <div className="text-xs text-gray-500">
                    {pension.estudiante?.tipoDocumento}:{" "}
                    {pension.estudiante?.nroDocumento}
                  </div>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getEstadoColor(
                  pension.estadoPension
                )}`}
              >
                {getEstadoIcon(pension.estadoPension)}
                <span className="ml-1">{pension.estadoPension}</span>
              </span>
            </div>

            {/* Información de la pensión */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Mes/Año</p>
                <p className="text-sm font-medium text-gray-900">
                  {format(
                    new Date(pension.anio, pension.mes - 1),
                    "MMMM yyyy",
                    { locale: es }
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Vencimiento</p>
                <p className="text-sm font-medium text-gray-900">
                  {format(new Date(pension.fechaVencimiento), "dd/MM/yyyy")}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Monto</p>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatMonto(pension.montoPension)}
                  </p>
                  {pension.montoDescuento > 0 && (
                    <p className="text-xs text-green-600">
                      -{formatMonto(pension.montoDescuento)} descuento
                    </p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Mora</p>
                {pension.diasMora > 0 ? (
                  <div>
                    <p className="text-sm font-medium text-red-600">
                      {pension.diasMora} días
                    </p>
                    <p className="text-xs text-red-500">
                      +{formatMonto(pension.montoMora)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">-</p>
                )}
              </div>
            </div>

            {/* Botón de acción */}
            <button
              onClick={() => handleVerDetalle(pension)}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Detalle
            </button>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Total de pensiones:{" "}
          <span className="font-medium">{pensiones.length}</span>
        </div>
      </div>
    </div>
  );
};

export default PensionesTable;
