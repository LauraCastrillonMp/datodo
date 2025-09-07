-- CreateTable
CREATE TABLE `video_content` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dataStructureId` INTEGER NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `filePath` VARCHAR(255) NOT NULL,
    `duration` INTEGER NOT NULL,
    `thumbnailPath` VARCHAR(255) NULL,
    `videoType` ENUM('animation', 'explanation', 'tutorial', 'demonstration') NOT NULL DEFAULT 'animation',
    `difficulty` ENUM('principiante', 'intermedio', 'avanzado') NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    INDEX `video_content_dataStructureId_idx`(`dataStructureId`),
    INDEX `video_content_videoType_idx`(`videoType`),
    INDEX `video_content_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `video_content` ADD CONSTRAINT `video_content_dataStructureId_fkey` FOREIGN KEY (`dataStructureId`) REFERENCES `data_structures`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
