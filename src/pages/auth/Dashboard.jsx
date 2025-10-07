import React from "react";
import { useAuthStore } from "../../store";
import AdminDashboard from "../dashboards/AdminDashboard";
import TeacherDashboard from "../dashboards/TeacherDashboard";
import ParentDashboard from "../dashboards/ParentDashboard";
import SpecialistDashboard from "../dashboards/SpecialistDashboard";
import DirectorDashboard from "../dashboards/DirectorDashboard";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">⏳</div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  // Renderizar dashboard según el rol del usuario
  const roleName = user.role?.nombre;
  const userRol = user.rol; // Rol original del demo
  
  // Debug para ver los roles
  console.log('🎭 Dashboard Debug:', { roleName, userRol, user });
  
  switch (roleName) {
    case 'admin':
    case 'administrador':
    case 'DIRECTORA':
      return <AdminDashboard />;
    case 'SECRETARIA':
      return <DirectorDashboard />;
    case 'trabajador':
    case 'docente':
    case 'Docente':
      return <TeacherDashboard />;
    case 'padre':
    case 'ESTUDIANTE':
      return <ParentDashboard />;
    case 'especialista':
      return <SpecialistDashboard />;
    default:
      // Fallback para roles del demo que no están mapeados
      if (userRol === 'administracion') {
        return <AdminDashboard />;
      } else if (userRol === 'docente') {
        return <TeacherDashboard />;
      } else if (userRol === 'padre') {
        return <ParentDashboard />;
      } else if (userRol === 'especialista') {
        return <SpecialistDashboard />;
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <div className="text-6xl mb-4">🎭</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Demo Mode</h2>
            <p className="text-red-600 mb-2">Rol no reconocido: {roleName || userRol}</p>
            <p className="text-gray-600 mb-4">Por favor, contacta al administrador del sistema.</p>
            <div className="bg-gray-100 p-4 rounded text-left text-sm">
              <p><strong>Usuario:</strong> {user.nombre}</p>
              <p><strong>Rol Sistema:</strong> {user.role?.nombre}</p>
              <p><strong>Rol Demo:</strong> {user.rol}</p>
              <p><strong>ID:</strong> {user.id}</p>
            </div>
          </div>
        </div>
      );
  }
};

export default Dashboard;
