"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class Db {
    constructor() {
        this.prismaClient = new client_1.PrismaClient();
        this.prismaClient.$connect();
    }
    static getInstance() {
        if (!Db.instance) {
            Db.instance = new Db();
        }
        return Db.instance;
    }
    static getPrismaClient() {
        return Db.getInstance().prismaClient;
    }
}
exports.default = Db;
