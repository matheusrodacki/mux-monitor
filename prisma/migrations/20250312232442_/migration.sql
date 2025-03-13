/*
  Warnings:

  - You are about to drop the column `location` on the `CompressionSystem` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CompressionSystem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "lastRun" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_CompressionSystem" ("createdAt", "id", "lastRun", "name", "status", "updatedAt") SELECT "createdAt", "id", "lastRun", "name", "status", "updatedAt" FROM "CompressionSystem";
DROP TABLE "CompressionSystem";
ALTER TABLE "new_CompressionSystem" RENAME TO "CompressionSystem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
