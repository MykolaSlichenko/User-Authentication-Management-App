/*
  Warnings:

  - Added the required column `acceptedTerms` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- ALTER TABLE "User"
-- ADD COLUMN "acceptedTerms" BOOLEAN NOT NULL DEFAULT FALSE,
-- ADD COLUMN "firstName" TEXT NOT NULL DEFAULT '',
-- ADD COLUMN "lastName" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "User"
ADD COLUMN "acceptedTerms" BOOLEAN,
ADD COLUMN "firstName" TEXT,
ADD COLUMN "lastName" TEXT;

UPDATE "User"
SET
  "acceptedTerms" = FALSE,
  "firstName" = '',
  "lastName" = '';

ALTER TABLE "User"
ALTER COLUMN "acceptedTerms" SET NOT NULL,
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL;