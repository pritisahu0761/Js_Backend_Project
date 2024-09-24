import { User } from "../module/user.module.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

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

export { registerUser };
