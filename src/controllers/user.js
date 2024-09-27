import { User } from "../module/user.module.js";
import {AsyncHandler} from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";



const  generateAccessAndRefereshToken = async(userId) =>{
  try {
    const user =await User.findById(userId)
    const accessToken= user.generateAccessToken()
    const refreshToken=user.generateREFRESHGToken()

 //It assigns a new refreshToken to the user object.
    user.refreshToken =  refreshToken
    await user.save({validateBeforeSave : false})

    return {accessToken,refreshToken}
  }



  catch(error){
    throw new ApiError(500 , "Something went wrong while generating referesh and access token")

  }
}

const registerUser = AsyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;
  console.log(req.body);

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all filed are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "user with email and username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;


  let coverImageLocalPath ;
  if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length >0){
    coverImageLocalPath =req.files.coverImage[0].path
  }


  //console.log(req.files)

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is requried");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

//   console.log("body", req.body);
//   console.log("files", req.files);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is requried");
  }

  // database field

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createUser = await User.findById(user._id).select(
    " -password -refreshToken",
  );

  if (!createUser) {
    throw new ApiError(500, "Somethinh went wrong while register the User");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createUser, "user register successfully"));
});


const loginUser =AsyncHandler(async(req,res) =>{

  const {email,username,password} =req.body;
  
  if(!(email || username)){
    throw new ApiError(400,"email and username are required")
  }

  const user =await User.findOne({
    $or : [{username} ,{email}]
  })

  if(!user){
    throw new ApiError(400,"user does not exist") 
  }

  const isPasswordVaild = await user.isPasswordCorrect(password)

  if(! isPasswordVaild){
    throw new ApiError(401  ,"Password is wrong")
  }

  const {accessToken,refreshToken} =await generateAccessAndRefereshToken(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly : true,
    secure : true
  }

return res
.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
  new ApiResponse(
    200,{
      user : loggedInUser,accessToken,refreshToken
    },
    "user logged in Successfully"
  )
)
})

const logoutUser =AsyncHandler(async (req ,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set :{
        refreshToken : undefined
      }
    },
    {
      new :true
    }
  )

  const options = {
    httpOnly : true,
    secure : true
  }

  return res 
  .status(200)
  .clear.Cookie("accessToken",options)
  .clear.Cookie("refreshToken",options)
  .json(new ApiResponse(200,{},"User logged Out"))
})

export { registerUser,
  loginUser,
  logoutUser

 };
