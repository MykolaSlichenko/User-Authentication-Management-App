import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/users.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

import swaggerUi from "swagger-ui-express";

import swaggerSpec from "./config/swagger";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("API is running");
});

export default app;