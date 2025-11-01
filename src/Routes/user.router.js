import { Router } from "express";
import { myself, userlogin, userlogout, userRegister } from "../controller/user.controller.js";
import { verifyjwt } from "../middleware/auth.middleware.js";
const router = Router();
router.route("/signup").post(userRegister);
router.route("/login").post(userlogin);
router.route("/logout").post(verifyjwt,userlogout);
router.route("/myself").post(verifyjwt,myself);
export default router