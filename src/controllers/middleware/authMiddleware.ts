import * as jwt from "jsonwebtoken";
const jwtSecret = process.env.jwtSecret || "your_secret_key";
import { NextFunction, Request, Response } from "express";

export const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
    try {
        
        const token = await req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Authorization token is missing" });
        }

        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Failed to authenticate token" });
            }
            req.decoded = decoded;
            next();
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};