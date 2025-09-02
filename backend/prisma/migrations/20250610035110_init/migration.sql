-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'teacher', 'student') NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL,
    `deletedAt` TIMESTAMP(0) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_structures` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `difficulty` ENUM('principiante', 'intermedio', 'avanzado') NOT NULL,
    `createdBy` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL,
    `deletedAt` TIMESTAMP(0) NULL,

    INDEX `data_structures_createdBy_idx`(`createdBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_structure_content` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dataStructureId` INTEGER NOT NULL,
    `contentType` ENUM('general', 'property', 'operation', 'application', 'resource') NOT NULL,
    `format` ENUM('text', 'video', 'image', 'link') NOT NULL DEFAULT 'text',
    `category` VARCHAR(100) NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `complexity` VARCHAR(20) NULL,
    `updatedAt` TIMESTAMP(0) NULL,

    INDEX `data_structure_content_dataStructureId_idx`(`dataStructureId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `content_edit_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contentId` INTEGER NOT NULL,
    `editedBy` INTEGER NOT NULL,
    `editedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `changesSummary` TEXT NULL,

    INDEX `content_edit_log_contentId_idx`(`contentId`),
    INDEX `content_edit_log_editedBy_idx`(`editedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quizzes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dataStructureId` INTEGER NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `difficulty` ENUM('principiante', 'intermedio', 'avanzado') NOT NULL,
    `createdBy` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL,
    `deletedAt` TIMESTAMP(0) NULL,

    INDEX `quizzes_dataStructureId_idx`(`dataStructureId`),
    INDEX `quizzes_createdBy_idx`(`createdBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_questions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quizId` INTEGER NOT NULL,
    `questionText` TEXT NOT NULL,
    `questionType` ENUM('multiple_choice', 'true_false', 'code', 'fill_blank') NOT NULL,
    `explanation` TEXT NULL,
    `order` INTEGER NOT NULL,
    `updatedAt` TIMESTAMP(0) NULL,

    INDEX `quiz_questions_quizId_idx`(`quizId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `question_options` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `questionId` INTEGER NOT NULL,
    `optionText` TEXT NOT NULL,
    `isCorrect` BOOLEAN NOT NULL DEFAULT false,
    `order` INTEGER NOT NULL,
    `updatedAt` TIMESTAMP(0) NULL,

    INDEX `question_options_questionId_idx`(`questionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_quiz_attempts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `quizId` INTEGER NOT NULL,
    `score` DECIMAL(5, 2) NOT NULL,
    `completedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL,

    INDEX `user_quiz_attempts_quizId_idx`(`quizId`),
    INDEX `user_quiz_attempts_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_edit_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quizId` INTEGER NOT NULL,
    `editedBy` INTEGER NOT NULL,
    `editedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `changesSummary` TEXT NULL,

    INDEX `quiz_edit_log_quizId_idx`(`quizId`),
    INDEX `quiz_edit_log_editedBy_idx`(`editedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `data_structures` ADD CONSTRAINT `data_structures_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `data_structure_content` ADD CONSTRAINT `data_structure_content_dataStructureId_fkey` FOREIGN KEY (`dataStructureId`) REFERENCES `data_structures`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `content_edit_log` ADD CONSTRAINT `content_edit_log_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `data_structure_content`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `content_edit_log` ADD CONSTRAINT `content_edit_log_editedBy_fkey` FOREIGN KEY (`editedBy`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quizzes` ADD CONSTRAINT `quizzes_dataStructureId_fkey` FOREIGN KEY (`dataStructureId`) REFERENCES `data_structures`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quizzes` ADD CONSTRAINT `quizzes_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_questions` ADD CONSTRAINT `quiz_questions_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `quizzes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question_options` ADD CONSTRAINT `question_options_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `quiz_questions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_quiz_attempts` ADD CONSTRAINT `user_quiz_attempts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_quiz_attempts` ADD CONSTRAINT `user_quiz_attempts_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `quizzes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_edit_log` ADD CONSTRAINT `quiz_edit_log_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `quizzes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_edit_log` ADD CONSTRAINT `quiz_edit_log_editedBy_fkey` FOREIGN KEY (`editedBy`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
