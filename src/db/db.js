import mongoose from "mongoose";

const connectdb = async ()=>{
    try{
       const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
       console.log(`database connected /ndb host = ${connectionInstance.connection.host}`);
    }
catch(error){
    console.log("db not connected",error);
}
    
}

export default connectdb