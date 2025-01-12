/*
  Warnings:

  - You are about to drop the column `deanAcademicsComment` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `hodComment` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `programCoordinatorComment` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `reviewComment` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `reviewedAt` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `reviewerId` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `rollNumber` on the `MedicalReport` table. All the data in the column will be lost.
  - You are about to drop the column `studentName` on the `MedicalReport` table. All the data in the column will be lost.
  - The `status` column on the `MedicalReport` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `class` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetPasswordExpires` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetPasswordToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verificationToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `department` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `department` on the `MedicalReport` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- First, create a backup of the existing data
CREATE TABLE "MedicalReport_backup" AS SELECT * FROM "MedicalReport";
CREATE TABLE "User_backup" AS SELECT * FROM "User";

-- Drop foreign keys
ALTER TABLE "MedicalReport" DROP CONSTRAINT IF EXISTS "MedicalReport_reviewerId_fkey";
ALTER TABLE "MedicalReport" DROP CONSTRAINT IF EXISTS "MedicalReport_studentId_fkey";

-- Drop indexes
DROP INDEX IF EXISTS "MedicalReport_reviewerId_idx";
DROP INDEX IF EXISTS "MedicalReport_status_idx";
DROP INDEX IF EXISTS "User_rollNumber_idx";
DROP INDEX IF EXISTS "User_rollNumber_key";

-- Create new tables for NextAuth
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- Create Comment table
CREATE TABLE IF NOT EXISTS "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- Modify User table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'image') THEN
        ALTER TABLE "User" ADD COLUMN "image" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'parentContact') THEN
        ALTER TABLE "User" ADD COLUMN "parentContact" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'parentName') THEN
        ALTER TABLE "User" ADD COLUMN "parentName" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'studentContact') THEN
        ALTER TABLE "User" ADD COLUMN "studentContact" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'className') THEN
        ALTER TABLE "User" ADD COLUMN "className" TEXT;
    END IF;
END $$;

ALTER TABLE "User" 
    ALTER COLUMN "name" DROP NOT NULL,
    ALTER COLUMN "email" DROP NOT NULL,
    ALTER COLUMN "rollNumber" DROP NOT NULL;

-- Create temporary columns for role and department
ALTER TABLE "User" 
    ADD COLUMN IF NOT EXISTS "role_new" TEXT,
    ADD COLUMN IF NOT EXISTS "department_new" TEXT;

-- Convert existing role and department data
UPDATE "User" SET 
    "role_new" = CASE 
        WHEN "role"::text = 'STUDENT' THEN 'STUDENT'
        WHEN "role"::text = 'PROGRAM_COORDINATOR' THEN 'PROGRAM_COORDINATOR'
        WHEN "role"::text = 'HOD' THEN 'HOD'
        WHEN "role"::text = 'DEAN_ACADEMICS' THEN 'DEAN_ACADEMICS'
        ELSE 'STUDENT'
    END,
    "department_new" = CASE 
        WHEN "department"::text = 'ENGINEERING' THEN 'Engineering'
        WHEN "department"::text = 'LAW' THEN 'Law'
        WHEN "department"::text = 'SCIENCE' THEN 'Science'
        WHEN "department"::text = 'EDUCATION_AND_HUMANITIES' THEN 'Education and Humanities'
        WHEN "department"::text = 'MANAGEMENT_AND_COMMERCE' THEN 'Management and Commerce'
        ELSE 'Engineering'
    END;

-- Drop old columns and rename new ones
ALTER TABLE "User" 
    DROP COLUMN "role",
    DROP COLUMN "department",
    ALTER COLUMN "role_new" SET NOT NULL,
    ALTER COLUMN "role_new" SET DEFAULT 'STUDENT',
    RENAME COLUMN "role_new" TO "role",
    RENAME COLUMN "department_new" TO "department";

-- Convert existing comments to new format
INSERT INTO "Comment" ("id", "content", "authorId", "reportId", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid()::text,
    COALESCE("reviewComment", ''),
    "reviewerId",
    "id",
    COALESCE("reviewedAt", CURRENT_TIMESTAMP),
    CURRENT_TIMESTAMP
FROM "MedicalReport_backup"
WHERE "reviewComment" IS NOT NULL;

-- Modify MedicalReport table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'MedicalReport' AND column_name = 'deanAcademicsComment') THEN
        ALTER TABLE "MedicalReport" DROP COLUMN "deanAcademicsComment";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'MedicalReport' AND column_name = 'hodComment') THEN
        ALTER TABLE "MedicalReport" DROP COLUMN "hodComment";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'MedicalReport' AND column_name = 'programCoordinatorComment') THEN
        ALTER TABLE "MedicalReport" DROP COLUMN "programCoordinatorComment";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'MedicalReport' AND column_name = 'reviewComment') THEN
        ALTER TABLE "MedicalReport" DROP COLUMN "reviewComment";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'MedicalReport' AND column_name = 'reviewedAt') THEN
        ALTER TABLE "MedicalReport" DROP COLUMN "reviewedAt";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'MedicalReport' AND column_name = 'reviewerId') THEN
        ALTER TABLE "MedicalReport" DROP COLUMN "reviewerId";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'MedicalReport' AND column_name = 'rollNumber') THEN
        ALTER TABLE "MedicalReport" DROP COLUMN "rollNumber";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'MedicalReport' AND column_name = 'studentName') THEN
        ALTER TABLE "MedicalReport" DROP COLUMN "studentName";
    END IF;
END $$;

-- Create temporary columns for status and department
ALTER TABLE "MedicalReport" 
    ADD COLUMN IF NOT EXISTS "status_new" TEXT,
    ADD COLUMN IF NOT EXISTS "department_new" TEXT;

-- Convert existing status and department data
UPDATE "MedicalReport" SET 
    "status_new" = CASE 
        WHEN "status"::text = 'PENDING' THEN 'PENDING'
        WHEN "status"::text = 'APPROVED' THEN 'APPROVED'
        WHEN "status"::text = 'REJECTED' THEN 'REJECTED'
        ELSE 'PENDING'
    END,
    "department_new" = CASE 
        WHEN "department"::text = 'ENGINEERING' THEN 'Engineering'
        WHEN "department"::text = 'LAW' THEN 'Law'
        WHEN "department"::text = 'SCIENCE' THEN 'Science'
        WHEN "department"::text = 'EDUCATION_AND_HUMANITIES' THEN 'Education and Humanities'
        WHEN "department"::text = 'MANAGEMENT_AND_COMMERCE' THEN 'Management and Commerce'
        ELSE 'Engineering'
    END;

-- Drop old columns and rename new ones
ALTER TABLE "MedicalReport" 
    DROP COLUMN "status",
    DROP COLUMN "department",
    ALTER COLUMN "status_new" SET NOT NULL,
    ALTER COLUMN "status_new" SET DEFAULT 'PENDING',
    ALTER COLUMN "department_new" SET NOT NULL,
    RENAME COLUMN "status_new" TO "status",
    RENAME COLUMN "department_new" TO "department",
    ALTER COLUMN "currentApprovalLevel" SET DEFAULT 'PROGRAM_COORDINATOR';

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS "Account_userId_idx" ON "Account"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");
CREATE INDEX IF NOT EXISTS "Comment_authorId_idx" ON "Comment"("authorId");
CREATE INDEX IF NOT EXISTS "Comment_reportId_idx" ON "Comment"("reportId");

-- Add foreign keys if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Account_userId_fkey') THEN
        ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" 
            FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Session_userId_fkey') THEN
        ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" 
            FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'MedicalReport_studentId_fkey') THEN
        ALTER TABLE "MedicalReport" ADD CONSTRAINT "MedicalReport_studentId_fkey" 
            FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Comment_authorId_fkey') THEN
        ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" 
            FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Comment_reportId_fkey') THEN
        ALTER TABLE "Comment" ADD CONSTRAINT "Comment_reportId_fkey" 
            FOREIGN KEY ("reportId") REFERENCES "MedicalReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

-- Drop backup tables after successful migration
DROP TABLE IF EXISTS "MedicalReport_backup";
DROP TABLE IF EXISTS "User_backup";
