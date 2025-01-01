/*
  Warnings:

  - Added the required column `class` to the `MedicalReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `disease` to the `MedicalReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentContact` to the `MedicalReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentName` to the `MedicalReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `section` to the `MedicalReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentContact` to the `MedicalReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workingDays` to the `MedicalReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MedicalReport" ADD COLUMN     "class" TEXT NOT NULL,
ADD COLUMN     "dischargeSlip" TEXT,
ADD COLUMN     "disease" TEXT NOT NULL,
ADD COLUMN     "opdIpdSlip" TEXT,
ADD COLUMN     "parentContact" TEXT NOT NULL,
ADD COLUMN     "parentName" TEXT NOT NULL,
ADD COLUMN     "section" TEXT NOT NULL,
ADD COLUMN     "studentContact" TEXT NOT NULL,
ADD COLUMN     "t1Reexam" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "t1Subjects" TEXT,
ADD COLUMN     "t2Reexam" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "t2Subjects" TEXT,
ADD COLUMN     "workingDays" INTEGER NOT NULL;
