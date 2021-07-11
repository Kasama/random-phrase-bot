-- CreateTable
CREATE TABLE "Phrase" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "author" TEXT,
    "content" TEXT NOT NULL,
    "chat" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);
