/*
  Warnings:

  - Added the required column `plateNumberId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "plateNumberId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PlateNumber" (
    "id" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlateNumber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlateNumber_plate_key" ON "PlateNumber"("plate");

-- AddForeignKey
ALTER TABLE "PlateNumber" ADD CONSTRAINT "PlateNumber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_plateNumberId_fkey" FOREIGN KEY ("plateNumberId") REFERENCES "PlateNumber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
