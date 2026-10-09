/*
  Warnings:

  - You are about to drop the column `season` on the `fixture` table. All the data in the column will be lost.
  - Added the required column `seasonId` to the `fixture` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "fixture_season_round_idx";

-- AlterTable
ALTER TABLE "fixture" DROP COLUMN "season",
ADD COLUMN     "seasonId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "season" (
    "id" TEXT NOT NULL,
    "apiId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "currentMatchday" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "season_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "season_apiId_key" ON "season"("apiId");

-- CreateIndex
CREATE UNIQUE INDEX "season_year_key" ON "season"("year");

-- CreateIndex
CREATE INDEX "fixture_seasonId_round_idx" ON "fixture"("seasonId", "round");

-- AddForeignKey
ALTER TABLE "fixture" ADD CONSTRAINT "fixture_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
