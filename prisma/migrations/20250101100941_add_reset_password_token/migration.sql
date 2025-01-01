/*
  Warnings:

  - You are about to drop the column `comments` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `reviewedAt` on the `MedicalReport` table. All the data in the column will be lost.
  - Added the required column `dateTo` to the `MedicalReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorAddress` to the `MedicalReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorName` to the `MedicalReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medicalCertificate` to the `MedicalReport` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "MedicalReport_status_idx";

-- AlterTable
ALTER TABLE "MedicalReport" DROP COLUMN "comments",
DROP COLUMN "fileUrl",
DROP COLUMN "reviewedAt",
ADD COLUMN     "dateTo" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "doctorAddress" TEXT NOT NULL,
ADD COLUMN     "doctorName" TEXT NOT NULL,
ADD COLUMN     "medicalCertificate" TEXT NOT NULL,
ADD COLUMN     "otherReports" TEXT[];

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "resetPasswordToken" TEXT;
