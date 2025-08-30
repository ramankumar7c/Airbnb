/*
  Warnings:

  - Added the required column `bathroomCount` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestCount` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomCount` to the `reservations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."reservations" ADD COLUMN     "bathroomCount" INTEGER NOT NULL,
ADD COLUMN     "guestCount" INTEGER NOT NULL,
ADD COLUMN     "roomCount" INTEGER NOT NULL;
