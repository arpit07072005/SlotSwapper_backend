import express from "express";
import { verifyjwt } from "../middleware/auth.middleware.js";
import {
  getSwappableSlots,
  createSwapRequest,
  respondToSwap,
  getIncomingSwapRequests,
  getOutgoingSwapRequests,
} from "../controller/swap.controller.js";
  
const router = express.Router();

router.route("/swappable-slots").get(verifyjwt,getSwappableSlots);
router.route("/swaprequest").post(verifyjwt,createSwapRequest);
router.route("/swapresponse").post(verifyjwt,respondToSwap);
router.route('/swapincoming').get(verifyjwt, getIncomingSwapRequests);
router.route('/swapoutgoing').get(verifyjwt, getOutgoingSwapRequests);

export default router;
