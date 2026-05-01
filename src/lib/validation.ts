import { z } from 'zod';

export const createComplaintSchema = z.object({
  category_id: z.coerce.number().int().positive('Please select a category.'),
  description: z.string().min(10, 'Description must be at least 10 characters.').max(1000),
});

export const updateStatusSchema = z.object({
  complaint_id: z.coerce.number().int().positive(),
  new_status: z.enum(['Assigned', 'In_Progress', 'Resolved', 'Reopened']),
  note: z.string().max(500).optional(),
});

export const assignComplaintSchema = z.object({
  complaint_id: z.coerce.number().int().positive(),
  staff_id: z.coerce.number().int().positive('Please select a staff member.'),
});

export const createStudentSchema = z.object({
  name: z.string().min(2).max(100),
  room_no: z.string().min(1).max(10),
  hostel_id: z.coerce.number().int().positive('Please select a hostel.'),
  contact: z.string().regex(/^\d{10}$/, 'Contact must be a 10-digit number.'),
});

export const createStaffSchema = z.object({
  name: z.string().min(2).max(100),
  role: z.string().min(2).max(100),
  contact: z.string().regex(/^\d{10}$/, 'Contact must be a 10-digit number.'),
});

export const createHostelSchema = z.object({
  hostel_name: z.string().min(2).max(100),
  block: z.string().min(1).max(10),
  capacity: z.coerce.number().int().positive('Capacity must be a positive number.'),
});

export const createCategorySchema = z.object({
  category_name: z.string().min(2).max(100),
});

export type CreateComplaintInput = z.infer<typeof createComplaintSchema>;
export type UpdateStatusInput    = z.infer<typeof updateStatusSchema>;
export type AssignComplaintInput = z.infer<typeof assignComplaintSchema>;
