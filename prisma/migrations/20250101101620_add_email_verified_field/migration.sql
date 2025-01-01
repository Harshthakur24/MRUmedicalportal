-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "verificationToken" TEXT;
