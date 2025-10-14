import React, { useState, useMemo, useEffect } from "react";
import { DollarSign, CreditCard, TrendingUp, CheckCircle } from "lucide-react";
import TablaPensiones from "./tabla/TablaPensiones";
import { toast } from "sonner";

// Generar datos de pensiones ficticias para demo
const generarPensionesFicticias = () => {
  const pensiones = [];
  const estudiantes = [
    {
      nombre: "Carlos",
      apellido: "Mendoza",
      documento: "12345678",
      apoderado: "María Mendoza",
    },
    {
      nombre: "Ana",
      apellido: "García",
      documento: "23456789",
      apoderado: "Juan García",
    },
    {
      nombre: "Luis",
      apellido: "Rodríguez",
      documento: "34567890",
      apoderado: "Rosa Rodríguez",
    },
    {
      nombre: "María",
      apellido: "López",
      documento: "45678901",
      apoderado: "Pedro López",
    },
    {
      nombre: "Jorge",
      apellido: "Martínez",
      documento: "56789012",
      apoderado: "Carmen Martínez",
    },
    {
      nombre: "Laura",
      apellido: "Hernández",
      documento: "67890123",
      apoderado: "Roberto Hernández",
    },
    {
      nombre: "Diego",
      apellido: "González",
      documento: "78901234",
      apoderado: "Elena González",
    },
    {
      nombre: "Sofía",
      apellido: "Pérez",
      documento: "89012345",
      apoderado: "Luis Pérez",
    },
    {
      nombre: "Mateo",
      apellido: "Sánchez",
      documento: "90123456",
      apoderado: "Ana Sánchez",
    },
    {
      nombre: "Valentina",
      apellido: "Ramírez",
      documento: "01234567",
      apoderado: "Carlos Ramírez",
    },
    {
      nombre: "Lucas",
      apellido: "Torres",
      documento: "11234567",
      apoderado: "Lucía Torres",
    },
    {
      nombre: "Isabella",
      apellido: "Flores",
      documento: "21234567",
      apoderado: "Miguel Flores",
    },
    {
      nombre: "Sebastián",
      apellido: "Rivera",
      documento: "31234567",
      apoderado: "Patricia Rivera",
    },
    {
      nombre: "Camila",
      apellido: "Gómez",
      documento: "41234567",
      apoderado: "Fernando Gómez",
    },
    {
      nombre: "Nicolás",
      apellido: "Díaz",
      documento: "51234567",
      apoderado: "Sofía Díaz",
    },
  ];

  const aulas = [
    { id: "aula-1", nombre: "3 años A", idAula: 1 },
    { id: "aula-2", nombre: "3 años B", idAula: 2 },
    { id: "aula-3", nombre: "4 años A", idAula: 3 },
    { id: "aula-4", nombre: "4 años B", idAula: 4 },
    { id: "aula-5", nombre: "5 años A", idAula: 5 },
  ];

  const meses = [
    { num: 3, nombre: "Marzo", año: 2025 },
    { num: 4, nombre: "Abril", año: 2025 },
    { num: 5, nombre: "Mayo", año: 2025 },
    { num: 6, nombre: "Junio", año: 2025 },
    { num: 7, nombre: "Julio", año: 2025 },
    { num: 8, nombre: "Agosto", año: 2025 },
    { num: 9, nombre: "Septiembre", año: 2025 },
    { num: 10, nombre: "Octubre", año: 2025 },
    { num: 11, nombre: "Noviembre", año: 2025 },
    { num: 12, nombre: "Diciembre", año: 2025 },
  ];

  const estados = ["PAGADO", "PENDIENTE", "VENCIDO"];
  let idCounter = 1;

  estudiantes.forEach((estudiante, idx) => {
    const aulaAsignada = aulas[idx % aulas.length];
    const montoPension = 350 + Math.floor(Math.random() * 3) * 50; // S/ 350, 400, 450

    meses.forEach((mes, mesIdx) => {
      let estado;
      if (mesIdx < 6) {
        estado = "PAGADO"; // Marzo-Agosto pagados
      } else if (mesIdx === 6) {
        estado = Math.random() > 0.5 ? "PAGADO" : "VENCIDO"; // Sep: 50% pagado, 50% vencido
      } else if (mesIdx === 7) {
        estado = Math.random() > 0.3 ? "VENCIDO" : "PENDIENTE"; // Oct: mayoría vencido
      } else {
        estado = "PENDIENTE"; // Nov-Dic pendientes
      }

      const fechaVencimiento = new Date(mes.año, mes.num - 1, 10);
      const fechaPago =
        estado === "PAGADO"
          ? new Date(mes.año, mes.num - 1, Math.floor(Math.random() * 9) + 1)
          : null;

      // Calcular mora si está vencido
      let mora = 0;
      if (estado === "VENCIDO") {
        const hoy = new Date();
        const diasVencidos = Math.floor(
          (hoy - fechaVencimiento) / (1000 * 60 * 60 * 24)
        );
        mora = diasVencidos * 1.5; // S/ 1.50 por día
      }

      // Descuento aleatorio en algunos casos
      const descuento = estado === "PAGADO" && Math.random() > 0.7 ? 30 : 0;

      pensiones.push({
        idPension: idCounter++,
        estudiante: {
          nombre: estudiante.nombre,
          apellido: estudiante.apellido,
          nroDocumento: estudiante.documento,
          idEstudiante: idx + 1,
        },
        apoderado: {
          nombre: estudiante.apoderado,
          idApoderado: idx + 1,
        },
        aula: {
          seccion: aulaAsignada.nombre,
          idAula: aulaAsignada.idAula,
        },
        mes: mes.num,
        año: mes.año,
        mesNombre: mes.nombre,
        montoPension: montoPension,
        descuento: descuento,
        mora: mora,
        montoTotal: montoPension - descuento + mora,
        estadoPension: estado,
        fechaVencimiento: fechaVencimiento.toISOString(),
        fechaPago: fechaPago ? fechaPago.toISOString() : null,
        metodoPago: fechaPago
          ? ["Efectivo", "Transferencia", "Tarjeta"][
              Math.floor(Math.random() * 3)
            ]
          : null,
        observaciones:
          estado === "VENCIDO"
            ? "Pago atrasado"
            : descuento > 0
            ? "Descuento por pronto pago"
            : null,
      });
    });
  });

  return pensiones;
};

