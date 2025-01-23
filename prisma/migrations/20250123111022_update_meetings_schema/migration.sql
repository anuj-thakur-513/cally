/*
  Warnings:

  - You are about to drop the `Meetings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Meetings" DROP CONSTRAINT "Meetings_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "Meetings" DROP CONSTRAINT "Meetings_sender_id_fkey";

-- DropTable
DROP TABLE "Meetings";

-- CreateTable
CREATE TABLE "meetings" (
    "id" SERIAL NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "receiver_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "meet_link" TEXT NOT NULL DEFAULT '',
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meetings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "meetings_id_key" ON "meetings"("id");

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
