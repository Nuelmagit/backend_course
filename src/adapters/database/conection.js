import { mongoose } from "mongoose"

export const connect = () => mongoose.connect(process.env.DB_CONECTION)
  .catch(error => {
    console.log(error);
    throw new Error('DB CONECTION ERROR')
  });

export const disconnect = () => mongoose.disconnect();