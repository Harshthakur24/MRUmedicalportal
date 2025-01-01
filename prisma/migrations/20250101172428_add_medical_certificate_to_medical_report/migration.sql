/*
  Warnings:

  - Added the required column `medicalCertificate` to the `MedicalReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MedicalReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MedicalReport" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "medicalCertificate" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
