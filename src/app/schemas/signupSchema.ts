import {z} from "zod"

export const usernameValdidation =z 
        .string()
        .min(2,"username should be atlest 2 characters")
        .max(20,"Usernmae should not be more than 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/,"Usrnmae must not contian special characters")

export const signupSchema = z.object({
    username : usernameValdidation,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:"password must be atlest 6 characters"}),
    

})