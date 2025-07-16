import { z } from 'zod';

/**
 * Validation schema for task creation and editing
 */
export const taskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less')
    .trim(),
  description: z.string()
    .max(500, 'Description must be 500 characters or less')
    .optional(),
  quadrant: z.enum(['urgent-important', 'not-urgent-important', 'urgent-not-important', 'not-urgent-not-important']),
  priority: z.enum(['low', 'medium', 'high']),
  completed: z.boolean().default(false),
  tags: z.array(z.string().trim().min(1)).default([]),
  dueDate: z.date().optional(),
});

/**
 * Validation schema for user registration
 */
export const userRegistrationSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required')
    .max(100, 'Email must be 100 characters or less')
    .trim()
    .toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password must be 100 characters or less')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
  name: z.string()
    .min(1, 'Name is required')
    .max(50, 'Name must be 50 characters or less')
    .trim(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

/**
 * Validation schema for user login
 */
export const userLoginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required')
    .trim()
    .toLowerCase(),
  password: z.string()
    .min(1, 'Password is required'),
});

/**
 * Validation schema for forgot password
 */
export const forgotPasswordSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required')
    .trim()
    .toLowerCase(),
});

/**
 * Validation schema for search filters
 */
export const searchFilterSchema = z.object({
  searchTerm: z.string().max(100, 'Search term must be 100 characters or less').trim(),
  priority: z.enum(['all', 'low', 'medium', 'high'] as const),
  showCompleted: z.boolean(),
  quadrant: z.enum(['all', 'urgent-important', 'not-urgent-important', 'urgent-not-important', 'not-urgent-not-important'] as const).optional(),
});

/**
 * Validation schema for user profile updates
 */
export const userProfileSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(50, 'Name must be 50 characters or less')
    .trim(),
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required')
    .max(100, 'Email must be 100 characters or less')
    .trim()
    .toLowerCase(),
  currentPassword: z.string()
    .min(1, 'Current password is required')
    .optional(),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password must be 100 characters or less')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .optional(),
  confirmNewPassword: z.string()
    .optional(),
}).refine((data) => {
  // If newPassword is provided, confirmNewPassword must match
  if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
    return false;
  }
  return true;
}, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"],
}).refine((data) => {
  // If newPassword is provided, currentPassword must be provided
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "Current password is required when changing password",
  path: ["currentPassword"],
});

/**
 * Validation schema for export options
 */
export const exportOptionsSchema = z.object({
  format: z.enum(['csv', 'pdf'] as const),
  includeCompleted: z.boolean(),
  quadrants: z.array(z.enum(['urgent-important', 'not-urgent-important', 'urgent-not-important', 'not-urgent-not-important'] as const)),
  dateRange: z.object({
    start: z.date().optional(),
    end: z.date().optional(),
  }).optional(),
});

// Type exports for TypeScript
export type TaskFormData = z.infer<typeof taskSchema>;
export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;
export type UserLoginData = z.infer<typeof userLoginSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type SearchFilterData = z.infer<typeof searchFilterSchema>;
export type UserProfileData = z.infer<typeof userProfileSchema>;
export type ExportOptionsData = z.infer<typeof exportOptionsSchema>;

/**
 * Helper function to validate data against a schema
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Validation result with success flag and data or errors
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
} {
  try {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        errors[path] = issue.message;
      });
      
      return {
        success: false,
        errors,
      };
    }
  } catch (error) {
    return {
      success: false,
      errors: { general: 'Validation error occurred' },
    };
  }
}

/**
 * Helper function to get validation error messages in a user-friendly format
 * @param errors Error object from validation
 * @returns Array of error messages
 */
export function getErrorMessages(errors: Record<string, string>): string[] {
  return Object.values(errors);
}

/**
 * Helper function to check if a field has validation errors
 * @param fieldName Name of the field to check
 * @param errors Error object from validation
 * @returns Boolean indicating if field has errors
 */
export function hasFieldError(fieldName: string, errors?: Record<string, string>): boolean {
  return errors ? fieldName in errors : false;
}

/**
 * Helper function to get error message for a specific field
 * @param fieldName Name of the field
 * @param errors Error object from validation
 * @returns Error message for the field or undefined
 */
export function getFieldError(fieldName: string, errors?: Record<string, string>): string | undefined {
  return errors?.[fieldName];
}