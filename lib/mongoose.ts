import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  // Set strict query mode for Mongoose to prevent unknown field queries.
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("MONGODB_URL Not Found");

  // If the connection is already established, return without creating a new connection.
  if (isConnected) return console.log("Mongodb Already Connected");

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "echoes",
    });

    // Set the connection status to true
    isConnected = true;
  } catch (error) {
    console.log(error);
  }
};
