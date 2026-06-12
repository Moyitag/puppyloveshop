import mongoose from "mongoose";
import {config} from "./src/config.js";
mongoose.connect(config.db.URI);
 const connection = mongoose.connection;
    connection.once("open",()=>{
        console.log("connected")
    })
    connection.on("disconnect",()=>{
        console.log("disconnected")
    })
    connection.on("error",(error)=>{
        console.log("error"+ error)
    })