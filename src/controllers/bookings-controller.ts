import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import { Response } from "express";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    res.send(await bookingService.getBooking(req.userId));
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
    const roomId = Number(req.body.roomId) || 0;
    res.send(await bookingService.createBooking(roomId, req.userId));
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
    const roomId = Number(req.body.roomId) || 0;
    const bookingId = Number(req.params.id) || 0;
    res.send(await bookingService.changeRoom(roomId, bookingId, req.userId));
}