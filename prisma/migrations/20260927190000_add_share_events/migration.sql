CREATE TABLE "ShareEvent" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT,
    "channel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ShareEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ShareEvent_postId_createdAt_idx" ON "ShareEvent"("postId", "createdAt");
ALTER TABLE "ShareEvent" ADD CONSTRAINT "ShareEvent_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ShareEvent" ADD CONSTRAINT "ShareEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
