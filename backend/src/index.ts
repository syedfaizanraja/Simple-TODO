import express from "express";
import { env } from "./config/env.js";
import { router as authRoutes, authenticateUser } from "./routes/auth.js";
import { router as todoRoutes } from "./routes/todos.js";

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS",
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }

  next();
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    environment: env.nodeEnv,
    database: {
      host: env.db.host,
      port: env.db.port,
      name: env.db.name,
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/todos", authenticateUser, todoRoutes);

app.listen(env.port, () => {
  console.log(`Backend running on http://localhost:${env.port}`);
});
