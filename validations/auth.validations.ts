import z from 'zod';

export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().pipe(z.email({ message: '"Please enter a valid email' })),
    password: z.string().trim().min(8, { message: 'Password must be at least 8 characters long' }),
})

export type LoginFormSchemaType = z.infer<typeof loginSchema>;