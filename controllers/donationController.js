import Donation from '../models/Donation.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createDonation = async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone, address1, address2, city,
      state, postalCode, donationAmount, frequency, startDate,
      coverFee, paymentMethodId
    } = req.body;


    let finalAmount = Math.round(parseFloat(donationAmount) * 100); 

    if (coverFee) {
      finalAmount += 250;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      payment_method_types: ['card'],
      receipt_email: email,
      description: `Donation by ${firstName} ${lastName}`
    });

    const donation = new Donation({
      firstName,
      lastName,
      email,
      phone,
      address1,
      address2,
      city,
      state,
      postalCode,
      donationAmount: finalAmount / 100,
      frequency,
      startDate,
      coverFee,
      stripePaymentId: paymentIntent.id
    });

    const savedDonation = await donation.save();

    res.status(201).json({ success: true, data: savedDonation });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }
    res.status(200).json({ success: true, data: donation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }
    res.status(200).json({ success: true, message: 'Donation deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
