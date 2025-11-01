import express from 'express'
import cors from 'cors'
import userrouter from './Routes/user.router.js';
import cookieParser from 'cookie-parser';
import eventrouter from './Routes/event.route.js';
import swaprouter from './Routes/swap.route.js';
const app = express();

app.use(cors({
    origin: "https://slot-swapper-theta.vercel.app",
    credentials: true
}))
app.set("trust proxy",1)
app.use(express.json({limit: "1mb"}))
app.use(cookieParser())

app.use("/api/v1/user",userrouter);
app.use("/api/v1/event",eventrouter);
app.use("/api/v1/swap",swaprouter);

 export default app