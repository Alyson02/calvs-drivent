import { notFoundError } from "@/errors";
import { AuthenticatedRequest } from "@/middlewares";
import paymentService from "@/services/payment-service";
import { Response } from "express";

async function create(req: AuthenticatedRequest, res: Response) {
    const payment = await paymentService.create(req.body, req.userId);
    res.send(payment);
}
async function getPaymentInfo(req: AuthenticatedRequest, res: Response) {
    const { ticketId } = req.query;

    if (!ticketId) return res.sendStatus(400);

    res.send(await paymentService.getPaymentInfo(Number(ticketId), req.userId))
}

export default {
    create,
    getPaymentInfo
}