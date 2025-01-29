"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const keys_1 = __importDefault(require("../config/keys"));
function generateToken(userId, email) {
    const token = jsonwebtoken_1.default.sign({
        userId,
        email,
    }, keys_1.default.jwt.secret, {
        expiresIn: keys_1.default.jwt.expiry,
    });
    return token;
}
exports.default = generateToken;
