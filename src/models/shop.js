// import mongoose from "mongoose";

// const shopSchema = new mongoose.Schema(
//   {
//     owner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "ShopOwner",
//       required: true,
//     },
//     name: { type: String, required: true },
//     address: { type: String, required: true },

//     liveLocation: {
//       latitude: { type: Number },
//       longitude: { type: Number },
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Shop = mongoose.model("Shop", shopSchema);

// export default Shop;

import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShopOwner",
      required: true,
    },

    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true, // shop must be under a branch
    },

    name: { type: String, required: true },
    address: { type: String, required: true },

    liveLocation: {
      latitude: Number,
      longitude: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Shop = mongoose.model("Shop", shopSchema);
export default Shop;
