CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Favorite_userId_postId_key" ON "Favorite"("userId", "postId");
CREATE INDEX "Favorite_userId_createdAt_idx" ON "Favorite"("userId", "createdAt");
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
