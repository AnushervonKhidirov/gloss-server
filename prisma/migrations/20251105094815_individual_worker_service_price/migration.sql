/*
  Warnings:

  - You are about to drop the column `date` on the `queue` table. All the data in the column will be lost.
  - Added the required column `end_at` to the `queue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_at` to the `queue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `queue` DROP COLUMN `date`,
    ADD COLUMN `end_at` DATETIME(3) NOT NULL,
    ADD COLUMN `start_at` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `worker_service_price` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `serviceId` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `worker_service_price` ADD CONSTRAINT `worker_service_price_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `worker_service_price` ADD CONSTRAINT `worker_service_price_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
