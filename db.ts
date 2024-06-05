import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectToDB = (): void => {
    mongoose.connect(process.env.DbUrl as string)
        .then(() => {
            console.log('Connected to database');
        })
        .catch((error:Error) => {
            console.error('Error connecting to database:', error);
        });
};

