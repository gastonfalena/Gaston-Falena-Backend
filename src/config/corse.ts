import { CorsOptions } from "cors";

const allowedOrigins = [
  "http://localhost:3000", // backend
  "http://localhost:5173", // Vite (React)
];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true, // Permitir cookies (Token)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Métodos permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Headers permitidos
};
