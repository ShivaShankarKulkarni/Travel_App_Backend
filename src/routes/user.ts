import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { JWT_SECRET } from "../config";
import { signupInput, signinInput } from "travel-app-common"; 


export const userRouter = express.Router();

const prisma = new PrismaClient();

const jwt = require('jsonwebtoken');

declare global {
    namespace Express {
      interface Request {
        id?: number; // Adding the optional 'id' property to the Request type
      }
    }
}



userRouter.post("/signup", async (req: Request, res: Response): Promise<any> => {
    const {success} = signupInput.safeParse(req.body);
    if(!success){
        return res.status(400).json({
            message: "Invalid input. Please check your details and try again."
        })
    }
    try {
        const { username, password, fullName, phoneNumber } = req.body;
        if (!username || !password || !fullName || !phoneNumber) {
            return res.status(400).json({ message: "All fields are required"});
        }
        const existingUser = await prisma.user.findUnique({
            where: {
                username: req.body.username
            },
        });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists. Try logging in." });
        }

        const newUser = await prisma.user.create({
            data: { 
                username,
                password,
                fullName,
                phoneNumber
            },
        });

        const token = await jwt.sign({
            id: newUser.id
        },JWT_SECRET)

        return res.json({token, newUser});
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


userRouter.post("/signin", async(req : Request,res : Response): Promise<any> =>{
    const {success, error} = signinInput.safeParse(req.body);
    if(!success){
        return res.status(400).json({
            message: "Invalid username or password format.",
        });
    } 
    
    try{
        const existingUser = await prisma.user.findFirst({
            where: {
                username: req.body.username,
                password: req.body.password
            }
        })

        if(!existingUser){
            return res.status(404).json({
                message: "Incorrect username or password."
            });
        }

        // Here we should use JWT signin
        const token = await jwt.sign({
            id: existingUser.id
        }, JWT_SECRET)

        return res.json({token,newUser: existingUser})
        
    } catch(e){
        res.status(500);
        return res.json({
            error: e
        })
    }
})