import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/routes';
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });
export const createServer = () => {
    try {
        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cookieParser());
       
        app.use(cors({
            origin: process.env.CORS_FRONTEND as string,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true
        }));

        app.use('/', routes); 

        return app;
    } catch (error: any) {
        console.error('An error occurred while creating the server:', error.message);
        throw error;
    }
};

export const connectDB = async () => {
    try {
        const mongoURL = process.env.MONGODB_URL as string;
        await mongoose.connect(mongoURL);
        console.log("Database connected");
    } catch (error: any) {
        console.error('An error occurred while connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

export const startServer = () => {
    try {
        connectDB(); 
        const app = createServer(); 

        app?.listen(3000, () => {
            console.log("Server is running @ 3000");
        });
    } catch (error: any) {
        console.error('An error occurred while starting the server:', error.message);
    }
};
startServer();
