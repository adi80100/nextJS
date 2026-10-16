import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
VerificationEmail

import {ApiResponse} from "@/types/ApiRespone"

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
) :Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from:'onboarding@resend.dev',
            to: email,
            subject: 'Hello world',
            react:VerificationEmail({username,otp:verifyCode}),
            
        });
        
        return {
        success: true,
        message: "Verification email sent successfully",
        }; 

    } catch (error) {
       console.log(error) 
       return {success:false,
        message:'failed to send verification email'}
    }
}