export const Roles = {
  MANAGER: "manager",
  SUPERVISOR: "supervisor",
  HR: "hr",
  SECRETARY: "secretary",
  EMPLOYEE: "employee",
};

export const PORT_BACKEND = import.meta.env.VITE_PORT_BACKEND;
export const BASE_URL_BACKEND = import.meta.env.VITE_PRODUCTION === "true" ? `https://facial-recognition-production.up.railway.app/` : `http://127.0.0.1:${PORT_BACKEND}/api`;