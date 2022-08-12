import path from "path";
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connect from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import kategoriRoutes from "./routes/kategoriRoutes.js";
import trackingRoutes from "./routes/trackingRoutes.js";
import trackingDetailRoutes from "./routes/trackingDetailRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import homeAdminRoutes from "./routes/homeAdminRoutes.js";

dotenv.config();
connect();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/tracking", trackingRoutes);
app.use("/api/kategori", kategoriRoutes);
app.use("/api/trackingDetail", trackingDetailRoutes);
app.use("/api/users", userRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/homeAdmin", homeAdminRoutes);

const __dirname = path.resolve();
app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "/public/uploads"))
);

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
