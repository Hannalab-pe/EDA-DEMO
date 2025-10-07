import demoUsers from "../data/users.json";

export const demoAuthService = {
  // Login demo
  async loginDemo(roleKey) {
    try {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 800));

      const user = demoUsers.users.find((u) => u.role === roleKey);

      if (!user) {
        throw new Error("Usuario no encontrado para el rol seleccionado");
      }

      // Mapear rol al formato esperado por el sistema
      const getRoleMappingForDemo = (roleKey) => {
        const roleMap = {
          administracion: { id: "1", nombre: "admin", permissions: ["all"] },
          docente: {
            id: "2",
            nombre: "trabajador",
            permissions: ["read_students", "write_students", "academic_access"],
          },
          padre: {
            id: "3",
            nombre: "padre",
            permissions: ["read_own_data", "view_grades"],
          },
          especialista: {
            id: "4",
            nombre: "especialista",
            permissions: ["read_students", "evaluations", "reports"],
          },
        };

        return (
          roleMap[roleKey] || {
            id: "2",
            nombre: "trabajador",
            permissions: ["read_students"],
          }
        );
      };

      const roleMapping = getRoleMappingForDemo(roleKey);

      const authResponse = {
        token: `demo-token-${user.id}`,
        user: {
          id: user.id.toString(),
          email: user.username,
          nombre: user.name.split(" ")[0],
          apellido: user.name.split(" ").slice(1).join(" "),
          fullName: user.fullName,
          tipo: "DEMO",
          rol: user.role,
          entidadId: "1",
          cambioContrasena: true, // Cambiar a true para que no requiera cambio obligatorio
          role: {
            id: roleMapping.id,
            nombre: roleMapping.nombre,
          },
          permissions: roleMapping.permissions,
          avatar: user.avatar,
          // Campos específicos según rol
          ...(user.children && { children: user.children }),
          ...(user.aula && { aula: user.aula }),
          ...(user.grado && { grado: user.grado }),
          ...(user.specialty && { specialty: user.specialty }),
        },
        role: {
          id: roleMapping.id,
          nombre: roleMapping.nombre,
        },
        permissions: roleMapping.permissions,
      };

      return authResponse;
    } catch (error) {
      console.error("❌ Error en demo login:", error);
      throw new Error(error.message || "Error en el sistema demo");
    }
  },

  // Logout demo
  async logoutDemo() {
    try {
      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Limpiar localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("auth-storage");

      return { success: true };
    } catch (error) {
      console.log("Error al cerrar sesión demo:", error);
    }
  },

  // Validar token demo
  async validateTokenDemo(token) {
    try {
      if (!token || !token.startsWith("demo-token-")) {
        return { valid: false };
      }

      const userId = token.replace("demo-token-", "");
      const user = demoUsers.users.find((u) => u.id.toString() === userId);

      if (!user) {
        return { valid: false };
      }

      // Mapear rol para validación
      const getRoleMappingForDemo = (roleKey) => {
        const roleMap = {
          administracion: { id: "1", nombre: "admin", permissions: ["all"] },
          docente: {
            id: "2",
            nombre: "trabajador",
            permissions: ["read_students", "write_students", "academic_access"],
          },
          padre: {
            id: "3",
            nombre: "padre",
            permissions: ["read_own_data", "view_grades"],
          },
          especialista: {
            id: "4",
            nombre: "especialista",
            permissions: ["read_students", "evaluations", "reports"],
          },
        };

        return (
          roleMap[roleKey] || {
            id: "2",
            nombre: "trabajador",
            permissions: ["read_students"],
          }
        );
      };

      const roleMapping = getRoleMappingForDemo(user.role);

      return {
        valid: true,
        user: {
          id: user.id.toString(),
          email: user.username,
          nombre: user.name.split(" ")[0],
          apellido: user.name.split(" ").slice(1).join(" "),
          fullName: user.fullName,
          tipo: "DEMO",
          rol: user.role,
          cambioContrasena: true, // Asegurar que no requiera cambio
          role: {
            id: roleMapping.id,
            nombre: roleMapping.nombre,
          },
          permissions: roleMapping.permissions,
          avatar: user.avatar,
          ...(user.children && { children: user.children }),
          ...(user.aula && { aula: user.aula }),
          ...(user.grado && { grado: user.grado }),
          ...(user.specialty && { specialty: user.specialty }),
        },
        role: {
          id: roleMapping.id,
          nombre: roleMapping.nombre,
        },
        permissions: roleMapping.permissions,
      };
    } catch (error) {
      console.error("Token demo inválido:", error);
      return { valid: false };
    }
  },

  // Obtener perfil demo
  async getProfileDemo() {
    try {
      const token = localStorage.getItem("token");
      const validation = await this.validateTokenDemo(token);

      if (!validation.valid) {
        throw new Error("Token inválido");
      }

      return validation.user;
    } catch (error) {
      throw new Error("Error al obtener perfil demo");
    }
  },

  // Actualizar perfil demo (simulado)
  async updateProfileDemo(profileData) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { ...profileData, updated: true };
    } catch (error) {
      throw new Error("Error al actualizar perfil demo");
    }
  },

  // Cambiar contraseña demo (simulado)
  async changePasswordDemo(userId, passwordData) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(
        "🎭 Demo: Cambio de contraseña simulado para usuario:",
        userId
      );
      return { success: true, message: "Contraseña actualizada en modo demo" };
    } catch (error) {
      throw new Error("Error al cambiar contraseña demo");
    }
  },
};
