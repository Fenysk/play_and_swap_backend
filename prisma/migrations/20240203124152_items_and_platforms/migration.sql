-- CreateEnum
CREATE TYPE "State" AS ENUM ('MINT', 'GOOD', 'AVERAGE', 'BAD', 'BROKEN');

-- CreateEnum
CREATE TYPE "Manufacturer" AS ENUM ('SONY', 'MICROSOFT', 'NINTENDO', 'SEGA', 'ATARI', 'PC', 'OTHER');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('PAL', 'NTSC', 'NTSC_J');

-- CreateTable
CREATE TABLE "Item" (
    "game_id" TEXT NOT NULL,
    "platform_id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "seller_price" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "edition" TEXT NOT NULL DEFAULT 'Standard',
    "region" "Region" NOT NULL,
    "image_url" TEXT NOT NULL,
    "has_game" BOOLEAN NOT NULL DEFAULT false,
    "state_game" "State",
    "has_box" BOOLEAN NOT NULL DEFAULT false,
    "state_box" "State",
    "has_manual" BOOLEAN NOT NULL DEFAULT false,
    "state_manual" "State",
    "has_cover" BOOLEAN NOT NULL DEFAULT false,
    "state_cover" "State",
    "extra_content" TEXT[],
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isSold" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("game_id")
);

-- CreateTable
CREATE TABLE "Platform" (
    "platform_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "release_date" TIMESTAMP(3) NOT NULL,
    "manufacturer" "Manufacturer" NOT NULL,
    "generation" INTEGER NOT NULL,
    "logo_url" TEXT,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("platform_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_game_id_key" ON "Item"("game_id");

-- CreateIndex
CREATE UNIQUE INDEX "Platform_platform_id_key" ON "Platform"("platform_id");

-- CreateIndex
CREATE UNIQUE INDEX "Platform_name_key" ON "Platform"("name");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "Platform"("platform_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
