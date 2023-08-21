// --- підключення до бази даних

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { DB_HOST } = process.env;

const connectToMonoDB = async () => {
    try {
      await mongoose.connect(DB_HOST);
      console.log("Database connection successful");
    }catch(error){ 
      console.log('Error connecting to MonoDB', error);
    }
}
  
module.exports = connectToMonoDB;