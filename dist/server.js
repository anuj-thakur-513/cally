"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const os_1 = __importDefault(require("os"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const v1Routes_1 = __importDefault(require("./routes/v1/v1Routes"));
const ApiResponse_1 = __importDefault(require("./core/ApiResponse"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)());
// error handler middleware
app.use(errorHandler_1.default);
app.use("/api/v1", v1Routes_1.default);
app.get("/", (req, res) => {
    res.json(new ApiResponse_1.default({
        status: "success",
        hostname: os_1.default.hostname(),
        requestIp: req.ip,
        requestMethod: req.method,
        requestUrl: req.url,
    }, "Server is running"));
});
exports.default = app;
