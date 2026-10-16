import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";

import {Message} from "@/model/User"

export async function POST(request:Request) {
    dbConnect()

    const {username,content} = await request.json()


    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success:false,
                message:"user not found",
            },{status:404})
        }

        // is user accepting msg
        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"User is not accepting",
            },{status:404})
        }

        const newMsg = {content,createdAt:new Date()}
        user.messages.push(newMsg as Message)
        await user.save()
        return Response.json({
                success:true,
                message:"Message send successfully",
            },{status:200})

    } catch (error) {
        console.log(error)
        return Response.json({
                success:false,
                message:"error at sending message",
            },{status:404})
    }
}