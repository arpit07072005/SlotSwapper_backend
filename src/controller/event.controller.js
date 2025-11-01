import { Event } from "../Models/event.model.js";

export const createEvent = async (req, res) => {
  console.log("Request Body for Creating Event:", req.body);
  try {
    const { title, startTime, endTime, status } = req.body;
if(!title || !startTime || !endTime){
    return res.status(400).json({error: "Title, Start Time and End Time are required"});
}
const event = await Event.create({
  title,
  startTime: new Date(startTime),
  endTime: new Date(endTime),
  status: status || "Busy",
  user: req.user._id,
});

console.log("Created Event:", event);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user._id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
