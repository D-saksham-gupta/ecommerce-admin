import { PrismaClient } from "./generated/prisma";
//export const prismaClient = new PrismaClient();

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClient = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prismaClient;

export default prismaClient;
