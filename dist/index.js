"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)({
    path: "../.env",
});
console.log(process.env.AWS_REGION);
const server_1 = __importDefault(require("./server"));
const PORT = process.env.PORT || 8000;
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            server_1.default.listen(PORT, () => {
                console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
init();
