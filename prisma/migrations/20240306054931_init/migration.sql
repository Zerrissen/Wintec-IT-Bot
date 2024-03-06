-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Visitor', 'Student', 'Alumni');

-- CreateEnum
CREATE TYPE "ResponseType" AS ENUM ('Morning', 'Afternoon');

-- CreateTable
CREATE TABLE "User" (
    "discordId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "wizardPoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userRole" "UserRole" NOT NULL DEFAULT 'Visitor',

    CONSTRAINT "User_pkey" PRIMARY KEY ("discordId")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "type" "ResponseType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guild" (
    "guildId" TEXT NOT NULL,
    "guildName" TEXT,
    "usingVerify" BOOLEAN NOT NULL DEFAULT false,
    "verifyChannel" TEXT,
    "joinedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("guildId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
