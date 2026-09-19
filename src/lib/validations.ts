import { z } from "zod";

const dueDateSchema = z
  .string()
  .min(1, "Due date is required")
  .regex(
    /^\d{4}-\d{2}-\d{2}$/,
    "Due date must be in YYYY-MM-DD format"
  )
  .refine(
    (date) => !Number.isNaN(new Date(date).getTime()),
    "Due date must be a valid date"
  );

const estimatedHoursSchema = z
  .number()
  .positive("Estimated hours must be greater than 0");

const projectBaseSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required"),

  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description cannot exceed 200 characters"),

  status: z.enum(["ACTIVE", "COMPLETED"]),
});

const initialProjectTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required"),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),

  dueDate: dueDateSchema,

  estimatedHours: estimatedHoursSchema.optional(),
});

export const projectCreateSchema = projectBaseSchema.extend({
  tasks: z
    .array(initialProjectTaskSchema)
    .optional()
    .default([]),
});

export const projectUpdateSchema = projectBaseSchema.partial();

export const taskCreateSchema = z.object({
  projectId: z
    .number()
    .int()
    .positive("Project ID must be valid")
    .optional(),

  title: z
    .string()
    .min(1, "Title is required"),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),

  dueDate: dueDateSchema,

  estimatedHours: estimatedHoursSchema.optional(),
});

export const taskUpdateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .optional(),

  status: z
    .enum(["TODO", "IN_PROGRESS", "DONE"])
    .optional(),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH"])
    .optional(),

  dueDate: dueDateSchema.optional(),

  estimatedHours: estimatedHoursSchema
    .nullable()
    .optional(),

  projectId: z
    .number()
    .int()
    .positive("Project ID must be valid")
    .nullable()
    .optional(),
});