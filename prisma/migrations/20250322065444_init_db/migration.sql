-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "metric_type" AS ENUM ('distance', 'temperature');

-- CreateEnum
CREATE TYPE "metric_unit" AS ENUM ('meter', 'centimeter', 'inch', 'feet', 'yard', 'celsius', 'fahrenheit', 'kelvin');

-- CreateTable
CREATE TABLE "metric" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" UUID NOT NULL,
    "base_value" DOUBLE PRECISION NOT NULL,
    "type" "metric_type" NOT NULL,
    "date" DATE NOT NULL,
    "is_last_of_date" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "pk_metric" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metric_value" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "metric_id" UUID NOT NULL,
    "value" REAL NOT NULL,
    "unit" "metric_unit" NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "pk_metric_value" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" UUID,
    "updated_by_id" UUID,
    "first_name" VARCHAR(200),
    "last_name" VARCHAR(200),

    CONSTRAINT "pk_user" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_metric_created_user_type" ON "metric"("created_by_id", "type");

-- CreateIndex
CREATE INDEX "idx_metric_created_user_date" ON "metric"("created_by_id", "date");

-- CreateIndex
CREATE INDEX "idx_metric_created_user_type_date" ON "metric"("created_by_id", "type", "date" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "idx_metric_value_metric_unit" ON "metric_value"("metric_id", "unit");

-- AddForeignKey
ALTER TABLE "metric" ADD CONSTRAINT "fk_metric_created_user" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metric_value" ADD CONSTRAINT "fk_metric_value_metric" FOREIGN KEY ("metric_id") REFERENCES "metric"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "fk_user_created_user" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "fk_user_updated_user" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
