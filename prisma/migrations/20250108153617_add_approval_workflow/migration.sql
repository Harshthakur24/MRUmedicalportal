/*
  Warnings:

  - The values [ADMIN] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('STUDENT', 'PROGRAM_COORDINATOR', 'HOD', 'DEAN_ACADEMICS');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'STUDENT';
COMMIT;

-- AlterTable
ALTER TABLE "MedicalReport" ADD COLUMN     "approvedByDeanAcademics" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "approvedByHOD" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "approvedByProgramCoordinator" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "currentApprovalLevel" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "deanAcademicsComment" TEXT,
ADD COLUMN     "hodComment" TEXT,
ADD COLUMN     "programCoordinatorComment" TEXT;
