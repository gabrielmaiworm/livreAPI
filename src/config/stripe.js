require("dotenv").config();
const STRIPE_KEY='sk_test_51Ln7ZjLQJFgFLfkLdSDp3Yo2TdO3dsJE59txU39knaGg2r30nuYPfD9IPJl9GzkMYUdd8s13BnZWDtyBQ72qyDXE00BIKgldib'
const stripe = require("stripe")(STRIPE_KEY);

async function createPaymentIntent(cliente) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: cliente == "caro" ? 4000 : 2000,
      currency: "brl",
      payment_method_types: ["card"],
      customer: "cus_MWB8OMMDGFeAx7",
      receipt_email: "joelsongsouzza@gmail.com",
    });

    return paymentIntent;
  } catch (error) {
    console.log("Error on 'createCheckoutSession': ", error);
    return null;
  }
}

module.exports = {
  createPaymentIntent,
};
