ALTER TABLE "Movie"
ADD COLUMN "deletedAt" TIMESTAMPTZ;

CREATE INDEX "Movie_deletedAt_idx" ON "Movie"("deletedAt");
