/*
  Warnings:

  - You are about to drop the column `name` on the `Mux` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Mux" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ipAddress" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "systemId" INTEGER NOT NULL,
    CONSTRAINT "Mux_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "CompressionSystem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Mux" ("createdAt", "id", "ipAddress", "status", "systemId", "type", "updatedAt") SELECT "createdAt", "id", "ipAddress", "status", "systemId", "type", "updatedAt" FROM "Mux";
DROP TABLE "Mux";
ALTER TABLE "new_Mux" RENAME TO "Mux";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
