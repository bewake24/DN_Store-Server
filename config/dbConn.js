const mongoose = require('mongoose');

const connectDB = async () =>{
    try {
      const connectionInstance =  await mongoose.connect(`${process.env.DATABASE_URI}${process.env.DB_NAME}`);
        console.log(`Connect to DB Successfully on the host: ${connectionInstance.connection.host}`)
      } catch (error) {
        console.error("Error connecting with Database",error.message);
        process.exit(1)
      }
}

module.exports = connectDB;