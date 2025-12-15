/*
  Warnings:

  - You are about to drop the column `isCompleted` on the `Habits` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Habits" DROP COLUMN "isCompleted",
ADD COLUMN     "completed" BOOLEAN[] DEFAULT ARRAY[]::BOOLEAN[],
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "streak" INTEGER NOT NULL DEFAULT 0;
