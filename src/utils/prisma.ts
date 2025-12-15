import { PrismaClient } from '../../generated/prisma/index.js';

export const prisma = new PrismaClient();

export const userTable = prisma.user;
export const categoryTable = prisma.category;
export const habitsTable = prisma.habits;
