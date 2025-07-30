import express from 'express'
import cors from 'cors'
import connectDB from './config/mongodb.js';
import userRoute from './Route/userRoute.js';
import transactionRoute from './Route/transactionRoute.js';

//App config
const app=express();
const port= process.env.PORT || 5000
connectDB()

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

//api endpoint
app.use('/api/user',userRoute)
app.get('/',(req,res)=>{
    res.send('api working')
})
app.use('/api/transaction',transactionRoute)

app.listen(port,()=>console.log("server started at "+port))