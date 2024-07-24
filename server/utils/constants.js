export const corsOptions = {
  origin: ["*"], //"http://localhost:3000", "http://127.0.0.1:3000", "localhost:3000", "https://facial-recognition-lime.vercel.app/",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

export const Roles = {
  MANAGER: "manager",
  SUPERVISOR: "supervisor",
  HR: "hr",
  SECRETARY: "secretary",
  EMPLOYEE: "employee",
};

export const Status = {
  PRESENT: "present",
  ABSENT: "absent"
}