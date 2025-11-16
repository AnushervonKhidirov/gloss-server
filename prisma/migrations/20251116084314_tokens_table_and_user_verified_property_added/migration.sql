-- DropForeignKey
ALTER TABLE `worker_service` DROP FOREIGN KEY `worker_service_serviceId_fkey`;

-- DropForeignKey
ALTER TABLE `worker_service` DROP FOREIGN KEY `worker_service_userId_fkey`;

-- DropIndex
DROP INDEX `worker_service_serviceId_fkey` ON `worker_service`;

-- DropIndex
DROP INDEX `worker_service_userId_fkey` ON `worker_service`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `verified` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `tokens` (
    `refresh_token` VARCHAR(255) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `expired_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `tokens_refresh_token_key`(`refresh_token`),
    PRIMARY KEY (`refresh_token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `worker_service` ADD CONSTRAINT `worker_service_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `worker_service` ADD CONSTRAINT `worker_service_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tokens` ADD CONSTRAINT `tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
