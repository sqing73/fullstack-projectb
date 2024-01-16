const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to database ${mongoose.connection.db.databaseName}`);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log(
      `Disconnected from database ${mongoose.connection.db.databaseName}`
    );
    process.exit(0);
  } catch {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = { connectDB, disconnectDB };
