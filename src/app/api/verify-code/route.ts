
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";



export async function POST(request:Request) {
    await dbConnect()

    try {

        const {username,code} = await request.json()
        // used for url we can use decodedURICompoment
     const decodedUsername=   decodeURIComponent(username)
    const user=  await UserModel.findOne({username:decodedUsername})
    if(!user){
        return Response.json({
            success:false,
            message:"user not found",

        },
    {status:500})
    }

    console.log("Stored OTP:", user.verifyCode);
    console.log("Received OTP:", code);
    console.log("Stored OTP type:", typeof user.verifyCode);
    console.log("Received OTP type:", typeof code);

    const isCodeValid = user.verifyCode ===code
    const isCodeNotExpired = new Date(user.verifyCodeExpiry)>new Date()
    console.log(isCodeValid)
    console.log(isCodeNotExpired)
    if(isCodeValid && isCodeNotExpired){
        user.isVerified=true
        await user.save()

        return Response.json({
            success:true,
            message:"account verified successfully",

        },
        {status:200})
    }

    else if(!isCodeNotExpired){
        return Response.json({
            success:false,
            message:"verificaton code expired please sing up  ",

        },
        {status:200})
    }
    else{
        return Response.json({
            success:false,
            message:" incorrect verfiicatin code  ",

        },
        {status:200})
    }

    } catch (error) {
        console.log(error)
        return Response.json({
            success:false,
            message:"invalid query parametrs",

        },
    {status:500})
    }
}