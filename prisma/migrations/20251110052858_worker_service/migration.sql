/*
  Warnings:

  - You are about to drop the `worker_service_price` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `worker_service_price` DROP FOREIGN KEY `worker_service_price_serviceId_fkey`;

-- DropForeignKey
ALTER TABLE `worker_service_price` DROP FOREIGN KEY `worker_service_price_userId_fkey`;

-- DropTable
DROP TABLE `worker_service_price`;

-- CreateTable
CREATE TABLE `worker_service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `serviceId` INTEGER NOT NULL,
    `price` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `worker_service` ADD CONSTRAINT `worker_service_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `worker_service` ADD CONSTRAINT `worker_service_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
