import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import footerRouter from './routes/footerRoute.js';
import donationRouter from "./routes/donationRoute.js";
import navigationRouter from "./routes/navigationRoutes.js"

const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

app.use(express.json());
app.use(cors());

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/footer', footerRouter);
app.use('/api/donation', donationRouter);
app.use('/api/navbar', navigationRouter);

app.get('/',(req,res)=>{
    res.send("API is working ecommerce website")
});

app.listen(port, ()=>console.log('server started on port: '+ port));