import express from 'express';
import connectDB from './Database/db_connect.js';
import router from './Routes/route.js';
const app=express();
 await connectDB();

app.use(express.json());

app.use("/",router);


app.listen(5000,()=>{
    console.log('Server is running on port 5000');
}       
)