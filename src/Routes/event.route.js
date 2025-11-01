import { Router } from "express";
import {createEvent, getMyEvents} from "../controller/event.controller.js";
import { verifyjwt } from "../middleware/auth.middleware.js";
const router = Router();
router.route("/create").post(verifyjwt, createEvent);
router.route("/myevents").get(verifyjwt, getMyEvents);
export default router