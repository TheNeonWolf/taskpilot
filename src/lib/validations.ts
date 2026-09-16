import { z } from "zod";

const projectBaseSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required"),

  description: z
    .string()
    .min(1, "Description is required"),

  status: z.enum(["ACTIVE", "COMPLETED"]),
});

const initialProjectTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required"),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),

  dueDate: z
    .string()
    .min(1, "Due date is required"),
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

  dueDate: z
    .string()
    .min(1, "Due date is required"),
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

  dueDate: z
    .string()
    .min(1, "Due date is required")
    .optional(),

  projectId: z
    .number()
    .int()
    .positive("Project ID must be valid")
    .nullable()
    .optional(),
});