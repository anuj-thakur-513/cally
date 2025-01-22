import { PrismaClient } from "@prisma/client";

class Db {
  private static instance: Db;
  private prismaClient: PrismaClient;

  private constructor() {
    this.prismaClient = new PrismaClient();
    this.prismaClient.$connect();
  }

  private static getInstance(): Db {
    if (!Db.instance) {
      Db.instance = new Db();
    }
    return Db.instance;
  }

  public static getPrismaClient() {
    return Db.getInstance().prismaClient;
  }
}

export default Db;
