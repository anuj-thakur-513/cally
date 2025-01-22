import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler";
import v1Router from "./routes/v1/v1Routes";

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

app.use("/v1", v1Router);

app.get("/", (req: Request, res: Response) => {
  res.send("Cally API is up and working fine");
});

export default app;
