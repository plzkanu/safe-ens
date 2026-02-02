-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SITE_MANAGER', 'SUPERVISOR');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('GOOD', 'BAD');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "siteId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatrolLog" (
    "id" TEXT NOT NULL,
    "inspectorId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "inspectionDate" TIMESTAMP(3) NOT NULL,
    "department" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "PatrolLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatrolItem" (
    "id" TEXT NOT NULL,
    "patrolLogId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "itemNumber" INTEGER NOT NULL,
    "itemText" TEXT NOT NULL,
    "status" "ItemStatus" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatrolItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SAOReport" (
    "id" TEXT NOT NULL,
    "inspectorId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "reportTime" TEXT,
    "workplace" TEXT NOT NULL,
    "workArea" TEXT NOT NULL,
    "workType" TEXT,
    "workShift" TEXT,
    "observerCount" INTEGER NOT NULL DEFAULT 1,
    "workerCount" INTEGER NOT NULL DEFAULT 0,
    "workResponse" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SAOReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SAOItem" (
    "id" TEXT NOT NULL,
    "saoReportId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "itemNumber" INTEGER NOT NULL,
    "itemText" TEXT NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SAOItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "patrolItemId" TEXT,
    "saoItemId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_siteId_idx" ON "User"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Site_code_key" ON "Site"("code");

-- CreateIndex
CREATE INDEX "Site_code_idx" ON "Site"("code");

-- CreateIndex
CREATE INDEX "PatrolLog_inspectorId_idx" ON "PatrolLog"("inspectorId");

-- CreateIndex
CREATE INDEX "PatrolLog_siteId_idx" ON "PatrolLog"("siteId");

-- CreateIndex
CREATE INDEX "PatrolLog_inspectionDate_idx" ON "PatrolLog"("inspectionDate");

-- CreateIndex
CREATE INDEX "PatrolItem_patrolLogId_idx" ON "PatrolItem"("patrolLogId");

-- CreateIndex
CREATE INDEX "PatrolItem_category_idx" ON "PatrolItem"("category");

-- CreateIndex
CREATE INDEX "SAOReport_inspectorId_idx" ON "SAOReport"("inspectorId");

-- CreateIndex
CREATE INDEX "SAOReport_siteId_idx" ON "SAOReport"("siteId");

-- CreateIndex
CREATE INDEX "SAOReport_reportDate_idx" ON "SAOReport"("reportDate");

-- CreateIndex
CREATE INDEX "SAOItem_saoReportId_idx" ON "SAOItem"("saoReportId");

-- CreateIndex
CREATE INDEX "SAOItem_category_idx" ON "SAOItem"("category");

-- CreateIndex
CREATE INDEX "Photo_patrolItemId_idx" ON "Photo"("patrolItemId");

-- CreateIndex
CREATE INDEX "Photo_saoItemId_idx" ON "Photo"("saoItemId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatrolLog" ADD CONSTRAINT "PatrolLog_inspectorId_fkey" FOREIGN KEY ("inspectorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatrolLog" ADD CONSTRAINT "PatrolLog_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatrolItem" ADD CONSTRAINT "PatrolItem_patrolLogId_fkey" FOREIGN KEY ("patrolLogId") REFERENCES "PatrolLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SAOReport" ADD CONSTRAINT "SAOReport_inspectorId_fkey" FOREIGN KEY ("inspectorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SAOReport" ADD CONSTRAINT "SAOReport_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SAOItem" ADD CONSTRAINT "SAOItem_saoReportId_fkey" FOREIGN KEY ("saoReportId") REFERENCES "SAOReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_patrolItemId_fkey" FOREIGN KEY ("patrolItemId") REFERENCES "PatrolItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_saoItemId_fkey" FOREIGN KEY ("saoItemId") REFERENCES "SAOItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
