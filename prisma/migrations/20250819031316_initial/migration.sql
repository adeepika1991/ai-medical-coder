-- CreateEnum
CREATE TYPE "public"."VisitStatus" AS ENUM ('IN_PROGRESS', 'READY_TO_BILL');

-- CreateEnum
CREATE TYPE "public"."VisitType" AS ENUM ('OFFICE_VISIT', 'CONSULTATION', 'FOLLOW_UP', 'ANNUAL_EXAM', 'URGENT_CARE', 'TELEMEDICINE', 'PROCEDURE', 'SURGERY', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."Specialty" AS ENUM ('CARDIOLOGY', 'DERMATOLOGY', 'ORTHOPEDICS', 'PEDIATRICS', 'PSYCHIATRY', 'FAMILY_MEDICINE', 'INTERNAL_MEDICINE', 'OTHER');

-- CreateTable
CREATE TABLE "public"."Patient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "insurance" TEXT,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Visit" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "status" "public"."VisitStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "type" "public"."VisitType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT,
    "specialty" "public"."Specialty" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SoapNote" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "SoapNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SoapNoteRevision" (
    "id" TEXT NOT NULL,
    "soapNoteId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(768) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SoapNoteRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SuggestedCode" (
    "id" TEXT NOT NULL,
    "revisionId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "codeType" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SuggestedCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CodeDecisionSet" (
    "id" TEXT NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "CodeDecisionSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FinalizedCode" (
    "id" TEXT NOT NULL,
    "decisionSetId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "codeType" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinalizedCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RejectedCode" (
    "id" TEXT NOT NULL,
    "decisionSetId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "codeType" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RejectedCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ManualCode" (
    "id" TEXT NOT NULL,
    "decisionSetId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "codeType" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ManualCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SoapNote_visitId_key" ON "public"."SoapNote"("visitId");

-- CreateIndex
CREATE UNIQUE INDEX "CodeDecisionSet_revisionId_key" ON "public"."CodeDecisionSet"("revisionId");

-- AddForeignKey
ALTER TABLE "public"."Visit" ADD CONSTRAINT "Visit_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SoapNote" ADD CONSTRAINT "SoapNote_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "public"."Visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SoapNoteRevision" ADD CONSTRAINT "SoapNoteRevision_soapNoteId_fkey" FOREIGN KEY ("soapNoteId") REFERENCES "public"."SoapNote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SuggestedCode" ADD CONSTRAINT "SuggestedCode_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "public"."SoapNoteRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CodeDecisionSet" ADD CONSTRAINT "CodeDecisionSet_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "public"."SoapNoteRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FinalizedCode" ADD CONSTRAINT "FinalizedCode_decisionSetId_fkey" FOREIGN KEY ("decisionSetId") REFERENCES "public"."CodeDecisionSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RejectedCode" ADD CONSTRAINT "RejectedCode_decisionSetId_fkey" FOREIGN KEY ("decisionSetId") REFERENCES "public"."CodeDecisionSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ManualCode" ADD CONSTRAINT "ManualCode_decisionSetId_fkey" FOREIGN KEY ("decisionSetId") REFERENCES "public"."CodeDecisionSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
