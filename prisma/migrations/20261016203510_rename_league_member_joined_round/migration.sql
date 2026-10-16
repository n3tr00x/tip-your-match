/*
  Warnings:

  - You are about to drop the column `joinedRoundInt` on the `league_member` table. All the data in the column will be lost.
  - Added the required column `joinedRound` to the `league_member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "league_member" DROP COLUMN "joinedRoundInt",
ADD COLUMN     "joinedRound" INTEGER NOT NULL;
