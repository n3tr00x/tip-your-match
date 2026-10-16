/*
  Warnings:

  - Added the required column `seasonId` to the `league` table without a default value. This is not possible if the table is not empty.
  - Added the required column `joinedRoundInt` to the `league_member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "league" ADD COLUMN     "seasonId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "league_member" ADD COLUMN     "joinedRoundInt" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "league_adminId_seasonId_idx" ON "league"("adminId", "seasonId");

-- AddForeignKey
ALTER TABLE "league" ADD CONSTRAINT "league_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
