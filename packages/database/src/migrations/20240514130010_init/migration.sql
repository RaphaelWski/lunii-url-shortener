-- CreateTable
CREATE TABLE "shortUrl" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shortUrl" TEXT NOT NULL DEFAULT nanoid(6),
    "originalUrl" TEXT NOT NULL,
    "nbClicks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "shortUrl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shortUrl_shortUrl_key" ON "shortUrl"("shortUrl");
