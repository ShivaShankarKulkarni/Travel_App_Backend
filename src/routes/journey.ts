import { Prisma, PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { authMiddleware } from "../middleware";
import { journeyPost } from "travel-app-common";

export const journeyRouter = express.Router();
const prisma = new PrismaClient();
declare global {
    namespace Express {
      interface Request {
        id?: number; // Adding the optional 'id' property to the Request type
      }
    }
}

journeyRouter.get("/journeys", authMiddleware,  async (req: Request, res: Response): Promise<any> => {
    try{
        const journeys = await prisma.journey.findMany({
            include: {
                captain: { 
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        phoneNumber: true
                    }
                }
            }
        });
        return res.json({
            journeys
        })
    }catch(error){
        return res.status(500).json({
            message: "Error getting all the journeys",
            error
        })
    }
})

journeyRouter.post("/journey", authMiddleware, async (req: Request, res: Response): Promise<any> =>{
    const {success} = journeyPost.safeParse(req.body);
        if(!success){
            return res.status(411).json({
                message: "Inputs not correct"
            })
        }
    const id = Number(req.id);
    console.log("1");
    try{
        console.log("2");
        await prisma.journey.create({
            data:{
                startingLoc: req.body.startingLoc,
                destinationLoc: req.body.destinationLoc,
                startTime: req.body.startTime,
                captainId: id,
                route: req.body.route
            }
        })
        return res.json({
            message: "Journey saved succesfully"
        })
    }catch(error){
        return res.json({error});
        console.log("3");
    }
})

// API call to delete particular user's journey:
journeyRouter.delete("/journey", authMiddleware, async( req: Request, res: Response): Promise<any> =>{
    const id = Number(req.id);
    try{
        await prisma.journey.delete({
            where:{
                id: req.body.id
            }
        })
        return res.json({
            message: "Deleted Successfully"
        })
    }catch(error){
        return res.json(error);
    }
})