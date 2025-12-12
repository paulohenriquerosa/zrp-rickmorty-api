import express from "express";
import { Request, Response, NextFunction } from "express";

import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./routes/routes";

import * as openApiDocument from "./docs/swagger.json";
import { AppError } from "./errors";

export const app = express();

app.use(express.json());

RegisterRoutes(app);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.get("/health", (_req, res) => {
  return res.json({ status: "ok" });
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.status).json({ message: error.message });
  }

  return res.status(500).json({ message: error.message });
});
