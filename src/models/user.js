import mongoose from "mongoose";

// Base fields shared by all user types
const baseUserFields = {
  name: { type: String },
  role: {
    type: String,
    enum: ["Customer", "Admin", "DeliveryPartner", "ShopOwner"],
    required: true,
  },
  isActivated: { type: Boolean, default: false },
};

// Customer Schema
const customerSchema = new mongoose.Schema({
  ...baseUserFields,
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  liveLocation: {
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
  },
  address: { type: String, default: "" },
});

// Delivery Partner Schema
const deliveryPartnerSchema = new mongoose.Schema({
  ...baseUserFields,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  liveLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  address: { type: String },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
  },
  isAvailable: { type: Boolean, default: true },
});

// Admin Schema
const adminSchema = new mongoose.Schema({
  ...baseUserFields,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin"], default: "Admin" },
});

// Shop Owner Schema
const shopOwnerSchema = new mongoose.Schema({
  ...baseUserFields,
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true, // 🔥 shop owner must be under a branch
  },

  liveLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  address: { type: String },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
  },
  role: { type: String, enum: ["ShopOwner"], default: "ShopOwner" },
});

// Named exports used everywhere in the project
export const Customer = mongoose.model("Customer", customerSchema);
export const DeliveryPartner = mongoose.model(
  "DeliveryPartner",
  deliveryPartnerSchema
);
export const Admin = mongoose.model("Admin", adminSchema);
export const ShopOwner = mongoose.model("ShopOwner", shopOwnerSchema);
