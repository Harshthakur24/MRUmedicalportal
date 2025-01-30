/*
  Warnings:

  - The values [DEAN_ACADEMICS] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `className` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `currentApprovalLevel` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfAbsence` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `dateTo` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `deanAcademicsComment` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `doctorAddress` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `doctorName` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `hodComment` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `medicalCertificate` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `otherReports` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `parentContact` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `parentName` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `programCoordinatorComment` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `reviewComment` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `reviewedAt` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `reviewerId` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `studentContact` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `studentName` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `submissionDate` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `t1Reexam` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `t1Subjects` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `t2Reexam` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `t2Subjects` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `workingDays` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `school` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verificationToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('STUDENT', 'PROGRAM_COORDINATOR', 'HOD', 'DEAN', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'STUDENT';
COMMIT;

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_reportId_fkey";

-- DropIndex
DROP INDEX "Account_userId_idx";

-- DropIndex
DROP INDEX "MedicalReport_studentId_idx";

-- DropIndex
DROP INDEX "Session_userId_idx";

-- DropIndex
DROP INDEX "User_email_idx";

-- AlterTable
ALTER TABLE "MedicalReport" DROP COLUMN "className",
DROP COLUMN "currentApprovalLevel",
DROP COLUMN "dateOfAbsence",
DROP COLUMN "dateTo",
DROP COLUMN "deanAcademicsComment",
DROP COLUMN "department",
DROP COLUMN "doctorAddress",
DROP COLUMN "doctorName",
DROP COLUMN "hodComment",
DROP COLUMN "medicalCertificate",
DROP COLUMN "otherReports",
DROP COLUMN "parentContact",
DROP COLUMN "parentName",
DROP COLUMN "programCoordinatorComment",
DROP COLUMN "reviewComment",
DROP COLUMN "reviewedAt",
DROP COLUMN "reviewerId",
DROP COLUMN "status",
DROP COLUMN "studentContact",
DROP COLUMN "studentName",
DROP COLUMN "submissionDate",
DROP COLUMN "t1Reexam",
DROP COLUMN "t1Subjects",
DROP COLUMN "t2Reexam",
DROP COLUMN "t2Subjects",
DROP COLUMN "workingDays",
ADD COLUMN     "comments" TEXT[],
ADD COLUMN     "deanApprovalDate" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "documents" TEXT[],
ADD COLUMN     "hodApprovalDate" TIMESTAMP(3),
ADD COLUMN     "programCoordinatorApprovalDate" TIMESTAMP(3),
ADD COLUMN     "rejected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rejectionReason" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "school",
DROP COLUMN "verificationToken";

-- DropTable
DROP TABLE "Comment";

-- DropEnum
DROP TYPE "Department";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
