-- CreateTable
CREATE TABLE "callback" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT NOT NULL,
    "payload" TEXT NOT NULL DEFAULT '{}',

    CONSTRAINT "callback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "direct_post_url" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "callback_url" TEXT,
    "status" TEXT NOT NULL,
    "purchaseId" UUID NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_purchaseId_key" ON "payment"("purchaseId");

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
