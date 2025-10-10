// src/pages/admin/planilla/Planilla.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Calendar,
  FileText,
  Plus,
  CheckSquare,
  Square,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import demoPlanillaService from "../../../services/demoPlanillaService";

const Planilla = () => {
  // Estados para filtros (Octubre 2025 por defecto)
  const [selectedMes, setSelectedMes] = useState("10");
  const [selectedAnio, setSelectedAnio] = useState("2025");
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para selección de trabajadores
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedTrabajadores, setSelectedTrabajadores] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar trabajadores disponibles para el periodo seleccionado
  const cargarTrabajadores = async () => {
    try {
      setLoading(true);
      const data = await demoPlanillaService.getTrabajadoresDisponibles(
        selectedMes,
        selectedAnio
      );
      setTrabajadores(data);
    } catch (error) {
      console.error("Error al cargar trabajadores:", error);
      toast.error("Error al cargar trabajadores");
    } finally {
      setLoading(false);
    }
  };

  // Cargar trabajadores al montar y cuando cambie el periodo
  useEffect(() => {
    cargarTrabajadores();
  }, [selectedMes, selectedAnio]);

  // Filtrar trabajadores por búsqueda local
  const filteredTrabajadores = useMemo(() => {
    if (!searchTerm) return trabajadores;
    return trabajadores.filter(
      (trabajador) =>
        trabajador.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trabajador.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trabajador.nroDocumento
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        trabajador.correo?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [trabajadores, searchTerm]);

  // Función para refrescar datos
  const handleRefresh = async () => {
    await cargarTrabajadores();
    toast.success("Datos actualizados correctamente");
  };

  // Función para cambiar período
  const handlePeriodoChange = async () => {
    if (!selectedMes || !selectedAnio) {
      toast.error("Debe seleccionar mes y año");
      return;
    }
    await cargarTrabajadores();
  };

  // Función para activar modo selección
  const handleEnableSelection = () => {
    setIsSelectionMode(true);
    setSelectedTrabajadores([]);
  };

  // Función para cancelar selección
  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedTrabajadores([]);
  };

  // Función para seleccionar/deseleccionar trabajador
  const handleToggleTrabajador = (trabajador) => {
    setSelectedTrabajadores((prev) => {
      const isSelected = prev.some(
        (t) => t.idTrabajador === trabajador.idTrabajador
      );
      if (isSelected) {
        return prev.filter((t) => t.idTrabajador !== trabajador.idTrabajador);
      } else {
        return [...prev, trabajador];
      }
    });
  };

  // Función para seleccionar todos los trabajadores
  const handleSelectAll = () => {
    if (selectedTrabajadores.length === filteredTrabajadores.length) {
      setSelectedTrabajadores([]);
    } else {
      setSelectedTrabajadores(filteredTrabajadores);
    }
  };

  // Función para crear planilla con trabajadores seleccionados (DEMO)
  const handleCreatePlanilla = () => {
    if (selectedTrabajadores.length === 0) {
      toast.error("Debe seleccionar al menos un trabajador");
      return;
    }

    toast.info(
      `Para generar planillas con ${selectedTrabajadores.length} trabajador(es), por favor contáctanos en soporte@colegio.edu.pe o al WhatsApp +51 987 654 321. ¡Estamos aquí para ayudarte! 📋`,
      { duration: 6000 }
    );

    // Limpiar selección
    setIsSelectionMode(false);
    setSelectedTrabajadores([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Planillas
          </h1>
          <p className="text-gray-600 mt-1">
            Trabajadores con contrato de planilla - {selectedMes}/{selectedAnio}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isSelectionMode ? (
            <>
              <button
                onClick={handleEnableSelection}
                disabled={loading || filteredTrabajadores.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Agregar a Planilla
              </button>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Actualizar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCancelSelection}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {selectedTrabajadores.length === filteredTrabajadores.length ? (
                  <>
                    <CheckSquare className="w-4 h-4" />
                    Deseleccionar Todos
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4" />
                    Seleccionar Todos
                  </>
                )}
              </button>
              <button
                onClick={handleCreatePlanilla}
                disabled={selectedTrabajadores.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                Crear Planilla ({selectedTrabajadores.length})
              </button>
            </>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Trabajadores
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {trabajadores.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">Con contrato planilla</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Período Actual
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {selectedMes}/{selectedAnio}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <FileText className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-blue-600">Listos para planilla</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Estado del Sistema
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "Cargando..." : "Activo"}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">Sistema operativo</span>
          </div>
        </div>
      </div>

      {/* Controles de búsqueda y filtros */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar trabajadores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Controles de período */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Mes:</label>
              <select
                value={selectedMes}
                onChange={(e) => setSelectedMes(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1">Enero</option>
                <option value="2">Febrero</option>
                <option value="3">Marzo</option>
                <option value="4">Abril</option>
                <option value="5">Mayo</option>
                <option value="6">Junio</option>
                <option value="7">Julio</option>
                <option value="8">Agosto</option>
                <option value="9">Septiembre</option>
                <option value="10">Octubre</option>
                <option value="11">Noviembre</option>
                <option value="12">Diciembre</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Año:</label>
              <select
                value={selectedAnio}
                onChange={(e) => setSelectedAnio(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>

            <button
              onClick={handlePeriodoChange}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Filtrar
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de trabajadores */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {isSelectionMode
                  ? "Seleccionar Trabajadores para Planilla"
                  : "Trabajadores con Contrato Planilla"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {isSelectionMode
                  ? `${selectedTrabajadores.length} de ${filteredTrabajadores.length} trabajadores seleccionados`
                  : `${filteredTrabajadores.length} trabajadores encontrados`}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">
                Cargando trabajadores...
              </span>
            </div>
          ) : filteredTrabajadores.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay trabajadores con contrato planilla
              </h3>
              <p className="text-gray-600">
                No se encontraron trabajadores para el período {selectedMes}/
                {selectedAnio}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {isSelectionMode && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Seleccionar
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trabajador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contrato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sueldo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTrabajadores.map((trabajador) => (
                    <tr
                      key={trabajador.idTrabajador}
                      className="hover:bg-gray-50"
                    >
                      {/* Checkbox de selección */}
                      {isSelectionMode && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedTrabajadores.some(
                              (t) => t.idTrabajador === trabajador.idTrabajador
                            )}
                            onChange={() => handleToggleTrabajador(trabajador)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                      )}
                      {/* Trabajador */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {trabajador.nombre?.charAt(0)}
                                {trabajador.apellido?.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {trabajador.nombre} {trabajador.apellido}
                            </div>
                            <div className="text-sm text-gray-500">
                              {trabajador.direccion}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Documento */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {trabajador.tipoDocumento}: {trabajador.nroDocumento}
                        </div>
                      </td>

                      {/* Contacto */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {trabajador.telefono}
                        </div>
                        <div className="text-sm text-gray-500">
                          {trabajador.correo}
                        </div>
                      </td>

                      {/* Contrato */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {trabajador.contratoTrabajadors3?.[0]
                            ?.numeroContrato || "Sin contrato"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {trabajador.contratoTrabajadors3?.[0]
                            ?.cargoContrato || ""}
                        </div>
                        <div className="text-sm text-gray-500">
                          {trabajador.contratoTrabajadors3?.[0]?.lugarTrabajo ||
                            ""}
                        </div>
                      </td>

                      {/* Sueldo */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          S/{" "}
                          {trabajador.contratoTrabajadors3?.[0]
                            ?.sueldoContratado || "0.00"}
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            trabajador.estaActivo
                              ? "text-green-700 bg-green-100"
                              : "text-red-700 bg-red-100"
                          }`}
                        >
                          {trabajador.estaActivo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Planilla;
