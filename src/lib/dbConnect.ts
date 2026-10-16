import mongoose from "mongoose";

type connectObject = {
    isConnectd?: number
}

const connection : connectObject = {}

// i does not matter what type of data we will have
export async function dbConnect():Promise<void> {
    if(connection.isConnectd){
        console.log("Already connected to database")
        return
    }

    try {
       const db= await mongoose.connect(process.env.MONGODB_URI || '',{})
        console.log(db.connections)
       connection.isConnectd = db.connections[0].readyState
    

       console.log("db connectd successfully")

    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}