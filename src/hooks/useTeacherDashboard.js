import { useState, useEffect, useMemo } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  Target,
  Calendar,
  TrendingUp,
} from "lucide-react";

/**
 * Hook personalizado para el dashboard de docente
 * Obtiene datos específicos del profesor usando las APIs proporcionadas
 */
export const useTeacherDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    aulas: {
      total: 0,
      data: [],
      loading: true,
    },
    estudiantes: {
      total: 0,
      porAula: {},
      loading: true,
    },
    estadisticas: {
      asistenciaPromedio: 0,
      evaluacionesCompletadas: 0,
      metasCompletadas: 0,
      loading: true,
    },
  });

  const [error, setError] = useState(null);

  // Función para obtener aulas asignadas al profesor (DEMO VERSION)
  const fetchAulasProfesor = async () => {
    try {
      console.log("🎭 Demo: Cargando aulas del profesor...");

      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Datos mockup de aulas para el profesor Carlos Ruiz
      const mockAulas = [
        {
          id: 1,
          id_aula: 1,
          nombre: "Inicial 3 años",
          grado: "Inicial 3 años",
          seccion: "A",
          capacidad: 20,
          descripcion: "Aula Amarilla - Inicial 3 años",
        },
        {
          id: 2,
          id_aula: 2,
          nombre: "Inicial 4 años",
          grado: "Inicial 4 años",
          seccion: "B",
          capacidad: 22,
          descripcion: "Aula Verde - Inicial 4 años",
        },
      ];

      setDashboardData((prev) => ({
        ...prev,
        aulas: {
          total: mockAulas.length,
          data: mockAulas,
          loading: false,
        },
      }));

      // Obtener estudiantes de cada aula
      await fetchEstudiantesPorAula(mockAulas);
    } catch (error) {
      console.error("Error obteniendo aulas del profesor:", error);
      setError(error.message);
      setDashboardData((prev) => ({
        ...prev,
        aulas: {
          ...prev.aulas,
          loading: false,
        },
      }));
    }
  };

  // Función para obtener estudiantes por aula (DEMO VERSION)
  const fetchEstudiantesPorAula = async (aulas) => {
    try {
      console.log("🎭 Demo: Cargando estudiantes por aula...");

      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 800));

      let totalEstudiantes = 0;
      const estudiantesPorAula = {};

      // Datos mockup de estudiantes por aula
      const mockEstudiantes = {
        1: [
          // Aula 1 - Inicial 3 años
          { id: 1, nombre: "Ana", apellido: "García", edad: 3 },
          { id: 2, nombre: "Luis", apellido: "Martínez", edad: 3 },
          { id: 3, nombre: "Sofía", apellido: "López", edad: 3 },
          { id: 4, nombre: "Carlos", apellido: "Rodríguez", edad: 3 },
          { id: 5, nombre: "María", apellido: "Fernández", edad: 3 },
          { id: 6, nombre: "Diego", apellido: "Morales", edad: 3 },
          { id: 7, nombre: "Valentina", apellido: "Herrera", edad: 3 },
          { id: 8, nombre: "Sebastián", apellido: "Ruiz", edad: 3 },
        ],
        2: [
          // Aula 2 - Inicial 4 años
          { id: 9, nombre: "Isabella", apellido: "Castro", edad: 4 },
          { id: 10, nombre: "Mateo", apellido: "Vargas", edad: 4 },
          { id: 11, nombre: "Camila", apellido: "Torres", edad: 4 },
          { id: 12, nombre: "Santiago", apellido: "Jiménez", edad: 4 },
          { id: 13, nombre: "Lucía", apellido: "Mendoza", edad: 4 },
          { id: 14, nombre: "Nicolás", apellido: "Paredes", edad: 4 },
          { id: 15, nombre: "Emma", apellido: "Silva", edad: 4 },
          { id: 16, nombre: "Andrés", apellido: "Rojas", edad: 4 },
          { id: 17, nombre: "Martina", apellido: "Peña", edad: 4 },
          { id: 18, nombre: "Gabriel", apellido: "Vega", edad: 4 },
        ],
      };

      for (const aula of aulas) {
        const aulaId = aula.id_aula || aula.idAula || aula.id;
        const estudiantes = mockEstudiantes[aulaId] || [];

        estudiantesPorAula[aulaId] = estudiantes;
        totalEstudiantes += estudiantes.length;
      }

      setDashboardData((prev) => ({
        ...prev,
        estudiantes: {
          total: totalEstudiantes,
          porAula: estudiantesPorAula,
          loading: false,
        },
      }));
    } catch (error) {
      console.error("Error obteniendo estudiantes por aula:", error);
      setDashboardData((prev) => ({
        ...prev,
        estudiantes: {
          ...prev.estudiantes,
          loading: false,
        },
      }));
    }
  };

  // Función para calcular estadísticas
  const calcularEstadisticas = () => {
    // Aquí puedes agregar lógica para calcular estadísticas reales
    // Por ahora usamos datos simulados basados en los datos reales
    const asistenciaPromedio = Math.floor(Math.random() * 20) + 80; // 80-99%
    const evaluacionesCompletadas = Math.floor(Math.random() * 20) + 10; // 10-29
    const metasCompletadas = Math.floor(Math.random() * 10) + 5; // 5-14

    setDashboardData((prev) => ({
      ...prev,
      estadisticas: {
        asistenciaPromedio,
        evaluacionesCompletadas,
        metasCompletadas,
        loading: false,
      },
    }));
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchAulasProfesor();
    calcularEstadisticas();
  }, []);

  // Función para refrescar datos
  const refreshData = async () => {
    try {
      setError(null);
      setDashboardData((prev) => ({
        ...prev,
        aulas: { ...prev.aulas, loading: true },
        estudiantes: { ...prev.estudiantes, loading: true },
        estadisticas: { ...prev.estadisticas, loading: true },
      }));

      await fetchAulasProfesor();
      calcularEstadisticas();
    } catch (error) {
      setError("Error al refrescar los datos del dashboard");
      console.error("Error refreshing teacher dashboard data:", error);
    }
  };

  // Memoizar estadísticas para el dashboard
  const stats = useMemo(
    () => [
      {
        title: "Mis Estudiantes",
        value: dashboardData.estudiantes.total.toString(),
        icon: Users,
        color: "#3B82F6",
        change: dashboardData.estudiantes.loading ? "..." : "+2 nuevos",
        loading: dashboardData.estudiantes.loading,
      },
      {
        title: "Aulas Asignadas",
        value: dashboardData.aulas.total.toString(),
        icon: GraduationCap,
        color: "#10B981",
        change: "Activas",
        loading: dashboardData.aulas.loading,
      },
      {
        title: "Asistencia Promedio",
        value: `${dashboardData.estadisticas.asistenciaPromedio}%`,
        icon: TrendingUp,
        color: "#F59E0B",
        change: dashboardData.estadisticas.loading ? "..." : "+3% esta semana",
        loading: dashboardData.estadisticas.loading,
      },
      {
        title: "Metas Completadas",
        value: `${dashboardData.estadisticas.metasCompletadas}/15`,
        icon: Target,
        color: "#8B5CF6",
        change: `${Math.round(
          (dashboardData.estadisticas.metasCompletadas / 15) * 100
        )}% progreso`,
        loading: dashboardData.estadisticas.loading,
      },
    ],
    [dashboardData]
  );

  // Datos para gráficos
  const chartData = useMemo(() => {
    const aulasData = dashboardData.aulas.data.map((aula) => {
      const aulaId = aula.id_aula || aula.idAula || aula.id;
      const estudiantesAula = dashboardData.estudiantes.porAula[aulaId] || [];
      const grado = aula.grado || aula.nombre || "Sin grado";
      const seccion = aula.seccion || "A";

      return {
        name: `${grado} - ${seccion}`,
        estudiantes: estudiantesAula.length,
        capacidad: aula.capacidad || 25,
        disponibles: (aula.capacidad || 25) - estudiantesAula.length,
      };
    });

    return aulasData;
  }, [dashboardData.aulas.data, dashboardData.estudiantes.porAula]);

  return {
    // Datos del dashboard
    stats,
    dashboardData,
    chartData,

    // Estados de carga
    loading:
      dashboardData.aulas.loading ||
      dashboardData.estudiantes.loading ||
      dashboardData.estadisticas.loading,

    // Funciones
    refreshData,

    // Error handling
    error,
  };
};

export default useTeacherDashboard;
