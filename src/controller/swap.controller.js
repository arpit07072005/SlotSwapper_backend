import { Event } from "../Models/event.model.js";
import { SwapRequest } from "../Models/swapRequest.model.js";

export const getSwappableSlots = async (req, res) => {
  const slots = await Event.find({
    status: "SWAPPABLE",
    user: { $ne: req.user._id },
  }).populate("user", "username email");
  res.json(slots);
};

export const createSwapRequest = async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  const mySlot = await Event.findById(mySlotId);
  const theirSlot = await Event.findById(theirSlotId);

  if (!mySlot || !theirSlot){
    return res.status(404).json({ error: "One or both slots not found" });
console.log(mySlot, theirSlot);
  }
  if (mySlot.status !== "SWAPPABLE" || theirSlot.status !== "SWAPPABLE"){
    return res.status(400).json({ error: "Both slots must be swappable" });
  }

  const swap = await SwapRequest.create({
    fromUser: req.user._id,
    toUser: theirSlot.user,
    mySlot: mySlot._id,
    theirSlot: theirSlot._id,
  });

  mySlot.status = "SWAP_PENDING";
  theirSlot.status = "SWAP_PENDING";
  await mySlot.save();
  await theirSlot.save();

  res.json({
  success: true,
  message: "Swap request created successfully!",
  swap
});
};
export const getIncomingSwapRequests = async (req, res) => {
  try {
    const requests = await SwapRequest.find({ toUser: req.user._id })
      .populate("fromUser", "username email")
      .populate("mySlot")
      .populate("theirSlot");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getOutgoingSwapRequests = async (req, res) => {
  try {
    const requests = await SwapRequest.find({ fromUser: req.user._id })
      .populate("toUser", "username email")
      .populate("mySlot")
      .populate("theirSlot");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const respondToSwap = async (req, res) => {
  const {requestId,  accepted } = req.body;

  const swap = await SwapRequest.findById(requestId)
    .populate("mySlot")
    .populate("theirSlot");

  if (!swap){
  res.status(404).json({ error: "Request not found" });
  }  
  if (accepted) {
    const tempUser = swap.mySlot.user;
    swap.mySlot.user = swap.theirSlot.user;
    swap.theirSlot.user = tempUser;

    swap.mySlot.status = "BUSY";
    swap.theirSlot.status = "BUSY";
    swap.status = "ACCEPTED";

    await swap.mySlot.save();
    await swap.theirSlot.save();
  } else {
    swap.status = "REJECTED";
    swap.mySlot.status = "SWAPPABLE";
    swap.theirSlot.status = "SWAPPABLE";
    await swap.mySlot.save();
    await swap.theirSlot.save();
  }
  await swap.save();
  res.json(swap);
};
