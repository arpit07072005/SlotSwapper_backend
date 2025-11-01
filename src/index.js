import app from './app.js'
import dotenv from 'dotenv'
import connectdb from './db/db.js'

dotenv.config({
    path:'./.env'
})
connectdb()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`system is running on ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

