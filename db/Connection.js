import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const state = mongoose.connection.readyState;
    const stateMessages = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    console.log(`MongoDB ${stateMessages[state]}: ${mongoose.connection.host}`);
    console.log(`DB ${stateMessages[state]}`);
  } catch (error) {
    console.error(`Error connecting to database: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
