import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  TrendingUp,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare,
  CalendarDays,
  BarChart3,
  Filter,
  Search,
  Download,
  Loader2,
} from "lucide-react";
import { formatDatePeru } from "../../../utils/dateUtils";
import { toast } from "sonner";

const Asistencia = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [isLoading, setIsLoading] = useState(true);
  const [asistencias, setAsistencias] = useState([]);

  // Función para generar asistencias ficticias para todo el año escolar
  const generarAsistenciasFicticias = () => {
    const asistenciasFake = [];
    let idCounter = 1;

    // Generar asistencias desde Marzo 2025 hasta Diciembre 2025 (año escolar completo)
    const fechaInicio = new Date("2025-03-01");
    const fechaFin = new Date("2025-12-20");

    // Iterar por cada día del rango
    const fechaActual = new Date(fechaInicio);
    while (fechaActual <= fechaFin) {
      // Solo días de semana (Lunes a Viernes)
      if (fechaActual.getDay() !== 0 && fechaActual.getDay() !== 6) {
        const fechaStr = fechaActual.toISOString().split("T")[0];

        // 85% presente, 5% ausente, 7% tardanza, 3% justificado
        const random = Math.random();
        let asistio, observaciones;

        if (random < 0.85) {
          asistio = true;
          observaciones = "Presente";
        } else if (random < 0.9) {
          asistio = false;
          observaciones = "Sin justificación";
        } else if (random < 0.97) {
          asistio = true;
          observaciones = "Tardanza";
        } else {
          asistio = true;
          observaciones = "Justificado";
        }

        asistenciasFake.push({
          idAsistencia: idCounter++,
          fecha: fechaStr,
          hora: "08:00:00",
          asistio: asistio,
          observaciones: observaciones,
        });
      }

      // Avanzar al siguiente día
      fechaActual.setDate(fechaActual.getDate() + 1);
    }

    return asistenciasFake;
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    const cargarAsistencias = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const asistenciasFake = generarAsistenciasFicticias();
      setAsistencias(asistenciasFake);
      setIsLoading(false);
      toast.success(
        `${asistenciasFake.length} registros de asistencia cargados`
      );
    };

    cargarAsistencias();
  }, []);

  const totalRegistros = asistencias.length;

  // Procesar datos para estadísticas
  const estadisticas = React.useMemo(() => {
    const total = asistencias.length;
    const presentes = asistencias.filter(
      (a) =>
        a.asistio === true &&
        (a.observaciones === "Presente" || a.observaciones === "")
    ).length;
    const ausentes = asistencias.filter((a) => a.asistio === false).length;
    const tardanzas = asistencias.filter(
      (a) => a.asistio === true && a.observaciones === "Tardanza"
    ).length;
    const justificados = asistencias.filter(
      (a) => a.asistio === true && a.observaciones === "Justificado"
    ).length;

    const porcentajeAsistencia =
      total > 0
        ? (((presentes + tardanzas + justificados) / total) * 100).toFixed(1)
        : 0;

    return {
      total,
      presentes,
      ausentes,
      tardanzas,
      justificados,
      porcentajeAsistencia,
    };
  }, [asistencias]);

  // Función helper para obtener mes y año en zona horaria de Perú
  const getMesAnioPeru = (fechaString) => {
    const fecha = new Date(fechaString + "T12:00:00-05:00"); // Forzar zona horaria de Perú
    return {
      mes: fecha.getMonth(),
      anio: fecha.getFullYear(),
    };
  };

  // Filtrar asistencias por mes/año y búsqueda
  const asistenciasFiltradas = React.useMemo(() => {
    return asistencias
      .filter((asistencia) => {
        const { mes, anio } = getMesAnioPeru(asistencia.fecha);
        const mesCoincide = mes === selectedMonth;
        const añoCoincide = anio === selectedYear;

        // Filtro por estado
        let estadoCoincide = true;
        if (filterStatus !== "todos") {
          if (filterStatus === "presente") {
            estadoCoincide =
              asistencia.asistio === true &&
              (asistencia.observaciones === "Presente" ||
                asistencia.observaciones === "");
          } else if (filterStatus === "ausente") {
            estadoCoincide = asistencia.asistio === false;
          } else if (filterStatus === "tardanza") {
            estadoCoincide =
              asistencia.asistio === true &&
              asistencia.observaciones === "Tardanza";
          } else if (filterStatus === "justificado") {
            estadoCoincide =
              asistencia.asistio === true &&
              asistencia.observaciones === "Justificado";
          }
        }

        // Filtro por búsqueda (fecha u observaciones)
        const busquedaCoincide =
          searchTerm === "" ||
          asistencia.fecha.includes(searchTerm) ||
          asistencia.observaciones
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return mesCoincide && añoCoincide && estadoCoincide && busquedaCoincide;
      })
      .sort((a, b) => {
        // Convertir fechas a zona horaria de Perú para ordenamiento correcto
        const fechaA = new Date(a.fecha + "T12:00:00-05:00");
        const fechaB = new Date(b.fecha + "T12:00:00-05:00");
        return fechaB - fechaA; // Más recientes primero
      });
  }, [asistencias, selectedMonth, selectedYear, filterStatus, searchTerm]);

  const getEstadoInfo = (asistencia) => {
    if (asistencia.asistio === false) {
      return {
        status: "ausente",
        icon: <XCircle className="w-5 h-5" />,
        color: "text-red-600 bg-red-100",
        label: "Ausente",
      };
    }

    if (asistencia.observaciones === "Tardanza") {
      return {
        status: "tardanza",
        icon: <Clock className="w-5 h-5" />,
        color: "text-yellow-600 bg-yellow-100",
        label: "Tardanza",
      };
    }

    if (asistencia.observaciones === "Justificado") {
      return {
        status: "justificado",
        icon: <AlertTriangle className="w-5 h-5" />,
        color: "text-blue-600 bg-blue-100",
        label: "Justificado",
      };
    }

    return {
      status: "presente",
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-green-600 bg-green-100",
      label: "Presente",
    };
  };

  const formatFecha = (fecha) => {
    return formatDatePeru(fecha, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">
            Cargando historial de asistencias...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Historial de Asistencias
        </h1>
        <p className="text-gray-600">
          Consulta el registro de asistencias de tu hijo/a
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {estadisticas.total}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-gray-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Presentes</p>
              <p className="text-2xl font-bold text-green-700">
                {estadisticas.presentes}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Ausentes</p>
              <p className="text-2xl font-bold text-red-700">
                {estadisticas.ausentes}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Tardanzas</p>
              <p className="text-2xl font-bold text-yellow-700">
                {estadisticas.tardanzas}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">
                % Asistencia
              </p>
              <p className="text-2xl font-bold text-purple-700">
                {estadisticas.porcentajeAsistencia}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Selector de Mes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mes
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {meses.map((mes, index) => (
                <option key={index} value={index}>
                  {mes}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Año */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Año
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[2024, 2025, 2026].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos</option>
              <option value="presente">Presente</option>
              <option value="ausente">Ausente</option>
              <option value="tardanza">Tardanza</option>
              <option value="justificado">Justificado</option>
            </select>
          </div>

          {/* Búsqueda */}
        </div>
      </div>

      {/* Lista de Asistencias */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Registro de Asistencias - {meses[selectedMonth]} {selectedYear}
            </h3>
            <span className="text-sm text-gray-600">
              {asistenciasFiltradas.length} registro(s)
            </span>
          </div>
        </div>

        <div className="p-6">
          {asistenciasFiltradas.length === 0 ? (
            <div className="text-center py-8">
              <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                No hay registros de asistencia
              </p>
              <p className="text-sm text-gray-500">
                {filterStatus !== "todos" || searchTerm !== ""
                  ? "Intenta cambiar los filtros de búsqueda"
                  : `No hay asistencias registradas para ${meses[selectedMonth]} ${selectedYear}`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {asistenciasFiltradas.map((asistencia) => {
                const estadoInfo = getEstadoInfo(asistencia);

                return (
                  <div
                    key={asistencia.idAsistencia}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${estadoInfo.color}`}>
                        {estadoInfo.icon}
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900">
                          {formatFecha(asistencia.fecha)}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Hora: {asistencia.hora}</span>
                          </span>
                          {asistencia.observaciones &&
                            asistencia.observaciones !== "" && (
                              <span className="flex items-center space-x-1">
                                <MessageSquare className="w-4 h-4" />
                                <span>Obs: {asistencia.observaciones}</span>
                              </span>
                            )}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${estadoInfo.color}`}
                    >
                      {estadoInfo.label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Asistencia;
