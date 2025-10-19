-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "password" DROP DEFAULT,
ALTER COLUMN "password" SET DATA TYPE TEXT;
