import express  from "express"
import { updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";



const router = express.Router();

router.get("/test", ()=>{
    console.log('Hello from the API endpoint!');
})
router.post("/update/:id", verifyToken, updateUser)

export default router;

