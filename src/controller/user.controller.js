
import { User } from "../Models/user.model.js";

const generateToken = async (userid)=>{
    try{
        const user = await User.findById(userid)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken =refreshToken;
       await user.save({validateBeforeSave: false})
       return {accessToken,refreshToken}
    }catch(error){
        return error;
    }
}

const userRegister = async(req,res)=>{
    const {email,password,username} =  req.body;

    if( !email ||  !password || !username){
       return res.status(410).json({error:"please provide all details for registration"});
    }
   const existeduser = await User.findOne({
    $or: [{username,email}]
   });
   if(existeduser){
    return res.status(400).json({error:'user already existed with username or email'});
   }
   const newuser = await User.create({
    email,
    password,
    username
   })
const createduser = await User.findById(newuser._id).select(
    "-password"
)
if(!createduser){
    return res.status(510).json({error:"something went wrong in db"})
}
res.status(215).json({Message:"user created successfully"});
}

const userlogin= async (req,res)=>{
const {email,password}=req.body

if(!password || !email ){
    return res.status(415).json({error:"please provide the email and password for login"});
}

const finduser = await User.findOne({
    $or: [{email}]
})
if(!finduser){
    return res.status(425).json({error:"user not found with provide email and password"})
}
 const verifypassword= await finduser.ispasswordcorrect(password);
  if(!verifypassword){
    return res.status(400).json({error:"password is incorrect"})
 }
 const {accessToken,refreshToken}= await generateToken(finduser._id);
 const loggedinUser = await User.findById(finduser._id).select("-password -refreshToken");
 const options ={
    httpOnly: true,
    secure : true,
    sameSite:"lax",
    maxAge: 24*60*60*1000
 }
   return res
   .status(220)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json({message:"user login successfully",user:loggedinUser,accessToken:accessToken,refreshtoken:refreshToken});
}

const userlogout = async (req, res) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, { refreshToken: "" });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Something went wrong during logout" });
  }
};
const myself = async(req,res)=>{
    const userid =req.user._id
    if (!userid) {
      return res.status(401).json({ message: "Unauthorized, no token" });
    }

    try {
        const user = await User.findById(userid).select("-password -refreshToken");
        res.json({user});
    } catch (error) {
         res.status(500).json({ error: "Something went wrong" });
    }
}


export {userRegister,userlogin,userlogout,myself}
