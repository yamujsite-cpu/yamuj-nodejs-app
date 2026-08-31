import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    console.log("MONGO URI EXISTS:", !!process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URL!, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw error;
  }
};

export default dbConnect;