// Generar aulas ficticias
const generarAulasFicticias = () => {
  return [
    { idAula: 1, seccion: "3 años A", cantidadEstudiantes: 15 },
    { idAula: 2, seccion: "3 años B", cantidadEstudiantes: 14 },
    { idAula: 3, seccion: "4 años A", cantidadEstudiantes: 16 },
    { idAula: 4, seccion: "4 años B", cantidadEstudiantes: 15 },
    { idAula: 5, seccion: "5 años A", cantidadEstudiantes: 18 },
  ];
};

const Pensiones = () => {
  // Estados para modo demo
  const [pensiones, setPensiones] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAula, setSelectedAula] = useState("");

  // Inicializar datos demo
  useEffect(() => {
    // Mostrar toast informativo al cargar
    toast.info("Modo Demostración", {
      description:
        "Los datos mostrados son ficticios para propósitos de demostración.",
      duration: 3000,
    });

    // Simular carga de datos
    const timer = setTimeout(() => {
      setPensiones(generarPensionesFicticias());
      setAulas(generarAulasFicticias());
      setLoading(false);
      console.log(
        "✅ [DEMO] Pensiones Admin cargadas:",
        generarPensionesFicticias().length,
        "registros"
      );
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Filtrar pensiones por aula seleccionada
  const pensionesAMostrar = useMemo(() => {
    if (!selectedAula) return pensiones;
    return pensiones.filter((p) => p.aula.idAula === parseInt(selectedAula));
  }, [pensiones, selectedAula]);

  // Calcular estadísticas basadas en pensiones a mostrar
  const totalPensiones = pensionesAMostrar.length;
  const montoTotal = pensionesAMostrar.reduce(
    (sum, pension) => sum + (Number(pension.montoTotal) || 0),
    0
  );
  const pensionesActivas = pensionesAMostrar.filter(
    (pension) =>
      pension.estadoPension === "PENDIENTE" ||
      pension.estadoPension === "VENCIDO"
  ).length;
  const promedioMonto =
    totalPensiones > 0 ? (montoTotal / totalPensiones).toFixed(2) : "0.00";

  // Manejar cambio de aula
  const handleAulaChange = (aulaId) => {
    setSelectedAula(aulaId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestión de Pensiones
            </h1>
            <p className="text-gray-600 mt-1">
              Administra las pensiones mensuales
            </p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">
                  Total Pensiones
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {totalPensiones}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">
                  Pensiones Activas
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {pensionesActivas}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">
                  Monto Total
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  S/ {montoTotal.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CreditCard className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-orange-600">Promedio</p>
                <p className="text-2xl font-bold text-orange-900">
                  S/ {promedioMonto}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Componente de Tabla de Pensiones */}
      <TablaPensiones
        pensiones={pensionesAMostrar}
        loading={loading}
        // Props para filtro de aulas
        aulas={aulas}
        selectedAula={selectedAula}
        onAulaChange={handleAulaChange}
        loadingAulas={loading}
      />
    </div>
  );
};

export default Pensiones;
