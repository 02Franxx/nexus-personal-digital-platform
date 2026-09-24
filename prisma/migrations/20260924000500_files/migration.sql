CREATE TABLE "FileRecord" (
    "id" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FileRecord_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "FileRecord_storageKey_key" ON "FileRecord"("storageKey");
CREATE INDEX "FileRecord_userId_createdAt_idx" ON "FileRecord"("userId", "createdAt");
ALTER TABLE "FileRecord" ADD CONSTRAINT "FileRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
