-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'HOD', 'STUDENT');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'REJECTED');

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "rollNumber" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resetPasswordToken" TEXT,
    "verificationToken" TEXT,
    "emailVerified" TIMESTAMP(3),
    "resetPasswordExpires" TIMESTAMP(3),

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalReport" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "rollNumber" TEXT NOT NULL,
    "dateOfAbsence" TIMESTAMP(3) NOT NULL,
    "dateTo" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "doctorName" TEXT NOT NULL,
    "doctorAddress" TEXT NOT NULL,
    "medicalCertificate" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "otherReports" TEXT[],
    "parentName" TEXT NOT NULL,
    "parentContact" TEXT NOT NULL,
    "studentContact" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "disease" TEXT NOT NULL,
    "workingDays" INTEGER NOT NULL,
    "t1Reexam" BOOLEAN NOT NULL DEFAULT false,
    "t1Subjects" TEXT,
    "t2Reexam" BOOLEAN NOT NULL DEFAULT false,
    "t2Subjects" TEXT,
    "submissionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_rollNumber_key" ON "Student"("rollNumber");

-- AddForeignKey
ALTER TABLE "MedicalReport" ADD CONSTRAINT "MedicalReport_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalReport" ADD CONSTRAINT "MedicalReport_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
