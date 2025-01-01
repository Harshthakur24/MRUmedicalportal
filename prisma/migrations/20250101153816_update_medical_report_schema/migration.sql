/*
  Warnings:

  - You are about to drop the column `class` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `dischargeSlip` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `opdIpdSlip` on the `MedicalReport` table. All the data in the column will be lost.
  - Added the required column `className` to the `MedicalReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MedicalReport" DROP COLUMN "class",
DROP COLUMN "dischargeSlip",
DROP COLUMN "opdIpdSlip",
ADD COLUMN     "className" TEXT NOT NULL;
