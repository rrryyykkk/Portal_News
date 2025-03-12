import mongoose from "mongoose";

const connectDB = async (req, res) => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");
};

export default connectDB;
