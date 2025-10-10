import React, { useState } from "react";
import { useSidebar } from "../../contexts/SidebarContext";

const WhatsAppButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { isMobileSidebarOpen } = useSidebar();
  const phoneNumber = "925223153"; // Número de WhatsApp

  // Mensaje predeterminado
  const defaultMessage =
    "¡Hola! Me gustaría obtener más información sobre EDA.";

  // Generar URL de WhatsApp
  const whatsappUrl = `https://wa.me/51${phoneNumber}?text=${encodeURIComponent(
    defaultMessage
  )}`;

  const handleClick = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // Logo oficial de WhatsApp en SVG
  const WhatsAppIcon = () => (
    <svg
      viewBox="0 0 32 32"
      className="w-7 h-7"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16 0C7.163 0 0 7.163 0 16c0 2.828.736 5.479 2.016 7.781L0 32l8.281-2.016C10.521 31.264 13.172 32 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333c-2.547 0-4.943-.719-6.959-1.953l-.5-.281-5.187 1.271 1.281-5.141-.313-.531A13.267 13.267 0 012.667 16c0-7.359 5.974-13.333 13.333-13.333S29.333 8.641 29.333 16 23.359 29.333 16 29.333z" />
      <path d="M23.281 19.531c-.344-.172-2.031-1.016-2.359-1.125-.313-.109-.547-.172-.766.172-.234.328-.891 1.125-1.094 1.359-.203.219-.406.234-.75.078-.344-.172-1.453-.547-2.766-1.734-1.016-.922-1.703-2.063-1.906-2.406-.203-.344-.016-.531.141-.703.156-.156.344-.406.516-.609.172-.203.234-.344.344-.578.109-.234.063-.438-.031-.609-.094-.172-.766-1.859-1.047-2.547-.281-.672-.563-.578-.766-.594-.203-.016-.438-.016-.672-.016s-.609.094-.922.438c-.313.344-1.203 1.188-1.203 2.875s1.234 3.344 1.406 3.563c.172.234 2.422 3.797 5.922 5.281.828.359 1.469.578 1.969.734.828.266 1.578.234 2.172.141.656-.094 2.031-.844 2.328-1.656.281-.813.281-1.5.203-1.656-.078-.172-.297-.266-.641-.438z" />
    </svg>
  );

  return (
    <>
      {/* Contenedor del botón - cambia posición y tamaño en móvil cuando sidebar está abierto */}
      <div
        className={`
          fixed z-50 transition-all duration-300
          ${
            isMobileSidebarOpen
              ? "bottom-6 right-6 lg:bottom-6 lg:left-1/2 lg:transform lg:-translate-x-1/2"
              : "bottom-6 left-1/2 transform -translate-x-1/2"
          }
        `}
      >
        {/* Anillo de pulso suave (efecto de onda sutil) - oculto cuando sidebar está abierto en móvil */}
        <div
          className={`absolute inset-0 flex items-center justify-center ${
            isMobileSidebarOpen ? "lg:block hidden" : ""
          }`}
        >
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-30 animate-ping-slow"></span>
        </div>

        {/* Botón flotante de WhatsApp */}
        <button
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            relative flex items-center bg-[#25D366] hover:bg-[#128C7E] text-white 
            shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 
            animate-float group rounded-full
            ${
              isMobileSidebarOpen
                ? "gap-0 px-3 py-3 lg:gap-3 lg:px-6 lg:py-3.5"
                : "gap-3 px-6 py-3.5"
            }
          `}
          aria-label="Contactar por WhatsApp"
        >
          {/* Logo de WhatsApp */}
          <div className="relative">
            <WhatsAppIcon />
            {/* Indicator de disponibilidad */}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-lg"></span>
          </div>

          {/* Texto "Contáctanos" - oculto en móvil cuando sidebar está abierto */}
          <span
            className={`
            font-semibold text-sm whitespace-nowrap transition-all duration-300
            ${isMobileSidebarOpen ? "hidden lg:inline" : ""}
          `}
          >
            CONTACTAR
          </span>

          {/* Icono de flecha sutil - oculto en móvil cuando sidebar está abierto */}
          <svg
            className={`
              w-4 h-4 transition-transform group-hover:translate-x-1
              ${isMobileSidebarOpen ? "hidden lg:block" : ""}
            `}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Tooltip opcional cuando está hover - oculto en móvil cuando sidebar está abierto */}
      {isHovered && !isMobileSidebarOpen && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm animate-fade-in-up">
          <p className="font-bold text-center">¿Necesitas ayuda? 💬</p>
          <p className="text-xs text-gray-300 text-center">
            Escríbenos por WhatsApp
          </p>
          {/* Flecha del tooltip */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900"></div>
        </div>
      )}

      {/* Estilos para las animaciones suaves */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translate(-50%, 10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes ping-slow {
          75%,
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </>
  );
};

export default WhatsAppButton;
