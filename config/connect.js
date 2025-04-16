const mongoose = require('mongoose');

const connectDB = async ()=>{
   const conn = await  mongoose.connect(process.env.MONGO_URL);
    console.log(`database conect o host :${mongoose.connection.host.cyan}`);
}
module.exports = connectDB 