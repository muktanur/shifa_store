// import mongoose from "mongoose";

// export const connectDB = async(uri)=>{
//     try {
//         await mongoose.connect(uri)
//         console.log("DB CONNECTED ✅")
//     } catch (error) {
//         console.log("Database connection error: " ,error)
//     }
// }

import mongoose from "mongoose";

export const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB Error ❌", error);
    process.exit(1);
  }
};
