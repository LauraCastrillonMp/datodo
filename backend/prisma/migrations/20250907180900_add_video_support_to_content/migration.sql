/*
  Warnings:

  - You are about to drop the column `complexity` on the `data_structure_content` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `data_structure_content` DROP COLUMN `complexity`,
    ADD COLUMN `duration` INTEGER NULL,
    ADD COLUMN `filePath` VARCHAR(255) NULL;
