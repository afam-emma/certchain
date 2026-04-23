-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "certHash" TEXT NOT NULL,
    "qrCode" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bgImage" TEXT NOT NULL,
    "fontFamily" TEXT NOT NULL,
    "fontSize" INTEGER NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_certHash_key" ON "Certificate"("certHash");

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
