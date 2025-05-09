import express from 'express';
import { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyStripe, verifyRazorpay,totalRevenue, totalOrdersCount } from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

//Admin
orderRouter.post('/list',adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

//user 
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.post('/razorpay', authUser, placeOrderRazorpay);

orderRouter.post('/userorders', authUser, userOrders);
orderRouter.get('/revenue', adminAuth, totalRevenue);
orderRouter.get('/orders-count', adminAuth, totalOrdersCount);

//verify payment
orderRouter.post('/verifyStripe', authUser, verifyStripe);
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay);

export default orderRouter;