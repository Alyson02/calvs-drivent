import { AuthenticatedRequest } from "@/middlewares";
import hotelService from "@/services/hotel-service";
import { Request, Response } from "express";

export async function getAllHotel(req: AuthenticatedRequest, res: Response) {

    res.send(await hotelService.getAll(req.userId));
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {

    const { id } = req.params;
    res.send(await hotelService.getById(Number(id), req.userId))

}