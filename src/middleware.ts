import { JWT_SECRET } from "./config";
const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from 'express';
import { admin } from "./firebaseAdmin";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

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
        const decodedToken = await admin.auth().verifyIdToken(token);
        if (!decodedToken) {
            return res.status(403).json({
                message: "2"
            });
        }
        const { user_id, phone_number } = decodedToken;
        const existingUser = await prisma.user.findFirst({
            where: {
                username: phone_number
            }
        })
        if(!existingUser){
            return res.status(403).json({
                message: "No User"
            })
        }
        req.id = existingUser.id;
        await next();
    }catch(e:any){
        return res.json({
            message: "Other Error",
            error: e
        })
    }
    // try{
    //     const decoded = await jwt.verify(token, JWT_SECRET) as { id: number };
    //     if (!decoded) {
    //         return res.status(403).json({
    //             message: "2"
    //         });
    //     }
    //     req.id = decoded.id

    //     await next();
    // }catch(e){
    //     return res.json({
    //         error: e
    //     })
    // }
}