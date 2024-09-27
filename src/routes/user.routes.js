import {Router} from "express"
import { loginUser, registerUser ,logoutUser} from "../controllers/user.js"
import {upload} from "../middleware/multer.js"
import jwt from 'jsonwebtoken';
import { verifyJWT  } from "../middleware/aoth.middleware.js"

const router =Router()

router.route("/register").post(
    upload.fields(
        [
            {
                name: "avatar",
                maxCount: 1
            },
            {
                name : "coverImage",
                maxCount :1
            }
        ]
    ) ,
    registerUser)


router.route("/login").post(loginUser)

// securd routes
router.route("/logout").post(verifyJWT,logoutUser)


//router.post('/register', upload.fields([{ name: 'avatar' }, { name: 'coverImage' }]), registerUser);

export default router