import {Router} from "express"
import { registerUser } from "../controllers/user.js"
import {upload} from "../middleware/multer.js"

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


//router.post('/register', upload.fields([{ name: 'avatar' }, { name: 'coverImage' }]), registerUser);

export default router