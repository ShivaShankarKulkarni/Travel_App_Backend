import { JWT_SECRET } from "./config";
const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from 'express';

export const authMiddleware = async (req : Request,res : Response, next: NextFunction): Promise<any>=>{
    const authHeader  = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).json({
            message: "1",
            authHeader: authHeader
        });
    }

    const token = authHeader;

    try{
        const decoded = await jwt.verify(token, JWT_SECRET) as { id: number };
        if (!decoded) {
            return res.status(403).json({
                message: "2"
            });
        }
        req.id = decoded.id

        await next();
    }catch(e){
        return res.json({
            error: e
        })
    }
}