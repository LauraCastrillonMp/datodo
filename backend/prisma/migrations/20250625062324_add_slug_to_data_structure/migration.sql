/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `data_structures` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `data_structures` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `data_structures` ADD COLUMN `slug` VARCHAR(100);

UPDATE `data_structures` SET `slug` = LOWER(REPLACE(`title`, ' ', '-')) WHERE `slug` IS NULL;

ALTER TABLE `data_structures` MODIFY COLUMN `slug` VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `data_structures_slug_key` ON `data_structures`(`slug`);
