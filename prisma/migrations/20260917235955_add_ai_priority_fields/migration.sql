-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "estimatedHours" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "PriorityPrediction" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "predictedPriority" "TaskPriority" NOT NULL,
    "finalPriority" "TaskPriority" NOT NULL,
    "estimatedHours" DOUBLE PRECISION,
    "daysUntilDue" INTEGER,
    "activeTaskCount" INTEGER,
    "overdueTaskCount" INTEGER,
    "overridden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriorityPrediction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PriorityPrediction" ADD CONSTRAINT "PriorityPrediction_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
