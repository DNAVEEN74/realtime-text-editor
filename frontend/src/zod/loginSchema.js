import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email().min(1, {message: "Invalid email"}),
    password: z.string().min(8, {message: 'Password must be at least 8 characters long'})
});

const signUpSchema = z.object({
    fullName: z.string().min(1, {message: "Full name is required"}),
    email: z.string().email().min(1,{message: "Invalid email"}),
    password: z.string().min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
})

export {
    loginSchema,
    signUpSchema
}