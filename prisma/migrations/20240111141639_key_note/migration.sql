-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('GOOGLE', 'LOCAL');

-- CreateTable
CREATE TABLE "Session" (
    "sid" VARCHAR(255) NOT NULL,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "provider" "Provider" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hive" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "userId" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Hive_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Hive" ADD CONSTRAINT "Hive_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
