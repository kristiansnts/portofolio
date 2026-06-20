-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'EDITOR';

-- AlterTable
ALTER TABLE "User" ADD COLUMN "username" TEXT,
ADD COLUMN "passwordHash" TEXT;

-- Backfill for existing rows if any (none expected)
UPDATE "User" SET "username" = "email", "passwordHash" = '' WHERE "username" IS NULL;

ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "passwordHash" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'EDITOR';
