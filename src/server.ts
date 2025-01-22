import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import errorHandler from "./middlewares/errorHandler";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
// error handler middleware
app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send("Cally API is up and working fine");
});

export default app;
