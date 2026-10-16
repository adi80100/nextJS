import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from 'next-auth'
import mongoose from "mongoose";

export async function GET(request:Request) {
    await dbConnect()
    const session =  await getServerSession(authOptions)
    const user : User =  session?.user as User

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },{status:401})
    }
    // now in order to get id getById will handle theose string and other issue
    // but when using aggregation we need to define it using mongoose

    const userId = await new mongoose.Types.ObjectId(user._id)
    console.log("Session user:", session.user);
console.log("Session user ID:", session.user._id);
console.log("Converted ObjectId:", userId);
// const foundUser = await UserModel.findById(userId);

// console.log("Found user:", foundUser);
// console.log("Database name:", UserModel.db.name);
// console.log("Collection name:", UserModel.collection.name);
    try {
        const user = await UserModel.aggregate([
            {
                $match:{_id:userId}
            },
            // unwind is used to sepaerate the conetent in differnt object of the same user
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{
                _id:'$_id',
                messages:{$push:'$messages'}
            }}
        ])

        if(!user || user.length===0){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:401}) 
        }

        return Response.json({
                success:true,
                messages:user[0].messages
            },{status:200}) 
    } catch (error) {
        console.log(error)
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },{status:401})
    }

}