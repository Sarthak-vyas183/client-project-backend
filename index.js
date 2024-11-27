import dotenv from "dotenv"
import dbConnect from "./src/db/dbConnect"
import { app } from "./app.js"  

dotenv.config({
    path : './.env'
}) 

dbConnect()
.then(()=>{
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is listning at port : ${process.env.PORT}`)
    } )
}).catch((error)=>{
     console.log(`mongodb connection failed : ${error}`)
})
