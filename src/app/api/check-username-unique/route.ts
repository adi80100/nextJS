import { usernameValdidation } from "@/app/schemas/signupSchema";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {success, z} from "zod";

const UsernameQuerySchema = z.object({
    username:usernameValdidation
})

export async function GET(request:Request) {

    
    await dbConnect()

    try {
        // inorder to take query paramsters from url

        // this is complete url
        const {searchParams} = new URL(request.url)
        // find out the query from search params

        const queryParams = {
            username:searchParams.get('username')
        }
        // validate with zod
      const result =   UsernameQuerySchema.safeParse(queryParams)
      console.log("result is : ",result)
      if(!result.success){
         const usernameErrors = result.error.format().username?._errors||[]
         return Response.json({
            success:false,
            message:usernameErrors.length>0?usernameErrors.join(', '):"invlaid query parametes",
         },{status:400})
      }
      const {username} = result.data
   const existingVerifiedUser = await   UserModel.findOne({username,isVerified:true})

   if(existingVerifiedUser){
        return Response.json({
                success:false,
                message:"usernme is already taken",

            },
        {status:400})
   }

   return Response.json({
                success:true,
                message:"username is unique",

            },
        {status:200})

       
    } catch (error) {
        console.log(error)
        return Response.json({
            success:false,
            message:"invalid query parametrs",

        },
    {status:500})
    }
}