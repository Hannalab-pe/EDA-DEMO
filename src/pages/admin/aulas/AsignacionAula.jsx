import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  GraduationCap,
  Calendar,
  School,
  MapPin,
  UserCheck,
  Plus,
} from "lucide-react";
import TablaAulas from "./tablas/TablaAula";
import { demoAsignacionAulaService } from "../../../services/demoAsignacionAulaService";
import ModalAgregarAula from "./modales/ModalAgregarAula";
import ModalVerAula from "./modales/ModalVerAula";
import ModalEditarAula from "./modales/ModalEditarAula";
import ModalEliminarAula from "./modales/ModalEliminarAula";

const AsignacionAula = () => {
  // Estados para gestión de datos DEMO
  const [asignaciones, setAsignaciones] = useState([]);
  const [loadingAsignaciones, setLoadingAsignaciones] = useState(true);

  // Cargar asignaciones al montar el componente
  useEffect(() => {
    cargarAsignaciones();
  }, []);

  const cargarAsignaciones = async () => {
    setLoadingAsignaciones(true);
    try {
      const data = await demoAsignacionAulaService.getAllAsignaciones();
      setAsignaciones(data);
      console.log("[DEMO] Asignaciones de aulas cargadas:", data.length);
    } catch (error) {
      console.error("[DEMO] Error al cargar asignaciones:", error);
    } finally {
      setLoadingAsignaciones(false);
    }
  };

  // Estados locales solo para UI
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClase, setSelectedClase] = useState(null);

  // Funciones para calcular estadísticas desde las asignaciones
  const getTotalAulasAsignadas = () => {
    return (
      asignaciones?.filter((asignacion) => asignacion.estadoActivo)?.length || 0
    );
  };

  const getTotalDocentes = () => {
    const docentesUnicos = new Set(
      asignaciones
        ?.filter((asignacion) => asignacion.estadoActivo)
        ?.map((asignacion) => asignacion.idTrabajador?.idTrabajador)
    );
    return docentesUnicos.size;
  };

  const getTotalEstudiantesEnAulas = () => {
    return (
      asignaciones
        ?.filter((asignacion) => asignacion.estadoActivo)
        ?.reduce((total, asignacion) => {
          return (
            total +
            (asignacion.idAula?.capacidad ||
              asignacion.idAula?.cantidadEstudiantes ||
              0)
          );
        }, 0) || 0
    );
  };

  const getTotalClases = () => {
    return asignaciones?.filter((a) => a.estadoActivo)?.length || 0;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestión de Asignaciones de Aula
            </h1>
            <p className="text-gray-600 mt-1">
              Administra las asignaciones de docentes a aulas del centro
              educativo
            </p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <School className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">
                  Aulas Asignadas
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {getTotalAulasAsignadas()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <UserCheck className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">
                  Docentes Asignados
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {getTotalDocentes()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">
                  Estudiantes en Aulas
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {getTotalEstudiantesEnAulas()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-orange-600">
                  Total Clases
                </p>
                <p className="text-2xl font-bold text-orange-900">
                  {getTotalClases() || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Componente de Tabla de Asignaciones */}
      <TablaAulas
        asignaciones={asignaciones}
        loading={loadingAsignaciones}
        onRefresh={cargarAsignaciones}
      />

      {/* Modal para agregar asignación */}
      <ModalAgregarAula
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={cargarAsignaciones}
      />

      {/* Modal para ver asignación */}
      <ModalVerAula
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedClase(null);
        }}
        asignacion={selectedClase}
      />

      {/* Modal para editar asignación */}
      <ModalEditarAula
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedClase(null);
        }}
        asignacion={selectedClase}
        onSuccess={cargarAsignaciones}
      />

      {/* Modal para eliminar asignación */}
      <ModalEliminarAula
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedClase(null);
        }}
        asignacion={selectedClase}
        onSuccess={cargarAsignaciones}
      />
    </div>
  );

  // Funciones para manejar las acciones de la tabla
  function handleAdd() {
    setShowModal(true);
  }

  function handleEdit(asignacion) {
    setSelectedClase(asignacion);
    setShowEditModal(true);
  }

  function handleDelete(asignacion) {
    setSelectedClase(asignacion);
    setShowDeleteModal(true);
  }

  function handleView(asignacion) {
    setSelectedClase(asignacion);
    setShowViewModal(true);
  }
};

export default AsignacionAula;
