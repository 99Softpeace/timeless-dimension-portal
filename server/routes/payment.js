const express = require('express');
const router = express.Router();
const Flutterwave = require('flutterwave-node-v3');
const { v4: uuidv4 } = require('uuid');
const Order = require('../models/Order');
const User = require('../models/User'); // Assuming you might need user info
const auth = require('../middleware/auth'); // If you want to protect routes

// Initialize Flutterwave
// Ideally, these keys should come from process.env
const flw = new Flutterwave(
    process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY,
    process.env.FLW_SECRET_KEY
);

// POST /api/payment/initialize
router.post('/initialize', async (req, res) => {
    try {
        const { amount, currency, email, phonenumber, name, user_id } = req.body;

        // payload logic
        const payload = {
            tx_ref: uuidv4(),
            amount,
            currency,
            payment_options: "card, mobilemoneyghana, ussd", // add more as needed
            redirect_url: `${process.env.FRONTEND_URL}/payment/callback`, // Callback URL on frontend
            customer: {
                email,
                phonenumber,
                name,
            },
            meta: {
                user_id,
            },
            customizations: {
                title: "Timeless Dimension Portal",
                description: "Payment for items in cart",
                logo: "https://assets.piedpiper.com/logo.png", // Replace with your logo
            },
        };

        const response = await flw.Payment.standard(payload);
        res.status(200).json({
            success: true,
            data: response.data,
            message: "Payment initialized successfully"
        });

    } catch (error) {
        console.error("Payment initialization error:", error);
        res.status(500).json({
            success: false,
            message: "Payment initialization failed",
            error: error.message
        });
    }
});

// GET /api/payment/verify
// This is often called by the frontend after redirect, or you check transaction status
router.get('/verify', async (req, res) => {
    try {
        const { transaction_id } = req.query;

        if (!transaction_id) {
            return res.status(400).json({ success: false, message: "Transaction ID required" });
        }

        const response = await flw.Transaction.verify({ id: transaction_id });

        if (response.data.status === "successful") {
            // Success! 
            // Here you would typically update the Order status in your DB.
            // For now, we return the success response.
            res.status(200).json({
                success: true,
                data: response.data,
                message: "Payment verified successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Payment not successful",
                data: response.data
            });
        }

    } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({
            success: false,
            message: "Payment verification failed",
            error: error.message
        });
    }
});


module.exports = router;
