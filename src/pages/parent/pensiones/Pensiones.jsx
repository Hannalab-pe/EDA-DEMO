// src/pages/parent/pensiones/Pensiones.jsx
import React, { useState, useEffect } from "react";
import PensionesTable from "./tablas/PensionesTable";
import { DollarSign, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const Pensiones = () => {
  const [loading, setLoading] = useState(true);
  const [pensiones, setPensiones] = useState([]);
  const [apoderado, setApoderado] = useState(null);

  // Función para generar pensiones ficticias
  const generarPensionesFicticias = () => {
    const estudiante = {
      nombre: "Sofía",
      apellido: "Morales Pérez",
      tipoDocumento: "DNI",
      nroDocumento: "78945612",
    };

    const meses = [
      { mes: 3, nombre: "Marzo", monto: 350 },
      { mes: 4, nombre: "Abril", monto: 350 },
      { mes: 5, nombre: "Mayo", monto: 350 },
      { mes: 6, nombre: "Junio", monto: 350 },
      { mes: 7, nombre: "Julio", monto: 350 },
      { mes: 8, nombre: "Agosto", monto: 350 },
      { mes: 9, nombre: "Septiembre", monto: 350 },
      { mes: 10, nombre: "Octubre", monto: 350 },
      { mes: 11, nombre: "Noviembre", monto: 350 },
      { mes: 12, nombre: "Diciembre", monto: 350 },
    ];

    const pensionesFake = meses.map((mesData, index) => {
      // Calcular fecha de vencimiento (día 10 de cada mes)
      const fechaVencimiento = new Date(2025, mesData.mes - 1, 10);
      const hoy = new Date();

      // Determinar estado según el mes
      let estadoPension,
        diasMora = 0,
        montoMora = 0;

      if (mesData.mes <= 8) {
        // Meses pasados - Pagados
        estadoPension = "PAGADO";
      } else if (mesData.mes === 9) {
        // Septiembre - Vencido
        estadoPension = "VENCIDO";
        diasMora = Math.floor((hoy - fechaVencimiento) / (1000 * 60 * 60 * 24));
        montoMora = Math.round(diasMora * 1.5); // S/1.50 por día
      } else if (mesData.mes === 10) {
        // Octubre (mes actual) - Pendiente
        estadoPension = "PENDIENTE";
      } else {
        // Meses futuros - Pendiente
        estadoPension = "PENDIENTE";
      }

      // Descuento en marzo (matricula)
      const montoDescuento = mesData.mes === 3 ? 50 : 0;
      const montoPension = mesData.monto;
      const montoTotal = montoPension - montoDescuento + montoMora;

      return {
        idPensionEstudiante: index + 1,
        mes: mesData.mes,
        anio: 2025,
        montoPension: montoPension,
        montoDescuento: montoDescuento,
        montoMora: montoMora,
        montoTotal: montoTotal,
        fechaVencimiento: fechaVencimiento.toISOString(),
        estadoPension: estadoPension,
        diasMora: diasMora,
        estudiante: estudiante,
      };
    });

    return pensionesFake;
  };

  // Cargar datos al montar
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const pensionesFake = generarPensionesFicticias();
      setPensiones(pensionesFake);

      setApoderado({
        nombre: "Ana",
        apellido: "Morales de Pérez",
        tipoApoderado: "Madre",
        matriculas: [{ id: 1 }],
      });

      setLoading(false);
      toast.success(`${pensionesFake.length} pensiones cargadas`);
    };

    cargarDatos();
  }, []);

  // Función para refrescar los datos
  const handleRefresh = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      const pensionesFake = generarPensionesFicticias();
      setPensiones(pensionesFake);
      setLoading(false);
      toast.success("Datos actualizados correctamente");
    } catch (error) {
      toast.error("Error al actualizar los datos");
    }
  };

  // Calcular estadísticas
  const estadisticas = React.useMemo(() => {
    if (!pensiones || pensiones.length === 0) {
      return {
        total: 0,
        pagadas: 0,
        pendientes: 0,
        vencidas: 0,
        totalMonto: 0,
        totalMora: 0,
      };
    }

    return pensiones.reduce(
      (acc, pension) => {
        acc.total += 1;

        switch (pension.estadoPension) {
          case "PAGADO":
            acc.pagadas += 1;
            break;
          case "PENDIENTE":
            acc.pendientes += 1;
            break;
          case "VENCIDO":
            acc.vencidas += 1;
            break;
        }

        acc.totalMonto += parseFloat(
          pension.montoTotal || pension.montoPension || 0
        );
        acc.totalMora += parseFloat(pension.montoMora || 0);

        return acc;
      },
      {
        total: 0,
        pagadas: 0,
        pendientes: 0,
        vencidas: 0,
        totalMonto: 0,
        totalMora: 0,
      }
    );
  }, [pensiones]);

  // Función para formatear montos
  const formatMonto = (monto) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(monto);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mr-2 sm:mr-3" />
                Pensiones
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Gestiona las pensiones de tus hijos
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Actualizar
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Pensiones
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {estadisticas.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Pagadas
                </p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {estadisticas.pagadas}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-yellow-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Pendientes
                </p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                  {estadisticas.pendientes}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Vencidas
                </p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">
                  {estadisticas.vencidas}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Información del Apoderado */}
        {apoderado && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Información del Apoderado
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Nombre
                </p>
                <p className="text-sm sm:text-base text-gray-900">
                  {apoderado.nombre} {apoderado.apellido}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Tipo
                </p>
                <p className="text-sm sm:text-base text-gray-900">
                  {apoderado.tipoApoderado}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Número de Hijos
                </p>
                <p className="text-sm sm:text-base text-gray-900">
                  {apoderado.matriculas?.length || 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de Pensiones */}
        <PensionesTable pensiones={pensiones} loading={loading} />

        {/* Resumen Financiero */}
        {(estadisticas.totalMonto > 0 || estadisticas.totalMora > 0) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Resumen Financiero
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">
                  Monto Total de Pensiones
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {formatMonto(estadisticas.totalMonto)}
                </p>
              </div>
              {estadisticas.totalMora > 0 && (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">
                    Total en Mora
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-red-600">
                    {formatMonto(estadisticas.totalMora)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pensiones;
