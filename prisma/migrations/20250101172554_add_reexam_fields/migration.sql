/*
  Warnings:

  - Added the required column `t2Reexam` to the `MedicalReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MedicalReport" ADD COLUMN     "t1Subjects" TEXT,
ADD COLUMN     "t2Reexam" BOOLEAN NOT NULL,
ADD COLUMN     "t2Subjects" TEXT;
