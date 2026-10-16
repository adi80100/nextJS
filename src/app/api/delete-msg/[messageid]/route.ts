import { dbConnect } from "@/lib/dbConnect"
import { getServerSession, User } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options"
import UserModel from "@/model/User"

export async function DELETE(request:Request,{params}:{params:{messageid:string}}){
    
        const messageId = params.messageid
        await dbConnect()
        const session = await getServerSession(authOptions)
        const user:User = session?.user as User
        if(!session || !session.user){
             return Response.json({
            success:false,
            message:"Not authenticated",

        },{status:401})


        }
    try{
        // as we need remove one value and rest remain as it is
        // each docmumet is being sited inside that array so now we need to delte that one documet
     const updatedResult =    await UserModel.updateOne({_id:user._id},{$pull:{messages:{_id:messageId}}})

        if(updatedResult.modifiedCount===0){
            return Response.json({
            success:false,
            message:"MEssage not found or already deleted",

        },{status:404})
        }

        return Response.json({
            success:true,
            message:"MEssage deleted",

        },{status:201})

    } catch (error) {
        console.log(error)
        return Response.json({
            success:false,
            message:"error deleting messages",

        },{status:500})
        
    }
}