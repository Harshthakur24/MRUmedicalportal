/*
  Warnings:

  - You are about to drop the column `createdAt` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `medicalCertificate` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `t1Subjects` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `t2Reexam` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `t2Subjects` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `MedicalReport` table. All the data in the column will be lost.
  - The `status` column on the `MedicalReport` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `rollNumber` to the `MedicalReport` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'REJECTED');

-- DropIndex
DROP INDEX "MedicalReport_studentId_idx";

-- AlterTable
ALTER TABLE "MedicalReport" DROP COLUMN "createdAt",
DROP COLUMN "medicalCertificate",
DROP COLUMN "t1Subjects",
DROP COLUMN "t2Reexam",
DROP COLUMN "t2Subjects",
DROP COLUMN "updatedAt",
ADD COLUMN     "rollNumber" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "t1Reexam" DROP DEFAULT;

-- DropEnum
DROP TYPE "Status";
