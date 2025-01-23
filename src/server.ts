import express, { Request, Response } from "express";
import cors from "cors";
import os from "os";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler";
import v1Router from "./routes/v1/v1Routes";
import ApiResponse from "./core/ApiResponse";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());
// error handler middleware
app.use(errorHandler);

app.use("/api/v1", v1Router);

app.get("/", (req: Request, res: Response) => {
  res.json(
    new ApiResponse(
      {
        status: "success",
        hostname: os.hostname(),
        requestIp: req.ip,
        requestMethod: req.method,
        requestUrl: req.url,
      },
      "Server is running"
    )
  );
});

export default app;
