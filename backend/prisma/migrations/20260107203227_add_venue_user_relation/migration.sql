-- CreateTable
CREATE TABLE "VenueUser" (
    "userId" INTEGER NOT NULL,
    "venueId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "VenueUser_pkey" PRIMARY KEY ("userId","venueId")
);

-- AddForeignKey
ALTER TABLE "VenueUser" ADD CONSTRAINT "VenueUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueUser" ADD CONSTRAINT "VenueUser_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
