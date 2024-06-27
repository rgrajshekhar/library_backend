import mongoose, { Schema } from "mongoose";

const SubscriptionSchema = new mongoose.Schema({


})

export const Subscription = mongoose.models.subscriptions || mongoose.model("subscriptions",SubscriptionSchema);