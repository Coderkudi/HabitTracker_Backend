import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const userTable = prisma.user;
