import React, { useState, useEffect } from "react";
import {
  Users,
  MapPin,
  Calendar,
  Clock,
  BookOpen,
  AlertCircle,
  Loader2,
  Eye,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";

const TablaAulas = ({ onVerEstudiantes }) => {
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar aulas al montar el componente
  useEffect(() => {
    cargarAulas();
  }, []);

  const cargarAulas = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Cargando aulas para demo...");

      // Simular delay de carga
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Generar datos demo de aulas sin depender de autenticación
      const { mockData } = await import("../../../../data/mockData.js");

      // Para demo, mostrar todas las aulas activas
      const aulasDemo = mockData.aulas
        .filter((aula) => aula.estaActivo === true)
        .map((aula) => ({
          ...aula,
          grado: aula.idGrado?.grado || "N/A",
          estado: aula.estaActivo ? "ACTIVA" : "INACTIVA",
          cantidadEstudiantes: Math.floor(Math.random() * 10) + 18, // Entre 18-27 estudiantes
          ubicacion: `Pabellón ${String.fromCharCode(
            65 + Math.floor(Math.random() * 3)
          )} - Aula ${aula.seccion}`,
          equipamiento: [
            "Proyector",
            "Pizarra digital",
            "Aire acondicionado",
            "Biblioteca de aula",
          ][Math.floor(Math.random() * 4)],
        }));

      console.log("✅ Aulas cargadas (DEMO):", aulasDemo.length);

      if (aulasDemo.length > 0) {
        setAulas(aulasDemo);
        toast.success(`${aulasDemo.length} aulas cargadas correctamente`);
      } else {
        setAulas([]);
        toast.info("No hay aulas disponibles");
      }
    } catch (err) {
      console.error("❌ Error al cargar aulas (DEMO):", err);
      setError("Error al cargar las aulas");
      toast.error("Error al cargar las aulas");
    } finally {
      setLoading(false);
    }
  };

  const handleVerEstudiantes = (aula) => {
    console.log("👀 Ver estudiantes clickeado:", aula);
    console.log("🆔 ID del aula:", aula.id_aula);
    if (onVerEstudiantes) {
      onVerEstudiantes(aula);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case "activa":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactiva":
        return "bg-red-100 text-red-800 border-red-200";
      case "mantenimiento":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Cargando mis aulas...
        </h3>
        <p className="text-gray-600">Obteniendo las aulas asignadas</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error al cargar aulas
        </h3>
        <p className="text-gray-600 text-center mb-4">{error}</p>
        <button
          onClick={cargarAulas}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (aulas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No tienes aulas asignadas
        </h3>
        <p className="text-gray-600 text-center">
          Aún no tienes aulas asignadas. Contacta con la administración para
          obtener tus asignaciones.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid de cards de aulas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(aulas || []).map((aula, index) => (
          <div
            key={aula.idAula || `aula-${index}`}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* Header de la card */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Aula {aula.seccion}
                  </h3>
                  <p className="text-sm text-gray-600">{aula.grado}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>

              {/* Información del aula en caja gris */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Capacidad:
                  </span>
                  <span className="text-sm font-bold text-blue-700">
                    {aula.capacidad} estudiantes
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Estudiantes:
                  </span>
                  <span className="text-sm font-bold text-green-700">
                    {aula.cantidadEstudiantes}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Estado:
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      aula.estado === "ACTIVA"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {aula.estado}
                  </span>
                </div>
              </div>

              {/* Ubicación */}
              {aula.ubicacion && (
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                  <span>{aula.ubicacion}</span>
                </div>
              )}

              {/* Equipamiento (si existe) */}
              {aula.equipamiento && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-900 mb-1 flex items-center">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Equipamiento:
                  </p>
                  <p className="text-sm text-yellow-800">
                    • {aula.equipamiento}
                  </p>
                </div>
              )}

              {/* Acciones */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleVerEstudiantes(aula)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver Estudiantes</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablaAulas;
