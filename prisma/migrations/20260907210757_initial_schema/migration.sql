-- CreateEnum
CREATE TYPE "FixtureStatus" AS ENUM ('SCHEDULED', 'LIVE', 'FINISHED', 'POSTPONED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('GOAL', 'OWN_GOAL', 'PENALTY_GOAL', 'YELLOW_CARD', 'RED_CARD', 'YELLOW_RED_CARD');

-- CreateTable
CREATE TABLE "league" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "league_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "league_member" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "league_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fixture" (
    "id" TEXT NOT NULL,
    "apiId" INTEGER NOT NULL,
    "season" INTEGER NOT NULL,
    "round" TEXT NOT NULL,
    "kickoff" TIMESTAMP(3) NOT NULL,
    "status" "FixtureStatus" NOT NULL DEFAULT 'SCHEDULED',
    "homeTeam" TEXT NOT NULL,
    "homeTeamLogo" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "awayTeamLogo" TEXT NOT NULL,
    "homeScore" INTEGER,
    "awayScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fixture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fixture_event" (
    "id" TEXT NOT NULL,
    "fixtureId" TEXT NOT NULL,
    "minute" INTEGER NOT NULL,
    "extraMinute" INTEGER,
    "team" TEXT NOT NULL,
    "playerName" TEXT,
    "type" "EventType" NOT NULL,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fixture_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prediction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fixtureId" TEXT NOT NULL,
    "homeScore" INTEGER NOT NULL,
    "awayScore" INTEGER NOT NULL,
    "points" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prediction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "league_code_key" ON "league"("code");

-- CreateIndex
CREATE INDEX "league_member_userId_idx" ON "league_member"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "league_member_leagueId_userId_key" ON "league_member"("leagueId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "fixture_apiId_key" ON "fixture"("apiId");

-- CreateIndex
CREATE INDEX "fixture_season_round_idx" ON "fixture"("season", "round");

-- CreateIndex
CREATE INDEX "fixture_kickoff_idx" ON "fixture"("kickoff");

-- CreateIndex
CREATE INDEX "fixture_event_fixtureId_idx" ON "fixture_event"("fixtureId");

-- CreateIndex
CREATE INDEX "prediction_userId_idx" ON "prediction"("userId");

-- CreateIndex
CREATE INDEX "prediction_fixtureId_idx" ON "prediction"("fixtureId");

-- CreateIndex
CREATE UNIQUE INDEX "prediction_userId_fixtureId_key" ON "prediction"("userId", "fixtureId");

-- AddForeignKey
ALTER TABLE "league" ADD CONSTRAINT "league_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "league_member" ADD CONSTRAINT "league_member_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "league"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "league_member" ADD CONSTRAINT "league_member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixture_event" ADD CONSTRAINT "fixture_event_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "fixture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prediction" ADD CONSTRAINT "prediction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prediction" ADD CONSTRAINT "prediction_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "fixture"("id") ON DELETE CASCADE ON UPDATE CASCADE;
