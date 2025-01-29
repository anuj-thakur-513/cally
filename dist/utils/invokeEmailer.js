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
const client_lambda_1 = require("@aws-sdk/client-lambda");
const keys_1 = __importDefault(require("../config/keys"));
const aws = keys_1.default.aws;
const client = new client_lambda_1.LambdaClient({
    region: aws.region,
});
const invokeEmailer = (receiverEmail, senderEmail, senderName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = {
            FunctionName: "cally-emailer",
            InvocationType: client_lambda_1.InvocationType.Event,
            LogType: client_lambda_1.LogType.None,
            Payload: new TextEncoder().encode(JSON.stringify({
                receiverEmail,
                senderEmail,
                senderName,
            })),
        };
        const command = new client_lambda_1.InvokeCommand(input); // Create the command
        const response = yield client.send(command); // Send the command to AWS Lambda
        return true;
    }
    catch (error) {
        console.error("Error invoking Lambda function:", error);
        return false;
    }
});
exports.default = invokeEmailer;
